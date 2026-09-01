import { practiceProjects } from "./practice-projects";

export type ProjectModule = {
  name: string;
  description: string;
  id?: string;
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
  fromCv?: boolean;
  /** Oculta del catálogo y rails; accesible por URL y spotlights. */
  hideFromCatalog?: boolean;
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
      "HikCentral",
      "Socket.IO",
      "NFC",
    ],
    highlights: [
      "Tres productos en producción: ERP web, app de campo y tienda Shopify en paralelo.",
      "Biometría HikCentral en caseta: facial, credenciales y conciliación con nómina semanal.",
      "Asistencias NFC/QR en surco con app offline-first y nfc-service en escritorio.",
      "Nómina semanal, cuadrillas y cierre de semana.",
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
        id: "biometria-hikcentral",
        name: "Biometría HikCentral",
        description:
          "En caseta, el trabajador se checa con el rostro; el checador avisa al backend y el marcaje cae en la misma captura de nómina que ve el administrador en el panel. Las fotos y IDs de HikCentral viven en la ficha de cada empleado en base de datos.",
      },
      {
        id: "asistencias-nfc-campo",
        name: "Asistencias NFC en campo",
        description:
          "En el surco, el capataz pasa la credencial NFC o QR con la app — aunque no haya señal, la checada se guarda en el teléfono y se sincroniza después. El panel web recibe las persistencias en vivo y las mezcla con las de caseta en la misma semana de nómina.",
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
  Web[ERP web PWA] --> Nomina[Nómina]
  Web --> Tes[Tesorería]
  Web --> Pack[Empaque]
  Web --> Wh[Almacenes]
  App[App Flutter de campo] --> Asist[Asistencias NFC/QR]
  App --> Alta[Alta de empleados]
  App --> Surcos[Captura de surcos]
  App --> Cajas[Cajas]
  Asist --> NFC[nfc-service :47321]
  Alta --> Manager[nfc_manager]
  Surcos --> Sync[betuko_offline_sync]
  Sync --> WM[WorkManager]
  NFC --> Auth[JWT / 2FA / RBAC]
  WM --> Payroll[processes/payroll]
  Auth --> IO[socket-gateway]
  Payroll --> Joni[chatbot Joni]
  IO --> Hik[hikcentral]
  Joni --> SAT[SAT CFDI]`,
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
      "jornalpro-hikcentral",
      "jornalpro-backend",
      "jornalpro-frontend",
      "jornalpro-mobile",
      "offline-sync",
      "nfc-service",
    ],
    links: [
      { label: "En vivo", href: "https://app.ultechzone.online/login" },
      { label: "Sitio oficial", href: "https://jornalpro.com/" },
    ],
  },
  {
    slug: "jornalpro-hikcentral",
    title: "Biometría HikCentral",
    kicker: "JornalPro Cloud · Integración hardware",
    tagline:
      "Checador facial en caseta con HikCentral Professional: Open API, webhooks, alta de rostros y marcajes en tiempo real integrados a la nómina semanal.",
    summary:
      "Módulo de JornalPro Cloud que conecta checadores biométricos HikCentral Professional con el ERP agrícola. Por cada ubicación (campo) se configura un proxy público (Cloudflare), credenciales Open API (partner key/secret con firma HMAC-SHA256) y organización HikCentral. El backend sincroniza personas y rostros, recibe eventos de acceso vía Event Push, los normaliza y los procesa contra turnos y nómina semanal. El panel web muestra checadas en vivo; la app móvil valida fotos antes del alta en campo.",
    problem:
      "En empacadora agrícola la caseta concentra cientos de entradas diarias. Excel o captura manual no escala: hace falta reconocimiento facial confiable, trazabilidad por empleado, tolerancia a desconexiones del webhook y conciliación automática con jornales semanales, turnos nocturnos y cuadrillas — sin duplicar lo que ya captura NFC en surco.",
    role: "Diseño e implementación full-stack de la integración HikCentral (backend proxy, webhooks, procesador de asistencias, UI web y validación en app móvil)",
    year: "2024 — actualidad",
    featured: true,
    hideFromCatalog: true,
    accent: "purple",
    stack: [
      "HikCentral",
      "TypeScript",
      "Express 5",
      "Prisma 7",
      "PostgreSQL",
      "Socket.IO",
      "AWS S3",
      "React 18",
      "MUI 6",
      "Flutter",
      "node-cron",
    ],
    highlights: [
      "Open API HikCentral vía proxy por ubicación: firma Alibaba Cloud Gateway (HMAC-SHA256, X-Ca-Key, Content-MD5).",
      "Event Push: webhook público recibe rostro, huella, palma y multi-factor; responde 200 OK y procesa en background.",
      "Marcaje → nómina: AttendanceProcessor clasifica CHECK_IN, CHECK_OUT, tardanzas, horas extra y duplicados (ventana 120 min).",
      "Alta de rostros: verificación en checador ACS online antes de registrar; batch, reintento y cola de pendientes.",
      "Tiempo real: Socket.IO emite eventos crudos, checadas procesadas, estado del servidor y alertas de desfase de reloj.",
      "Respaldo diario 23:30 Hermosillo: polling del día si el webhook falló; circuit breaker ante errores de conexión.",
      "Multi-tenant: HikCentralConfig por Location con orgIndexCode, access levels, credenciales cifradas y auditoría.",
      "Resincronización de emergencia: limpiar, verificar vacío y re-llenar empleados activos con contrato vigente.",
    ],
    modules: [
      {
        id: "config-proxy",
        name: "Configuración y proxy",
        description:
          "Desde el panel web, el administrador conecta cada rancho o empaque con su servidor HikCentral: URL del túnel, llaves de API y organización. Eso queda guardado en base de datos por ubicación. Cuando la app o el backend necesitan hablar con el checador, leen esa configuración — no hay credenciales hardcodeadas ni mezcla entre empresas.",
      },
      {
        id: "personas-rostros",
        name: "Personas y rostros",
        description:
          "Al dar de alta un empleado, el panel o la app envían su foto al backend. Este crea la persona en HikCentral, registra el rostro en el checador y guarda en la ficha del empleado los IDs de HikCentral más la foto en S3. En pantalla ves si quedó sincronizado o si falta reintentar; la cola de pendientes avisa quién tiene foto local pero aún no aparece en caseta.",
      },
      {
        id: "webhook-event-push",
        name: "Webhook Event Push",
        description:
          "Cuando alguien se checa en caseta, HikCentral avisa al backend al instante — entrada, salida, rostro aceptado o rechazado. El servidor responde de inmediato para no frenar el fila y procesa el evento en segundo plano. En el panel, quien vigila asistencias puede ver los eventos crudos en vivo sin recargar la página.",
      },
      {
        id: "procesador-asistencias",
        name: "Procesador de asistencias",
        description:
          "El backend identifica al empleado por su ID en HikCentral, lo cruza con el turno del día y decide si fue entrada, salida, retardo o duplicado. Eso se escribe en las tablas de asistencia y en la captura diaria de nómina de esa semana. Lo que el capataz o administrador ve en la cuadrícula de asistencias es el mismo dato que ya quedó ligado al cierre de jornal.",
      },
      {
        id: "monitoreo-reloj",
        name: "Monitoreo y reloj",
        description:
          "El dashboard muestra si el servidor y los checadores de cada ubicación están en línea. Si el reloj de HikCentral no coincide con la nube, aparece una alerta en el panel — un desfase de minutos puede correr la nómina entera. También puedes consultar dispositivos conectados sin entrar al administrador de HikCentral.",
      },
      {
        id: "respaldo-cron",
        name: "Respaldo y polling",
        description:
          "Si el webhook falló por mala red o mantenimiento, no se pierde el día: cada noche a las 23:30 (Hermosillo) el backend repregunta a HikCentral qué marcajes hubo y los inserta en base de datos. Es el respaldo silencioso que completa lo que no llegó en tiempo real.",
      },
      {
        id: "mobile-alta",
        name: "Alta en app móvil",
        description:
          "En campo, el capataz toma la foto del trabajador con la app Flutter. Antes de dar por buena la imagen, el backend la prueba contra un checador real. Si HikCentral la rechaza, la app lo marca en rojo pero el alta local sigue; después, desde el panel web se puede reenviar la foto que ya está guardada en S3.",
      },
      {
        id: "focsign-pantallas",
        name: "FOCSign en checadores",
        description:
          "Desde el panel se pueden publicar avisos o imágenes en la pantalla del checador de caseta — por ejemplo recordatorios de turno o comunicados del empaque. El backend envía el material a HikCentral y el dispositivo lo muestra a quien llega a checar.",
      },
    ],
    howItWorks: [
      "El administrador configura HikCentral por ubicación en el panel; los datos viven en base de datos y aplican solo a ese rancho o empaque.",
      "Al registrar un empleado, panel o app suben la foto → el backend valida con el checador → crea persona y rostro en HikCentral → guarda los IDs en la ficha del empleado.",
      "En caseta, cada checada dispara un webhook al backend, que responde al instante y procesa el marcaje sin bloquear la fila.",
      "El backend cruza el evento con turnos y empleados, escribe asistencia y captura de nómina, y avisa al panel por Socket.IO.",
      "La cuadrícula de asistencias se actualiza en vivo; las checadas de caseta conviven con las de NFC en surco en el mismo ciclo semanal.",
      "Si algo no llegó por red, el respaldo nocturno repesca el día; el chip de pendientes ayuda a resincronizar rostros que fallaron.",
    ],
    architecture: `flowchart TB
  subgraph caseta [Caseta]
    ACS[Checador HikCentral ACS]
    Cam[Cámaras / NVR opcional]
  end
  subgraph tunnel [Proxy Cloudflare]
    Proxy["proxyUrl /artemis → HikCentral\\nproxyUrl /api → Backend"]
  end
  subgraph cloud [JornalPro Cloud]
    WH["POST /webhook/events"]
    ProxySvc[HikCentralProxyService]
    Face[Face + Person Service]
    Proc[AttendanceProcessor]
    Pay[Nómina semanal]
    IO[Socket.IO]
    Mon[HikCentralMonitor]
    Cron[Backup cron 23:30]
  end
  subgraph ui [Superficies]
    Web[Panel web MUI]
    App[App Flutter campo]
  end
  ACS -->|Event Push| Proxy
  Proxy --> WH
  WH --> Proc
  ProxySvc -->|Open API firmada| Proxy
  Face --> ProxySvc
  Web --> Face
  App -->|verify-before-register| Face
  Proc --> Pay
  Proc --> IO
  IO --> Web
  Mon --> ProxySvc
  Cron --> ProxySvc
  NFC[nfc-service surco] --> Pay`,
    architectureLayers: [
      {
        name: "Hardware caseta",
        items: ["Checador ACS facial", "Access levels", "FOCSign pantallas"],
      },
      {
        name: "Conectividad",
        items: ["Cloudflare Tunnel", "Open API /artemis", "Webhook Event Push"],
      },
      {
        name: "Backend",
        lane: "left",
        items: [
          "HikCentralConfig por Location",
          "Proxy + firma HMAC",
          "Webhook async",
          "AttendanceProcessor",
          "Backup cron",
        ],
      },
      {
        name: "Datos",
        lane: "right",
        items: [
          "Employee.hikCentralPersonId",
          "AttendanceEvent",
          "WorkDayEntry",
          "Prisma + PostgreSQL",
        ],
      },
      {
        name: "Tiempo real",
        items: [
          "hikcentral:raw_event",
          "attendance:webhook-event",
          "hikcentral:clock-skew",
          "hikcentral_status",
        ],
      },
      {
        name: "Superficies",
        items: [
          "Grid asistencias v3",
          "Eventos biométricos modal",
          "HikCentralServersScreen",
          "Alta empleado móvil",
        ],
      },
    ],
    related: [
      "jornalpro",
      "jornalpro-backend",
      "jornalpro-frontend",
      "jornalpro-mobile",
      "nfc-service",
    ],
    links: [
      { label: "Caso JornalPro Cloud", href: "/proyectos/jornalpro" },
      { label: "Sitio oficial", href: "https://jornalpro.com/" },
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
      "HikCentral",
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
  Web[Dashboard PWA] --> JWT[JWT]
  App[App Flutter] --> JWT
  WA[WhatsApp] --> TOTP[TOTP / 2FA]
  JWT --> Role[RoleGuard]
  TOTP --> Module[ModuleGuard]
  JWT --> Admin[admin]
  JWT --> Payroll[processes/payroll]
  WA --> Joni[chatbot Joni]
  Admin --> Prisma[Prisma]
  Payroll --> PaySvc[payroll]
  Joni --> Prisma
  Prisma --> PG[PostgreSQL]
  Prisma --> S3[AWS S3]
  PG --> Cron[node-cron]`,
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
      { label: "Sitio oficial", href: "https://jornalpro.com/" },
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
      "HikCentral",
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
  Nomina[Nómina] --> Asist[Asistencias]
  Tes[Tesorería] --> SAT[Buzón SAT]
  Empaque[Empaque] --> Alta[Alta empleado]
  Wh[Almacenes] --> Hik[HikCentral]
  Config[Configuración] --> Joni[Chat Joni]
  Res[Resultados] --> Mon[Monitor]
  Asist --> Guards[Guards + MFA]
  SAT --> Axios[Axios + JWT]
  Alta --> NFC[nfc-service]
  NFC --> WebNFC[Web NFC]
  Mon --> Leaflet[Leaflet]
  Leaflet --> IO[Socket.IO]`,
    architectureLayers: [
      {
        name: "Shell",
        items: ["Nómina", "Tesorería", "Empaque", "Almacenes", "Configuración", "Resultados"],
      },
      {
        name: "Módulos",
        items: ["Asistencias", "Buzón SAT", "Alta empleado", "HikCentral", "Chat Joni", "Monitor"],
      },
      {
        name: "Cliente",
        items: ["Guards + MFA", "Axios + JWT", "X-Location-Id", "Zustand", "PWA Workbox"],
      },
      {
        name: "Dispositivo",
        items: ["nfc-service :47321", "Web NFC", "Leaflet", "Socket.IO"],
      },
    ],
    related: ["jornalpro", "jornalpro-backend", "nfc-service"],
    links: [
      { label: "En vivo", href: "https://app.ultechzone.online/login" },
      { label: "Sitio oficial", href: "https://jornalpro.com/" },
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
  Asist[Asistencias] --> NFC[NFC]
  Asist --> QR[QR]
  Alta[Alta de empleado] --> GPS[GPS]
  Surcos[Captura de surcos] --> Voice[Sherpa-ONNX]
  NFC --> Sync[betuko_offline_sync]
  QR --> Queue[Cola Hive]
  GPS --> WM[WorkManager]
  Sync --> API[Backend /api]
  Queue --> Bulk[daily-capture/bulk]
  WM --> API`,
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
    links: [{ label: "Sitio oficial", href: "https://jornalpro.com/" }],
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
  Get[get] --> OOM[OnlineOfflineManager]
  Save[save] --> OOM
  Sync[syncAll] --> OOM
  OOM --> Hive[LocalStorage Hive]
  OOM --> SS[SyncService]
  SS --> API[ApiClient]
  OOM --> Net[ConnectivityService]
  Net --> Timer[Timer 10 min]
  Timer --> WM[WorkManager 15 min]`,
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
  Reader[ACR122U] --> PCSC[PC/SC]
  PCSC --> Driver[nfc-pcsc]
  Driver --> Svc[REST :47321]
  Svc --> Last[/last-card]
  Svc --> Status[/status]
  Svc --> Console[Consola web]
  Svc --> Alta[Alta de empleado]
  Svc --> Gafetes[Entrega de gafetes]
  Svc --> Lookup[Lookup]
  DMG[DMG macOS] --> Svc
  EXE[EXE Windows] --> Svc
  Launch[launchd] --> Svc`,
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
    slug: "agroeasy",
    title: "Agroeasy — Empaques & Embarques",
    kicker: "KleviSoft · En producción",
    tagline: "ERP agrícola de paletización y logística: acarreos, pallets, embarques y facturación SAT.",
    summary:
      "Agroeasy digitaliza empacadoras agrícolas. El módulo de Empaques & Embarques cubre acarreos de campo, pallets con etiquetas QR/código de barras, embarques normales y rápidos, inventario de materiales por almacén, reportes operativos y facturación electrónica. Frontend PWA en Vue 3 + Quasar; API en Node.js, Express y Prisma sobre PostgreSQL, con roles multi-empresa, sync móvil de catálogos y chat con IA.",
    problem:
      "La operación de empaque agrícola exige trazar producto desde el acarreo en campo hasta el embarque exportador, con decenas de catálogos logísticos, etiquetado, inventarios y fiscal México. No basta un CRUD: cada empresa y ubicación opera con permisos distintos y datos que deben cuadrar en tiempo real.",
    role: "Desarrollo full-stack — frontend Vue/Quasar y backend Node/Prisma",
    year: "2024 — actualidad",
    featured: false,
    accent: "purple",
    stack: [
      "Vue 3",
      "Quasar",
      "Vite",
      "Pinia",
      "Vue Query",
      "TypeScript",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Socket.IO",
      "PWA",
      "AWS S3",
    ],
    highlights: [
      "Hub multi-app: Empaques & Embarques, Nómina, Cuaderno agrícola y panel admin en una sola sesión.",
      "Procesos de campo: acarreos, granel, pallets, embarques, embarque rápido y almacenes de materiales.",
      "Etiquetado con QR/códigos de barras, reportes de inventario, acarreos y facturación CFDI.",
      "Más de 20 catálogos: cultivos, distribuidores, transporte, lotes, áreas de empaque y temporadas.",
      "PWA con Workbox; sync móvil de catálogos vía endpoint dedicado de paletización.",
      "Socket.IO para chat con IA (Portkey/OpenAI), AWS S3/SES y roles por membresía.",
    ],
    modules: [
      {
        name: "Acarreos y granel",
        description:
          "Recepción de cosecha desde campo y procesamiento a granel antes del empaque.",
      },
      {
        name: "Pallets y etiquetado",
        description:
          "Creación de pallets, etiquetas QR/código de barras, trazabilidad e impresión.",
      },
      {
        name: "Embarques",
        description:
          "Embarque completo y embarque rápido: armado de carga, facturación y documentación.",
      },
      {
        name: "Almacenes de materiales",
        description:
          "Inventario por almacén con rutas dinámicas y entregas pendientes.",
      },
      {
        name: "Reportes operativos",
        description:
          "Inventario de pallets, concentrados, acarreos, embarques, precios y remisiones.",
      },
      {
        name: "Catálogos logísticos",
        description:
          "Cultivos, distribuidores, destinos, transporte, lotes, empaque y temporadas.",
      },
      {
        name: "Facturación SAT",
        description:
          "CFDI, catálogos fiscales, folios y bandeja de correos integrada.",
      },
    ],
    howItWorks: [
      "Login multi-empresa: el usuario elige empresa y ubicación; los permisos filtran apps y rutas.",
      "El hub carga Empaques & Embarques, Nómina o Cuaderno agrícola según membresía y rol.",
      "Vue Query + Axios consumen la API Express; Pinia guarda catálogos y estado de sesión.",
      "registerRoutes monta controladores por convención bajo /api/apps/{modulo}.",
      "Prisma sobre PostgreSQL modela paletización, nómina, auth e IA en esquemas separados.",
      "Socket.IO alimenta el chat con IA; cron y servicios AWS gestionan correo y archivos.",
      "La PWA cachea assets; el sync móvil expone catálogos de campo para operación offline.",
    ],
    architecture: `flowchart TB
  Vue[Vue 3] --> Express[Express]
  Quasar[Quasar] --> Vue
  Pinia[Pinia] --> Vue
  Express --> Prisma[Prisma]
  Express --> IO[Socket.IO]
  Empaques[Empaques & Embarques] --> Acarreos[Acarreos]
  Empaques --> Pallets[Pallets]
  Empaques --> Embarques[Embarques]
  Empaques --> Rapido[Embarque rápido]
  Empaques --> Almacenes[Almacenes]
  Acarreos --> Prisma
  Pallets --> Prisma
  Embarques --> Prisma
  Nomina[Nómina] --> Prisma
  Cuaderno[Cuaderno agrícola] --> Prisma
  Admin[Administración] --> Prisma
  Express --> Empaques
  Express --> Nomina
  Express --> Cuaderno`,
    architectureLayers: [
      {
        name: "Apps",
        items: ["Empaques & Embarques", "Nómina", "Cuaderno agrícola", "Administración"],
      },
      {
        name: "Procesos",
        items: ["Acarreos", "Pallets", "Embarques", "Embarque rápido", "Almacenes", "Facturación"],
      },
      {
        name: "Frontend",
        lane: "left",
        items: ["Vue 3", "Quasar", "Pinia", "Vue Query", "PWA Workbox"],
      },
      {
        name: "Backend",
        lane: "right",
        items: ["Express", "Prisma", "Socket.IO", "AWS S3", "OpenAI/Portkey"],
      },
    ],
    related: [],
    links: [
      { label: "En vivo", href: "https://soft.agroeasy.com.mx/" },
      { label: "Sitio oficial", href: "https://agroeasy.com.mx/" },
    ],
  },
  {
    slug: "cotizaciones-facturaciones",
    title: "Cotizaciones y Facturaciones",
    kicker: "Producto fiscal · En producción",
    tagline:
      "Sistema comercial para cotizar, timbrar CFDI y conciliar finanzas: clientes, productos, perfiles fiscales y reportes operativos.",
    summary:
      "Producto independiente desplegado en cotiz.jornalpro.com. Frontend PWA en React 18 y MUI 6 con cotizaciones comerciales, PDF (pdfmake) y panel financiero; backend Node.js, Express y Prisma sobre PostgreSQL con timbrado vía FacturoPorTi, perfiles fiscales multi-empresa, CSD cifrado, transacciones conciliables, reglas recurrentes, alertas proactivas y reportes de cobranza, flujo de caja e impuestos.",
    problem:
      "Cotizar, facturar y cuadrar finanzas suele repartirse entre Excel, el PAC y hojas sueltas. El producto concentra catálogos comerciales, timbrado SAT, conciliación bancaria y reportes ejecutivos en una sola sesión multi-perfil fiscal, con jobs en background que sincronizan movimientos y avisan de deudas o presupuestos excedidos.",
    role: "Desarrollo full-stack — frontend React/MUI y backend Node/Prisma",
    year: "2024 — actualidad",
    featured: true,
    accent: "sand",
    stack: [
      "React 18",
      "MUI 6",
      "Vite",
      "Zustand",
      "React Router",
      "Zod",
      "TypeScript",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "Socket.IO",
      "AWS S3",
      "Postmark",
      "PWA",
    ],
    highlights: [
      "Cotizaciones con plantillas, tabs comerciales, juegos de puntos y PDF descargable.",
      "Facturación CFDI: timbrado FacturoPorTi, cancelación, re-facturación, XML y correo Postmark.",
      "Perfiles fiscales con CSD cifrado al arrancar y sesión reutilizable al PAC.",
      "Finanzas: movimientos, conciliación, presupuestos, deudas, créditos y calendario.",
      "Reportes: historial fiscal, cobranza, flujo de efectivo, rentabilidad por cliente e impuestos.",
      "Jobs programados: sync de transacciones, reglas recurrentes, alertas y reporte ejecutivo mensual.",
    ],
    modules: [
      {
        name: "Cotizaciones comerciales",
        description:
          "Arma propuestas por cliente con productos, plantillas, tabs y exportación PDF antes de facturar.",
      },
      {
        name: "Catálogos comerciales",
        description:
          "Clientes, productos, categorías y plantillas de cotización reutilizables en todo el flujo.",
      },
      {
        name: "Facturación CFDI",
        description:
          "Timbrado, cancelación, consulta de XML, envío por correo y flujos de re-facturación manual.",
      },
      {
        name: "Perfiles fiscales",
        description:
          "Multi-empresa con RFC, CSD, folios, login FacturoPorTi y respaldo de archivos en S3.",
      },
      {
        name: "Finanzas y movimientos",
        description:
          "Transacciones, conciliación, cuentas bancarias, créditos, deudas, presupuestos y servicios.",
      },
      {
        name: "Reportes ejecutivos",
        description:
          "Historial de cotizaciones y facturas, antigüedad de saldos, flujo de caja e impuestos pagados.",
      },
      {
        name: "Usuarios y utilerías",
        description:
          "Sesiones JWT, administración de usuarios, plantillas de correo y perfil de empresa.",
      },
    ],
    howItWorks: [
      "Login JWT con sesiones; el usuario elige perfil fiscal y opera bajo ese contexto comercial.",
      "React Router + Zustand organizan catálogos, procesos y reportes en un dashboard MUI lazy-loaded.",
      "Las cotizaciones generan PDF con pdfmake; los datos pasan a facturación cuando el cliente confirma.",
      "InvoiceMapper traduce a payload FacturoPorTi; el PAC timbra, guarda XML/PDF y Postmark envía el comprobante.",
      "TransactionSyncService crea movimientos desde facturas e impuestos; la conciliación enlaza pagos reales.",
      "registerRoutes monta controladores bajo /api; Prisma modela cotizaciones, CFDI, finanzas y usuarios.",
      "node-cron ejecuta reglas recurrentes, alertas financieras, recordatorios de deuda y reporte mensual.",
    ],
    architecture: `flowchart TB
  Quote[Cotizaciones] --> Hist[Historial CFDI]
  Inv[Facturación] --> Cob[Cobranza]
  Fin[Movimientos] --> Cash[Flujo de efectivo]
  Hist --> React[React 18]
  Cob --> Express[Express]
  React --> MUI[MUI 6]
  Express --> Prisma[Prisma]
  Express --> FPT[FacturoPorTi]
  Prisma --> S3[AWS S3]
  S3 --> Mail[Postmark]
  Mail --> Cron[node-cron]`,
    architectureLayers: [
      {
        name: "Procesos",
        items: ["Cotizaciones", "Facturación", "Movimientos", "Servicios", "Calendario financiero"],
      },
      {
        name: "Reportes",
        items: ["Historial CFDI", "Cobranza", "Flujo de efectivo", "Impuestos", "Rentabilidad"],
      },
      {
        name: "Frontend",
        lane: "left",
        items: ["React 18", "MUI 6", "Zustand", "React Router", "pdfmake", "PWA"],
      },
      {
        name: "Backend",
        lane: "right",
        items: ["Express", "Prisma", "FacturoPorTi", "AWS S3", "Postmark", "node-cron"],
      },
    ],
    related: [],
    links: [
      { label: "En vivo", href: "https://cotiz.jornalpro.com/" },
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
  Browser[Navegador] --> Ox[Oxygen]
  Ox --> Remix[Remix]
  Remix --> Hydrogen[Hydrogen]
  Remix --> SF[Storefront API]
  Remix --> CA[Customer Account API]
  Remix --> Admin[Admin API]
  Hydrogen --> SF
  Hydrogen --> Checkout[Checkout]
  Checkout --> Shopify[Shopify]
  SF --> Cloudinary[Cloudinary]
  CA --> Mail[Nodemailer]`,
    architectureLayers: [
      {
        name: "Cliente",
        items: ["Navegador"],
      },
      {
        name: "Runtime",
        items: ["Oxygen", "Remix", "Hydrogen"],
      },
      {
        name: "Shopify",
        items: ["Storefront API", "Admin API", "Customer Account API", "Checkout", "Shopify"],
      },
      {
        name: "Media y correo",
        items: ["Cloudinary", "Nodemailer"],
      },
    ],
    related: [],
    links: [
      { label: "En vivo", href: "https://itzcoleccionables.com/" },
    ],
  },
  ...practiceProjects,
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

const GITHUB_REPO = /github\.com\/([^/#?\s]+\/[^/#?\s]+)/i;

/** Repos enlazados en proyectos del portafolio. */
export function getPortfolioGithubRepos(): string[] {
  const repos = new Map<string, string>();

  for (const project of projects) {
    for (const link of project.links) {
      const match = link.href.match(GITHUB_REPO);
      if (!match) continue;
      const fullName = match[1]!.replace(/\.git$/, "").replace(/\/$/, "");
      repos.set(fullName.toLowerCase(), fullName);
    }
  }

  return [...repos.values()].sort((a, b) => a.localeCompare(b));
}
