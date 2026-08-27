export const profile = {
  name: "Jesús Zavala",
  fullName: "Jesús Alberto Zavala",
  handle: "betuko37",
  role: "Ingeniero de software",
  headline: "Construyo cualquier capa del producto: backend, web, mobile y hardware.",
  summary:
    "Ingeniero de software. Diseño y construyo de punta a punta: la API, la interfaz y la app. Si el producto pide hardware, también lo hago.",
  about: [
    "Estudié Ingeniería en Software y me formé tocando web, mobile, backends y un poco de hardware. Hoy trabajo sobre todo con TypeScript, React y Flutter, pero no me encasillo en un stack.",
    "Me interesa el producto que alguien usa de verdad. Busco un equipo donde pueda atacar lo que salga, no solo una capa.",
  ],
  education: [
    {
      school: "Universidad Estatal de Sonora",
      program: "Ingeniería en Software",
      years: "2021 — 2025",
      logo: "/universidad/LogoUesVinoFondoTransparente.png",
      logoTone: "sand",
    },
    {
      school: "Cecytes Hermosillo V",
      program: "Programación",
      years: "2017 — 2020",
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
  location: "México",
  email: "betorolitos37@gmail.com",
  github: "https://github.com/betuko37",
  githubUser: "betuko37",
  linkedin: "https://www.linkedin.com/in/betuko35/",
  whatsapp: "+52 6621324345",
  pubdev: "https://pub.dev/packages/betuko_offline_sync",
  availability: "Abierto a oportunidades full-stack, backend o mobile.",
  focus: [
    "Producto de extremo a extremo",
    "Offline-first",
    "Sistemas multi-tenant",
    "Hardware NFC",
    "Dashboards y comercio",
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
