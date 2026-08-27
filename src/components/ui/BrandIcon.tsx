import { getBrandColor, getBrandImage, getBrandMark, getStackLucide } from "@data/brands";
import type { IconName } from "@data/icons";

/** Paths Lucide 24×24 — fallback cuando no hay marca en simple-icons. */
const LUCIDE: Partial<Record<IconName, string>> = {
  "file-code":
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  hexagon:
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  terminal: "M4 17l6-6-6-6 M12 19h8",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  cpu: "M12 20v-2 M12 6V4 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41 M12 12h.01 M9 12h.01 M15 12h.01",
  smartphone:
    "M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01",
  "panels-top-left":
    "M3 3h18v18H3z M3 9h18 M9 21V9",
  sparkles:
    "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z",
};

type Props = {
  label: string;
  size?: number;
  className?: string;
};

export default function BrandIcon({ label, size = 14, className = "" }: Props) {
  const image = getBrandImage(label);
  const mark = getBrandMark(label);
  const color = getBrandColor(label);

  if (image) {
    return (
      <img
        src={image}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 object-contain ${className}`}
      />
    );
  }

  if (mark) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={mark.color}
        aria-hidden="true"
        className={`shrink-0 ${className}`}
      >
        <path d={mark.path} />
      </svg>
    );
  }

  const name = getStackLucide(label);
  const path = LUCIDE[name] ?? LUCIDE.cpu;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d={path} />
    </svg>
  );
}
