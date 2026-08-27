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
    kicker: "Práctica · GitHub",
    tagline: "Consulta del clima por ciudad con HTML, CSS y JavaScript, integrada con una API pública.",
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
    kicker: "Práctica · Hardware",
    tagline: "Sistema de automatización residencial con panel táctil y control por voz, mediante Alexa, Arduino y C#.",
    year: "2023 — 2024",
    accent: "ink",
    icon: "home",
    stack: ["C#", "Arduino", "Alexa"],
    fromCv: true,
  },
  {
    slug: "juego-2d",
    title: "Juego 2D de plataformas",
    kicker: "Práctica · Unity",
    tagline: "Videojuego de plataformas en 2D con dos niveles, enemigos y objetivos, desarrollado en Unity3D.",
    year: "2024",
    accent: "night",
    icon: "sparkles",
    stack: ["Unity3D", "C#"],
    fromCv: true,
  },
  {
    slug: "rest-api-node",
    title: "REST API Node",
    kicker: "Práctica · GitHub",
    tagline: "API REST de películas con Express, validación Zod, CORS y persistencia en MySQL o MongoDB.",
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
    kicker: "Práctica · Móvil",
    tagline: "Aplicaciones móviles de listas de tareas, CRUD y consumo de APIs. En Kotlin incluye servicios en segundo plano.",
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
    tagline: "Explorador de GIFs desarrollado en React y Vite, con enrutamiento y publicación en Netlify.",
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
    tagline: "Lista de precios comercial con Firebase, generación de PDF y Tailwind CSS. Publicada en Netlify.",
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
    tagline: "Catálogo de héroes con React Router, Tailwind CSS y búsqueda.",
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
    tagline: "Buscador de cócteles integrado con una API pública.",
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
    tagline: "Búsqueda de imágenes con listado de favoritos, integrada con una API de fotografías.",
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
    tagline: "Sistema de gestión veterinaria en PHP, desarrollado en el mismo ciclo que el formulario de mascotas.",
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
    tagline: "Formulario de registro de mascotas en PHP, complementario a VeterinaryPHP.",
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
    tagline: "Aplicación de chat en tiempo real con Express, Socket.IO y cliente en React.",
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
    tagline: "Cuestionario de JavaScript desarrollado con React, TypeScript, Material UI y Zustand.",
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
    tagline: "Aplicación de diario personal en React y Material UI, con enrutamiento.",
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
    tagline: "Aplicación de lista de tareas en JavaScript, correspondiente a las prácticas del currículum.",
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
    tagline: "Página de aterrizaje desarrollada con HTML y CSS.",
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
