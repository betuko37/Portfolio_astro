export const projectIcons: Record<string, IconName> = {
  jornalpro: "layers",
  "jornalpro-backend": "server",
  "jornalpro-frontend": "layout-dashboard",
  "jornalpro-mobile": "smartphone-nfc",
  "offline-sync": "refresh-cw",
  "nfc-service": "nfc",
  "tienda-ivan": "shopping-bag",
};

export const stackIcons: Record<string, IconName> = {
  TypeScript: "file-code",
  "Node.js": "hexagon",
  Express: "network",
  "Express 5": "network",
  Prisma: "triangle",
  "Prisma 7": "triangle",
  PostgreSQL: "database",
  "PostgreSQL 17": "database",
  React: "atom",
  "React 18": "atom",
  Vite: "zap",
  "Vite 6": "zap",
  "Material UI": "panels-top-left",
  "MUI 6": "panels-top-left",
  MUI: "panels-top-left",
  Zustand: "boxes",
  Flutter: "smartphone",
  "Flutter 3.8": "smartphone",
  Dart: "code",
  Riverpod: "git-branch",
  Hive: "archive",
  "Shopify Hydrogen": "shopping-bag",
  Remix: "shuffle",
  "Socket.IO": "radio",
  "AWS S3": "hard-drive",
  NFC: "nfc",
  Zod: "shield-check",
  JWT: "key-round",
  Leaflet: "map",
  Workbox: "package",
  go_router: "route",
  WorkManager: "timer",
  nfc_manager: "smartphone-nfc",
  geolocator: "map-pin",
  sherpa_onnx: "audio-lines",
  http: "globe",
  connectivity_plus: "wifi",
  workmanager: "timer",
  shared_preferences: "bookmark",
  "nfc-pcsc": "credit-card",
  CORS: "shield",
  pkg: "box",
  launchd: "power",
  "PC/SC": "usb",
  ACR122U: "scan-line",
  Oxygen: "cloud",
  GraphQL: "share-2",
  GSAP: "sparkles",
  "Three.js": "box",
  "Framer Motion": "move",
  Cloudinary: "image",
  Nodemailer: "mail",
  Axios: "unplug",
  SWR: "refresh-cw",
  Recharts: "chart-column",
  otplib: "key-round",
  "node-cron": "clock",
  Postmark: "send",
  OpenAI: "brain",
  pdfmake: "file-text",
  xlsx: "sheet",
  Angular: "hexagon",
  Laravel: "globe",
  PHP: "code",
  MySQL: "database",
  MongoDB: "database",
  Firebase: "cloud",
  "C#": "terminal",
  Java: "code",
  Kotlin: "smartphone",
  Arduino: "cpu",
  Unity: "box",
  Unity3D: "box",
  Alexa: "audio-lines",
  Android: "smartphone",
  HTML: "file-code",
  CSS: "panels-top-left",
  JavaScript: "file-code",
  "React Router": "route",
  Tailwind: "layers",
};

export const focusIcons: { label: string; icon: IconName }[] = [
  { label: "Productos de dominio complejo", icon: "layers" },
  { label: "Tres productos en producción", icon: "building-2" },
  { label: "Offline-first y tiempo real", icon: "wifi-off" },
  { label: "NFC y biometría", icon: "nfc" },
  { label: "Fiscal México y tesorería", icon: "wallet" },
];

