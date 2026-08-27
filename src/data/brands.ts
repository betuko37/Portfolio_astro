import type { SimpleIcon } from "simple-icons";
import {
  siAndroid,
  siAngular,
  siArduino,
  siAxios,
  siAstro,
  siCloudinary,
  siCss,
  siDart,
  siDocker,
  siDotnet,
  siExpress,
  siFirebase,
  siFlutter,
  siFramer,
  siGraphql,
  siGnubash,
  siGsap,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siKotlin,
  siLaravel,
  siLeaflet,
  siMongodb,
  siMui,
  siMysql,
  siNfc,
  siNodedotjs,
  siOpenjdk,
  siPhp,
  siPostman,
  siPostgresql,
  siPrisma,
  siPinia,
  siPwa,
  siQuasar,
  siReact,
  siReactrouter,
  siRemix,
  siResend,
  siShopify,
  siSocketdotio,
  siSwr,
  siSwift,
  siTailwindcss,
  siTanstack,
  siThreedotjs,
  siTypescript,
  siUnity,
  siVite,
  siVuedotjs,
  siZod,
} from "simple-icons";
import { iconForStack, type IconName } from "./icons";

type BrandMark = {
  path: string;
  color: string;
};

const brands: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  "Node.js": siNodedotjs,
  Express: siExpress,
  "Express 5": siExpress,
  Prisma: siPrisma,
  "Prisma 7": siPrisma,
  PostgreSQL: siPostgresql,
  "PostgreSQL 17": siPostgresql,
  SQL: siPostgresql,
  React: siReact,
  "React 18": siReact,
  Vue: siVuedotjs,
  "Vue 3": siVuedotjs,
  Quasar: siQuasar,
  Pinia: siPinia,
  "Vue Query": siTanstack,
  TanStack: siTanstack,
  Vite: siVite,
  "Vite 6": siVite,
  "Material UI": siMui,
  "MUI 6": siMui,
  MUI: siMui,
  Flutter: siFlutter,
  "Flutter 3.8": siFlutter,
  Dart: siDart,
  "Shopify Hydrogen": siShopify,
  Remix: siRemix,
  "Socket.IO": siSocketdotio,
  Zod: siZod,
  JWT: siJsonwebtokens,
  Leaflet: siLeaflet,
  Angular: siAngular,
  Laravel: siLaravel,
  PHP: siPhp,
  MySQL: siMysql,
  MongoDB: siMongodb,
  Firebase: siFirebase,
  "C#": siDotnet,
  Java: siOpenjdk,
  Kotlin: siKotlin,
  Arduino: siArduino,
  Unity: siUnity,
  Unity3D: siUnity,
  Docker: siDocker,
  Postman: siPostman,
  Resend: siResend,
  Swift: siSwift,
  Android: siAndroid,
  HTML: siHtml5,
  CSS: siCss,
  JavaScript: siJavascript,
  Astro: siAstro,
  Shell: siGnubash,
  "React Router": siReactrouter,
  "React Router 7": siReactrouter,
  Tailwind: siTailwindcss,
  GraphQL: siGraphql,
  GSAP: siGsap,
  "Three.js": siThreedotjs,
  "Framer Motion": siFramer,
  Cloudinary: siCloudinary,
  Axios: siAxios,
  SWR: siSwr,
  "Workbox PWA": siPwa,
  PWA: siPwa,
  NFC: siNfc,
};

/** Marcas sin entrada en simple-icons — logo raster del producto. */
const brandImages: Record<string, string> = {
  HikCentral: "/hikcentral/logo/icon.webp",
  "HikCentral Professional": "/hikcentral/logo/icon.webp",
};

const fallbackColor: Record<string, string> = {
  Zustand: "#433E38",
  Riverpod: "#0757D4",
  Hive: "#FFC107",
  "AWS S3": "#FF9900",
  OpenAI: "#10A37F",
  Nodemailer: "#22B573",
  pdfmake: "#1A73E8",
  xlsx: "#217346",
  Postmark: "#FFDE00",
  HikCentral: "#FA3139",
  CFDI: "#0A0A0A",
  "node-cron": "#68A063",
  otplib: "#F97316",
  Recharts: "#22C55E",
  Oxygen: "#7AB55C",
  Alexa: "#00CAFF",
  go_router: "#0175C2",
  WorkManager: "#3DDC84",
  workmanager: "#3DDC84",
  nfc_manager: "#002E5F",
  mobile_scanner: "#3DDC84",
  geolocator: "#4285F4",
  sherpa_onnx: "#0EA5E9",
  http: "#0175C2",
  connectivity_plus: "#0175C2",
  shared_preferences: "#0175C2",
  betuko_offline_sync: "#7C3AED",
  "nfc-pcsc": "#002E5F",
  CORS: "#0A0A0A",
  pkg: "#CB3837",
  launchd: "#A3AAAE",
  "PC/SC": "#002E5F",
  ACR122U: "#002E5F",
};

function isMono(hex: string): boolean {
  const value = Number.parseInt(hex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma < 0.14 || luma > 0.9;
}

export function getBrandMark(label: string): BrandMark | undefined {
  const icon = brands[label];
  if (!icon) return undefined;
  return {
    path: icon.path,
    color: isMono(icon.hex) ? "currentColor" : `#${icon.hex}`,
  };
}

export function getBrandImage(label: string): string | undefined {
  return brandImages[label];
}

export function isBrandImage(label: string): boolean {
  return Boolean(getBrandImage(label));
}

export function getBrandColor(label: string): string {
  const mark = getBrandMark(label);
  if (mark) return mark.color;
  return fallbackColor[label] ?? "currentColor";
}

export function getStackLucide(label: string): IconName {
  return iconForStack(label);
}
