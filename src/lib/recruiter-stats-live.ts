import { GITHUB_LOGIN, GITHUB_TOKEN } from "astro:env/server";
import { applyLiveGithubStats, getRecruiterStats, githubContributionsSnapshot } from "@data/recruiter-stats";
import { fetchGithubUsage, normalizeContributions } from "@lib/github-stats";

/** Stats con cuadrícula GitHub — build (Vercel) o SSR con GITHUB_TOKEN. */
export async function getLiveRecruiterStats() {
  const base = getRecruiterStats();

  try {
    const { usage, contributions } = await fetchGithubUsage({
      login: GITHUB_LOGIN || undefined,
      token: GITHUB_TOKEN || undefined,
    });

    return applyLiveGithubStats(
      base,
      usage,
      normalizeContributions(contributions ?? githubContributionsSnapshot),
    );
  } catch (error) {
    console.warn("[recruiter-stats] live fetch failed", error);
    return base;
  }
}
