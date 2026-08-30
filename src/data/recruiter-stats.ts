import type { GithubContributions } from "@lib/github-stats";
import { getContributionYear, resolveContributionWeeks } from "@lib/github-stats";
import type { RecruiterStats } from "./recruiter-stats-types";
import { githubUsageSnapshot } from "./github-usage";
import { githubContributionsSnapshot } from "./github-contributions";
import { practiceProjects } from "./practice-projects";
import { projects } from "./projects";
import { getShowcase } from "./showcase";

export type { RecruiterStats } from "./recruiter-stats-types";
export { applyLiveGithubStats } from "./recruiter-stats-client";
export { githubContributionsSnapshot } from "./github-contributions";

/** Año del snapshot; si el archivo aún no tiene daily, se usa el año actual. */
const contributionYear = githubContributionsSnapshot.year ?? getContributionYear();

function fromSnapshot(items: readonly { label: string; bytes: number }[]) {
  return items.map(({ label, bytes }) => ({ label, count: bytes }));
}

function buildGithubBlock(
  usage: typeof githubUsageSnapshot,
  contributions: GithubContributions,
) {
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

const allProjects = [...projects, ...practiceProjects];

export function getRecruiterStats(): RecruiterStats {
  const live = getShowcase("live");
  const githubShowcase = getShowcase("github");
  const cv = getShowcase("cv");

  const productionProjects = projects.filter((p) =>
    p.links.some((l) => /en vivo|app en vivo/i.test(l.label)),
  );

  const topTechnologies = fromSnapshot(githubUsageSnapshot.technologies);
  const languages = fromSnapshot(githubUsageSnapshot.languages);
  const stackFamilies = fromSnapshot(githubUsageSnapshot.layers);

  const avgMonthly = Math.round(
    githubContributionsSnapshot.contributionsLastYear /
      githubContributionsSnapshot.monthlyContributions.length,
  );

  const gh = githubUsageSnapshot;
  const contributions = githubContributionsSnapshot;

  return {
    github: buildGithubBlock(gh, contributions),
    kpis: [
      {
        label: `Commits (${contributionYear})`,
        value: githubContributionsSnapshot.contributionsLastYear.toLocaleString("es-MX"),
        hint: `${githubContributionsSnapshot.activeDaysLastYear} días activos · ene–dic ${contributionYear}`,
      },
      {
        label: "Productos en producción",
        value: String(live.length),
        hint: "ERP, Agroeasy, Cotizaciones, tienda Shopify…",
      },
      {
        label: "Estudios de caso",
        value: String(allProjects.length),
        hint: "Arquitectura, stack y proceso documentados",
      },
      {
        label: "Repos GitHub",
        value: String(gh.totalRepos),
        hint: `${gh.reposWithLanguages} con lenguajes detectados`,
      },
      {
        label: "Promedio mensual",
        value: String(avgMonthly),
        hint: `Contribuciones GitHub / mes (${contributionYear})`,
      },
      {
        label: "Stack en producción",
        value: String(productionProjects.length),
        hint: "Proyectos desplegados con URL en vivo",
      },
    ],
    topTechnologies,
    languages,
    githubUsage: githubUsageSnapshot,
    stackFamilies,
    projectMix: [
      { label: "En producción", count: live.length },
      { label: "Open source", count: githubShowcase.length },
      { label: "Formación / CV", count: cv.length },
    ],
    productionStacks: productionProjects.length,
    caseStudies: allProjects.length,
  };
}
