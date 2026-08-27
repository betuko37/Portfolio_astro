export type GalleryImage = {
  src: string;
  alt: string;
};

export type GalleryVariant = "phone" | "desktop";

export type ProjectGallery = {
  variant: GalleryVariant;
  images: GalleryImage[];
};

const shopifyShot = (file: string) =>
  encodeURI(`/tiendashopify/capturas/${file}`);

const mobileShot = (file: string) => `/mobile/capturas/${file}`;

const nbsp = "\u202f";

export const profilePhoto = encodeURI(
  "/profile/WhatsApp Image 2026-08-26 at 17.14.02.jpeg",
);

export const projectLogos: Record<string, string> = {
  jornalpro: "/jornalpro/logo/favicon.png",
  "jornalpro-backend": "/jornalpro/logo/favicon.png",
  "jornalpro-frontend": "/jornalpro/logo/favicon.png",
  "jornalpro-mobile": "/mobile/logo/favicon.png",
  "tienda-ivan": "/tiendashopify/logo/Logo.png",
};

export const projectGalleries: Record<string, ProjectGallery> = {
  jornalpro: {
    variant: "desktop",
    images: [],
  },
  "jornalpro-frontend": {
    variant: "desktop",
    images: [],
  },
  "jornalpro-backend": {
    variant: "desktop",
    images: [],
  },
  "jornalpro-mobile": {
    variant: "phone",
    images: [
      "Screenshot_2026-08-26-16-26-47-247_com.example.app_asistencia_nomina_1.jpg",
      "Screenshot_2026-08-26-16-27-09-767_com.example.app_asistencia_nomina_1.jpg",
      "Screenshot_2026-08-26-16-27-15-313_com.example.app_asistencia_nomina_1.jpg",
      "Screenshot_2026-08-26-16-27-25-077_com.example.app_asistencia_nomina_1.jpg",
      "Screenshot_2026-08-26-16-27-54-309_com.example.app_asistencia_nomina_1.jpg",
      "Screenshot_2026-08-26-16-29-58-850_com.example.app_asistencia_nomina_1.jpg",
      "Screenshot_2026-08-26-16-30-07-279_com.example.app_asistencia_nomina_1.jpg",
      "Screenshot_2026-08-26-16-30-22-004_com.example.app_asistencia_nomina_1.jpg",
      "Screenshot_2026-08-26-16-31-14-054_com.example.app_asistencia_nomina_1.jpg",
    ].map((file, index) => ({
      src: mobileShot(file),
      alt: `JornalPro Mobile — captura ${index + 1}`,
    })),
  },
  "tienda-ivan": {
    variant: "desktop",
    images: [
      `Screenshot 2026-08-26 at 5.06.14${nbsp}p.m..png`,
      `Screenshot 2026-08-26 at 5.06.31${nbsp}p.m..png`,
      `Screenshot 2026-08-26 at 5.06.39${nbsp}p.m..png`,
      `Screenshot 2026-08-26 at 5.06.49${nbsp}p.m..png`,
      `Screenshot 2026-08-26 at 5.06.55${nbsp}p.m..png`,
      `Screenshot 2026-08-26 at 5.07.14${nbsp}p.m..png`,
      `Screenshot 2026-08-26 at 5.07.32${nbsp}p.m..png`,
      `Screenshot 2026-08-26 at 5.07.49${nbsp}p.m..png`,
    ].map((file, index) => ({
      src: shopifyShot(file),
      alt: `ITZ Coleccionables — captura ${index + 1}`,
    })),
  },
};

export function getProjectGallery(slug: string): ProjectGallery | undefined {
  const gallery = projectGalleries[slug];
  if (!gallery || gallery.images.length === 0) return undefined;
  return gallery;
}

export function getProjectLogo(slug: string): string | undefined {
  return projectLogos[slug];
}

export function getProjectCover(slug: string): string | undefined {
  return getProjectGallery(slug)?.images[0]?.src;
}
