import { GITHUB_LOGIN, GITHUB_TOKEN } from "astro:env/server";
import { applyLiveGithubStats, getRecruiterStats, githubContributionsSnapshot } from "@data/recruiter-stats";
import { fetchGithubContributions, fetchGithubUsage, normalizeContributions } from "@lib/github-stats";
import { profile } from "@data/profile";

/** Stats con cuadrícula GitHub — build (Vercel) o SSR con GITHUB_TOKEN. */
export async function getLiveRecruiterStats() {
  const base = getRecruiterStats();
  const login = GITHUB_LOGIN || profile.githubUser;
  const token = GITHUB_TOKEN || undefined;

  try {
    const { usage, contributions } = await fetchGithubUsage({
      login,
      token,
    });

    return applyLiveGithubStats(
      base,
      usage,
      normalizeContributions(contributions ?? githubContributionsSnapshot),
    );
  } catch (error) {
    console.warn("[recruiter-stats] live fetch failed", error);

    const attached = (error as Error & { contributions?: ReturnType<typeof normalizeContributions> | null })
      .contributions;
    let contributions = attached ?? null;

    if (!contributions?.dailyFromGithub) {
      try {
        contributions = await fetchGithubContributions(login, token);
      } catch {
        /* snapshot */
      }
    }

    if (contributions?.dailyFromGithub) {
      return applyLiveGithubStats(
        base,
        base.githubUsage,
        normalizeContributions(contributions),
      );
    }

    return base;
  }
}
