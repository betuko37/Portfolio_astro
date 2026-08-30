import type { ContributionDay, GithubContributions, GithubUsage } from "@lib/github-stats";

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
