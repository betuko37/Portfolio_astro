import fs from "node:fs";
import path from "node:path";

export type GalleryImage = {
  src: string;
  alt: string;
};

export type GalleryVariant = "phone" | "desktop";

export type ProjectGallery = {
  variant: GalleryVariant;
  images: GalleryImage[];
};

const publicDir = path.join(process.cwd(), "public");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

type GallerySource = {
  dir: string;
  variant: GalleryVariant;
  altLabel: string;
};

/** Slug del proyecto → carpeta en public/ (sin barra inicial). */
export const gallerySources: Record<string, GallerySource> = {
  jornalpro: {
    dir: "jornalpro/screenshots",
    variant: "desktop",
    altLabel: "JornalPro Cloud",
  },
  "jornalpro-hikcentral": {
    dir: "hikcentral/screenshots",
    variant: "desktop",
    altLabel: "Biometría HikCentral",
  },
  agroeasy: {
    dir: "agroeasy/screenshots",
    variant: "desktop",
    altLabel: "Agroeasy",
  },
  "cotizaciones-facturaciones": {
    dir: "cotizaciones/screenshots",
    variant: "desktop",
    altLabel: "Cotizaciones y Facturaciones",
  },
  "jornalpro-mobile": {
    dir: "mobile/capturas",
    variant: "phone",
    altLabel: "JornalPro Mobile",
  },
  "tienda-ivan": {
    dir: "tiendashopify/capturas",
    variant: "desktop",
    altLabel: "ITZ Coleccionables",
  },
};

function listImageFiles(relativeDir: string): string[] {
  const absoluteDir = path.join(publicDir, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];

  return fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true, sensitivity: "base" }));
}

function publicAssetUrl(relativeDir: string, file: string) {
  return encodeURI(`/${relativeDir}/${file}`);
}

export function buildGalleryFromPublic(source: GallerySource): GalleryImage[] {
  return listImageFiles(source.dir).map((file, index) => ({
    src: publicAssetUrl(source.dir, file),
    alt: `${source.altLabel} — captura ${index + 1}`,
  }));
}

export function buildProjectGalleriesFromPublic() {
  return Object.fromEntries(
    Object.entries(gallerySources).map(([slug, source]) => [
      slug,
      {
        variant: source.variant,
        images: buildGalleryFromPublic(source),
      },
    ]),
  );
}
