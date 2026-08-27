import type { IconName } from "./icons";

export type Lab = {
  slug: string;
  title: string;
  kicker: string;
  tagline: string;
  summary?: string;
  highlights?: string[];
  modules?: string[];
  year: string;
  accent: "purple" | "ink" | "sand" | "night";
  icon: IconName;
  stack: string[];
  github?: string;
  githubRepos?: { label: string; href: string }[];
  live?: string;
  fromCv?: boolean;
};

/** Prácticas migradas a estudios de caso en projects.ts */
export const labs: Lab[] = [];

export function labHref(lab: Lab): string | undefined {
  return lab.live ?? lab.github;
}

export function getLab(slug: string): Lab | undefined {
  return labs.find((lab) => lab.slug === slug);
}

export function labLinks(lab: Lab): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  if (lab.live) links.push({ label: "En vivo", href: lab.live });
  if (lab.githubRepos?.length) {
    links.push(...lab.githubRepos);
  } else if (lab.github) {
    links.push({ label: "GitHub", href: lab.github });
  }
  return links;
}

export function getRelatedLabs(slug: string): Lab[] {
  const lab = getLab(slug);
  if (!lab) return [];

  return labs
    .filter((item) => item.slug !== slug)
    .map((item) => ({
      item,
      score:
        (item.fromCv && lab.fromCv ? 1 : 0) +
        item.stack.filter((tech) => lab.stack.includes(tech)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);
}
