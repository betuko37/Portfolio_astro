#!/usr/bin/env node
/** Genera fallback estático: pnpm stats:github */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { register } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const rootUrl = pathToFileURL(root + "/").href;

register(
  `data:text/javascript,${encodeURIComponent(`
    export async function resolve(specifier, context, nextResolve) {
      if (specifier.startsWith("@data/")) {
        const rel = specifier.slice("@data/".length);
        return nextResolve(new URL("./src/data/" + rel + ".ts", ${JSON.stringify(rootUrl)}).href, context);
      }
      if (specifier.startsWith("@lib/")) {
        const rel = specifier.slice("@lib/".length);
        return nextResolve(new URL("./src/lib/" + rel + ".ts", ${JSON.stringify(rootUrl)}).href, context);
      }
      return nextResolve(specifier, context);
    }
  `)}`,
  pathToFileURL(join(__dirname, "update-github-stats.ts")).href,
);

const { fetchGithubUsage } = await import("../src/lib/github-stats.ts");

const usageFile = join(root, "src/data/github-usage.ts");
const contributionsFile = join(root, "src/data/github-contributions.ts");

function formatJson(data) {
  return JSON.stringify(data, null, 2);
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const login = process.env.GITHUB_LOGIN;

  console.log(`GitHub${token ? " (autenticado)" : " (público / HTML calendar)"}`);

  let usage;
  let contributions;

  try {
    ({ usage, contributions } = await fetchGithubUsage({ login, token }));
  } catch (error) {
    const attached = error?.contributions;
    if (!attached?.dailyFromGithub) throw error;
    console.warn("Usage REST falló; se guardan contribuciones del calendario HTML.");
    const { githubUsageSnapshot } = await import("../src/data/github-usage.ts");
    usage = githubUsageSnapshot;
    contributions = attached;
  }

  if (!contributions?.dailyFromGithub) {
    throw new Error("No se pudo obtener la cuadrícula diaria de contribuciones.");
  }

  const usageOut = `/**
 * Fallback estático — en producción se actualiza vía /api/github-stats.
 * Regenerar: pnpm stats:github
 */
export const githubUsageSnapshot = ${formatJson(usage)} as const;

export type GithubUsageSnapshot = typeof githubUsageSnapshot;
`;

  const contributionsOut = `/**
 * Fallback de contribuciones diarias — regenerar: pnpm stats:github
 */
import type { GithubContributions } from "@lib/github-stats";

export const githubContributionsSnapshot: GithubContributions = ${formatJson(contributions)};
`;

  await writeFile(usageFile, usageOut, "utf8");
  await writeFile(contributionsFile, contributionsOut, "utf8");

  console.log(
    `✓ ${usage.reposScanned} repos · ${contributions.contributionsLastYear} contribuciones · ${contributions.activeDaysLastYear} días activos`,
  );
  console.log(`Escrito en ${usageFile}`);
  console.log(`Escrito en ${contributionsFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
