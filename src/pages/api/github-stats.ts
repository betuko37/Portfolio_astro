import type { APIRoute } from "astro";
import { GITHUB_LOGIN, GITHUB_TOKEN } from "astro:env/server";
import { fetchGithubUsage, normalizeContributions } from "@lib/github-stats";
import { githubUsageSnapshot } from "@data/github-usage";
import { githubContributionsSnapshot } from "@data/recruiter-stats";

export const prerender = false;

const TTL_MS = 15 * 60 * 1000;
const CACHE_VERSION = 7;

type CacheEntry = {
  version: number;
  expires: number;
  mode: "auth" | "public";
  body: Record<string, unknown>;
};

let cache: CacheEntry | null = null;

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const GET: APIRoute = async () => {
  const now = Date.now();
  const token = GITHUB_TOKEN;
  const login = GITHUB_LOGIN;
  const mode = token ? "auth" : "public";

  if (cache && cache.version === CACHE_VERSION && cache.expires > now && cache.mode === mode) {
    const cached = cache.body as {
      contributions?: Parameters<typeof normalizeContributions>[0];
    };
    return json({
      ...cache.body,
      cached: true,
      contributions: cached.contributions
        ? normalizeContributions(cached.contributions)
        : githubContributionsSnapshot,
    });
  }

  try {
    const { usage, contributions } = await fetchGithubUsage({ login, token });

    const body = {
      ok: true,
      cached: false,
      fetchedAt: new Date().toISOString(),
      usage,
      contributions: normalizeContributions(contributions ?? githubContributionsSnapshot),
    };

    cache = { version: CACHE_VERSION, expires: now + TTL_MS, mode, body };
    return json(body);
  } catch (error) {
    console.error("github-stats", error);

    const body = {
      ok: true,
      cached: false,
      stale: true,
      fetchedAt: new Date().toISOString(),
      usage: githubUsageSnapshot,
      contributions: normalizeContributions(githubContributionsSnapshot),
    };

    return json(body);
  }
};
