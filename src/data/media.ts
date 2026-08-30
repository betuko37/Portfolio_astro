import {
  buildProjectGalleriesFromPublic,
  type GalleryImage,
  type GalleryVariant,
  type ProjectGallery,
} from "@lib/project-galleries";

export type { GalleryImage, GalleryVariant, ProjectGallery };

export {
  HIKCENTRAL_LOGO,
  getProjectLogo,
  profilePhoto,
  projectLogoUsesLightBg,
  projectLogos,
} from "./project-logos";

/** Galerías generadas al build leyendo carpetas en public (screenshots o capturas). */
const productionGalleries = buildProjectGalleriesFromPublic();

function resolveProjectGalleries() {
  return import.meta.env.DEV ? buildProjectGalleriesFromPublic() : productionGalleries;
}

export function getProjectGallery(slug: string): ProjectGallery | undefined {
  const gallery = resolveProjectGalleries()[slug];
  if (!gallery || gallery.images.length === 0) return undefined;
  return gallery;
}

export function getProjectCover(slug: string): string | undefined {
  return getProjectGallery(slug)?.images[0]?.src;
}
