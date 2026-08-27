import type { ContributionDay, GithubContributions, GithubUsage } from "@lib/github-stats";
import { getContributionYear, resolveContributionWeeks } from "@lib/github-stats";
import { githubUsageSnapshot } from "./github-usage";
import { practiceProjects } from "./practice-projects";
import { projects } from "./projects";
import { getShowcase } from "./showcase";

/** Contribuciones — actualizar a mano o con GraphQL + GITHUB_TOKEN. */
const contributionYear = getContributionYear();

const githubContributionsMonthly = [
  { month: `${contributionYear}-01`, count: 317 },
  { month: `${contributionYear}-02`, count: 313 },
  { month: `${contributionYear}-03`, count: 475 },
  { month: `${contributionYear}-04`, count: 316 },
  { month: `${contributionYear}-05`, count: 371 },
  { month: `${contributionYear}-06`, count: 382 },
  { month: `${contributionYear}-07`, count: 347 },
  { month: `${contributionYear}-08`, count: 302 },
] as const;

export const githubContributionsSnapshot: GithubContributions = {
  year: contributionYear,
  contributionsLastYear: githubContributionsMonthly.reduce((sum, m) => sum + m.count, 0),
  activeDaysLastYear: 0,
  monthlyContributions: [...githubContributionsMonthly],
  weeks: [],
  dailyFromGithub: false,
};

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
    dailyFromGithub: contributions.dailyFromGithub || weeks.length > 0 || contributions.weeks.length > 0,
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

const allProjects = [...projects, ...practiceProjects];

export type RecruiterStats = {
  github: {
    updatedAt: string;
    login: string;
    name: string;
    publicRepos: number;
    followers: number;
    memberSince: string;
    contributionsLastYear: number;
    activeDaysLastYear: number;
    monthlyContributions: GithubContributions["monthlyContributions"];
    weeks: ContributionDay[][];
    year: number;
    dailyFromGithub: boolean;
    reposScanned: number;
  };
  kpis: {
    label: string;
    value: string;
    hint: string;
  }[];
  topTechnologies: { label: string; count: number }[];
  languages: { label: string; count: number }[];
  githubUsage: GithubUsage;
  stackFamilies: { label: string; count: number }[];
  projectMix: { label: string; count: number }[];
  productionStacks: number;
  caseStudies: number;
};

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
