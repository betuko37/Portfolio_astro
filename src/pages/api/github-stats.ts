import type { APIRoute } from "astro";
import { GITHUB_LOGIN, GITHUB_TOKEN } from "astro:env/server";
import {
  fetchGithubContributions,
  fetchGithubUsage,
  normalizeContributions,
  type GithubContributions,
} from "@lib/github-stats";
import { githubUsageSnapshot } from "@data/github-usage";
import { githubContributionsSnapshot } from "@data/recruiter-stats";
import { profile } from "@data/profile";

export const prerender = false;

const TTL_MS = 15 * 60 * 1000;
const CACHE_VERSION = 8;

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

function resolveLogin(tokenLogin?: string | undefined) {
  return tokenLogin || GITHUB_LOGIN || profile.githubUser;
}

export const GET: APIRoute = async () => {
  const now = Date.now();
  const token = GITHUB_TOKEN;
  const login = resolveLogin();
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

    let contributions: GithubContributions | null =
      (error as Error & { contributions?: GithubContributions | null }).contributions ?? null;

    if (!contributions?.dailyFromGithub) {
      try {
        contributions = await fetchGithubContributions(login, token);
      } catch {
        /* snapshot */
      }
    }

    const body = {
      ok: true,
      cached: false,
      stale: true,
      fetchedAt: new Date().toISOString(),
      usage: githubUsageSnapshot,
      contributions: normalizeContributions(contributions ?? githubContributionsSnapshot),
    };

    // Cachea poco si al menos hay cuadrícula diaria (evita martillar GitHub HTML).
    if (body.contributions.dailyFromGithub) {
      cache = { version: CACHE_VERSION, expires: now + TTL_MS, mode, body };
    }

    return json(body);
  }
};
