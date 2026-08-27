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
  if (project.fromCv && !live) groups.push("cv");

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
  if ((lab.github || lab.githubRepos?.length) && !lab.live) groups.push("github");
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
    logo: getProjectLogo(lab.slug),
    stack: lab.stack,
  };
}

export const showcase: ShowcaseItem[] = [
  ...projects.filter((project) => !project.hideFromCatalog).map(fromProject),
  ...labs.map(fromLab),
];

export function getShowcase(group: ShowcaseGroup): ShowcaseItem[] {
  const items = showcase.filter((item) => item.groups.includes(group));

  if (group !== "live") return items;

  const priority = [
    "case-jornalpro",
    "case-cotizaciones-facturaciones",
    "case-agroeasy",
    "case-jornalpro-mobile",
    "case-jornalpro-frontend",
    "case-tienda-ivan",
  ];

  return [...items].sort((a, b) => {
    const ai = priority.indexOf(a.id);
    const bi = priority.indexOf(b.id);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
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
