import { useEffect, useState } from "react";
import type { RecruiterStats } from "@data/recruiter-stats";
import { applyLiveGithubStats } from "@data/recruiter-stats";
import { getContributionYear, normalizeContributions, type ContributionDay, type GithubContributions, type GithubUsage } from "@lib/github-stats";
import BrandIcon from "@components/ui/BrandIcon";
import { getBrandColor } from "@data/brands";

type BarItem = { label: string; count: number };

type Segment = { label: string; count: number; pct: number; color: string };

const GH_LEVELS = [
  "var(--gh-contrib-0)",
  "var(--gh-contrib-1)",
  "var(--gh-contrib-2)",
  "var(--gh-contrib-3)",
  "var(--gh-contrib-4)",
] as const;

const GH_MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const WEEKDAY_LABELS = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

function contributionLevel(count: number, max: number) {
  if (count <= 0) return 0;
  if (max <= 1) return 1;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function formatContributionDate(date: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${Number(d)} ${GH_MONTHS[Number(m) - 1] ?? m} ${y}`;
}

function ContributionGrid({
  weeks,
  total,
  activeDays,
  login,
  year,
  dailyFromGithub,
  loading,
}: {
  weeks: ContributionDay[][] | undefined;
  total: number;
  activeDays: number;
  login: string;
  year: number;
  dailyFromGithub: boolean;
  loading: boolean;
}) {
  if (!dailyFromGithub && !weeks?.length) {
    return (
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[10px] text-[var(--ink)]">
            <span className="font-medium tabular-nums">{total.toLocaleString("es-MX")}</span>
            <span className="text-[var(--muted)]"> contribuciones en {year}</span>
          </p>
          <p className="text-[9px] tabular-nums text-[var(--muted)]">@{login}</p>
        </div>
        <p className="mt-2 text-[10px] text-[var(--muted)]">
          {loading
            ? "Cargando actividad diaria desde GitHub…"
            : "Cuadrícula diaria disponible con datos en vivo de GitHub."}
        </p>
      </div>
    );
  }

  const safeWeeks = weeks?.length ? weeks : [];
  if (!safeWeeks.length) {
    return (
      <p className="text-[10px] text-[var(--muted)]">
        {loading ? "Cargando actividad diaria…" : "Sin datos diarios de GitHub."}
      </p>
    );
  }

  const flat = safeWeeks.flat().filter((day) => day.date);
  const max = Math.max(...flat.map((day) => day.count), 1);

  const monthMarkers: { week: number; label: string }[] = [];
  for (let m = 0; m < 12; m++) {
    const prefix = `${year}-${String(m + 1).padStart(2, "0")}`;
    const weekIndex = safeWeeks.findIndex((week) => week.some((d) => d.date.startsWith(prefix)));
    if (weekIndex >= 0) monthMarkers.push({ week: weekIndex, label: GH_MONTHS[m]! });
  }

  const cellSize = 11;
  const cellGap = 3;
  const weekStep = cellSize + cellGap;
  const gridWidth = safeWeeks.length * weekStep - cellGap;

  return (
    <div className="w-full sm:flex sm:flex-col sm:items-center">
      <div className="flex w-full items-baseline justify-between gap-2 sm:max-w-fit sm:justify-center sm:gap-x-4">
        <p className="text-[10px] text-[var(--ink)]">
          <span className="font-medium tabular-nums">{total.toLocaleString("es-MX")}</span>
          <span className="text-[var(--muted)]"> contribuciones en {year} · </span>
          <span className="font-medium tabular-nums">{activeDays}</span>
          <span className="text-[var(--muted)]"> días activos · ene–dic</span>
        </p>
        <p className="text-[9px] tabular-nums text-[var(--muted)]">@{login}</p>
      </div>

      <div className="mt-2 w-full sm:flex sm:justify-center">
        <div className="flex w-full max-w-full gap-1.5 sm:w-auto">
          <div
            className="flex w-7 shrink-0 flex-col gap-[3px] pt-4 sm:w-8"
            aria-hidden="true"
          >
            {WEEKDAY_LABELS.map((label) => (
              <span
                key={label}
                className="flex items-center text-[8px] font-medium leading-none text-[var(--muted)] sm:text-[9px]"
                style={{ height: cellSize }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="relative min-w-0 flex-1 sm:flex-none">
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-sand via-sand/80 to-transparent sm:hidden"
              aria-hidden="true"
            />
            <div
              className="contrib-scroll w-full max-w-full overflow-x-scroll overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] sm:mx-auto sm:overflow-x-visible sm:scroll-smooth [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--mist)]/80 [&::-webkit-scrollbar-track]:bg-transparent"
              tabIndex={0}
              role="region"
              aria-label={`Cuadrícula de contribuciones ${year}, desliza horizontalmente`}
            >
              <div className="w-max pr-2" style={{ minWidth: gridWidth }}>
                <div
                  className="relative mb-1.5 h-3.5 text-[8px] text-[var(--muted)] sm:text-[9px]"
                  style={{ width: gridWidth }}
                >
                  {monthMarkers.map(({ week, label }) => (
                    <span
                      key={`${week}-${label}`}
                      className="absolute top-0 whitespace-nowrap"
                      style={{ left: week * weekStep }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div
                  className="flex gap-[3px]"
                  style={{ width: gridWidth }}
                  role="img"
                  aria-label={`${total} contribuciones en GitHub de enero a diciembre ${year}`}
                >
                  {safeWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex shrink-0 flex-col gap-[3px]">
                      {week.map((day, dayIndex) => {
                        if (!day.date) {
                          return (
                            <div
                              key={`${weekIndex}-${dayIndex}`}
                              style={{ width: cellSize, height: cellSize }}
                              aria-hidden="true"
                            />
                          );
                        }

                        const level = contributionLevel(day.count, max);

                        return (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className="rounded-[2px] sm:rounded-[3px]"
                            style={{
                              width: cellSize,
                              height: cellSize,
                              background: GH_LEVELS[level],
                            }}
                            title={`${formatContributionDate(day.date)}: ${day.count} contribuciones`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-end gap-1 text-[8px] text-[var(--muted)] sm:justify-center sm:text-[9px]">
                  <span>Menos</span>
                  {GH_LEVELS.map((color, i) => (
                    <div
                      key={i}
                      className="rounded-[2px]"
                      style={{ width: cellSize, height: cellSize, background: color }}
                    />
                  ))}
                  <span>Más</span>
                </div>
              </div>
            </div>
            <p className="mt-1 text-[8px] text-[var(--muted)] sm:hidden">
              Desliza horizontalmente para ver ene–dic →
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
const LAYER_COLORS: Record<string, string> = {
  Frontend: "#2563eb",
  Backend: "#141414",
  Mobile: "#dc2626",
  Datos: "#059669",
  Lenguajes: "#d97706",
  Comercio: "#5b21b6",
  "Hardware / IoT": "#0891b2",
};

function formatKpiLabel(label: string) {
  return label
    .replace(/^Commits \(\d+\)$/, "Commits")
    .replace("Estudios de caso", "Casos")
    .replace("Productos en producción", "En producción")
    .replace("Repos GitHub", "Repos");
}

function buildSegments(
  items: BarItem[],
  maxItems = 5,
  colorFor: (label: string) => string = getBrandColor,
): Segment[] {
  const total = items.reduce((s, i) => s + i.count, 0) || 1;
  const sorted = [...items].sort((a, b) => b.count - a.count);
  const main = sorted.slice(0, maxItems);
  const restCount = sorted.slice(maxItems).reduce((s, i) => s + i.count, 0);

  const segments = main.map((item) => ({
    label: item.label,
    count: item.count,
    pct: (item.count / total) * 100,
    color: colorFor(item.label),
  }));

  if (restCount > 0) {
    segments.push({
      label: "Otros",
      count: restCount,
      pct: (restCount / total) * 100,
      color: "var(--mist)",
    });
  }

  return segments;
}

function ShareStrip({
  title,
  hint,
  items,
  maxItems = 5,
  withIcons = false,
  colorFor,
  unit = "proyectos",
  refreshing = false,
}: {
  title: string;
  hint?: string;
  items: BarItem[];
  maxItems?: number;
  withIcons?: boolean;
  colorFor?: (label: string) => string;
  unit?: string;
  refreshing?: boolean;
}) {
  const segments = buildSegments(items, maxItems, colorFor);

  return (
    <div className={refreshing ? "opacity-60 transition-opacity" : "transition-opacity"}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
          {title}
        </p>
        {hint ? (
          <span className="text-[9px] tabular-nums text-[var(--muted)]">{hint}</span>
        ) : null}
      </div>
      <div
        className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-[var(--paper)]"
        role="img"
        aria-label={`${title}: distribución 100%`}
      >
        {segments.map((s) => (
          <div
            key={s.label}
            title={`${s.label} ${s.pct.toFixed(0)}% · ${s.count.toLocaleString("es-MX")} ${unit}`}
            style={{ width: `${s.pct}%`, background: s.color }}
          />
        ))}
      </div>
      <ul className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1" aria-label={title}>
        {segments.map((s) => (
          <li
            key={s.label}
            className="inline-flex max-w-full items-center gap-1 text-[10px] leading-none"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
            {withIcons && s.label !== "Otros" ? <BrandIcon label={s.label} size={11} /> : null}
            <span className="truncate text-[var(--ink)]">{s.label}</span>
            <span className="shrink-0 font-medium tabular-nums">{s.pct.toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type ApiPayload = {
  ok: boolean;
  usage: GithubUsage;
  contributions: GithubContributions;
  fetchedAt?: string;
  stale?: boolean;
};

export default function RecruiterInsights({ stats: initial }: { stats: RecruiterStats }) {
  const [stats, setStats] = useState(initial);
  const [live, setLive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRefreshing(true);

    fetch("/api/github-stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: ApiPayload) => {
        if (cancelled || !data.ok) return;
        const normalized = normalizeContributions(data.contributions);
        setStats(applyLiveGithubStats(initial, data.usage, normalized));
        setLive(!data.stale);
        setFetchedAt(data.fetchedAt ?? null);
      })
      .catch(() => {
        /* fallback estático */
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once al montar
  }, []);

  const hero = stats.kpis.slice(0, 4);
  const layerColor = (label: string) => LAYER_COLORS[label] ?? "var(--accent)";

  const mixTotal = stats.projectMix.reduce((s, i) => s + i.count, 0) || 1;
  const mixColor = (label: string) => {
    if (label === "En producción") return "#dc2626";
    if (label === "Open source") return "#16a34a";
    if (label === "Formación / CV") return "#141414";
    return "var(--mist)";
  };

  const liveLabel = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
    : stats.github.updatedAt;

  const repoHint = `${stats.githubUsage.reposWithLanguages} de ${stats.githubUsage.totalRepos} repos`;

  return (
    <div className="rounded-[1.25rem] bg-sand">
      <div className="grid grid-cols-4 divide-x divide-[var(--paper)]">
        {hero.map((kpi) => (
          <div
            key={kpi.label}
            className="flex flex-col items-center px-2 py-2.5 text-center sm:px-2.5 md:py-3"
          >
            <p className="flex min-h-[2.6em] w-full items-end justify-center text-[9px] font-medium uppercase leading-[1.15] tracking-[0.1em] text-[var(--muted)]">
              {formatKpiLabel(kpi.label)}
            </p>
            <p className="mt-1 font-display text-base font-semibold leading-none tabular-nums sm:text-lg">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-px bg-[var(--paper)] sm:grid-cols-2">
        <div
          className={`bg-sand px-3 py-2.5 sm:col-span-2 sm:flex sm:flex-col sm:items-center ${refreshing ? "opacity-60" : ""} transition-opacity`}
        >
          <p className="w-full text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)] sm:text-center">
            GitHub
          </p>
          <div className="mt-1.5 w-full max-w-full sm:flex sm:justify-center">
            <ContributionGrid
              weeks={stats.github.weeks}
              total={stats.github.contributionsLastYear}
              activeDays={stats.github.activeDaysLastYear}
              login={stats.github.login}
              year={stats.github.year ?? getContributionYear()}
              dailyFromGithub={stats.github.dailyFromGithub || stats.github.weeks.length > 0}
              loading={refreshing}
            />
          </div>
        </div>

        <div className="bg-sand px-3 py-2.5 sm:col-span-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
            Portafolio
          </p>
          <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-[var(--paper)]">
            {stats.projectMix.map((item, i) => (
              <div
                key={item.label}
                style={{
                  width: `${(item.count / mixTotal) * 100}%`,
                  background: mixColor(item.label),
                }}
              />
            ))}
          </div>
          <ul className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1">
            {stats.projectMix.map((item, i) => (
              <li key={item.label} className="inline-flex items-center gap-1 text-[10px]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: mixColor(item.label) }}
                />
                <span>{item.label}</span>
                <span className="font-medium tabular-nums">
                  {Math.round((item.count / mixTotal) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-px bg-[var(--paper)] md:grid-cols-3">
        <div className="bg-sand px-3 py-2.5">
          <ShareStrip
            title="Lenguajes"
            hint={`GitHub · ${repoHint}`}
            items={stats.languages}
            withIcons
            maxItems={8}
            unit="repos"
            refreshing={refreshing}
          />
        </div>
        <div className="bg-sand px-3 py-2.5">
          <ShareStrip
            title="Tecnologías"
            hint={`GitHub · ${repoHint}`}
            items={stats.topTechnologies}
            withIcons
            maxItems={8}
            unit="repos"
            refreshing={refreshing}
          />
        </div>
        <div className="bg-sand px-3 py-2.5">
          <ShareStrip
            title="Por capa"
            hint={`GitHub · ${repoHint}`}
            items={stats.stackFamilies}
            colorFor={layerColor}
            unit="repos"
            refreshing={refreshing}
          />
        </div>
      </div>

      <p className="border-t border-[var(--paper)] px-3 py-1.5 text-center text-[9px] text-[var(--muted)]">
        {live ? (
          <span className="mr-1.5 inline-flex items-center gap-1">
            <span className="live-dot text-accent" />
            En vivo
          </span>
        ) : null}
        GitHub @{stats.github.login} · {repoHint}
        {!stats.githubUsage.authenticated ? " (solo públicos)" : null} · {liveLabel}
      </p>
    </div>
  );
}
