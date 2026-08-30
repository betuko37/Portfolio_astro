export const profilePhoto = encodeURI(
  "/profile/WhatsApp Image 2026-08-26 at 17.14.02.jpeg",
);

/** Logo oficial HikCentral (extraído del producto JornalPro). */
export const HIKCENTRAL_LOGO = "/hikcentral/logo/icon.webp";

export const projectLogos: Record<string, string> = {
  jornalpro: "/jornalpro/logo/favicon.png",
  "jornalpro-hikcentral": HIKCENTRAL_LOGO,
  "jornalpro-backend": "/jornalpro/logo/favicon.png",
  "jornalpro-frontend": "/jornalpro/logo/favicon.png",
  "jornalpro-mobile": "/mobile/logo/favicon.png",
  agroeasy: "/agroeasy/logo/logo.png",
  "cotizaciones-facturaciones": "/cotizaciones/logo/logo.png",
  "tienda-ivan": "/tiendashopify/logo/Logo.png",
};

export function getProjectLogo(slug: string): string | undefined {
  return projectLogos[slug];
}

/** Logos raster que necesitan fondo claro sobre hero/card oscura. */
export function projectLogoUsesLightBg(slug: string): boolean {
  return slug === "jornalpro-hikcentral";
}
