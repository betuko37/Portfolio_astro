#!/usr/bin/env node
/**
 * Genera el CV en PDF (sin página en el sitio).
 * Uso: pnpm cv:pdf
 */
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import {
  siArduino,
  siCloudflare,
  siCursor,
  siDart,
  siDbeaver,
  siDocker,
  siDotnet,
  siExpress,
  siFigma,
  siFirebase,
  siFlutter,
  siGit,
  siGithubactions,
  siGnubash,
  siJavascript,
  siKotlin,
  siLaravel,
  siMui,
  siMysql,
  siNodedotjs,
  siOpenjdk,
  siPhp,
  siPm2,
  siPnpm,
  siPostgresql,
  siPostman,
  siPrisma,
  siPython,
  siQuasar,
  siReact,
  siShopify,
  siSocketdotio,
  siSwift,
  siTypescript,
  siUnity,
  siVite,
  siVuedotjs,
  siZod,
} from "simple-icons";

/** AWS ya no está en simple-icons (marca); smile + etiqueta. */
const ICON_AWS = {
  title: "AWS",
  hex: "FF9900",
  path: "M18.671 14.304c-1.796 1.325-4.412 2.03-6.658 2.03-3.148 0-5.988-1.164-8.13-3.098-.168-.152-.018-.36.184-.242 2.312 1.345 5.172 2.154 7.67 2.154 1.88 0 3.95-.39 5.856-1.197.288-.122.53.189.078.353zm.97-1.106c-.23-.294-1.52-.139-2.102-.07-.174.02-.2-.13-.044-.24 1.012-.712 2.674-.507 2.867-.268.194.24-.05 1.9-1.002 2.693-.146.122-.285.057-.22-.104.214-.528.694-1.716.501-2.011z",
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "cv");
const outPdf = join(outDir, "Jesus-Alberto-Zavala-CV.pdf");
const tmpHtml = join(outDir, "_cv-temp.html");
const photoPath = join(
  root,
  "public",
  "profile",
  "WhatsApp Image 2026-08-26 at 17.14.02.jpeg",
);

const PORTFOLIO = "https://portfolio-astro-nine-coral.vercel.app/";

/** Stack principal (lo que más usas en producción) */
const STACK_CORE = [
  { icon: siTypescript, title: "TypeScript" },
  { icon: siNodedotjs, title: "Node.js" },
  { icon: siExpress, title: "Express" },
  { icon: siPrisma, title: "Prisma" },
  { icon: siPostgresql, title: "PostgreSQL" },
  { icon: siReact, title: "React" },
  { icon: siMui, title: "MUI" },
  { icon: siVuedotjs, title: "Vue" },
  { icon: siFlutter, title: "Flutter" },
  { icon: siDart, title: "Dart" },
  { icon: siSocketdotio, title: "Socket.IO" },
  { icon: siShopify, title: "Shopify" },
  { icon: siDocker, title: "Docker" },
  { icon: siJavascript, title: "JavaScript" },
  { icon: siZod, title: "Zod" },
  { icon: siVite, title: "Vite" },
];

/** También — iconos secundarios (formación / proyectos) */
const STACK_ALSO = [
  { icon: siQuasar, title: "Quasar" },
  { icon: siKotlin, title: "Kotlin" },
  { icon: siSwift, title: "Swift" },
  { icon: siOpenjdk, title: "Java" },
  { icon: siPython, title: "Python" },
  { icon: siPhp, title: "PHP" },
  { icon: siLaravel, title: "Laravel" },
  { icon: siMysql, title: "MySQL" },
  { icon: siDotnet, title: "C# / .NET" },
  { icon: siUnity, title: "Unity" },
  { icon: siArduino, title: "Arduino" },
  { icon: siFirebase, title: "Firebase" },
];

