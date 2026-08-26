export const profile = {
  name: "Jesús Zavala",
  handle: "betuko37",
  role: "Ingeniero de software",
  headline: "Construyo sistemas que aguantan el campo, la nómina y el comercio real.",
  summary:
    "Diseño y programo productos de punta a punta: backend, dashboard y apps móviles offline-first. Mi trabajo más fuerte es JornalPro Cloud, un ERP agrícola con nómina por jornales, NFC, biométricos y tesorería. También publico librerías Flutter y servicios de hardware que se usan en producción.",
  about: [
    "No hago demos sueltas. El código que muestro aquí corre en operaciones diarias: capataces sin señal, cierres de semana, lectores USB, instaladores de macOS y tiendas Shopify.",
    "Me muevo entre TypeScript, Flutter y hardware. Me importa que el sistema sea entendible: módulos claros, sync predecible, auth real y reportes que cuadran con el dinero.",
    "Busco un equipo donde pueda aportar esa misma profundidad: producto difícil, dominio concreto y responsabilidad de extremo a extremo.",
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
    "Sistemas multi-tenant",
    "Offline-first",
    "Nómina y operaciones",
    "Hardware NFC",
    "Dashboards enterprise",
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
