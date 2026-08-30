import type { GithubContributions, GithubUsage } from "@lib/github-stats";
import { resolveContributionWeeks } from "@lib/github-stats";
import type { RecruiterStats } from "./recruiter-stats-types";

function fromSnapshot(items: readonly { label: string; bytes: number }[]) {
  return items.map(({ label, bytes }) => ({ label, count: bytes }));
}

function buildGithubBlock(usage: GithubUsage, contributions: GithubContributions) {
  const weeks = resolveContributionWeeks(contributions);

  return {
    updatedAt: usage.updatedAt,
    login: usage.login,
    name: usage.name,
    publicRepos: usage.publicRepos,
    followers: usage.followers,
    memberSince: usage.memberSince,
    reposScanned: usage.reposScanned,
    contributionsLastYear: contributions.contributionsLastYear,
    activeDaysLastYear: contributions.activeDaysLastYear,
    monthlyContributions: contributions.monthlyContributions,
    weeks: weeks.length ? weeks : contributions.weeks,
    year: contributions.year,
    dailyFromGithub:
      contributions.dailyFromGithub || weeks.length > 0 || contributions.weeks.length > 0,
  };
}

export function applyLiveGithubStats(
  base: RecruiterStats,
  usage: GithubUsage,
  contributions: GithubContributions,
): RecruiterStats {
  const avgMonthly = Math.round(
    contributions.contributionsLastYear /
      Math.max(contributions.monthlyContributions.length, 1),
  );

  return {
    ...base,
    github: buildGithubBlock(usage, contributions),
    languages: fromSnapshot(usage.languages),
    topTechnologies: fromSnapshot(usage.technologies),
    stackFamilies: fromSnapshot(usage.layers),
    githubUsage: usage,
    kpis: base.kpis.map((kpi) => {
      if (kpi.label.startsWith("Commits (")) {
        return {
          ...kpi,
          label: `Commits (${contributions.year})`,
          value: contributions.contributionsLastYear.toLocaleString("es-MX"),
          hint: `${contributions.activeDaysLastYear} días activos · ene–dic ${contributions.year}`,
        };
      }
      if (kpi.label === "Repos GitHub") {
        return {
          ...kpi,
          value: String(usage.totalRepos),
          hint:
            usage.privateRepos > 0
              ? `${usage.publicRepos} públicos · ${usage.privateRepos} privados`
              : `${usage.reposWithLanguages} con lenguajes detectados`,
        };
      }
      if (kpi.label === "Promedio mensual") {
        return { ...kpi, value: String(avgMonthly) };
      }
      return kpi;
    }),
  };
}

export type { RecruiterStats };