/** Herramientas de trabajo diario — icono + nombre */
const TOOLS = [
  { icon: ICON_AWS, label: "AWS" },
  { icon: siDocker, label: "Docker" },
  { icon: siPostman, label: "Postman" },
  { icon: siDbeaver, label: "DBeaver" },
  { icon: siGit, label: "Git" },
  { icon: siPnpm, label: "pnpm" },
  { icon: siPrisma, label: "Prisma Studio" },
  { icon: siCloudflare, label: "cloudflared" },
  { icon: siGithubactions, label: "GitHub Actions" },
  { icon: siPm2, label: "PM2" },
  { icon: siGnubash, label: "SSH" },
  { icon: siCursor, label: "Cursor AI" },
  { icon: siFigma, label: "Figma" },
];

function iconSvg(icon, title) {
  const raw = icon.hex.toLowerCase();
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // En sidebar oscura, marcas casi negras se ven con tono claro
  const color = luminance < 0.22 ? "#e8e4ff" : `#${icon.hex}`;
  return `<span class="tech-icon" title="${title}" aria-label="${title}" style="color:${color}"><svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path fill="currentColor" d="${icon.path}"/></svg></span>`;
}

function toolChip(icon, label) {
  const color = `#${icon.hex}`;
  return `<span class="tool-chip" title="${label}"><svg viewBox="0 0 24 24" role="img" aria-hidden="true" style="color:${color}"><path fill="currentColor" d="${icon.path}"/></svg><span>${label}</span></span>`;
}

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.EDGE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    join(process.env.LOCALAPPDATA || "", "Google\\Chrome\\Application\\chrome.exe"),
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);

  return candidates.find((p) => existsSync(p)) || null;
}

