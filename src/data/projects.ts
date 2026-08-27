export type ProjectModule = {
  name: string;
  description: string;
};

export type ArchLayer = {
  name: string;
  items: string[];
  lane?: "left" | "right";
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
  architectureLayers?: ArchLayer[];
  related: string[];
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "jornalpro",
    title: "JornalPro Cloud",
    kicker: "Producto principal",
    tagline: "ERP agrícola en producción: web, móvil, hardware NFC e IA operativa.",
    summary:
      "Producto privado de JornalPro. Tres superficies en paralelo: API en la nube, panel web PWA y aplicación Android offline-first. Cubre nómina semanal, asistencias y cuadrillas, tesorería, empaque, buzón SAT/CFDI y el asistente Joni por WhatsApp y chat web.",
    problem:
      "No es un CRUD. El dominio exige jornales semanales, biometría y NFC, fiscal México, tesorería, empaque y un asistente operativo. La conectividad en campo es intermitente. JornalPro concentra esa operación en una plataforma multiempresa.",
    role: "Arquitectura y desarrollo de backend, interfaz web y aplicación móvil",
    year: "2024 — actualidad",
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
      "Tres productos en producción: ERP web, app de campo y tienda Shopify en paralelo.",
      "Nómina semanal, asistencias, cuadrillas y cierre de semana.",
      "Biometría HikCentral en caseta y persistencias NFC en campo.",
      "Buzón SAT, descarga masiva CFDI y conciliación con tesorería.",
      "Empaque, pallets, embarques, compras y almacén.",
      "Joni: enrutador de IA en WhatsApp y chat web.",
      "Tiempo real con Socket.IO: buzón SAT, notificaciones y persistencias.",
      "JWT, 2FA y control de acceso por módulo en un entorno multiempresa.",
    ],
    modules: [
      {
        name: "Nómina semanal",
        description:
          "Captura diaria, cuadrillas, temporadas, cierre de semana, TXT bancario, préstamos y conciliación.",
      },
      {
        name: "Asistencias y biometría",
        description:
          "HikCentral (facial) en caseta y NFC/QR en surco. Ambas fuentes alimentan el mismo ciclo de nómina.",
      },
      {
        name: "Tesorería y SAT",
        description:
          "Cajas, transferencias, plan de cuentas, buzón SAT y conciliación de CFDI.",
      },
      {
        name: "Empaque y compras",
        description:
          "Pallets, embarques, acarreos, requisiciones, órdenes y almacén.",
      },
      {
        name: "Joni e IA operativa",
        description:
          "Asistente multi-canal: WhatsApp y chat web sobre el mismo motor. Extracción de listas con visión.",
      },
      {
        name: "Tiempo real y offline",
        description:
          "Socket.IO por ubicación. La app Flutter opera sin red y sincroniza con betuko_offline_sync.",
      },
    ],
    howItWorks: [
      "Cada empresa es un tenant. La ubicación (campo) viaja en X-Location-Id.",
      "El panel web administra catálogos, cierra semanas y reporta. La app registra en campo aunque no haya red.",
      "Las persistencias NFC/GPS llegan al backend como captura diaria. Al reconectar, la cola Hive se envía en bloque.",
      "HikCentral cubre biométricos en caseta. NFC cubre el surco. Ambos alimentan el mismo ciclo de nómina.",
      "Joni atiende WhatsApp y el chat del panel con el mismo enrutador.",
      "Socket.IO emite persistencias, notificaciones y eventos del buzón SAT.",
    ],
    architecture: `flowchart TB
  subgraph surfaces [Superficies]
    Web[ERP Web PWA]
    App[App de campo Flutter]
  end
  subgraph api [JornalPro Cloud]
    Express[Express Prisma PostgreSQL]
    IO[Socket.IO]
    Joni[Joni IA router]
    Auth[JWT 2FA RBAC]
  end
  subgraph domain [Dominio]
    Nomina[Nomina y cuadrillas]
    Tes[Tesoreria y cajas]
    Pack[Empaque y embarques]
    SAT[Buzon SAT CFDI]
  end
  subgraph field [Campo y oficina]
    Hik[HikCentral facial]
    NFC[nfc-service ACR122U]
    Sync[betuko_offline_sync]
    WA[WhatsApp]
  end
  Web --> Auth
  App --> Auth
  Auth --> Express
  Express --> Nomina
  Express --> Tes
  Express --> Pack
  Express --> SAT
  Express --> IO
  Joni --> WA
  Joni --> Web
  Joni --> Express
  Hik --> Express
  NFC --> Web
  NFC --> App
  Sync --> App
  IO --> Web
  IO --> SAT`,
    architectureLayers: [
      {
        name: "Superficies",
        items: ["ERP web PWA", "App Flutter de campo"],
      },
      {
        name: "Panel web",
        lane: "left",
        items: ["Nómina", "Tesorería", "Empaque", "Almacenes", "Configuración", "Resultados"],
      },
      {
        name: "App de campo",
        lane: "right",
        items: ["Asistencias NFC/QR", "Alta de empleados", "Captura de surcos", "Cajas"],
      },
      {
        name: "Adaptadores",
        items: ["nfc-service :47321", "nfc_manager", "betuko_offline_sync", "WorkManager"],
      },
      {
        name: "API",
        items: ["JWT / 2FA / RBAC", "processes/payroll", "treasury/sat-mailbox", "packing", "warehouses", "whatsapp", "mobile"],
      },
      {
        name: "Servicios",
        items: ["socket-gateway", "chatbot Joni", "hikcentral", "SAT CFDI"],
      },
    ],
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
    kicker: "Estudio de caso",
    tagline: "API en la nube de un ERP: aproximadamente 1.150 controladores y 182 modelos.",
    summary:
      "Monolito modular en Node.js y TypeScript. Express 5, Prisma 7 sobre PostgreSQL, JWT con TOTP, Socket.IO y tareas programadas. El servidor se identifica como JornalPro Cloud.",
    problem:
      "Era necesario modelar nómina semanal por cuadrilla, asistencia proveniente de varias fuentes, empaque, tesorería fiscal y un bot de WhatsApp, sin fragmentar el dominio en microservicios de forma prematura.",
    role: "Responsable de backend / desarrollo full-stack",
    year: "2024 — actualidad",
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
      "126 controladores REST y 182 modelos Prisma en un monolito modular.",
      "Autenticación empresarial: JWT, 2FA, OTP y dispositivos de confianza.",
      "Dominio: nómina, asistencias, tesorería, empaque, compras y SAT.",
      "HikCentral, WhatsApp Meta, buzón SAT/CFDI y Socket.IO en vivo.",
      "Joni: enrutador de IA para WhatsApp y el chat del panel.",
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
  subgraph clients [Clientes]
    Web[Dashboard PWA]
    App[App Flutter]
    WA[WhatsApp]
  end
  Web --> Express
  App --> Express
  WA --> Joni[Joni IA router]
  Joni --> Express
  Express --> Auth[JWT 2FA Role Module]
  Auth --> Ctrl[Controllers por convencion]
  Ctrl --> Prisma
  Prisma --> PG[(PostgreSQL)]
  Express --> IO[Socket.IO]
  Express --> Cron[node-cron]
  Express --> S3[AWS S3]
  Cron --> SAT[Buzon SAT CFDI]
  Cron --> JobsWA[WhatsApp jobs]
  Hik[HikCentral] --> Express
  IO --> Web
  IO --> SAT
  Ctrl --> Nomina[Nomina]
  Ctrl --> Tes[Tesoreria]
  Ctrl --> Pack[Empaque]
  Ctrl --> Buy[Compras]`,
    architectureLayers: [
      {
        name: "Entrada",
        items: ["Dashboard PWA", "App Flutter", "WhatsApp"],
      },
      {
        name: "Auth",
        items: ["JWT", "TOTP / 2FA", "RoleGuard", "ModuleGuard"],
      },
      {
        name: "Rutas",
        lane: "left",
        items: ["admin", "processes/payroll", "treasury", "packing", "warehouses", "mobile", "whatsapp-*", "ai"],
      },
      {
        name: "Servicios",
        lane: "right",
        items: ["payroll", "socket-gateway", "chatbot Joni", "hikcentral", "whatsapp", "sat-mailbox"],
      },
      {
        name: "Datos",
        items: ["Prisma", "PostgreSQL", "AWS S3", "node-cron"],
      },
    ],
    related: ["jornalpro", "jornalpro-frontend", "jornalpro-mobile"],
    links: [
      { label: "App en vivo", href: "https://app.ultechzone.online/login" },
    ],
  },
  {
    slug: "jornalpro-frontend",
    title: "JornalPro Frontend",
    kicker: "Estudio de caso",
    tagline: "ERP web en producción: nómina, tesorería, empaque, SAT y Joni.",
    summary:
      "Panel privado de JornalPro. React 18, Vite 6, Material UI 6, Zustand, React Router 7 y Zod. Más de 100 rutas de negocio, PWA, mapas Leaflet y Socket.IO. Cubre nómina semanal, asistencias, tesorería con buzón SAT, empaque y el chat de Joni.",
    problem:
      "Un capataz, un administrador de empaque y un tesorero no deben ver el mismo menú. La interfaz debe comportarse como varias aplicaciones sin perder una sola sesión ni el contexto de ubicación.",
    role: "Responsable de frontend / desarrollo full-stack",
    year: "2024 — actualidad",
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
      "Seis aplicaciones en una SPA: nómina, empaque, almacenes, tesorería, configuración y resultados.",
      "Login multifactor: contraseña, OTP por correo, TOTP y aprobación de dispositivo.",
      "NFC de escritorio (ACR122U) y Web NFC en Android, en el mismo flujo de alta.",
      "Buzón SAT y conciliación fiscal en tesorería.",
      "Joni en el panel: el mismo motor de IA que WhatsApp.",
      "PWA para assets. Socket.IO en monitor, notificaciones y cobrowse.",
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
  Shell[Shell multi-app PWA] --> Nomina[Nomina]
  Shell --> Empaque[Empaque]
  Shell --> Wh[Almacenes]
  Shell --> Tes[Tesoreria y SAT]
  Shell --> Joni[Chat Joni]
  Shell --> Mon[Monitor Socket.IO]
  Shell --> API[Axios JWT Location]
  API --> Cloud[Backend Cloud]
  Shell --> NFC[nfc-service 47321]
  Shell --> WebNFC[Web NFC Android]
  Shell --> Maps[Leaflet]
  IO[Socket.IO] --> Mon
  IO --> Tes
  Joni --> Cloud`,
    architectureLayers: [
      {
        name: "Shell",
        items: ["Nómina", "Tesorería", "Empaque", "Almacenes", "Configuración", "Resultados"],
      },
      {
        name: "Módulos",
        items: ["Asistencias", "Alta de empleado", "Buzón SAT", "Chat Joni", "Monitor", "HikCentral"],
      },
      {
        name: "Cliente",
        lane: "left",
        items: ["Axios + JWT", "X-Location-Id", "Zustand", "PWA Workbox"],
      },
      {
        name: "Local",
        lane: "right",
        items: ["nfc-service :47321", "Web NFC", "Leaflet", "Socket.IO"],
      },
    ],
    related: ["jornalpro", "jornalpro-backend", "nfc-service"],
    links: [
      { label: "En vivo", href: "https://app.ultechzone.online/login" },
    ],
  },
  {
    slug: "jornalpro-mobile",
    title: "JornalPro Mobile",
    kicker: "Estudio de caso",
    tagline: "App de campo offline-first: NFC, QR, GPS y sincronización en segundo plano.",
    summary:
      "Aplicación privada de JornalPro para capataces. Flutter, Riverpod y WorkManager. Opera sin red con betuko_offline_sync y cola Hive. NFC, QR, geolocalización, alta de empleados y destajo por surcos con voz en el dispositivo. Se distribuye como APK.",
    problem:
      "En campo no hay red Wi-Fi estable. Es necesario escanear decenas de gafetes, conservar cada registro y enviarlo cuando exista conectividad; en su ausencia, la operación debe continuar.",
    role: "Responsable de mobile / desarrollo full-stack",
    year: "2024 — actualidad",
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
      "Operación offline-first: se trabaja sin red y se sincroniza al recuperar conexión.",
      "Asistencias NFC y QR con geolocalización y confirmación por voz.",
      "Sincronización en segundo plano con WorkManager y cola Hive.",
      "Alta de empleados en campo: foto, firma y entrega de tarjeta NFC.",
      "Operaciones de campo: cuadrillas, destajo por surcos y captura diaria.",
      "Paquete betuko_offline_sync en producción para catálogos.",
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
  UI[Pantallas Riverpod] --> Sync[betuko_offline_sync]
  UI --> Queue[Cola Hive asistencias]
  UI --> Alta[Alta de empleados]
  NFC[NFC y QR] --> UI
  GPS[Geolocalizacion] --> UI
  Voice[Sherpa-ONNX] --> Surcos[Destajo surcos]
  Surcos --> UI
  Sync --> Hive[(Catalogos Hive)]
  Queue --> HiveQ[(attendance_queue)]
  WM[WorkManager] --> Sync
  WM --> Queue
  Sync --> API[Backend /api]
  Queue --> Bulk[daily-capture/bulk]
  Alta --> API`,
    architectureLayers: [
      {
        name: "Pantallas",
        items: ["Asistencias", "Alta de empleado", "Captura de surcos", "Cajas"],
      },
      {
        name: "Campo",
        lane: "left",
        items: ["NFC", "QR", "GPS", "Sherpa-ONNX"],
      },
      {
        name: "Offline",
        lane: "right",
        items: ["betuko_offline_sync", "Cola Hive", "WorkManager", "connectivity_plus"],
      },
      {
        name: "Nube",
        items: ["Backend /api", "daily-capture/bulk"],
      },
    ],
    related: ["jornalpro", "jornalpro-backend", "offline-sync", "nfc-service"],
    links: [],
  },
  {
    slug: "offline-sync",
    title: "betuko_offline_sync",
    kicker: "Biblioteca Flutter",
    tagline: "Sincronización offline-first mediante tres operaciones: get, save y syncAll.",
    summary:
      "Paquete público en pub.dev (v3.3.2). Hive, HTTP, connectivity_plus y WorkManager. Se originó en JornalPro y se publicó para que otras aplicaciones Flutter reutilicen la misma semántica.",
    problem:
      "Cada funcionalidad móvil volvía a implementar caché, pendientes y reconexión. Se requirió una API mínima que lea siempre en local y sincronice cuando el usuario o la red lo permitan.",
    role: "Autor y responsable de mantenimiento",
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
      "get() responde siempre desde Hive, de forma inmediata.",
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
    architectureLayers: [
      {
        name: "API pública",
        items: ["get", "save", "syncAll"],
      },
      {
        name: "Núcleo",
        items: ["OnlineOfflineManager", "LocalStorage Hive", "SyncService", "ApiClient"],
      },
      {
        name: "Red",
        items: ["ConnectivityService", "Timer 10 min", "WorkManager 15 min"],
      },
    ],
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
      "Servicio REST para la lectura de tarjetas NFC en escritorio. Express, nfc-pcsc, CORS, consola web e instaladores para Windows y macOS (exe, DMG, launchd). El panel de JornalPro lo consulta cada 500 ms.",
    problem:
      "El alta de empleados y la entrega de gafetes se realizan en oficina con lector USB, no en el teléfono. El navegador no comunica con PC/SC; se requiere un puente local estable.",
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
      "Puente REST entre el lector ACR122U y el panel web, en tiempo real.",
      "UID formateado. Se limpia al leer o a los cinco segundos.",
      "Reconexión con espera, detección de suspensión y reinicio manual.",
      "Instalador para macOS con Node LTS embebido y autoinicio launchd.",
      "Integrado en el alta de empleados, entrega de gafetes y búsqueda por tarjeta.",
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
  Reader[ACR122U USB] --> PCSC[nfc-pcsc]
  PCSC --> Svc[REST :47321]
  Svc --> Web[Alta y gafetes]
  Svc --> Lookup[Lookup empleado]
  Svc --> Console[Consola web]
  Installer[DMG EXE launchd] --> Svc
  Web --> Cloud[JornalPro Cloud]`,
    architectureLayers: [
      {
        name: "Hardware",
        items: ["ACR122U", "PC/SC", "nfc-pcsc"],
      },
      {
        name: "Servicio local",
        items: ["REST :47321", "/last-card", "/status", "Consola web"],
      },
      {
        name: "Clientes",
        lane: "left",
        items: ["Alta de empleado", "Entrega de gafetes", "Lookup"],
      },
      {
        name: "Distribución",
        lane: "right",
        items: ["DMG macOS", "EXE Windows", "launchd"],
      },
    ],
    related: ["jornalpro-frontend", "jornalpro-mobile", "jornalpro"],
    links: [
      { label: "GitHub", href: "https://github.com/betuko37/nfc-service" },
    ],
  },
  {
    slug: "tienda-ivan",
    title: "ITZ Coleccionables",
    kicker: "Comercio headless",
    tagline: "Tienda Shopify Hydrogen y Remix para Funko y figuras coleccionables.",
    summary:
      "Tienda en línea de ITZ Coleccionables (itzcoleccionables.com): arquitectura headless sobre Hydrogen 2025 y Remix 2. Partió del Demo Store y se convirtió en un storefront propio: tema oscuro, cursor de temporada, roles de administración, Cloudinary, motion y correo con Nodemailer.",
    problem:
      "Shopify Liquid no ofrecía el control visual ni el panel interno que requería la tienda. Era necesario conservar el checkout de Shopify y construir el resto en React.",
    role: "Desarrollo del storefront e integraciones a medida",
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
      "Storefront Hydrogen en producción, publicado en Oxygen.",
      "Storefront API, Admin API y Customer Account API.",
      "Comercio headless: el checkout permanece en Shopify.",
      "Loader raíz con defer: layout crítico frente a carrito y administración.",
      "Cursor de temporada configurable mediante metafield JSON.",
      "SEO JSON-LD y analítica de Hydrogen.",
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
  Browser --> Ox[Oxygen]
  Ox --> Remix[Remix + Hydrogen]
  Remix --> SF[Storefront API]
  Remix --> CA[Customer Account API]
  Remix --> Admin[Admin API]
  SF --> Shopify[(Shopify)]
  Admin --> Shopify
  Remix --> Cloudinary
  Remix --> Mail[Nodemailer]
  Remix --> Checkout[Checkout Shopify]`,
    architectureLayers: [
      {
        name: "Runtime",
        items: ["Oxygen", "Remix", "Hydrogen"],
      },
      {
        name: "Shopify",
        items: ["Storefront API", "Admin API", "Customer Account API", "Checkout"],
      },
      {
        name: "Media y correo",
        items: ["Cloudinary", "Nodemailer"],
      },
    ],
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
