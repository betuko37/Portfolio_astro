import type { IconName } from "./icons";
import { HIKCENTRAL_LOGO, getProjectLogo } from "./project-logos";

export type ProjectSpotlight = {
  id: string;
  title: string;
  tagline: string;
  /** Proyecto padre cuando es un módulo o capacidad dentro de otro caso. */
  parent?: string;
  href: string;
  live?: boolean;
  logo?: string;
  icon: IconName;
  stack: string[];
  accent: "purple" | "ink" | "sand" | "night";
  /** Tarjeta más grande en la cuadrícula de inicio. */
  featured?: boolean;
  /** Estilo de tarjeta destacada: oscura (default) o clara. */
  featuredTone?: "dark" | "light";
};

export const projectSpotlights: ProjectSpotlight[] = [
  {
    id: "hikcentral",
    title: "Biometría HikCentral",
    tagline:
      "Reconocimiento facial en caseta con HikCentral Professional: eventos de acceso, alta de credenciales y conciliación automática con nómina semanal.",
    parent: "JornalPro Cloud",
    href: "/proyectos/jornalpro-hikcentral",
    live: true,
    logo: HIKCENTRAL_LOGO,
    icon: "fingerprint",
    stack: ["HikCentral", "Express 5", "Prisma 7", "PostgreSQL", "Socket.IO", "AWS S3"],
    accent: "purple",
    featured: true,
    featuredTone: "dark",
  },
  {
    id: "cotizaciones-facturaciones",
    title: "Cotizaciones y Facturaciones",
    tagline:
      "Producto fiscal independiente: cotizar, timbrar CFDI con FacturoPorTi, conciliar finanzas y reportes ejecutivos multi-empresa.",
    href: "/proyectos/cotizaciones-facturaciones",
    live: true,
    logo: getProjectLogo("cotizaciones-facturaciones"),
    icon: "file-text",
    stack: ["React 18", "MUI 6", "Prisma", "PostgreSQL", "CFDI"],
    accent: "sand",
    featured: true,
    featuredTone: "light",
  },
  {
    id: "agroeasy",
    title: "Agroeasy",
    tagline:
      "ERP de empaque agrícola: acarreos, pallets con QR, embarques exportador y facturación SAT — PWA Vue/Quasar en producción.",
    href: "/proyectos/agroeasy",
    live: true,
    logo: getProjectLogo("agroeasy"),
    icon: "package-open",
    stack: ["Vue 3", "Quasar", "Prisma", "PostgreSQL", "Socket.IO"],
    accent: "purple",
    featured: true,
    featuredTone: "light",
  },
  {
    id: "jornalpro",
    title: "JornalPro Cloud",
    tagline:
      "ERP agrícola multiempresa: nómina semanal, tesorería, empaque, buzón SAT y asistente Joni por WhatsApp.",
    href: "/proyectos/jornalpro",
    live: true,
    logo: getProjectLogo("jornalpro"),
    icon: "layers",
    stack: ["TypeScript", "React 18", "Flutter", "PostgreSQL"],
    accent: "purple",
  },
  {
    id: "jornalpro-mobile",
    title: "JornalPro Mobile",
    tagline:
      "App de campo offline-first: NFC, QR, geolocalización y captura de surcos con voz. Sincroniza con betuko_offline_sync.",
    parent: "JornalPro Cloud",
    href: "/proyectos/jornalpro-mobile",
    live: true,
    logo: getProjectLogo("jornalpro-mobile"),
    icon: "smartphone-nfc",
    stack: ["Flutter", "Riverpod", "Hive", "NFC"],
    accent: "purple",
  },
  {
    id: "tienda-ivan",
    title: "Tienda Shopify",
    tagline: "Headless commerce con Hydrogen, Remix y Storefront API en producción.",
    href: "/proyectos/tienda-ivan",
    live: true,
    logo: getProjectLogo("tienda-ivan"),
    icon: "shopping-bag",
    stack: ["Remix", "Hydrogen", "Shopify"],
    accent: "ink",
  },
];

/** Slugs de proyectos ya destacados en la cuadrícula «Casos reales». */
export function getSpotlightProjectSlugs(): ReadonlySet<string> {
  return new Set(
    projectSpotlights.map((item) => item.href.replace(/^\/proyectos\//, "")),
  );
}
