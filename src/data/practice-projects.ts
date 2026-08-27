import type { Project } from "./projects";

export const practiceProjects: Project[] = [
  {
    slug: "weather-api",
    title: "WheatherApi",
    kicker: "Práctica · GitHub",
    tagline: "Consulta del clima por ciudad con HTML, CSS y JavaScript, integrada con una API pública.",
    summary:
      "SPA estática publicada en GitHub Pages. El usuario escribe una ciudad; fetch consulta la API meteorológica y renderiza temperatura, iconografía y fondo según condiciones. CSS organiza banner, tarjetas y estados de carga/error sin framework.",
    problem:
      "Practicar consumo de APIs REST desde el navegador, manejo de estados asíncronos y presentación responsive sin depender de React ni bundlers.",
    role: "Desarrollo front-end — HTML, CSS y JavaScript",
    year: "2024",
    featured: false,
    accent: "purple",
    fromCv: true,
    stack: ["HTML", "CSS", "JavaScript", "Fetch API"],
    highlights: [
      "Consulta por ciudad con feedback visual inmediato.",
      "Assets locales para banner y fondos temáticos.",
      "Desplegado en GitHub Pages.",
    ],
    modules: [
      { name: "Formulario de búsqueda", description: "Captura la ciudad y dispara la consulta a la API." },
      { name: "Render de clima", description: "Muestra temperatura, iconos y descripción del pronóstico." },
      { name: "Estilos responsive", description: "Layout con CSS en carpetas css/ e imágenes en img/." },
    ],
    howItWorks: [
      "index.html define la estructura y carga js/script.js.",
      "El script lee la ciudad, llama fetch a la API pública y parsea JSON.",
      "Se actualiza el DOM con datos de temperatura y condición.",
      "CSS aplica fondos e imágenes según la respuesta o errores de red.",
    ],
    architecture: `flowchart LR
  User[Usuario] --> UI[index.html]
  UI --> JS[script.js]
  JS --> API[API clima]
  API --> JS
  JS --> UI`,
    architectureLayers: [
      { name: "Cliente", items: ["HTML", "CSS", "JavaScript"] },
      { name: "Datos", items: ["Fetch API", "JSON"] },
      { name: "Deploy", items: ["GitHub Pages"] },
    ],
    related: ["api-cocktail", "image-api"],
    links: [
      { label: "En vivo", href: "https://betuko37.github.io/WheatherApi/" },
      { label: "GitHub", href: "https://github.com/betuko37/WheatherApi" },
    ],
  },
  {
    slug: "casa-domotica",
    title: "Casa domótica",
    kicker: "Práctica · Hardware",
    tagline: "Sistema de automatización residencial con panel táctil y control por voz, mediante Alexa, Arduino y C#.",
    summary:
      "Proyecto de formación que integra sensores/actuadores en Arduino, lógica en C# y control por voz con Alexa. Un panel táctil centraliza escenas domóticas: iluminación, persianas o relés según el circuito montado en prototipo.",
    problem:
      "Unificar hardware embebido, software de escritorio y asistentes de voz exige protocolos claros entre microcontrolador, PC y servicios cloud de Amazon.",
    role: "Desarrollo embebido y software de control",
    year: "2023 — 2024",
    featured: false,
    accent: "ink",
    fromCv: true,
    stack: ["C#", "Arduino", "Alexa", "IoT"],
    highlights: [
      "Arduino lee sensores y acciona relés o actuadores.",
      "Aplicación C# como puente entre hardware y servicios.",
      "Comandos de voz vía Alexa para escenas del hogar.",
    ],
    modules: [
      { name: "Firmware Arduino", description: "Lectura de sensores y control de salidas digitales/analogicas." },
      { name: "App C#", description: "Orquesta comunicación serial o red con el microcontrolador." },
      { name: "Integración Alexa", description: "Skills o rutinas que disparan acciones en el hogar." },
      { name: "Panel táctil", description: "Interfaz física para escenas manuales sin voz." },
    ],
    howItWorks: [
      "Arduino ejecuta el loop de sensores y publica estados.",
      "C# recibe eventos y traduce órdenes de Alexa o del panel.",
      "Las escenas agrupan acciones (luces, persianas, etc.).",
      "Feedback visual en el panel confirma el estado de cada zona.",
    ],
    architecture: `flowchart TB
  Alexa[Alexa Skill] --> CS[C# App]
  Panel[Panel tactil] --> CS
  CS --> Serial["Serial y red"]
  Serial --> Arduino[Arduino]
  Arduino --> Actuadores[Luces Relés Sensores]`,
    architectureLayers: [
      { name: "Entrada", items: ["Alexa", "Panel táctil"] },
      { name: "Control", items: ["C#", "Lógica de escenas"] },
      { name: "Hardware", items: ["Arduino", "Sensores", "Actuadores"] },
    ],
    related: ["flutter-kotlin"],
    links: [],
  },
  {
    slug: "juego-2d",
    title: "Juego 2D de plataformas",
    kicker: "Práctica · Unity",
    tagline: "Videojuego de plataformas en 2D con dos niveles, enemigos y objetivos, desarrollado en Unity3D.",
    summary:
      "Juego de plataformas 2D en Unity con dos escenas jugables, enemigos con patrones básicos, coleccionables y condición de victoria. Scripts en C# gestionan movimiento, colisiones, UI y transición entre niveles.",
    problem:
      "Aprender game loop, física 2D, animaciones y diseño de niveles dentro del ecosistema Unity sin depender de assets comerciales complejos.",
    role: "Desarrollo de gameplay en Unity y C#",
    year: "2024",
    featured: false,
    accent: "night",
    fromCv: true,
    stack: ["Unity3D", "C#", "2D Physics"],
    highlights: [
      "Dos niveles con plataformas, enemigos y meta.",
      "Controles de salto y movimiento con Rigidbody2D.",
      "UI mínima de vidas, puntaje o fin de nivel.",
    ],
    modules: [
      { name: "Jugador", description: "Movimiento, salto y detección de suelo con colliders 2D." },
      { name: "Enemigos", description: "Patrullaje o persecución simple con daño al contacto." },
      { name: "Niveles", description: "Tilemaps o sprites organizados en dos escenas." },
      { name: "Game manager", description: "Estado de partida, reinicio y cambio de escena." },
    ],
    howItWorks: [
      "Input del jugador actualiza velocidad y animación cada frame.",
      "Colisiones disparan daño, recolección o cambio de escena.",
      "Enemigos ejecutan IA básica en Update/FixedUpdate.",
      "Al cumplir objetivo se carga el siguiente nivel o pantalla final.",
    ],
    architecture: `flowchart TB
  Input[Input jugador] --> Player[PlayerController]
  Player --> Physics[Physics2D]
  Physics --> Enemies[Enemy AI]
  Enemies --> GM[Game Manager]
  GM --> UI["HUD y escenas"]`,
    architectureLayers: [
      { name: "Gameplay", items: ["Movimiento", "Enemigos", "Objetivos"] },
      { name: "Motor", items: ["Unity 2D", "Rigidbody2D", "Colliders"] },
      { name: "Contenido", items: ["Nivel 1", "Nivel 2", "UI"] },
    ],
    related: ["flutter-kotlin"],
    links: [],
  },
  {
    slug: "rest-api-node",
    title: "REST API Node",
    kicker: "Práctica · GitHub",
    tagline: "API REST de películas con Express, validación Zod, CORS y persistencia en MySQL o MongoDB.",
    summary:
      "API educativa de catálogo de películas. Express expone /movies con inyección de modelo: implementaciones intercambiables para JSON local, MySQL o MongoDB. Middleware CORS, bloqueo de métodos y esquemas Zod validan entrada.",
    problem:
      "Mostrar cómo desacoplar rutas del almacenamiento: el mismo router funciona con distintos adaptadores de datos, patrón útil antes de escalar a Prisma o microservicios.",
    role: "Desarrollo backend — Node.js y Express",
    year: "2025",
    featured: false,
    accent: "sand",
    fromCv: true,
    stack: ["Node.js", "Express", "Zod", "MySQL", "MongoDB"],
    highlights: [
      "createApp({ movieModel }) inyecta persistencia.",
      "Tres backends: JSON local, MySQL y MongoDB.",
      "Middleware CORS y restricción de métodos HTTP.",
      "Esquemas Zod en schemas/movieScheme.js.",
    ],
    modules: [
      { name: "Router /movies", description: "CRUD delegado al movieModel inyectado." },
      { name: "Adaptadores", description: "models/local, mysql y mongoDB con la misma interfaz." },
      { name: "Validación", description: "Zod valida payloads antes de persistir." },
      { name: "Middlewares", description: "CORS configurable y filtro de métodos." },
    ],
    howItWorks: [
      "server-mysql.js (o mongo/local) instancia el modelo concreto.",
      "createApp monta express.json(), CORS y createMovieRouter.",
      "El controlador delega en movieModel sin conocer la base.",
      "Zod rechaza body inválidos con respuesta 4xx.",
    ],
    architecture: `flowchart TB
  Client[Cliente HTTP] --> Express[Express app.js]
  Express --> CORS[CORS + methods]
  CORS --> Router["movies router"]
  Router --> Zod[Zod schemas]
  Router --> Model[movieModel]
  Model --> Local[(JSON local)]
  Model --> MySQL[(MySQL)]
  Model --> Mongo[(MongoDB)]`,
    architectureLayers: [
      { name: "API", items: ["Express", "movies_routes", "controllers"] },
      { name: "Dominio", items: ["Movie model", "Zod validation"] },
      { name: "Persistencia", lane: "right", items: ["Local JSON", "MySQL", "MongoDB"] },
    ],
    related: ["chat-socket"],
    links: [{ label: "GitHub", href: "https://github.com/betuko37/Rest-Api-Node" }],
  },
  {
    slug: "flutter-kotlin",
    title: "Apps Flutter y Kotlin",
    kicker: "Práctica · Móvil",
    tagline: "Aplicaciones móviles de listas de tareas, CRUD y consumo de APIs. En Kotlin incluye servicios en segundo plano.",
    summary:
      "Colección de prácticas móviles nativas y cross-platform: apps Flutter de listas y CRUD, más proyectos Kotlin con servicios en background y consumo de APIs REST. Refuerzan ciclo de vida Android, estado local y permisos.",
    problem:
      "Dominar dos stacks móviles (Flutter/Dart y Kotlin/Android) para UI reactiva, persistencia simple y tareas en segundo plano sin framework web.",
    role: "Desarrollo móvil — Flutter y Kotlin",
    year: "2023 — 2024",
    featured: false,
    accent: "purple",
    fromCv: true,
    stack: ["Flutter", "Kotlin", "Android", "Dart"],
    highlights: [
      "Listas de tareas y CRUD en Flutter.",
      "Consumo de APIs con http/dio o Retrofit en Kotlin.",
      "Servicios en segundo plano en Android nativo.",
    ],
    modules: [
      { name: "Flutter UI", description: "Widgets, estado setState/Provider y navegación básica." },
      { name: "CRUD local", description: "Formularios y listados con persistencia en memoria o shared prefs." },
      { name: "APIs REST", description: "Fetch de datos remotos y manejo de loading/error." },
      { name: "Kotlin services", description: "Workers o services para tareas periódicas en Android." },
    ],
    howItWorks: [
      "Flutter pinta listas desde estado en memoria o API.",
      "Kotlin Activity/Fragment gestiona ciclo de vida Android.",
      "Servicios en background continúan trabajo con red intermitente.",
      "Permisos y notificaciones según versión de Android.",
    ],
    architecture: `flowchart TB
  subgraph flutter [Flutter]
    UI[Widgets] --> State[Estado]
    State --> API1[HTTP API]
  end
  subgraph kotlin [Kotlin Android]
    Act[Activity] --> Svc[Background Service]
    Svc --> API2[REST Client]
  end`,
    architectureLayers: [
      { name: "Flutter", items: ["Dart", "Widgets", "HTTP"] },
      { name: "Android", items: ["Kotlin", "Services", "Retrofit/OkHttp"] },
    ],
    related: ["task-app", "jornalpro-mobile"],
    links: [],
  },
  {
    slug: "gifxplore",
    title: "Gifxplore",
    kicker: "GitHub",
    tagline: "Explorador de GIFs desarrollado en React y Vite, con enrutamiento y publicación en Netlify.",
    summary:
      "Cliente React 18 + Vite que consume la API de Giphy: categorías, trending, búsqueda, detalle por ID y favoritos locales. React Router 7 organiza landing, categoría y favoritos; helpers encapsulan fetch y hooks reutilizables.",
    problem:
      "Practicar arquitectura por features (components, helpers, hooks) y enrutamiento SPA desplegado en Netlify con variables de API key.",
    role: "Desarrollo front-end — React y Vite",
    year: "2025",
    featured: false,
    accent: "ink",
    stack: ["React", "Vite", "React Router", "Giphy API"],
    highlights: [
      "Grid de categorías, trending y búsqueda por término.",
      "Hook useFetchGifs centraliza loading y errores.",
      "Favoritos persistidos en cliente.",
      "Deploy en Netlify (gifxplore.netlify.app).",
    ],
    modules: [
      { name: "Home y trending", description: "Landing con GIFs populares vía getGiftTendecy." },
      { name: "Categorías", description: "CategoriesGrid y CategoryCard navegan por slug." },
      { name: "Búsqueda", description: "SectionSearch filtra resultados en tiempo real." },
      { name: "Favoritos", description: "Ruta /favorites con estado local del usuario." },
    ],
    howItWorks: [
      "React Router define Home, Category y Favorites.",
      "helpers/getGifs.js llama la API con apiKey de config.",
      "useFetchGifs expone data, loading y error a la UI.",
      "Vite build genera estáticos para Netlify.",
    ],
    architecture: `flowchart TB
  Browser --> Vite[React SPA]
  Vite --> Router[React Router 7]
  Router --> Hooks[useFetchGifs]
  Hooks --> Helpers[getGifs helpers]
  Helpers --> Giphy[Giphy API]`,
    architectureLayers: [
      { name: "UI", items: ["Navbar", "GridGifts", "Search", "Favorites"] },
      { name: "Datos", items: ["helpers", "hooks", "apiKey"] },
      { name: "Deploy", items: ["Vite build", "Netlify"] },
    ],
    related: ["heroes-app", "image-api"],
    links: [
      { label: "En vivo", href: "https://gifxplore.netlify.app" },
      { label: "GitHub", href: "https://github.com/betuko37/Api-Gifts-React" },
    ],
  },
  {
    slug: "lista-precios",
    title: "Lista de precios",
    kicker: "GitHub",
    tagline: "Lista de precios comercial con Firebase, generación de PDF y Tailwind CSS. Publicada en Netlify.",
    summary:
      "App React 19 + Vite para negocios que publican listas de precios: catálogo en Firebase Firestore, panel admin, vista cliente, export PDF con pdfmake y enlace WhatsApp. Tailwind 4 y scripts pre-deploy validan build antes de Netlify.",
    problem:
      "Comercios pequeños necesitan actualizar precios rápido, compartir PDF/WhatsApp y separar vista pública de edición admin sin montar un ERP.",
    role: "Desarrollo full-stack ligero — React y Firebase",
    year: "2025",
    featured: false,
    accent: "night",
    stack: ["React", "Firebase", "Tailwind", "pdfmake", "Vite"],
    highlights: [
      "Firestore como backend serverless para productos y categorías.",
      "Generación PDF con pdfGenerator y logo embebido.",
      "Integración WhatsApp para compartir listas.",
      "Deploy Netlify con netlify.toml y pre-deploy.js.",
    ],
    modules: [
      { name: "Catálogo", description: "Productos, categorías y precios en Firestore." },
      { name: "Panel admin", description: "components/admin para altas, edición y estados." },
      { name: "Vista cliente", description: "Lista pública filtrable por categoría." },
      { name: "PDF y WhatsApp", description: "Export pdfmake y deep links de WhatsApp." },
    ],
    howItWorks: [
      "firebaseConfig inicializa SDK; firebaseService CRUD en Firestore.",
      "Admin autentica y escribe precios; cliente solo lee.",
      "pdfGenerator arma documento con pdfmake y descarga.",
      "pre-deploy.js valida build antes de publicar en Netlify.",
    ],
    architecture: `flowchart TB
  React[React Vite] --> Admin[Admin UI]
  React --> Client[Vista cliente]
  Admin --> FB[Firebase Firestore]
  Client --> FB
  React --> PDF[pdfmake]
  React --> WA[WhatsApp share]`,
    architectureLayers: [
      { name: "Frontend", items: ["React 19", "Tailwind 4", "Vite"] },
      { name: "Backend", items: ["Firebase", "storageService"] },
      { name: "Salida", items: ["PDF", "WhatsApp", "Netlify"] },
    ],
    related: ["nexgard"],
    links: [
      { label: "En vivo", href: "https://multicarnes-lista.netlify.app/" },
      { label: "GitHub", href: "https://github.com/betuko37/lista-precios" },
    ],
  },
  {
    slug: "heroes-app",
    title: "Comicpedia",
    kicker: "GitHub",
    tagline: "Catálogo de héroes con React Router, Tailwind CSS y búsqueda.",
    summary:
      "SPA React 19 (HeroesApp) estilo catálogo DC/Marvel: auth context, listado paginado, búsqueda con query-string y ficha de héroe. Tailwind 4 + animate.css; assets locales en public/assets para no depender de CDN en demo.",
    problem:
      "Practicar React Router 7, contexto de autenticación simulado y rutas anidadas con parámetros (:id) en un catálogo visual rico.",
    role: "Desarrollo front-end — React y Tailwind",
    year: "2025",
    featured: false,
    accent: "sand",
    stack: ["React", "Vite", "Tailwind", "React Router"],
    highlights: [
      "Módulos auth/ y heroes/ separados por dominio.",
      "Búsqueda con query-string y filtros.",
      "Assets DC/Marvel en public/assets.",
      "Publicado en comicpedia.netlify.app.",
    ],
    modules: [
      { name: "Autenticación", description: "auth/context simula login y protege rutas." },
      { name: "Listado", description: "Grid de héroes con imágenes locales." },
      { name: "Detalle", description: "Ruta /hero/:id con ficha ampliada." },
      { name: "Búsqueda", description: "Filtros por nombre, publisher o equipo." },
    ],
    howItWorks: [
      "AppRouter declara rutas públicas y privadas.",
      "AuthProvider guarda sesión en contexto React.",
      "query-string sincroniza filtros con la URL.",
      "Vite + Tailwind compilan assets estáticos para Netlify.",
    ],
    architecture: `flowchart TB
  Browser --> Router[React Router 7]
  Router --> Auth[Auth Context]
  Router --> Heroes[Heroes module]
  Heroes --> Assets["public assets"]
  Auth --> Router`,
    architectureLayers: [
      { name: "UI", items: ["Tailwind 4", "animate.css", "react-icons"] },
      { name: "Estado", items: ["Auth context", "query-string"] },
      { name: "Deploy", items: ["Vite", "Netlify"] },
    ],
    related: ["gifxplore", "journal-app"],
    links: [
      { label: "En vivo", href: "https://comicpedia.netlify.app/" },
      { label: "GitHub", href: "https://github.com/betuko37/HeroesApp" },
    ],
  },
  {
    slug: "api-cocktail",
    title: "apiCoktel",
    kicker: "GitHub",
    tagline: "Buscador de cócteles integrado con una API pública.",
    summary:
      "Sitio multipágina en HTML/CSS/JS que explora la API de cócteles: menús por categoría (clásicos, shots, sin alcohol), carrusel, ruleta aleatoria y páginas de receta. Cada sección en pages/ con JS dedicado en JS/.",
    problem:
      "Aprender organización multipágina sin SPA, consumiendo endpoints REST y enriqueciendo UX con carruseles y selección aleatoria.",
    role: "Desarrollo front-end — JavaScript vanilla",
    year: "2024",
    featured: false,
    accent: "purple",
    stack: ["HTML", "CSS", "JavaScript", "Cocktail API"],
    highlights: [
      "Secciones: clásicos, shots, sin alcohol, cafés y más.",
      "Ruleta y carrusel para descubrir bebidas.",
      "Estilos modulares en Styles/.",
    ],
    modules: [
      { name: "Menú principal", description: "index.html enlaza categorías y estilos globales." },
      { name: "Categorías", description: "Scripts conAlcohol, sinAlcohol, shots, etc." },
      { name: "Ruleta", description: "ruleta.js elige cóctel aleatorio con animación." },
      { name: "Recetas", description: "Páginas de detalle con ingredientes e instrucciones." },
    ],
    howItWorks: [
      "Cada categoría carga su JS y CSS propios.",
      "fetch obtiene listados e idDrink para detalle.",
      "El DOM renderiza tarjetas e imágenes de la API.",
      "GitHub Pages sirve el sitio estático.",
    ],
    architecture: `flowchart LR
  Pages["pages HTML"] --> JS["JS modulos"]
  JS --> API[Cocktail API]
  JS --> DOM["DOM render"]
  Styles["Styles CSS"] --> Pages`,
    architectureLayers: [
      { name: "Vistas", items: ["index", "pages/", "carrusel"] },
      { name: "Lógica", items: ["fetch", "ruleta", "filtros"] },
      { name: "Deploy", items: ["GitHub Pages"] },
    ],
    related: ["weather-api", "image-api"],
    links: [
      { label: "En vivo", href: "https://betuko37.github.io/apiCoktel/" },
      { label: "GitHub", href: "https://github.com/betuko37/apiCoktel" },
    ],
  },
  {
    slug: "image-api",
    title: "ImageApi",
    kicker: "GitHub",
    tagline: "Búsqueda de imágenes con listado de favoritos, integrada con una API de fotografías.",
    summary:
      "Página única que consulta una API de imágenes, muestra resultados en grid y permite marcar favoritos persistidos en localStorage. js/Obtener.js concentra fetch y manipulación del DOM; CSS minimalista en styles/.",
    problem:
      "Practicar paginación o búsqueda por término, favoritos offline y render dinámico sin frameworks.",
    role: "Desarrollo front-end — JavaScript",
    year: "2024",
    featured: false,
    accent: "ink",
    stack: ["HTML", "CSS", "JavaScript", "localStorage"],
    highlights: [
      "Búsqueda por keyword contra API de fotos.",
      "Favoritos guardados en localStorage.",
      "UI ligera con un solo módulo JS.",
    ],
    modules: [
      { name: "Buscador", description: "Input dispara fetch y pinta grid de thumbnails." },
      { name: "Favoritos", description: "Toggle guarda IDs en localStorage." },
      { name: "Listado", description: "Vista de favoritos recuperados al recargar." },
    ],
    howItWorks: [
      "Obtener.js escucha submit del formulario.",
      "fetch devuelve hits; se crean nodos img dinámicamente.",
      "Favoritos leen/escriben JSON en localStorage.",
      "GitHub Pages publica index.html estático.",
    ],
    architecture: `flowchart LR
  UI[index.html] --> JS[Obtener.js]
  JS --> API[Photos API]
  JS --> LS[(localStorage)]`,
    architectureLayers: [
      { name: "Cliente", items: ["HTML", "CSS", "Obtener.js"] },
      { name: "Persistencia local", items: ["localStorage", "Favoritos"] },
    ],
    related: ["gifxplore", "api-cocktail"],
    links: [
      { label: "En vivo", href: "https://betuko37.github.io/ImageApi/" },
      { label: "GitHub", href: "https://github.com/betuko37/ImageApi" },
    ],
  },
  {
    slug: "veterinary-php",
    title: "VeterinaryPHP",
    kicker: "GitHub",
    tagline: "Sistema de gestión veterinaria en PHP, desarrollado en el mismo ciclo que el formulario de mascotas.",
    summary:
      "Panel PHP + MySQL para clínica veterinaria: clientes, productos, pedidos y compras. Php/*.php expone endpoints CRUD; Js/*.js consume fetch y actualiza tablas. database.php centraliza conexión PDO.",
    problem:
      "Practicar backend PHP procedural orientado a endpoints JSON consumidos por un front vanilla, con relaciones clientes–pedidos–productos.",
    role: "Desarrollo web — PHP y JavaScript",
    year: "2024",
    featured: false,
    accent: "night",
    stack: ["PHP", "MySQL", "JavaScript", "PDO"],
    highlights: [
      "CRUD de clientes, pedidos, productos y compras.",
      "Endpoints PHP en carpeta Php/ consumidos por fetch.",
      "Búsqueda y listados en app.js y módulos JS.",
    ],
    modules: [
      { name: "Clientes", description: "add_client, get_clients, update y delete vía PHP." },
      { name: "Pedidos", description: "get_orders, edit_order y flujo de estado." },
      { name: "Inventario", description: "Productos y compras a proveedores." },
      { name: "Front JS", description: "Tablas dinámicas y formularios en Js/." },
    ],
    howItWorks: [
      "database.php abre PDO a MySQL.",
      "Cada acción POST/GET en Php/*.php ejecuta SQL parametrizado.",
      "JS llama endpoints y refresca DOM sin recargar.",
      "Form-Pets-Php complementa el alta de mascotas.",
    ],
    architecture: `flowchart TB
  JS[Js app.js] --> PHP[Php endpoints]
  PHP --> PDO[database.php]
  PDO --> MySQL[(MySQL)]
  PHP --> JSON[JSON response]
  JSON --> JS`,
    architectureLayers: [
      { name: "Frontend", items: ["JavaScript", "Tablas", "Formularios"] },
      { name: "Backend", items: ["PHP", "PDO", "CRUD scripts"] },
      { name: "Datos", items: ["MySQL", "Clientes", "Pedidos"] },
    ],
    related: ["form-pets"],
    links: [{ label: "GitHub", href: "https://github.com/betuko37/VeterinaryPHP" }],
  },
  {
    slug: "form-pets",
    title: "Form Pets PHP",
    kicker: "GitHub",
    tagline: "Formulario de registro de mascotas en PHP, complementario a VeterinaryPHP.",
    summary:
      "Mini CRUD de mascotas: formulario HTML, ajax.js envía JSON a php/guardar.php, php/get.php lista registros y editar/eliminar completan el ciclo. Estilos en styles/stylei.css; comparte enfoque PDO con VeterinaryPHP.",
    problem:
      "Aislar el flujo de alta/edición de mascotas como módulo pequeño antes de integrarlo a un panel veterinario más grande.",
    role: "Desarrollo web — PHP y AJAX",
    year: "2024",
    featured: false,
    accent: "sand",
    stack: ["PHP", "JavaScript", "MySQL", "AJAX"],
    highlights: [
      "ajax.js comunica formulario sin recargar página.",
      "Endpoints guardar, get, editar y eliminar.",
      "Complemento directo de VeterinaryPHP.",
    ],
    modules: [
      { name: "Formulario", description: "index.html captura datos de la mascota." },
      { name: "API PHP", description: "guardar.php, get.php, editar.php, eliminar.php." },
      { name: "Listado AJAX", description: "ajax.js pinta tabla editable en cliente." },
    ],
    howItWorks: [
      "El usuario envía el formulario; ajax.js hace POST a guardar.php.",
      "PHP valida e inserta en MySQL vía database.php.",
      "get.php devuelve JSON para refrescar la tabla.",
      "Editar/eliminar reutilizan el mismo patrón fetch.",
    ],
    architecture: `flowchart LR
  Form[index.html] --> Ajax[ajax.js]
  Ajax --> PHP["php endpoints"]
  PHP --> DB[(MySQL)]`,
    architectureLayers: [
      { name: "UI", items: ["HTML form", "stylei.css"] },
      { name: "API", items: ["guardar", "get", "editar", "eliminar"] },
    ],
    related: ["veterinary-php"],
    links: [{ label: "GitHub", href: "https://github.com/betuko37/Form-Pets-Php" }],
  },
  {
    slug: "chat-socket",
    title: "Chat en tiempo real",
    kicker: "GitHub",
    tagline: "Aplicación de chat en tiempo real con Express, Socket.IO y cliente en React.",
    summary:
      "Monorepo con server Express + Socket.IO en puerto 4000 y frontend Vite/React con PWA opcional. Los sockets emiten message y broadcast a otros clientes; sendNotification fan-out a todos los conectados.",
    problem:
      "Entender WebSockets bidireccionales, rooms implícitos por socket.id y separación cliente/servidor en desarrollo con nodemon.",
    role: "Desarrollo full-stack — Socket.IO y React",
    year: "2025",
    featured: false,
    accent: "purple",
    stack: ["React", "Express", "Socket.IO", "Vite", "PWA"],
    highlights: [
      "Servidor HTTP + Socket.IO en server/index.js.",
      "Broadcast de mensajes con from derivado de socket.id.",
      "Frontend Vite en carpeta frontend/ con plugin PWA.",
    ],
    modules: [
      { name: "Servidor realtime", description: "Express HTTP, lista de clients y eventos socket." },
      { name: "Mensajería", description: "message broadcast y sendNotification global." },
      { name: "Cliente React", description: "UI de chat conectada vía socket.io-client." },
    ],
    howItWorks: [
      "server/index.js crea http.Server e io Socket.IO.",
      "connection agrega socket a clients[].",
      "message hace broadcast.emit a otros usuarios.",
      "npm run dev levanta nodemon ignorando rebuilds del frontend.",
    ],
    architecture: `flowchart TB
  React[React frontend] --> IO[Socket.IO client]
  IO --> Server["Express Socket.IO"]
  Server --> Clients[Broadcast a clients]`,
    architectureLayers: [
      { name: "Cliente", lane: "left", items: ["React", "Vite", "socket.io-client"] },
      { name: "Servidor", lane: "right", items: ["Express", "Socket.IO", "nodemon"] },
    ],
    related: ["rest-api-node", "js-quiz"],
    links: [{ label: "GitHub", href: "https://github.com/betuko37/Chat-App-socket-React" }],
  },
  {
    slug: "js-quiz",
    title: "JavaScript Quiz",
    kicker: "GitHub",
    tagline: "Cuestionario de JavaScript desarrollado con React, TypeScript, Material UI y Zustand.",
    summary:
      "Quiz interactivo en React 19 + TypeScript: preguntas en public/data.json, store Zustand (questions.ts) maneja índice y puntaje, MUI estiliza Start/Game y react-syntax-highlighter muestra snippets de código en cada pregunta.",
    problem:
      "Combinar TypeScript estricto, estado global ligero y UI MUI en un juego educativo de una sola sesión.",
    role: "Desarrollo front-end — React y TypeScript",
    year: "2025",
    featured: false,
    accent: "ink",
    stack: ["React", "TypeScript", "MUI", "Zustand", "Vite"],
    highlights: [
      "Flujo Start → Game con transiciones MUI.",
      "Preguntas cargadas desde data.json estático.",
      "Syntax highlight para fragmentos de JS en enunciados.",
    ],
    modules: [
      { name: "Start", description: "Pantalla inicial y reglas del quiz." },
      { name: "Game", description: "Iteración de preguntas, respuestas y puntaje." },
      { name: "Store", description: "Zustand centraliza questions, índice y resultados." },
    ],
    howItWorks: [
      "App.tsx alterna Start y Game según estado.",
      "questions.ts fetch o importa data.json al iniciar.",
      "Cada respuesta actualiza score en Zustand.",
      "Al terminar muestra resultado final.",
    ],
    architecture: `flowchart TB
  UI[React MUI] --> Store[Zustand store]
  Store --> Data[data.json]
  UI --> Highlight[react-syntax-highlighter]`,
    architectureLayers: [
      { name: "UI", items: ["MUI 6", "Start", "Game"] },
      { name: "Estado", items: ["Zustand", "TypeScript types"] },
    ],
    related: ["journal-app", "heroes-app"],
    links: [{ label: "GitHub", href: "https://github.com/betuko37/Javascript-Quizz" }],
  },
  {
    slug: "journal-app",
    title: "Journal App",
    kicker: "GitHub",
    tagline: "Aplicación de diario personal en React y Material UI, con enrutamiento.",
    summary:
      "Diario personal con auth simulado, rutas protegidas y vistas MUI. Estructura por capas: auth/, app/views, theme/AppTheme.jsx y AppRouter.jsx con React Router 7. Tema Roboto y layout dashboard para entradas por día.",
    problem:
      "Practicar separación auth vs app, theming MUI centralizado y rutas anidadas antes de escalar a backend real.",
    role: "Desarrollo front-end — React y MUI",
    year: "2025",
    featured: false,
    accent: "night",
    stack: ["React", "MUI", "React Router", "Vite"],
    highlights: [
      "Auth layout separado del dashboard del diario.",
      "AppTheme.jsx centraliza palette y typography.",
      "Rutas protegidas en router/AppRouter.jsx.",
    ],
    modules: [
      { name: "Autenticación", description: "auth/pages login/registro simulado." },
      { name: "Entradas", description: "app/views para crear y listar notas." },
      { name: "Tema MUI", description: "theme/theme.js + AppTheme provider." },
      { name: "Router", description: "Rutas públicas vs privadas con React Router 7." },
    ],
    howItWorks: [
      "main.jsx monta AppTheme y AppRouter.",
      "Auth guard redirige a login si no hay sesión.",
      "Vistas del diario leen/escriben estado local o mock.",
      "MUI layout responsive para móvil y desktop.",
    ],
    architecture: `flowchart TB
  Router[AppRouter] --> Auth["auth module"]
  Router --> App["app views"]
  AppTheme[MUI Theme] --> Auth
  AppTheme --> App`,
    architectureLayers: [
      { name: "Navegación", items: ["React Router 7", "Auth guard"] },
      { name: "UI", items: ["MUI 6", "Roboto", "Layouts"] },
    ],
    related: ["js-quiz", "heroes-app"],
    links: [{ label: "GitHub", href: "https://github.com/betuko37/Journal-App" }],
  },
  {
    slug: "task-app",
    title: "TaskApp",
    kicker: "GitHub",
    tagline: "Aplicación de lista de tareas en JavaScript, correspondiente a las prácticas del currículum.",
    summary:
      "To-do list con Bootstrap 4: index.html, script.js manipula DOM para agregar, completar y eliminar tareas. Sin build step; refuerza eventos, arrays en memoria y persistencia opcional en localStorage.",
    problem:
      "Fundamentos de DOM scripting y UX mínima antes de frameworks SPA.",
    role: "Desarrollo front-end — JavaScript",
    year: "2024",
    featured: false,
    accent: "sand",
    fromCv: true,
    stack: ["JavaScript", "Bootstrap", "HTML"],
    highlights: [
      "CRUD de tareas en memoria con Bootstrap UI.",
      "script.js sin dependencias de framework.",
      "Proyecto base del currículum formativo.",
    ],
    modules: [
      { name: "Lista de tareas", description: "Render dinámico de items pendientes y completados." },
      { name: "Acciones", description: "Alta, toggle completado y borrado." },
      { name: "UI Bootstrap", description: "Grid y componentes CSS predefinidos." },
    ],
    howItWorks: [
      "El usuario escribe tarea y submit agrega al array.",
      "script.js re-renderiza la lista completa.",
      "Click en checkbox marca completada.",
      "Botón eliminar filtra el array y actualiza DOM.",
    ],
    architecture: `flowchart LR
  HTML[index.html] --> JS[script.js]
  JS --> DOM[Lista DOM]
  JS --> Mem[(Array tareas)]`,
    architectureLayers: [
      { name: "Cliente", items: ["HTML", "Bootstrap", "script.js"] },
    ],
    related: ["flutter-kotlin"],
    links: [{ label: "GitHub", href: "https://github.com/betuko37/TaskApp" }],
  },
  {
    slug: "nexgard",
    title: "Nexgard",
    kicker: "GitHub",
    tagline: "Página de aterrizaje desarrollada con HTML y CSS.",
    summary:
      "Landing page estática para producto/mascotas: index.html, pages/ secundarias, cart.js y productServices.js simulan carrito en localStorage. Imágenes en img/fondos; CSS puro sin preprocessors.",
    problem:
      "Practicar maquetación responsive, landing comercial y estado de carrito en vanilla JS.",
    role: "Desarrollo front-end — HTML, CSS y JavaScript",
    year: "2024",
    featured: false,
    accent: "purple",
    stack: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "Landing multipágina con assets optimizados.",
      "Carrito simulado con cartService.js.",
      "Catálogo estático de productos en productServices.js.",
    ],
    modules: [
      { name: "Landing", description: "Hero, beneficios y CTA en index.html." },
      { name: "Catálogo", description: "productServices expone lista de productos mock." },
      { name: "Carrito", description: "cart.js persiste selección en cliente." },
    ],
    howItWorks: [
      "Usuario navega pages/ desde menú principal.",
      "productServices devuelve datos estáticos de producto.",
      "cart.js agrega/quita ítems y actualiza contador.",
      "GitHub Pages o hosting estático sirve assets.",
    ],
    architecture: `flowchart LR
  Pages[HTML pages] --> JS[cart.js + productServices]
  JS --> LS[(localStorage carrito)]`,
    architectureLayers: [
      { name: "Presentación", items: ["HTML", "CSS", "img/fondos"] },
      { name: "Interacción", items: ["cart.js", "productServices"] },
    ],
    related: ["lista-precios"],
    links: [{ label: "GitHub", href: "https://github.com/betuko37/Nexgard" }],
  },
];
