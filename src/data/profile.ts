export const profile = {
  name: "Jesús Zavala",
  handle: "betuko37",
  role: "Ingeniero de software",
  headline: "Construyo cualquier capa del producto: backend, web, mobile y hardware.",
  summary:
    "Full-stack de punta a punta. APIs, dashboards, apps offline, e-commerce y el puente con hardware cuando hace falta. JornalPro, una tienda Shopify headless, una librería Flutter y un servicio NFC salieron a producción. Si el problema es nuevo, lo resuelvo.",
  about: [
    "No me encasillo en un stack ni en un dominio. He construido cloud, PWAs, apps sin red, comercio headless y lectores USB. El hilo común es producto real, no demos.",
    "Me muevo entre TypeScript, Flutter y hardware. Me importa que el sistema se entienda: módulos claros, sync predecible, auth de verdad y reportes que cuadran.",
    "Busco un equipo donde pueda atacar lo que salga: backend, frontend, mobile o la pieza rara que nadie quiere tocar.",
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
