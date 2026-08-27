import type { IconName } from "./icons";

export type Lab = {
  slug: string;
  title: string;
  kicker: string;
  tagline: string;
  year: string;
  accent: "purple" | "ink" | "sand" | "night";
  icon: IconName;
  stack: string[];
  github?: string;
  live?: string;
  fromCv?: boolean;
};

export const labs: Lab[] = [
  {
    slug: "weather-api",
    title: "WheatherApi",
    kicker: "CV · GitHub",
    tagline: "Clima por ciudad. HTML, CSS y JavaScript contra una API pública.",
    year: "2024",
    accent: "purple",
    icon: "cloud",
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/betuko37/WheatherApi",
    live: "https://betuko37.github.io/WheatherApi/",
    fromCv: true,
  },
  {
    slug: "casa-domotica",
    title: "Casa domótica",
    kicker: "CV · Hardware",
    tagline: "Panel táctil y voz: Alexa, Arduino y un programa en C#.",
    year: "2023 — 2024",
    accent: "ink",
    icon: "home",
    stack: ["C#", "Arduino", "Alexa"],
    fromCv: true,
  },
  {
    slug: "juego-2d",
    title: "Juego 2D de plataformas",
    kicker: "CV · Unity",
    tagline: "Dos niveles, enemigos y objetivos. Hecho en Unity3D.",
    year: "2024",
    accent: "night",
    icon: "sparkles",
    stack: ["Unity3D", "C#"],
    fromCv: true,
  },
  {
    slug: "rest-api-node",
    title: "REST API Node",
    kicker: "CV · GitHub",
    tagline: "API de películas con Express, Zod, CORS y persistencia MySQL o MongoDB.",
    year: "2025",
    accent: "sand",
    icon: "server",
    stack: ["Node.js", "Express", "Zod", "MySQL", "MongoDB"],
    github: "https://github.com/betuko37/Rest-Api-Node",
    fromCv: true,
  },
  {
    slug: "flutter-kotlin",
    title: "Apps Flutter y Kotlin",
    kicker: "CV · Mobile",
    tagline: "TODOs, CRUD y consumo de APIs. En Kotlin, servicios en segundo plano.",
    year: "2023 — 2024",
    accent: "purple",
    icon: "smartphone",
    stack: ["Flutter", "Kotlin", "Android"],
    fromCv: true,
  },
  {
    slug: "gifxplore",
    title: "Gifxplore",
    kicker: "GitHub",
    tagline: "Explorador de GIFs en React + Vite, con rutas y Netlify.",
    year: "2025",
    accent: "ink",
    icon: "image",
    stack: ["React", "Vite", "React Router"],
    github: "https://github.com/betuko37/Api-Gifts-React",
    live: "https://gifxplore.netlify.app",
  },
  {
    slug: "lista-precios",
    title: "Lista de precios",
    kicker: "GitHub",
    tagline: "Lista comercial con Firebase, PDF y Tailwind. En vivo en Netlify.",
    year: "2025",
    accent: "night",
    icon: "sheet",
    stack: ["React", "Firebase", "Tailwind", "pdfmake"],
    github: "https://github.com/betuko37/lista-precios",
    live: "https://multicarnes-lista.netlify.app/",
  },
  {
    slug: "heroes-app",
    title: "Comicpedia",
    kicker: "GitHub",
    tagline: "Catálogo de héroes con React Router, Tailwind y búsqueda.",
    year: "2025",
    accent: "sand",
    icon: "bookmark",
    stack: ["React", "Vite", "Tailwind", "React Router"],
    github: "https://github.com/betuko37/HeroesApp",
    live: "https://comicpedia.netlify.app/",
  },
  {
    slug: "api-cocktail",
    title: "apiCoktel",
    kicker: "GitHub",
    tagline: "Buscador de cócteles contra una API pública.",
    year: "2024",
    accent: "purple",
    icon: "sparkles",
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/betuko37/apiCoktel",
    live: "https://betuko37.github.io/apiCoktel/",
  },
  {
    slug: "image-api",
    title: "ImageApi",
    kicker: "GitHub",
    tagline: "Búsqueda de imágenes favoritas con una API de fotos.",
    year: "2024",
    accent: "ink",
    icon: "image",
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/betuko37/ImageApi",
    live: "https://betuko37.github.io/ImageApi/",
  },
  {
    slug: "veterinary-php",
    title: "VeterinaryPHP",
    kicker: "GitHub",
    tagline: "Gestión veterinaria en PHP. Del mismo ciclo que el form de mascotas.",
    year: "2024",
    accent: "night",
    icon: "store",
    stack: ["PHP", "JavaScript"],
    github: "https://github.com/betuko37/VeterinaryPHP",
  },
  {
    slug: "form-pets",
    title: "Form Pets PHP",
    kicker: "GitHub",
    tagline: "Formulario de mascotas en PHP, hermano de VeterinaryPHP.",
    year: "2024",
    accent: "sand",
    icon: "file-text",
    stack: ["PHP", "JavaScript"],
    github: "https://github.com/betuko37/Form-Pets-Php",
  },
  {
    slug: "chat-socket",
    title: "Chat en tiempo real",
    kicker: "GitHub",
    tagline: "Chat con Express, Socket.IO y un front React.",
    year: "2025",
    accent: "purple",
    icon: "message-circle",
    stack: ["React", "Express", "Socket.IO"],
    github: "https://github.com/betuko37/Chat-App-socket-React",
  },
  {
    slug: "js-quiz",
    title: "JavaScript Quiz",
    kicker: "GitHub",
    tagline: "Quiz de JS con React, TypeScript, MUI y Zustand.",
    year: "2025",
    accent: "ink",
    icon: "file-code",
    stack: ["React", "TypeScript", "MUI", "Zustand"],
    github: "https://github.com/betuko37/Javascript-Quizz",
  },
  {
    slug: "journal-app",
    title: "Journal App",
    kicker: "GitHub",
    tagline: "Diario en React + MUI, con rutas.",
    year: "2025",
    accent: "night",
    icon: "file-text",
    stack: ["React", "MUI", "React Router"],
    github: "https://github.com/betuko37/Journal-App",
  },
  {
    slug: "task-app",
    title: "TaskApp",
    kicker: "GitHub",
    tagline: "Lista de tareas. La línea de los TODOs del CV.",
    year: "2024",
    accent: "sand",
    icon: "folder-kanban",
    stack: ["JavaScript"],
    github: "https://github.com/betuko37/TaskApp",
    fromCv: true,
  },
  {
    slug: "nexgard",
    title: "Nexgard",
    kicker: "GitHub",
    tagline: "Landing / pieza web en CSS.",
    year: "2024",
    accent: "purple",
    icon: "shopping-bag",
    stack: ["HTML", "CSS"],
    github: "https://github.com/betuko37/Nexgard",
  },
];

export function labHref(lab: Lab): string | undefined {
  return lab.live ?? lab.github;
}

export function getLab(slug: string): Lab | undefined {
  return labs.find((lab) => lab.slug === slug);
}

export function labLinks(lab: Lab): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  if (lab.live) links.push({ label: "En vivo", href: lab.live });
  if (lab.github) links.push({ label: "GitHub", href: lab.github });
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
