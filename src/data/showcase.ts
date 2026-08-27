import { labs } from "./labs";
import type { IconName } from "./icons";
import { projectIcons } from "./icons";
import { getLiveLink, projects, type Project } from "./projects";
import { getProjectLogo } from "./media";

export type ShowcaseGroup = "live" | "github" | "cv";

export type ShowcaseItem = {
  id: string;
  title: string;
  tagline: string;
  kicker: string;
  year: string;
  accent: Project["accent"];
  href?: string;
  external?: boolean;
  live?: boolean;
  groups: ShowcaseGroup[];
  icon: IconName;
  logo?: string;
  stack: string[];
};

const isGithub = (href: string) => /github\.com/i.test(href);

export function fromProject(project: Project): ShowcaseItem {
  const live = getLiveLink(project);
  const github = project.links.find((link) => isGithub(link.href));
  const groups: ShowcaseGroup[] = [];
  if (live) groups.push("live");
  if (github && !live) groups.push("github");

  return {
    id: `case-${project.slug}`,
    title: project.title,
    tagline: project.tagline,
    kicker: project.kicker,
    year: project.year,
    accent: project.accent,
    href: `/proyectos/${project.slug}`,
    live: Boolean(live),
    groups,
    icon: projectIcons[project.slug] ?? "layers",
    logo: getProjectLogo(project.slug),
    stack: project.stack,
  };
}

export function fromLab(lab: (typeof labs)[number]): ShowcaseItem {
  const groups: ShowcaseGroup[] = [];
  if (lab.live) groups.push("live");
  if (lab.github && !lab.live) groups.push("github");
  if (lab.fromCv && !lab.live) groups.push("cv");

  return {
    id: `lab-${lab.slug}`,
    title: lab.title,
    tagline: lab.tagline,
    kicker: lab.kicker,
    year: lab.year,
    accent: lab.accent,
    href: `/proyectos/${lab.slug}`,
    live: Boolean(lab.live),
    groups,
    icon: lab.icon,
    stack: lab.stack,
  };
}

export const showcase: ShowcaseItem[] = [
  ...projects.map(fromProject),
  ...labs.map(fromLab),
];

export function getShowcase(group: ShowcaseGroup): ShowcaseItem[] {
  return showcase.filter((item) => item.groups.includes(group));
}

export const showcaseSections: {
  id: ShowcaseGroup;
  title: string;
  kicker: string;
  icon: IconName;
}[] = [
  { id: "live", title: "En producción", kicker: "Disponibles en línea", icon: "globe" },
  { id: "github", title: "GitHub", kicker: "Repositorios públicos", icon: "github" },
  { id: "cv", title: "Prácticas", kicker: "Proyectos de formación", icon: "briefcase" },
];
