# Portafolio — Jesús Zavala

Portafolio profesional de **Jesús Zavala** (`betuko37`): desarrollador full-stack con foco en productos complejos en producción — ERP, aplicaciones móviles, comercio electrónico e integraciones de hardware.

Sitio estático con islas React, animaciones GSAP/Motion, estudios de caso detallados y formulario de contacto vía API serverless.

## Características

- **Home** con hero animado, sección sobre mí, showcase de proyectos y contacto
- **Estudios de caso** con arquitectura interactiva (diagramas Mermaid, capas SVG, visor fullscreen)
- **Showcase** agrupado: productos en vivo, GitHub y prácticas del CV
- **Tema claro/oscuro** con persistencia en `localStorage`
- **Animaciones**: FoldText (GSAP), TrueFocus, GradientWaves, ClickSpark
- **Escena 3D** en la sección About (Three.js)
- **Formulario de contacto** con API `/api/contact` y [Resend](https://resend.com)
- **Responsive** — diseño mobile-first con Tailwind CSS

## Stack

| Área | Tecnologías |
|------|-------------|
| Framework | [Astro 7](https://astro.build), [React 19](https://react.dev) (islands) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com), tokens CSS custom |
| Animación | GSAP, Motion, OGL, Three.js |
| Iconos | Lucide, Simple Icons |
| Datos | TypeScript estático (`src/data/`) |
| Deploy | [Vercel](https://vercel.com) (`@astrojs/vercel`, SSR para la API) |
| Correo | Resend API |

## Requisitos

- **Node.js** ≥ 22.12
- **pnpm** (recomendado)

## Instalación

```bash
git clone https://github.com/betuko37/portfolio-astro.git
cd portfolio-astro
pnpm install
```

## Desarrollo

```bash
# Servidor de desarrollo
pnpm dev

# Servidor en segundo plano (recomendado en este proyecto)
pnpm astro dev --background
pnpm astro dev status
pnpm astro dev logs
pnpm astro dev stop
```

Abre [http://localhost:4321](http://localhost:4321).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción en `./dist/` |
| `pnpm preview` | Vista previa del build local |
| `pnpm astro ...` | CLI de Astro (`check`, `add`, etc.) |

## Variables de entorno

Copia `.env.example` a `.env` y configura:

```env
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_TO_EMAIL=tu@correo.com
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>
```

| Variable | Descripción |
|----------|-------------|
| `RESEND_API_KEY` | API key de Resend |
| `CONTACT_TO_EMAIL` | Correo destino del formulario |
| `CONTACT_FROM_EMAIL` | Remitente (requiere dominio verificado en producción) |

Sin `RESEND_API_KEY`, el formulario responde 503 y ofrece fallback a `mailto:`.

En **Vercel**, añade las mismas variables en *Project → Settings → Environment Variables*.

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/       Header, Footer, BackLink
│   ├── ui/           AppIcon, Carousel, StackPills, ThemeToggle…
│   ├── sections/     Hero, About, Contact, ProjectGrid
│   ├── showcase/     ShowcaseRail, ShowcaseCard, ShowcaseBreak
│   ├── projects/     CaseStudyDeck, LabCase, ArchViewer…
│   └── effects/      Islas React (FoldText, TrueFocus, Waves…)
├── data/             profile, projects, labs, showcase, icons, media
├── lib/              motion, theme, heroScene
├── layouts/          Layout.astro
├── pages/            Rutas y API
│   ├── index.astro
│   ├── sobre.astro
│   ├── proyectos/
│   └── api/contact.ts
└── styles/           global.css
```

### Aliases de importación

```ts
import Layout from '@layouts/Layout.astro';
import Hero from '@components/sections/Hero.astro';
import { profile } from '@data/profile';
import { initMotion } from '@lib/motion';
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/sobre` | Sobre mí |
| `/proyectos` | Listado de proyectos |
| `/proyectos/:slug` | Estudio de caso o práctica |
| `/api/contact` | POST — envío de correo (serverless) |

## Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com).
2. Framework preset: **Astro** (detectado automáticamente).
3. Configura las variables de entorno de Resend.
4. Deploy.

El adapter `@astrojs/vercel` genera funciones serverless para la ruta API y prerenderiza el resto de páginas.

## Contenido

Los proyectos y datos personales viven en `src/data/`:

- `profile.ts` — información personal y contacto
- `projects.ts` — estudios de caso principales
- `labs.ts` — prácticas y repos menores
- `showcase.ts` — capa de presentación para listados

Edita esos archivos para actualizar el contenido del sitio.

## Contacto

- **GitHub:** [@betuko37](https://github.com/betuko37)
- **LinkedIn:** [betuko35](https://www.linkedin.com/in/betuko35/)
- **Correo:** betorolitos37@gmail.com

---

Desarrollado por Jesús Zavala · Hermosillo, Sonora, México