function buildHtml(photoUrl) {
  const stackCoreHtml = STACK_CORE.map(({ icon, title }) => iconSvg(icon, title)).join("");
  const stackAlsoHtml = STACK_ALSO.map(({ icon, title }) => iconSvg(icon, title)).join("");
  const toolsHtml = TOOLS.map(({ icon, label }) => toolChip(icon, label)).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Jesús Alberto Zavala — CV</title>
  <style>
    @page { size: letter; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      font-size: 8.4pt;
      line-height: 1.32;
      color: #1c1c1c;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      display: grid;
      grid-template-columns: 68mm 1fr;
      width: 215.9mm;
      height: 279.4mm;
      overflow: hidden;
    }
    .sidebar {
      background: #151515;
      color: #f4f4f4;
      padding: 6mm 6.5mm 4mm;
      position: relative;
      height: 279.4mm;
      overflow: hidden;
    }
    .sidebar::after {
      content: "";
      position: absolute;
      inset: 0 0 auto 0;
      height: 3px;
      background: linear-gradient(90deg, #5b21b6, #7c3aed 55%, #a78bfa);
    }
    .photo-wrap {
      width: 36mm;
      height: 36mm;
      margin: 0.5mm auto 2.2mm;
      border-radius: 999px;
      overflow: hidden;
      border: 2.5px solid rgba(255,255,255,0.22);
      box-shadow: 0 5px 16px rgba(0,0,0,0.4);
      background: #2a2a2a;
    }
    .photo-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 18%;
      display: block;
    }
    .side-name {
      text-align: center;
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin: 0 0 1px;
    }
    .side-role {
      text-align: center;
      font-size: 5.8pt;
      color: #c4b5fd;
      font-weight: 600;
      margin: 0 0 1.8mm;
    }
    .side-h {
      margin: 0 0 0.8mm;
      font-size: 5.5pt;
      font-weight: 700;
      letter-spacing: 0.11em;
      text-transform: uppercase;
      color: #c4b5fd;
    }
    .side-block { margin-bottom: 1.5mm; }
    .contact-list { list-style: none; margin: 0; padding: 0; font-size: 5.3pt; line-height: 1.22; }
    .contact-list li { margin: 0 0 0.7mm; word-break: break-word; }
    .contact-list a { color: #f4f4f4; text-decoration: none; }
    .contact-label {
      display: block;
      font-size: 4.7pt;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
      margin-bottom: 0.08mm;
    }
    .side-list { list-style: none; margin: 0; padding: 0; font-size: 5.3pt; }
    .side-list li {
      margin: 0 0 0.35mm;
      padding-left: 2mm;
      position: relative;
      line-height: 1.2;
    }
    .side-list li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.4em;
      width: 0.9mm;
      height: 0.9mm;
      border-radius: 999px;
      background: #7c3aed;
    }
    .edu-item { margin: 0 0 1mm; font-size: 5.6pt; }
    .edu-item strong { display: block; font-size: 5.9pt; margin-bottom: 0.08mm; }
    .edu-item span { display: block; color: rgba(255,255,255,0.62); font-size: 5.3pt; }
    .tech-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8mm 1mm;
      align-items: center;
    }
    .tech-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3.6mm;
      height: 3.6mm;
      border-radius: 0.7mm;
      background: rgba(255,255,255,0.08);
      flex: 0 0 auto;
    }
    .tech-icon svg {
      width: 2mm;
      height: 2mm;
      display: block;
    }
    .tech-note {
      margin: 1mm 0 0;
      font-size: 5pt;
      color: rgba(255,255,255,0.5);
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .tech-grid.also { margin-top: 0.8mm; opacity: 0.92; }
    .main {
      display: flex;
      flex-direction: column;
      padding: 7mm 8mm 5mm 7.5mm;
      height: 279.4mm;
      overflow: hidden;
      background:
        radial-gradient(ellipse 80% 40% at 100% 0%, rgba(124, 58, 237, 0.06), transparent 55%),
        #fff;
    }
    .main h1 {
      margin: 0;
      font-size: 14.5pt;
      font-weight: 750;
      letter-spacing: -0.03em;
      line-height: 1.08;
      color: #111;
    }
    .main .tagline {
      margin: 1mm 0 0;
      font-size: 7.4pt;
      color: #5b21b6;
      font-weight: 600;
    }
    .main .lead {
      margin: 1.2mm 0 0;
      color: #444;
      font-size: 6.6pt;
      line-height: 1.35;
    }
    .avail {
      display: inline-block;
      margin-top: 1.2mm;
      padding: 0.65mm 2.2mm;
      border-radius: 999px;
      background: #f3e8ff;
      color: #5b21b6;
      font-size: 5.9pt;
      font-weight: 600;
    }
    h2 {
      margin: 2mm 0 1mm;
      font-size: 6.6pt;
      font-weight: 700;
      letter-spacing: 0.11em;
      text-transform: uppercase;
      color: #5b21b6;
      display: flex;
      align-items: center;
      gap: 2.5mm;
    }
    h2::after {
      content: "";
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, rgba(91, 33, 182, 0.35), transparent);
    }
    .job { margin: 0 0 1mm; }
    .job-head {
      display: flex;
      justify-content: space-between;
      gap: 2.5mm;
      align-items: baseline;
    }
    .job-title { font-weight: 700; font-size: 7.2pt; color: #111; }
    .job-org { font-size: 6pt; color: #555; margin-top: 0.05mm; }
    .job-dates {
      font-size: 5.5pt;
      color: #5b21b6;
      font-weight: 600;
      white-space: nowrap;
      background: #f3e8ff;
      padding: 0.25mm 1.2mm;
      border-radius: 999px;
    }
    .job-role {
      font-size: 5.8pt;
      color: #666;
      font-style: italic;
      margin: 0.15mm 0 0.2mm;
    }
    ul { margin: 0; padding-left: 2.6mm; }
    li { margin: 0 0 0.08mm; font-size: 6.4pt; line-height: 1.28; }
    .foot {
      margin-top: auto;
      padding-top: 1.8mm;
      border-top: 1px solid #eee;
      font-size: 5.7pt;
      color: #999;
    }
    .foot a { color: #5b21b6; text-decoration: none; font-weight: 600; }
    .foot-h {
      margin: 0 0 1mm;
      font-size: 6pt;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #5b21b6;
    }
    .tools-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1.2mm 2.2mm;
      margin: 0 0 1.4mm;
      align-items: center;
    }
    .tool-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.9mm;
      padding: 0;
      border: none;
      background: transparent;
      font-size: 5.7pt;
      font-weight: 600;
      color: #444;
      white-space: nowrap;
    }
    .tool-chip svg {
      width: 2.5mm;
      height: 2.5mm;
      flex: 0 0 auto;
      display: block;
    }
    .foot-links { margin: 0; }
  </style>
</head>
<body>
  <div class="page">
    <aside class="sidebar">
      <div class="photo-wrap">
        <img src="${photoUrl}" alt="Jesús Alberto Zavala" />
      </div>
      <p class="side-name">Jesús Alberto<br/>Zavala</p>
      <p class="side-role">Full-stack · productos en producción</p>

      <div class="side-block">
        <p class="side-h">Contacto</p>
        <ul class="contact-list">
          <li>
            <span class="contact-label">Portafolio</span>
            <a href="${PORTFOLIO}">portfolio-astro-nine-coral.vercel.app</a>
          </li>
          <li>
            <span class="contact-label">Ubicación</span>
            Hermosillo, Sonora, México
          </li>
          <li>
            <span class="contact-label">Email</span>
            <a href="mailto:betorolitos37@gmail.com">betorolitos37@gmail.com</a>
          </li>
          <li>
            <span class="contact-label">GitHub</span>
            <a href="https://github.com/betuko37">github.com/betuko37</a>
          </li>
          <li>
            <span class="contact-label">LinkedIn</span>
            <a href="https://www.linkedin.com/in/betuko35/">linkedin.com/in/betuko35</a>
          </li>
          <li>
            <span class="contact-label">pub.dev</span>
            <a href="https://pub.dev/packages/betuko_offline_sync">betuko_offline_sync</a>
          </li>
          <li>
            <span class="contact-label">WhatsApp</span>
            +52 662 132 4345
          </li>
        </ul>
      </div>

      <div class="side-block">
        <p class="side-h">Disponibilidad</p>
        <ul class="side-list">
          <li>Inmediata · remoto / híbrido / MX</li>
          <li>Full-stack, backend o mobile</li>
        </ul>
      </div>

      <div class="side-block">
        <p class="side-h">Busco</p>
        <ul class="side-list">
          <li>Equipo mid donde aportar y aprender</li>
          <li>Productos con impacto real en usuarios</li>
          <li>Crecer en arquitectura y buenas prácticas</li>
        </ul>
      </div>

      <div class="side-block">
        <p class="side-h">Formación</p>
        <div class="edu-item">
          <strong>Ingeniería en Software</strong>
          <span>Universidad Estatal de Sonora</span>
          <span>2021–2025</span>
        </div>
        <div class="edu-item">
          <strong>Programación</strong>
          <span>Cecytes Hermosillo V</span>
          <span>2017–2020</span>
        </div>
      </div>

      <div class="side-block">
        <p class="side-h">Idiomas</p>
        <div class="edu-item">
          <strong>Español</strong>
          <span>Nativo</span>
        </div>
        <div class="edu-item">
          <strong>Inglés</strong>
          <span>B1 · lectura técnica fluida</span>
        </div>
      </div>

      <div class="side-block">
        <p class="side-h">Stack principal</p>
        <div class="tech-grid" aria-label="Stack principal">
          ${stackCoreHtml}
        </div>
        <p class="tech-note">También</p>
        <div class="tech-grid also" aria-label="También">
          ${stackAlsoHtml}
        </div>
      </div>

      <div class="side-block">
        <p class="side-h">En números</p>
        <ul class="side-list">
          <li>3+ productos en producción en paralelo</li>
          <li>App Flutter con 9+ managers offline</li>
          <li>betuko_offline_sync en pub.dev</li>
          <li>HikCentral → nómina en caseta</li>
          <li>CFDI timbrado (FacturoPorTi)</li>
        </ul>
      </div>

      <div class="side-block">
        <p class="side-h">Habilidades blandas</p>
        <ul class="side-list">
          <li>Comunicación clara</li>
          <li>Colaboración y feedback</li>
          <li>Aprendizaje continuo</li>
          <li>Responsabilidad en entregas</li>
        </ul>
      </div>

      <div class="side-block">
        <p class="side-h">Dominios</p>
        <ul class="side-list">
          <li>Nómina y asistencias agrícolas</li>
          <li>Biometría / NFC / hardware</li>
          <li>Fiscal México (SAT / CFDI)</li>
          <li>Tesorería, empaque, e-commerce</li>
        </ul>
      </div>
    </aside>

    <main class="main">
      <h1>Jesús Alberto Zavala</h1>
      <p class="tagline">Full-stack · TypeScript / Node / React / Flutter · productos en producción</p>
      <p class="lead">
        Construyo de punta a punta — API, web, móvil e integración con hardware — en problemas de
        negocio reales: nómina agrícola, biometría en caseta, fiscal México, tesorería y empaque.
        Mantengo varios productos en producción y sigo aprendiendo de usuarios, compañeros y código
        ajeno. Busco un equipo mid donde aportar con claridad, escuchar feedback y crecer en
        arquitectura y buenas prácticas. Comunicación, colaboración y responsabilidad forman parte
        de cómo entrego, no solo el stack.
      </p>
      <span class="avail">Disponible · full-stack / backend / mobile · abierto a aprender stack del equipo</span>

      <h2>Productos en producción</h2>

      <article class="job">
        <div class="job-head">
          <div>
            <div class="job-title">JornalPro Cloud</div>
            <div class="job-org">ERP agrícola multiempresa · operación en rancho y empaque</div>
          </div>
          <div class="job-dates">2024 — actualidad</div>
        </div>
        <p class="job-role">Full-stack · TypeScript / Node / React · colaboración en producto</p>
        <ul>
          <li>Nómina semanal, asistencias, tesorería, empaque y buzón SAT/CFDI en una plataforma multi-tenant.</li>
          <li>Asistente Joni (WhatsApp + chat web); JWT/2FA/RBAC y Socket.IO en vivo.</li>
          <li>Express 5, Prisma 7, PostgreSQL, React 18, MUI 6, AWS S3.</li>
        </ul>
      </article>

      <article class="job">
        <div class="job-head">
          <div>
            <div class="job-title">JornalPro Mobile</div>
            <div class="job-org">App Flutter de campo · offline-first · APK en producción</div>
          </div>
          <div class="job-dates">2024 — actualidad</div>
        </div>
        <p class="job-role">Mobile · Flutter / Dart · con backend y usuarios de campo</p>
        <ul>
          <li>Operación sin señal: NFC, QR, GPS y destajo; sync al recuperar red.</li>
          <li><em>betuko_offline_sync</em> (Hive + WorkManager) en 9+ managers de la app · pub.dev.</li>
          <li>Alta de empleados y validación de foto biométrica desde el dispositivo.</li>
        </ul>
      </article>

      <article class="job">
        <div class="job-head">
          <div>
            <div class="job-title">Biometría HikCentral</div>
            <div class="job-org">Integración hardware · módulo de JornalPro Cloud</div>
          </div>
          <div class="job-dates">2024 — actualidad</div>
        </div>
        <p class="job-role">Full-stack · integración Open API + webhooks</p>
        <ul>
          <li>Checador facial HikCentral Professional → nómina: HMAC, webhooks, rostros en S3 y conciliación.</li>
          <li>Multi-ubicación, monitor en vivo y job nocturno de respaldo si falla la red en caseta.</li>
        </ul>
      </article>

      <article class="job">
        <div class="job-head">
          <div>
            <div class="job-title">Agroeasy — Empaques &amp; Embarques</div>
            <div class="job-org">KleviSoft · ERP de empaque agrícola · en producción</div>
          </div>
          <div class="job-dates">2024 — actualidad</div>
        </div>
        <p class="job-role">Full-stack · Vue 3 / Quasar + Node / Prisma</p>
        <ul>
          <li>PWA: acarreos, pallets QR, embarques exportador, inventarios y factura SAT.</li>
          <li>Flujo patio → embarque → facturación; Pinia, Vue Query y API en tiempo real.</li>
        </ul>
      </article>

      <article class="job">
        <div class="job-head">
          <div>
            <div class="job-title">Cotizaciones y Facturaciones</div>
            <div class="job-org">Producto fiscal · CFDI México · en producción</div>
          </div>
          <div class="job-dates">2024 — actualidad</div>
        </div>
        <p class="job-role">Full-stack · React / MUI + Node / Prisma</p>
        <ul>
          <li>Cotización → CFDI timbrado (FacturoPorTi): multi-empresa, conciliación y reportes.</li>
          <li>Catálogos SAT y seguimiento de comprobantes para operación diaria de finanzas.</li>
        </ul>
      </article>

      <article class="job">
        <div class="job-head">
          <div>
            <div class="job-title">ITZ Coleccionables</div>
            <div class="job-org">E-commerce headless Shopify · en producción</div>
          </div>
          <div class="job-dates">2025 — 2026</div>
        </div>
        <p class="job-role">Storefront · Hydrogen / Remix / GraphQL</p>
        <ul>
          <li>Commerce headless con Storefront API y Oxygen — vitrina y checkout a medida.</li>
        </ul>
      </article>

      <h2>Móvil y open source</h2>

      <article class="job">
        <div class="job-head">
          <div>
            <div class="job-title">Flutter · betuko_offline_sync · NFC Service</div>
            <div class="job-org">Campo + pub.dev + lectores ACR122U</div>
          </div>
          <div class="job-dates">2024 — 2026</div>
        </div>
        <p class="job-role">Mobile / open source · Flutter + Node</p>
        <ul>
          <li>Paquete de sync offline en pub.dev; usado en producción por JornalPro Mobile.</li>
          <li>NFC Service local (Express + nfc-pcsc) con instaladores Win/macOS para el panel web.</li>
        </ul>
      </article>

      <article class="job">
        <div class="job-head">
          <div>
            <div class="job-title">También · Kotlin, Swift, Java, Python, PHP, C#</div>
            <div class="job-org">Formación y proyectos · base para ampliar stack del equipo</div>
          </div>
          <div class="job-dates">2021 — 2025</div>
        </div>
        <p class="job-role">Complementario al core TypeScript / Flutter</p>
        <ul>
          <li><strong>Kotlin / Swift:</strong> apps nativas (ciclo de vida, Retrofit, UIKit/SwiftUI).</li>
          <li><strong>Java / Python / PHP:</strong> APIs, scripts y VeterinaryPHP (Laravel/MySQL).</li>
          <li><strong>C#:</strong> domótica Arduino–Alexa y juego 2D en Unity.</li>
        </ul>
      </article>

      <footer class="foot">
        <p class="foot-h">Herramientas cotidianas</p>
        <div class="tools-grid" aria-label="Herramientas cotidianas">
          ${toolsHtml}
        </div>
        <p class="foot-links">
          Portafolio (casos con detalle técnico):
          <a href="${PORTFOLIO}">${PORTFOLIO.replace(/^https?:\/\//, "")}</a>
          · github.com/betuko37 · pub.dev/packages/betuko_offline_sync
        </p>
      </footer>
    </main>
  </div>
</body>
</html>`;
}

async function main() {
  if (!existsSync(photoPath)) {
    throw new Error(`No se encontró la foto: ${photoPath}`);
  }

  await mkdir(outDir, { recursive: true });
  const photoUrl = pathToFileURL(photoPath).href;
  await writeFile(tmpHtml, buildHtml(photoUrl), "utf8");

  const browser = findBrowser();
  if (!browser) {
    throw new Error(
      "No se encontró Chrome ni Edge. Instala Chrome o define CHROME_PATH / EDGE_PATH.",
    );
  }

  const htmlUrl = pathToFileURL(tmpHtml).href;
  const result = spawnSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--prefer-css-page-size",
      `--print-to-pdf=${outPdf}`,
      "--print-to-pdf-no-header",
      htmlUrl,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error(`Falló la impresión a PDF (código ${result.status}).`);
  }

  if (!existsSync(outPdf)) {
    throw new Error("El navegador no generó el PDF.");
  }

  try {
    await unlink(tmpHtml);
  } catch {
    /* ignore */
  }

  console.log(`✓ CV escrito en ${outPdf}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
