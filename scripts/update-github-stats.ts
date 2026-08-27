#!/usr/bin/env node
/** Genera fallback estático: pnpm stats:github */
import { writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchGithubUsage } from "../src/lib/github-stats.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputFile = join(__dirname, "../src/data/github-usage.ts");

function formatJson(data: unknown) {
  return JSON.stringify(data, null, 2).replace(/\n/g, "\n  ").replace(/^  /, "");
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const login = process.env.GITHUB_LOGIN;

  console.log(`GitHub${token ? " (autenticado)" : " (público)"}`);

  const { usage } = await fetchGithubUsage({ login, token });

  const file = `/**
 * Fallback estático — en producción se actualiza vía /api/github-stats.
 * Regenerar: pnpm stats:github
 */
export const githubUsageSnapshot = ${formatJson(usage)} as const;

export type GithubUsageSnapshot = typeof githubUsageSnapshot;
`;

  await writeFile(outputFile, file, "utf8");

  console.log(`✓ ${usage.reposScanned} repos · ${Math.round(usage.totalBytes / 1024)} KB`);
  console.log(`Escrito en ${outputFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
