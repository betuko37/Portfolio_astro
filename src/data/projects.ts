export type ProjectModule = {
  name: string;
  description: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  tagline: string;
  summary: string;
  problem: string;
  role: string;
  year: string;
  featured: boolean;
  accent: "purple" | "ink" | "sand" | "night";
  stack: string[];
  highlights: string[];
  modules: ProjectModule[];
  howItWorks: string[];
  architecture: string;
  related: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "jornalpro",
    title: "JornalPro Cloud",
    kicker: "Producto principal",
    tagline: "ERP multi-empresa: API, dashboard, app offline y hardware.",
    summary:
      "Plataforma completa para productoras agrícolas en México. Un solo producto con backend cloud, dashboard web y app Android offline-first. Cubre jornales, asistencia NFC/biometría, empaque, compras y SAT.",
    problem:
      "El campo no espera a que haya internet. Hay que pagar jornales por semana, checar gente con tarjeta o cara, cerrar ciclos, facturar embarques y no perder un peso. JornalPro une esa operación en un sistema multi-tenant.",
    role: "Arquitectura y desarrollo de backend, frontend y mobile",
    year: "2024 — hoy",
    featured: true,
    accent: "purple",
    stack: [
      "TypeScript",
      "Express 5",
      "Prisma 7",
      "PostgreSQL",
      "React 18",
      "MUI 6",
      "Flutter",
      "Riverpod",
      "Socket.IO",
      "NFC",
    ],
    highlights: [
      "Tres superficies: API cloud, dashboard PWA y app de campo.",
      "Multi-empresa y multi-ubicación, con roles por módulo.",
      "NFC, biométricos HikCentral y cola offline en el mismo flujo de nómina.",
      "Tesorería con buzón SAT, empaque/embarque y bot operativo por WhatsApp.",
    ],
    modules: [
      {
        name: "Backend cloud",
        description:
          "API Express + Prisma. Autoregistro de rutas, JWT con 2FA, cron jobs, S3, WhatsApp y SAT.",
      },
      {
        name: "Dashboard web",
        description:
          "SPA React/MUI con seis apps lógicas: nómina, empaque, almacenes, tesorería, config y resultados.",
      },
      {
        name: "App de campo",
        description:
          "Flutter Android. Asistencias NFC/QR, captura de surcos con voz offline y alta de empleados.",
      },
      {
        name: "NFC Service",
        description:
          "Servicio local Node para lector ACR122U. El dashboard hace polling a localhost:47321.",
      },
      {
        name: "betuko_offline_sync",
        description:
          "Paquete Flutter publicado. Catálogos Hive + sync. Lo usa la app de JornalPro en producción.",
      },
    ],
    howItWorks: [
      "Cada empresa es un tenant. La ubicación (campo) viaja en X-Location-Id.",
      "El dashboard administra catálogos, cierra semanas y reporta. La app registra en campo aunque no haya red.",
      "Las persistencias NFC/GPS llegan al backend como captura diaria. Al reconectar, la cola Hive se envía en bulk.",
      "HikCentral cubre biométricos en caseta. NFC cubre el surco. Ambos alimentan el mismo ciclo de nómina.",
    ],
    architecture: `flowchart LR
  subgraph cloud [JornalPro Cloud]
    API[Backend Express Prisma]
    Web[Dashboard React MUI]
    App[App Flutter]
  end
  NFC[nfc-service ACR122U]
  Sync[betuko_offline_sync]
  Hik[HikCentral]
  SAT[Buzon SAT]
  WA[WhatsApp Joni]
  Web --> API
  App --> API
  NFC --> Web
  NFC --> App
  Sync --> App
  Hik --> API
  SAT --> API
  WA --> API`,
    related: [
      "jornalpro-backend",
      "jornalpro-frontend",
      "jornalpro-mobile",
      "offline-sync",
      "nfc-service",
    ],
    links: [
      { label: "En vivo", href: "https://app.ultechzone.online/login" },
    ],
  },
  {
    slug: "jornalpro-backend",
    title: "JornalPro Backend",
    kicker: "Case study",
    tagline: "API cloud de un ERP: ~1.150 handlers y 182 modelos.",
    summary:
      "Monolito modular en Node.js y TypeScript. Express 5, Prisma 7 sobre PostgreSQL, JWT con TOTP, Socket.IO y crons. El servidor se identifica como JornalPro Cloud.",
    problem:
      "Había que modelar nómina semanal por cuadrilla, asistencia de varias fuentes, empaque, tesorería fiscal y un bot de WhatsApp — sin partir el dominio en microservicios prematuros.",
    role: "Backend lead / full-stack",
    year: "2024 — hoy",
    featured: false,
    accent: "ink",
    stack: [
      "Node.js",
      "TypeScript",
      "Express 5",
      "Prisma 7",
      "PostgreSQL 17",
      "Zod",
      "JWT",
      "otplib",
      "Socket.IO",
      "node-cron",
      "AWS S3",
      "Postmark",
      "OpenAI",
      "pdfmake",
      "xlsx",
    ],
    highlights: [
      "126 controladores REST registrados por convención de carpetas.",
      "182 modelos Prisma en schema modular (~136 archivos).",
      "Auth: bcrypt, TOTP, OTP email, dispositivos de confianza y sesiones en BD.",
      "Integraciones: HikCentral, WhatsApp Meta, SAT CFDI, S3, Puppeteer.",
    ],
    modules: [
      {
        name: "Admin y auth",
        description:
          "Login, 2FA, empresas, ubicaciones, roles por módulo (nómina, empaque, almacenes), dashboard y presencia.",
      },
      {
        name: "Catálogos de campo",
        description:
          "Empleados (nfcCardId), cuadrillas, reclutadoras, labores, cultivos, lotes, mapas y plantillas de contrato.",
      },
      {
        name: "Nómina y procesos",
        description:
          "Captura diaria, persistencias NFC, ciclos semanales, cierres, TXT bancario, préstamos y conciliación.",
      },
      {
        name: "Reportes",
        description:
          "Auditoría canónica, concentrado de labores, P&L operativo, ausentismo, checadas sin contrato.",
      },
      {
        name: "Empaque y embarque",
        description:
          "Pallets, embarques, acarreos, cotizaciones, facturación y ~20 catálogos logísticos.",
      },
      {
        name: "Tesorería",
        description:
          "Cajas, movimientos, plan de cuentas, transferencias y buzón SAT de descarga masiva CFDI.",
      },
      {
        name: "Compras y almacenes",
        description:
          "Requisiciones, órdenes, cotizaciones, recepciones con fotos y digest por email.",
      },
      {
        name: "Mobile, IA y WhatsApp",
        description:
          "Telemetría de app, APK, bot Joni, extracción de listas de asistencia con visión, notificaciones.",
      },
    ],
    howItWorks: [
      "registerRoutes monta cada *.controller.ts bajo /api/{ruta/anidada}.",
      "AsyncLocalStorage guarda locationId, headers y métricas Prisma por request.",
      "RoleGuard + ModuleGuard aíslan packing/warehouses. ENTERPRISE_ADMIN hereda ADMIN.",
      "Los crons no usan Redis: node-cron cubre SAT, WhatsApp, despoblado y limpieza.",
      "Socket.IO conecta field servers por ubicación y emite persistencias en vivo.",
      "Tras un cierre de semana, servicios de sync actualizan préstamos, tesorería y ledgers.",
    ],
    architecture: `flowchart TB
  Client[Dashboard / App / WhatsApp] --> Express
  Express --> Guards[JWT Role Module]
  Guards --> Ctrl[Controllers por convencion]
  Ctrl --> Prisma
  Prisma --> PG[(PostgreSQL)]
  Express --> S3[AWS S3]
  Express --> Cron[node-cron]
  Express --> IO[Socket.IO]
  Cron --> SAT[SAT CFDI]
  Cron --> WA[WhatsApp jobs]`,
    related: ["jornalpro", "jornalpro-frontend", "jornalpro-mobile"],
    links: [
      { label: "App en vivo", href: "https://app.ultechzone.online/login" },
    ],
  },
  {
    slug: "jornalpro-frontend",
    title: "JornalPro Frontend",
    kicker: "Case study",
    tagline: "Dashboard enterprise: seis apps en una SPA React + MUI.",
    summary:
      "jornalpro-cloud. React 18, Vite 6, Material UI 6, Zustand, React Router 7 y Zod. Más de 100 rutas de negocio, PWA, mapas Leaflet y Socket.IO bajo demanda.",
    problem:
      "Un capataz, un admin de empaque y un tesorero no pueden ver el mismo menú. El frontend tiene que sentirse como varias apps sin perder un solo login ni el contexto de ubicación.",
    role: "Frontend lead / full-stack",
    year: "2024 — hoy",
    featured: false,
    accent: "sand",
    stack: [
      "React 18",
      "TypeScript",
      "Vite 6",
      "MUI 6",
      "Zustand",
      "React Router 7",
      "Axios",
      "SWR",
      "Zod",
      "Leaflet",
      "Recharts",
      "Socket.IO",
      "Workbox PWA",
    ],
    highlights: [
      "Shell multi-app: nómina, empaque, almacenes, tesorería, config, results.",
      "Login multifactor: password, OTP email, TOTP y aprobación de dispositivo.",
      "NFC de escritorio vía servicio local + Web NFC en Android.",
      "Wizards pesados: alta de empleado, cuadrícula semanal v3 y cierre de semana.",
    ],
    modules: [
      {
        name: "Nómina",
        description:
          "Asistencias v2/v3, captura diaria, cierre semanal, préstamos, deducciones, tarjetas bancarias y catálogos de campo.",
      },
      {
        name: "Empaque",
        description:
          "Etiquetado, pallets, embarques, facturas, acarreos, cotizaciones y catálogos logísticos.",
      },
      {
        name: "Almacenes",
        description:
          "Requisiciones, autorizaciones, OC, recepciones e historial de compras.",
      },
      {
        name: "Tesorería",
        description:
          "Cajas, bancos, conciliación, flujo de efectivo, buzón SAT y caja de ahorro.",
      },
      {
        name: "Monitor y mapas",
        description:
          "Tablero fullscreen con Leaflet, feed de eventos, clima y presencia. MapDrawer para lotes y polígonos.",
      },
      {
        name: "Soporte",
        description:
          "Chatbot Joni (mismo motor que WhatsApp), cobrowsing Master Support y Dev Panel.",
      },
    ],
    howItWorks: [
      "ApiInstance inyecta Bearer + X-Location-Id. Un 401 cierra sesión; un fallo de red muestra servicio no disponible.",
      "Guards por rol (Admin, EnterpriseAdmin, Packing, Warehouse, SAT, Master Support).",
      "useNfcService hace polling a 127.0.0.1:47321. useWebNfc cubre Chrome Android.",
      "PWA cachea assets, no datos de negocio. El offline-first vive en la app Flutter.",
      "Socket.IO se conecta solo en Monitor, cobrowse o Dev Panel.",
    ],
    architecture: `flowchart TB
  Shell[Multi-app shell] --> Nomina[Nomina]
  Shell --> Empaque[Empaque]
  Shell --> Wh[Almacenes]
  Shell --> Tes[Tesoreria]
  Shell --> API[Axios + JWT + Location]
  API --> Cloud[Backend Cloud]
  Shell --> NFC[localhost 47321]
  Shell --> Maps[Leaflet MapDrawer]`,
    related: ["jornalpro", "jornalpro-backend", "nfc-service"],
    links: [
      { label: "En vivo", href: "https://app.ultechzone.online/login" },
    ],
  },
  {
    slug: "jornalpro-mobile",
    title: "JornalPro Mobile",
    kicker: "Case study",
    tagline: "App Flutter offline-first: NFC, cola Hive y voz on-device.",
    summary:
      "Android para capataces. ~104k líneas Dart. Offline-first con betuko_offline_sync, cola propia de asistencias, GPS obligatorio, QR de respaldo y ASR Sherpa-ONNX para destajo por surcos. Se distribuye como APK (sin URL pública); las capturas van en esta ficha.",
    problem:
      "En el surco no hay Wi-Fi. Hay que escanear 80 gafetes, no perder un registro y, si hay red, mandarlo. Si no, seguir trabajando.",
    role: "Mobile lead / full-stack",
    year: "2024 — hoy",
    featured: false,
    accent: "purple",
    stack: [
      "Flutter 3.8",
      "Dart",
      "Riverpod",
      "go_router",
      "betuko_offline_sync",
      "Hive",
      "WorkManager",
      "nfc_manager",
      "mobile_scanner",
      "geolocator",
      "sherpa_onnx",
    ],
    highlights: [
      "Asistencias NFC/QR con GPS y TTS de confirmación.",
      "Cola Hive independiente + POST bulk a daily-capture.",
      "Captura de surcos con dictado offline y speaker ID.",
      "Alta de empleado en campo: foto, firma y entrega de tarjeta NFC.",
    ],
    modules: [
      {
        name: "Asistencias",
        description:
          "Ubicación (sección/cuadro/lote), cuadrilla, concepto, modal NFC, panel QR, historial local y lista del día.",
      },
      {
        name: "Cola AttendanceManager",
        description:
          "Hive attendance_queue / sent_history. Reconcile, dedupe y WorkManager en background.",
      },
      {
        name: "Captura de surcos",
        description:
          "Grilla de destajo, roster del día, cierre de jornada y stores locales.",
      },
      {
        name: "Voz offline",
        description:
          "Sherpa-ONNX, hotwords agrícolas, enrollment de capataz y foreground service.",
      },
      {
        name: "Alta y credenciales",
        description:
          "Wizard con verificación facial, contratos y doble pasada NFC para asignar chip.",
      },
      {
        name: "Tesorería (admin empresa)",
        description:
          "Consulta online de cajas. Sin caché local: es un rol distinto al de campo.",
      },
    ],
    howItWorks: [
      "AppInitializer configura betuko, telemetría, migración Hive y sync periódico.",
      "ADMIN/USER ven campo. ENTERPRISE_ADMIN solo cajas.",
      "GlobalSyncService sincroniza 9 catálogos en paralelo, luego la cola de asistencias.",
      "NFC resuelve empleado en Hive, toma GPS y encola. Al haber red, bulk al backend.",
      "Logout hace resetAll() y limpia config de background sync.",
    ],
    architecture: `flowchart TB
  UI[Screens Riverpod] --> Managers[OnlineOfflineManager]
  UI --> Queue[AttendanceManager Hive]
  Managers --> Hive[(Hive catalogs)]
  Queue --> HiveQ[(attendance_queue)]
  Managers --> API[Backend /api]
  Queue --> Bulk[daily-capture/bulk]
  NFC[nfc_manager / QR] --> UI
  Voice[Sherpa-ONNX] --> Surcos[Captura surcos]
  WM[WorkManager] --> Managers
  WM --> Queue`,
    related: ["jornalpro", "jornalpro-backend", "offline-sync", "nfc-service"],
    links: [],
  },
  {
    slug: "offline-sync",
    title: "betuko_offline_sync",
    kicker: "Librería Flutter",
    tagline: "Offline-first en tres llamadas: get, save, syncAll.",
    summary:
      "Paquete público en pub.dev (v3.3.2). Hive + HTTP + connectivity_plus + WorkManager. Nació para JornalPro y se publicó para que cualquier app Flutter tenga la misma semántica.",
    problem:
      "Cada feature móvil reinventaba caché, pendientes y reconexión. Quería una API mínima que siempre lea local y sincronice cuando el usuario o la red lo permitan.",
    role: "Autor y mantenedor",
    year: "2024 — 2026",
    featured: true,
    accent: "ink",
    stack: [
      "Dart",
      "Flutter",
      "Hive",
      "http",
      "connectivity_plus",
      "workmanager",
      "shared_preferences",
    ],
    highlights: [
      "get() siempre responde desde Hive. Instantáneo.",
      "Auto-sync cada 10 minutos y al recuperar red.",
      "Background sync Android cada 15 min vía WorkManager.",
      "Usada en producción por 9+ managers de JornalPro Mobile.",
    ],
    modules: [
      {
        name: "OnlineOfflineManager",
        description:
          "Orquestador. get, save, delete, getPending, getFullData, syncAll estático, streams de data/status.",
      },
      {
        name: "LocalStorage",
        description:
          "Una box Hive por entidad. Recupera boxes corruptas y registra boxes abiertas para debug.",
      },
      {
        name: "SyncService",
        description:
          "Sube pendientes (sync != true) y baja el GET del endpoint. Marca syncDate.",
      },
      {
        name: "ConnectivityService",
        description:
          "Singleton. hasRealConnection pinea URLs reales, no solo el tipo de red.",
      },
      {
        name: "BackgroundSyncService",
        description:
          "Isolate WorkManager. Persiste baseUrl, token y boxes en SharedPreferences.",
      },
      {
        name: "ApiClient",
        description:
          "Bearer, unwrap de { data: [] }, retry con backoff y timeout de 60s.",
      },
    ],
    howItWorks: [
      "GlobalConfig.init(baseUrl, token) una vez al arrancar.",
      "Cada entidad es un manager: boxName + endpoint.",
      "save() escribe local. syncAll() sube pendientes y refresca.",
      "En JornalPro, AttendanceManager usa Hive propio para la cola crítica y betuko para catálogos.",
    ],
    architecture: `flowchart TB
  App[App Flutter] --> GConf[GlobalConfig]
  App --> OOM[OnlineOfflineManager]
  OOM --> LS[LocalStorage Hive]
  OOM --> SS[SyncService]
  OOM --> CS[ConnectivityService]
  SS --> API[ApiClient]
  OOM --> Auto[Timer 10min + reconexion]
  BGS[BackgroundSyncService] --> WM[WorkManager]
  WM --> OOM`,
    related: ["jornalpro-mobile", "jornalpro"],
    links: [
      { label: "pub.dev", href: "https://pub.dev/packages/betuko_offline_sync" },
      { label: "GitHub", href: "https://github.com/betuko37/online_offline" },
    ],
  },
  {
    slug: "nfc-service",
    title: "NFC Service",
    kicker: "Hardware + Node",
    tagline: "Lector ACR122U expuesto como API local en el puerto 47321.",
    summary:
      "Servicio REST para leer tarjetas NFC en escritorio. Express, nfc-pcsc, CORS, consola web e instaladores Windows/macOS (exe, DMG, launchd). El dashboard de JornalPro lo consulta cada 500 ms.",
    problem:
      "El alta de empleado y la entrega de gafetes ocurren en una oficina con lector USB, no en el teléfono. El navegador no habla PC/SC. Hace falta un puente local estable.",
    role: "Autor",
    year: "2025 — 2026",
    featured: true,
    accent: "night",
    stack: [
      "Node.js",
      "Express",
      "nfc-pcsc",
      "CORS",
      "pkg",
      "launchd",
      "PC/SC",
      "ACR122U",
    ],
    highlights: [
      "UID formateado 83:BF:6E:BE. Se limpia al leer o a los 5 segundos.",
      "Reconexión con cooldown, detección de suspensión y restart manual.",
      "Instalador macOS con Node LTS embebido y autoinicio launchd.",
      "Integrado en NfcCardScanModal, entrega de tarjetas y lookup de empleado.",
    ],
    modules: [
      {
        name: "Motor NFC",
        description:
          "nfc-pcsc + ACR122U. Delay distinto en Windows/macOS. Ignora SCardCancel y timeouts de tarjeta.",
      },
      {
        name: "API HTTP",
        description:
          "GET /last-card, /status, /ping, /diagnostic, /logs, /console. POST /logs/clear y /restart-nfc.",
      },
      {
        name: "Consola web",
        description:
          "Terminal oscura con auto-scroll, filtro por tipo y estado del lector.",
      },
      {
        name: "Distribución",
        description:
          "exe con pkg, DMG con INSTALAR.app, runtime Node propio, firma/notarización Apple opcional.",
      },
    ],
    howItWorks: [
      "El servicio escucha 0.0.0.0:47321. El HTTP arranca antes que el stack NFC.",
      "Al acercar una tarjeta, guarda lastCardId. El cliente lo consume y se borra.",
      "Si el Mac se duerme, el heartbeat detecta el hueco y reconecta con cooldown de 10 s.",
      "El front de JornalPro no empaqueta el binario en src/: el DMG vive en public/.",
    ],
    architecture: `flowchart LR
  Reader[ACR122U] --> PCSC[nfc-pcsc]
  PCSC --> Svc[Express :47321]
  Svc --> Web[Dashboard React]
  Svc --> Console[console.html]
  Installer[DMG / EXE] --> Svc`,
    related: ["jornalpro-frontend", "jornalpro-mobile", "jornalpro"],
    links: [
      { label: "GitHub", href: "https://github.com/betuko37/nfc-service" },
    ],
  },
  {
    slug: "tienda-ivan",
    title: "ITZ Coleccionables",
    kicker: "Comercio headless",
    tagline: "Storefront Shopify Hydrogen + Remix para Funko y figuras.",
    summary:
      "Tienda en vivo de ITZ Coleccionables (itzcoleccionables.com): headless sobre Hydrogen 2025 y Remix 2. Partió del Demo Store y se convirtió en un storefront propio: tema oscuro, cursor de temporada, roles admin, Cloudinary, motion y correo con Nodemailer.",
    problem:
      "Shopify Liquid no daba el control visual ni el backoffice ligero que pedía la tienda. Había que quedarse en el checkout de Shopify y construir el resto en React.",
    role: "Desarrollo storefront e integraciones custom",
    year: "2025 — 2026",
    featured: true,
    accent: "night",
    stack: [
      "Shopify Hydrogen",
      "Remix",
      "Oxygen",
      "TypeScript",
      "Tailwind",
      "GraphQL",
      "GSAP",
      "Three.js",
      "Framer Motion",
      "Cloudinary",
      "Nodemailer",
    ],
    highlights: [
      "Loader raíz con defer: layout crítico vs carrito/admin diferidos.",
      "Cursor de tienda configurable (single o temporadas) vía metafield JSON.",
      "isAdmin por ADMIN_EMAILS, avatar desde Customer Account API.",
      "SEO JSON-LD (Organization, Product, Collection, Article) y Analytics Hydrogen.",
    ],
    modules: [
      {
        name: "Storefront Hydrogen",
        description:
          "Catálogo, colecciones, producto, carrito y checkout Shopify. CacheShort en layout GraphQL.",
      },
      {
        name: "Cursor de temporada",
        description:
          "Metafield custom.custom_store_cursor. Librería de hasta 24 cursores, 12 temporadas, hotspot y preview admin.",
      },
      {
        name: "Tema y media",
        description:
          "ThemeProvider, fondo negro, Cloudinary con dns-prefetch, logo WebP y LCP cuidado.",
      },
      {
        name: "Motion",
        description:
          "GSAP, Three.js, Matter.js, postprocessing, Embla (fade/autoplay) y Framer Motion.",
      },
      {
        name: "Cuenta y admin",
        description:
          "Customer Account API, lista de emails admin, shouldRevalidate solo en mutaciones.",
      },
      {
        name: "Email y SEO",
        description:
          "Nodemailer para formularios. schema-dts para rich results de producto y colecciones.",
      },
    ],
    howItWorks: [
      "loadCriticalData pide layout + shop analytics. loadDeferredData trae carrito, login y isAdmin.",
      "El cursor se resuelve en el servidor (Admin API o metafield) y se inyecta como CSS en <html>.",
      "Los menús Shopify se parsean con prefijos custom (blog, catálogo → /products).",
      "Oxygen sirve el storefront; el checkout sigue en el dominio Shopify.",
    ],
    architecture: `flowchart TB
  Browser --> Remix[Remix + Hydrogen]
  Remix --> SF[Storefront API]
  Remix --> CA[Customer Account API]
  Remix --> Admin[Admin API cursor]
  SF --> Shopify[(Shopify)]
  Remix --> Cloudinary
  Remix --> Mail[Nodemailer]
  Remix --> Checkout[Checkout Shopify]`,
    related: [],
    links: [
      { label: "En vivo", href: "https://itzcoleccionables.com/" },
      { label: "GitHub", href: "https://github.com/betuko37/tienda-react-ivan" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getRelatedProjects(slug: string): Project[] {
  const project = getProject(slug);
  if (!project) return [];
  return project.related
    .map((relatedSlug) => getProject(relatedSlug))
    .filter((item): item is Project => Boolean(item));
}

export function getLiveLink(project: Project): ProjectLink | undefined {
  return project.links.find((link) =>
    /en vivo|app en vivo|pub\.dev/i.test(link.label),
  );
}