export type IconName =
  | "sprout"
  | "server"
  | "layout-dashboard"
  | "smartphone"
  | "smartphone-nfc"
  | "refresh-cw"
  | "nfc"
  | "shopping-bag"
  | "file-code"
  | "hexagon"
  | "network"
  | "triangle"
  | "database"
  | "atom"
  | "zap"
  | "panels-top-left"
  | "boxes"
  | "code"
  | "git-branch"
  | "archive"
  | "shuffle"
  | "radio"
  | "hard-drive"
  | "shield-check"
  | "key-round"
  | "map"
  | "package"
  | "route"
  | "timer"
  | "map-pin"
  | "audio-lines"
  | "globe"
  | "wifi"
  | "wifi-off"
  | "bookmark"
  | "credit-card"
  | "shield"
  | "box"
  | "power"
  | "usb"
  | "scan-line"
  | "cloud"
  | "share-2"
  | "sparkles"
  | "move"
  | "image"
  | "mail"
  | "unplug"
  | "chart-column"
  | "clock"
  | "send"
  | "brain"
  | "file-text"
  | "sheet"
  | "building-2"
  | "wallet"
  | "github"
  | "linkedin"
  | "whatsapp"
  | "message-circle"
  | "arrow-up-right"
  | "arrow-right"
  | "home"
  | "folder-kanban"
  | "user-round"
  | "layers"
  | "cpu"
  | "fingerprint"
  | "package-open"
  | "tractor"
  | "store"
  | "monitor"
  | "briefcase"
  | "leaf"
  | "badge-check"
  | "circle-alert"
  | "workflow"
  | "waypoints"
  | "terminal"
  | "sun"
  | "moon"
  | "maximize-2"
  | "minus"
  | "plus"
  | "rotate-ccw"
  | "x";

export function iconForStack(label: string): IconName {
  return stackIcons[label] ?? "cpu";
}

export function iconForModule(name: string): IconName {
  const value = name.toLowerCase();
  if (value.includes("nómina") || value.includes("nomina") || value.includes("payroll") || value.includes("préstamo")) return "wallet";
  if (value.includes("tesorer")) return "wallet";
  if (value.includes("backend") || value.includes("api") || value.includes("auth")) return "server";
  if (value.includes("dashboard") || value.includes("front") || value.includes("monitor")) return "layout-dashboard";
  if (value.includes("mobile") || value.includes("app de campo") || value.includes("asistencia")) return "smartphone-nfc";
  if (value.includes("nfc")) return "nfc";
  if (value.includes("sync") || value.includes("offline") || value.includes("hive")) return "refresh-cw";
  if (value.includes("empaque") || value.includes("pallet") || value.includes("embarque")) return "package";
  if (value.includes("compra") || value.includes("almacén") || value.includes("almacen")) return "store";
  if (value.includes("voz") || value.includes("surco")) return "audio-lines";
  if (value.includes("tienda") || value.includes("store") || value.includes("cursor")) return "shopping-bag";
  if (value.includes("mapa")) return "map";
  if (value.includes("whatsapp") || value.includes("ia") || value.includes("joni")) return "message-circle";
  if (value.includes("catálogo") || value.includes("catalogo")) return "layers";
  if (value.includes("reporte")) return "chart-column";
  if (value.includes("distrib") || value.includes("instal")) return "box";
  if (value.includes("consola")) return "terminal" as IconName;
  if (value.includes("motor")) return "cpu";
  if (value.includes("cuenta") || value.includes("admin")) return "user-round";
  if (value.includes("seo") || value.includes("email")) return "mail";
  if (value.includes("motion") || value.includes("tema")) return "sparkles";
  if (value.includes("trabajo") || value.includes("cola")) return "workflow";
  if (value.includes("alta") || value.includes("credencial")) return "fingerprint";
  if (value.includes("superficie") || value.includes("módulo") || value.includes("modulo")) return "layers";
  if (value.includes("panel") || value.includes("shell") || value.includes("pantalla")) return "layout-dashboard";
  if (value.includes("adaptador") || value.includes("cliente") || value.includes("red")) return "unplug";
  if (value.includes("servicio") || value.includes("núcleo") || value.includes("nucleo") || value.includes("runtime")) return "cpu";
  if (value.includes("entrada") || value.includes("ruta")) return "route";
  if (value.includes("dato") || value.includes("local")) return "database";
  if (value.includes("campo") || value.includes("hardware")) return "nfc";
  if (value.includes("nube") || value.includes("shopify")) return "cloud";
  if (value.includes("media") || value.includes("correo")) return "image";
  return "layers";
}
