export const profile = {
  name: "Jesús Zavala",
  fullName: "Jesús Alberto Zavala",
  handle: "betuko37",
  role: "Desarrollador full-stack, mobile",
  headline: "Desarrollo sistemas de software: backend, web, móviles y hardware.",
  summary:
    "Ingeniero de software. Diseño y desarrollo aplicaciones de extremo a extremo: API, interfaz web y aplicación móvil. Integro hardware cuando el producto lo requiere.",
  about: [
    "Egresado de Ingeniería en Software. Me formé en desarrollo web, aplicaciones móviles, backends e integración de hardware. Trabajo principalmente con TypeScript, React y Flutter, y me adapto al stack que el proyecto requiera.",
    "Me interesa el software que opera en entornos reales. Busco un equipo donde pueda contribuir en más de una capa del producto.",
  ],
  education: [
    {
      school: "Universidad Estatal de Sonora",
      program: "Ingeniería en Software",
      years: "2021–2025",
      logo: "/universidad/LogoUesVinoFondoTransparente.png",
      logoTone: "sand",
    },
    {
      school: "Cecytes Hermosillo V",
      program: "Programación",
      years: "2017–2020",
      logo: "/preparatoria/logo-horizontal-solido-2z8x-Utv.svg",
      logoTone: "sand",
    },
  ],
  languages: [{ name: "Inglés", level: "B1" }],
  alsoStack: [
    "Angular",
    "Laravel",
    "PHP",
    "MySQL",
    "MongoDB",
    "Firebase",
    "C#",
    "Java",
    "Kotlin",
    "Arduino",
    "Unity",
  ],
  location: "Hermosillo, Sonora, México",
  email: "betorolitos37@gmail.com",
  github: "https://github.com/betuko37",
  githubUser: "betuko37",
  linkedin: "https://www.linkedin.com/in/betuko35/",
  whatsapp: "+52 6621324345",
  pubdev: "https://pub.dev/packages/betuko_offline_sync",
  availability: "Disponible para oportunidades en desarrollo full-stack, backend o aplicaciones móviles.",
  focus: [
    "Desarrollo de extremo a extremo",
    "Arquitectura offline-first",
    "Sistemas multiempresa",
    "Integración de hardware NFC",
    "Paneles de control y comercio electrónico",
  ],
  stack: [
    "TypeScript",
    "Node.js",
    "Express",
    "Prisma",
    "PostgreSQL",
    "React",
    "Vite",
    "Material UI",
    "Zustand",
    "Flutter",
    "Dart",
    "Riverpod",
    "Hive",
    "Shopify Hydrogen",
    "Remix",
    "Socket.IO",
    "AWS S3",
    "NFC",
  ],
} as const;

export type Profile = typeof profile;

export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}
