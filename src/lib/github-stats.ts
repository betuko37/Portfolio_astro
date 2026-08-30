import { profile } from "@data/profile";

export type GithubUsageItem = { label: string; bytes: number };

export type GithubUsage = {
  updatedAt: string;
  source: "github";
  login: string;
  name: string;
  publicRepos: number;
  privateRepos: number;
  totalRepos: number;
  followers: number;
  memberSince: string;
  authenticated: boolean;
  reposScanned: number;
  reposWithLanguages: number;
  totalBytes: number;
  languages: GithubUsageItem[];
  technologies: GithubUsageItem[];
  layers: GithubUsageItem[];
};

export type ContributionDay = { date: string; count: number };

export type GithubContributions = {
  /** Año calendario mostrado (ene–dic). */
  year: number;
  contributionsLastYear: number;
  activeDaysLastYear: number;
  monthlyContributions: { month: string; count: number }[];
  /** Semanas GitHub (dom → sáb), cada columna es una semana. */
  weeks: ContributionDay[][];
  /** true = cuadrícula con días reales desde GitHub (incluye días en 0). */
  dailyFromGithub: boolean;
};

export type FetchGithubOptions = {
  login?: string;
  token?: string;
  /** Si se pasa, limita el análisis a esta lista en lugar de toda la cuenta. */
  repos?: string[];
};

export function getContributionYear(): number {
  return new Date().getFullYear();
}

export function getCalendarYearBounds(year = getContributionYear()) {
  return {
    from: new Date(year, 0, 1),
    to: new Date(year, 11, 31, 23, 59, 59, 999),
  };
}

function isoDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function buildCalendarYearDays(year = getContributionYear()): ContributionDay[] {
  const days: ContributionDay[] = [];
  const cursor = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  while (cursor <= end) {
    days.push({ date: isoDateLocal(cursor), count: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function groupDaysIntoWeeks(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = [];
  let week: ContributionDay[] = [];
  const firstDow = new Date(`${days[0]!.date}T12:00:00`).getDay();

  for (let i = 0; i < firstDow; i++) week.push({ date: "", count: 0 });

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length) {
    while (week.length < 7) week.push({ date: "", count: 0 });
    weeks.push(week);
  }

  return weeks;
}

export function buildContributionWeeksFromDaily(
  daily: readonly ContributionDay[],
  year = getContributionYear(),
): ContributionDay[][] {
  const days = buildCalendarYearDays(year);
  const byDate = new Map(
    daily.filter((d) => d.date.startsWith(String(year))).map((d) => [d.date, d.count]),
  );

  for (const day of days) {
    day.count = byDate.get(day.date) ?? 0;
  }

  return groupDaysIntoWeeks(days);
}

export function resolveContributionWeeks(
  contributions: Pick<GithubContributions, "weeks" | "year" | "dailyFromGithub">,
): ContributionDay[][] {
  const year = contributions.year ?? getContributionYear();
  const hasDaily =
    contributions.dailyFromGithub ||
    (contributions.weeks?.flat().filter((day) => day.date.startsWith(String(year))).length ?? 0) > 30;

  if (!hasDaily) return [];

  if (contributions.weeks?.length) {
    const dated = contributions.weeks.flat().filter((day) => day.date.startsWith(String(year)));
    if (dated.length) return buildContributionWeeksFromDaily(dated, year);
  }

  return [];
}

export function normalizeContributions(
  contributions: Omit<GithubContributions, "year" | "weeks" | "dailyFromGithub"> & {
    year?: number;
    weeks?: ContributionDay[][];
    dailyFromGithub?: boolean;
  },
): GithubContributions {
  const year = contributions.year ?? getContributionYear();
  const datedDays =
    contributions.weeks?.flat().filter((day) => day.date.startsWith(String(year))).length ?? 0;
  const dailyFromGithub = contributions.dailyFromGithub ?? datedDays > 30;

  const weeks = dailyFromGithub
    ? resolveContributionWeeks({ ...contributions, year, dailyFromGithub })
    : [];

  return {
    year,
    dailyFromGithub: dailyFromGithub || weeks.length > 0,
    contributionsLastYear: contributions.contributionsLastYear,
    activeDaysLastYear: contributions.activeDaysLastYear,
    monthlyContributions: contributions.monthlyContributions.filter((m) =>
      m.month.startsWith(String(year)),
    ),
    weeks: weeks.length ? weeks : dailyFromGithub ? (contributions.weeks ?? []) : [],
  };
}

const LANG_TO_LAYER: Record<string, string> = {
  TypeScript: "Backend",
  JavaScript: "Backend",
  Vue: "Frontend",
  HTML: "Frontend",
  CSS: "Frontend",
  SCSS: "Frontend",
  Less: "Frontend",
  Astro: "Frontend",
  Dart: "Mobile",
  Kotlin: "Mobile",
  Swift: "Mobile",
  Java: "Backend",
  Python: "Backend",
  Go: "Backend",
  Ruby: "Backend",
  PHP: "Backend",
  C: "Backend",
  "C++": "Backend",
  Shell: "Backend",
  PowerShell: "Backend",
  Dockerfile: "Backend",
  SQL: "Datos",
  PLpgSQL: "Datos",
  R: "Datos",
};

function totalLangBytes(languages: Record<string, number>) {
  return Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
}

/** Capa dominante del repo (no del lenguaje suelto: TS en backend ≠ frontend). */
export function inferRepoLayer(fullName: string, languages: Record<string, number>): string {
  const id = fullName.toLowerCase();
  const repo = id.split("/").pop() ?? id;
  const total = totalLangBytes(languages) || 1;
  const share = (lang: string) => (languages[lang] ?? 0) / total;

  if (/backend|back-end|nfc-service|rest-api|wheatherapi|imageapi|apicoktel|veterinary|form-pets/.test(id)) {
    return "Backend";
  }
  if (/frontend|front-end|tienda-react/.test(id)) {
    return "Frontend";
  }
  if (/online_offline|flutter/.test(id) || share("Dart") > 0.35) {
    return "Mobile";
  }
  if (share("Kotlin") > 0.35 || share("Swift") > 0.35) {
    return "Mobile";
  }
  if (
    share("Vue") > 0.15 ||
    share("HTML") + share("CSS") + share("SCSS") > 0.1 ||
    /react|vue|dashboard|heroes|journal|task|chat|quizz|precios|gifts|nexgard|lista-precios/.test(id)
  ) {
    return "Frontend";
  }
  if (share("PHP") > 0.35 || share("Python") > 0.35 || share("Go") > 0.35 || share("Java") > 0.35) {
    return "Backend";
  }

  const tsJs = share("TypeScript") + share("JavaScript");
  const ui = share("Vue") + share("HTML") + share("CSS") + share("Astro");
  if (tsJs > 0.65 && ui < 0.1) return "Backend";
  if (/api|service|server|cloud|node/.test(repo) && !/react|vue|gift|front/.test(repo)) {
    return "Backend";
  }

  let topLang = "";
  let topBytes = 0;
  for (const [lang, bytes] of Object.entries(languages)) {
    if (bytes > topBytes) {
      topBytes = bytes;
      topLang = lang;
    }
  }

  return LANG_TO_LAYER[topLang] ?? "Backend";
}


/** Linguist labels that are markup, config or frameworks — van a Tecnologías, no a Lenguajes. */
const LINGUIST_NOT_LANGUAGES = new Set([
  "Vue",
  "Astro",
  "HTML",
  "CSS",
  "SCSS",
  "Less",
  "Sass",
  "Dockerfile",
  "Batchfile",
  "VBScript",
  "CMake",
  "Inno Setup",
  "Procfile",
]);

const PKG_DEP_PATTERNS: [RegExp, string][] = [
  [/^react(-dom)?$/, "React"],
  [/^vue$|^@vue\//, "Vue"],
  [/^express$/, "Express"],
  [/^fastify$/, "Fastify"],
  [/^@nestjs\/core$/, "NestJS"],
  [/^socket\.io$/, "Socket.IO"],
  [/^astro$/, "Astro"],
  [/^next$/, "Next.js"],
  [/^@remix-run\//, "Remix"],
  [/^@prisma\/client$|^prisma$/, "Prisma"],
  [/^tailwindcss$/, "Tailwind"],
  [/^gsap$/, "GSAP"],
  [/^three$/, "Three.js"],
  [/^firebase$/, "Firebase"],
  [/^vite$/, "Vite"],
  [/^@mui\/material$/, "Material UI"],
  [/^zustand$/, "Zustand"],
  [/^@tanstack\/react-query$/, "React Query"],
  [/^leaflet$/, "Leaflet"],
  [/^@mui\/icons-material$/, "Material UI"],
  [/^react-router(-dom)?$/, "React Router"],
];

function techsFromPackageJson(text: string): string[] {
  const techs = new Set<string>();
  if (!text.trim()) return [];
  try {
    const pkg = JSON.parse(text) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
    for (const name of Object.keys(deps)) {
      for (const [pattern, tech] of PKG_DEP_PATTERNS) {
        if (pattern.test(name)) techs.add(tech);
      }
    }
  } catch {
    /* invalid package.json */
  }
  return [...techs];
}

function techsFromPubspec(text: string): string[] {
  const techs = new Set<string>();
  if (/^\s*flutter\s*:/m.test(text) || /sdk:\s*flutter/m.test(text)) techs.add("Flutter");
  if (/riverpod/i.test(text)) techs.add("Riverpod");
  if (/hive/i.test(text)) techs.add("Hive");
  return [...techs];
}

function inferRepoTechnologies(fullName: string, languages: Record<string, number>): string[] {
  const id = fullName.toLowerCase();
  const repo = id.split("/").pop() ?? id;
  const total = totalLangBytes(languages) || 1;
  const share = (lang: string) => (languages[lang] ?? 0) / total;
  const techs = new Set<string>();

  if (share("Dart") > 0.05 || /online_offline|flutter|nexgard|mobile/.test(id)) techs.add("Flutter");
  if (share("Vue") > 0.05 || /agroeasy_frontend|vue/.test(id)) techs.add("Vue");
  if (share("Astro") > 0.1) techs.add("Astro");

  const isBackend =
    /backend|back-end|nfc-service|rest-api|wheatherapi|imageapi|apicoktel|veterinary|form-pets/.test(id) ||
    (/api|service|server|cloud|node/.test(repo) && !/react|vue|gift|front/.test(repo));

  const isFrontend =
    /frontend|front-end|tienda-react|react|heroes|journal|task|chat|quizz|precios|gifts|lista-precios|nexgard|cotizaciones/.test(
      id,
    ) ||
    share("Vue") > 0.1 ||
    (share("HTML") + share("CSS") > 0.08 && !isBackend);

  if (isFrontend && !techs.has("Vue")) techs.add("React");
  if (isBackend) {
    techs.add("Node.js");
    if (/express|backend|api|nfc|rest-api/.test(id)) techs.add("Express");
  }
  if (share("PHP") > 0.2) techs.add("PHP");
  if (share("Python") > 0.2) techs.add("Python");

  return [...techs];
}

/** Un repo → una capa principal (React ≠ Vite ≠ MUI por separado en el %). */
function primaryFrameworkTechs(techs: string[]): string[] {
  if (techs.includes("Flutter")) return ["Flutter"];
  if (techs.includes("Vue")) return ["Vue"];
  if (techs.includes("React")) return ["React"];
  if (techs.includes("Astro")) return ["Astro"];
  if (techs.includes("NestJS")) return ["NestJS"];
  if (techs.includes("Express")) return ["Express"];
  if (techs.includes("Fastify")) return ["Fastify"];
  if (techs.includes("Node.js")) return ["Node.js"];
  if (techs.includes("PHP")) return ["PHP"];
  if (techs.includes("Python")) return ["Python"];
  return techs.length ? [techs[0]!] : [];
}

function primaryProgrammingLanguage(languages: Record<string, number>): string | null {
  let top = "";
  let topBytes = 0;
  for (const [lang, bytes] of Object.entries(languages)) {
    if (LINGUIST_NOT_LANGUAGES.has(lang)) continue;
    if (bytes > topBytes) {
      topBytes = bytes;
      top = lang;
    }
  }
  return top || null;
}

async function fetchRepoFileText(fullName: string, path: string, token?: string): Promise<string | null> {
  const file = await ghMaybe<{ content?: string; encoding?: string }>(
    `/repos/${fullName}/contents/${path}`,
    token,
  );
  if (!file?.content) return null;
  return Buffer.from(file.content, file.encoding === "base64" ? "base64" : "utf8").toString("utf8");
}

async function detectRepoTechnologies(
  fullName: string,
  languages: Record<string, number>,
  token?: string,
): Promise<string[]> {
  const [pkg, pubspec] = await Promise.all([
    fetchRepoFileText(fullName, "package.json", token),
    fetchRepoFileText(fullName, "pubspec.yaml", token),
  ]);

  const techs = new Set<string>();
  for (const t of techsFromPackageJson(pkg ?? "")) techs.add(t);
  for (const t of techsFromPubspec(pubspec ?? "")) techs.add(t);

  if (techs.size) return [...techs];
  return inferRepoTechnologies(fullName, languages);
}

type RepoLangs = {
  full_name: string;
  private: boolean;
  languages: Record<string, number>;
  technologies: string[];
};
type CountMap = Map<string, number>;

function ghHeaders(token?: string): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-astro",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function gh<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers: ghHeaders(token) });
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function ghMaybe<T>(path: string, token?: string): Promise<T | null> {
  const res = await fetch(`https://api.github.com${path}`, { headers: ghHeaders(token) });
  if (res.status === 404 || res.status === 403) return null;
  if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchUserProfile(login: string, token?: string) {
  type GhUser = {
    login: string;
    name: string | null;
    public_repos: number;
    followers: number;
    created_at: string;
  };

  return token ? gh<GhUser>("/user", token) : gh<GhUser>(`/users/${login}`);
}

async function fetchAllUserRepos(login: string, token?: string): Promise<string[]> {
  type GhRepo = { full_name: string; fork: boolean };
  const names: string[] = [];
  let page = 1;

  while (page <= 10) {
    const path = token
      ? `/user/repos?affiliation=owner&sort=updated&per_page=100&page=${page}`
      : `/users/${login}/repos?sort=updated&per_page=100&page=${page}&type=owner`;

    const batch = await gh<GhRepo[]>(path, token);
    if (!batch.length) break;

    for (const repo of batch) {
      if (!repo.fork) names.push(repo.full_name);
    }
    if (batch.length < 100) break;
    page++;
  }

  return names.sort((a, b) => a.localeCompare(b));
}

async function fetchPortfolioReposWithLanguages(repos: string[], token?: string) {
  const results: RepoLangs[] = [];

  await mapPool(repos, 8, async (fullName) => {
    const [meta, langs] = await Promise.all([
      ghMaybe<{ private: boolean }>(`/repos/${fullName}`, token),
      ghMaybe<Record<string, number>>(`/repos/${fullName}/languages`, token),
    ]);
    if (!meta || !langs || !Object.keys(langs).length) return;

    const technologies = await detectRepoTechnologies(fullName, langs, token);
    results.push({ full_name: fullName, private: meta.private, languages: langs, technologies });
  });

  return results;
}

function buildUsageFromRepos(
  user: { login: string; name: string | null; followers: number; created_at: string },
  repos: RepoLangs[],
  authenticated: boolean,
  accountRepoTotal: number,
) {
  const { languages, technologies, layers, reposWithLangs } = aggregateRepoLanguages(repos);
  const langList = toSortedList(languages);
  const privateRepos = repos.filter((r) => r.private).length;
  const publicRepos = repos.filter((r) => !r.private).length;

  return {
    updatedAt: today(),
    source: "github" as const,
    login: user.login,
    name: user.name ?? user.login,
    publicRepos,
    privateRepos,
    totalRepos: accountRepoTotal,
    followers: user.followers,
    memberSince: user.created_at.slice(0, 7),
    authenticated,
    reposScanned: accountRepoTotal,
    reposWithLanguages: reposWithLangs,
    totalBytes: langList.reduce((s, i) => s + i.bytes, 0),
    languages: langList,
    technologies: toSortedList(technologies),
    layers: toSortedList(layers),
  };
}

function add(map: CountMap, key: string, n: number) {
  map.set(key, (map.get(key) ?? 0) + n);
}

function aggregateRepoLanguages(repos: RepoLangs[]) {
  const languages: CountMap = new Map();
  const technologies: CountMap = new Map();
  const layers: CountMap = new Map();
  let reposWithLangs = 0;

  for (const repo of repos) {
    const entries = Object.entries(repo.languages);
    if (!entries.length) continue;

    reposWithLangs++;
    const layer = inferRepoLayer(repo.full_name, repo.languages);
    add(layers, layer, 1);

    let techs = [
      ...(repo.technologies.length
        ? repo.technologies
        : inferRepoTechnologies(repo.full_name, repo.languages)),
    ];

    if ((repo.languages.Vue ?? 0) > 0 && !techs.includes("Vue")) techs.push("Vue");
    if ((repo.languages.Astro ?? 0) > 0 && !techs.includes("Astro")) techs.push("Astro");

    for (const tech of primaryFrameworkTechs(techs)) add(technologies, tech, 1);

    const primaryLang = primaryProgrammingLanguage(repo.languages);
    if (primaryLang) add(languages, primaryLang, 1);
  }

  return { languages, technologies, layers, reposWithLangs };
}

function toSortedList(map: CountMap): GithubUsageItem[] {
  return [...map.entries()]
    .map(([label, bytes]) => ({ label, bytes }))
    .sort((a, b) => b.bytes - a.bytes);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function fetchContributionsGraphql(
  login: string,
  token: string,
): Promise<GithubContributions | null> {
  const year = getContributionYear();
  const { from, to } = getCalendarYearBounds(year);

  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { ...ghHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { login, from: from.toISOString(), to: to.toISOString() },
    }),
  });

  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions: number;
            weeks: { contributionDays: { contributionCount: number; date: string }[] }[];
          };
        };
      };
    };
    errors?: { message: string }[];
  };

  if (json.errors?.length) return null;

  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;

  const yearPrefix = String(year);
  const daily: ContributionDay[] = [];

  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      if (!day.date.startsWith(yearPrefix)) continue;
      daily.push({ date: day.date, count: day.contributionCount });
    }
  }

  return contributionsFromDaily(daily, year);
}

/** Fallback público: el calendario HTML de GitHub no exige token (REST/GraphQL sí). */
async function fetchContributionsFromHtml(
  login: string,
  year = getContributionYear(),
): Promise<GithubContributions | null> {
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;
  const res = await fetch(
    `https://github.com/users/${encodeURIComponent(login)}/contributions?from=${from}&to=${to}`,
    {
      headers: {
        Accept: "text/html",
        "User-Agent": "portfolio-astro",
      },
    },
  );

  if (!res.ok) return null;

  const html = await res.text();
  const countById = new Map<string, number>();

  for (const match of html.matchAll(
    /for="(contribution-day-component-[^"]+)"[^>]*>([^<]*)<\/tool-tip>/gi,
  )) {
    const id = match[1]!;
    const text = match[2]!.trim();
    const countMatch = text.match(/^(\d+)\s+contributions?\s+on\b/i);
    countById.set(id, countMatch ? Number(countMatch[1]) : 0);
  }

  const yearPrefix = String(year);
  const daily: ContributionDay[] = [];
  const seen = new Set<string>();

  for (const match of html.matchAll(/<td\b([^>]*\bContributionCalendar-day\b[^>]*)>/gi)) {
    const attrs = match[1]!;
    const date = attrs.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const id = attrs.match(/\bid="(contribution-day-component-[^"]+)"/)?.[1];
    if (!date || !date.startsWith(yearPrefix) || seen.has(date)) continue;
    seen.add(date);
    daily.push({ date, count: id ? (countById.get(id) ?? 0) : 0 });
  }

  if (daily.length < 30) return null;
  return contributionsFromDaily(daily, year);
}

function contributionsFromDaily(daily: ContributionDay[], year: number): GithubContributions {
  const monthly = new Map<string, number>();
  let activeDays = 0;

  for (const day of daily) {
    if (day.count > 0) activeDays++;
    monthly.set(day.date.slice(0, 7), (monthly.get(day.date.slice(0, 7)) ?? 0) + day.count);
  }

  return normalizeContributions({
    year,
    dailyFromGithub: true,
    contributionsLastYear: daily.reduce((sum, day) => sum + day.count, 0),
    activeDaysLastYear: activeDays,
    monthlyContributions: [...monthly.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count })),
    weeks: buildContributionWeeksFromDaily(daily, year),
  });
}

/** Contribuciones del año: GraphQL (con token) o HTML público. */
export async function fetchGithubContributions(
  login: string,
  token?: string,
): Promise<GithubContributions | null> {
  if (token) {
    try {
      const fromGraphql = await fetchContributionsGraphql(login, token);
      if (fromGraphql) return fromGraphql;
    } catch {
      /* fallback HTML */
    }
  }

  try {
    return await fetchContributionsFromHtml(login);
  } catch {
    return null;
  }
}

async function mapPool<T>(items: T[], concurrency: number, fn: (item: T) => Promise<void>) {
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      await fn(items[i]!);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
}

export async function fetchGithubUsage(options: FetchGithubOptions = {}): Promise<{
  usage: GithubUsage;
  contributions: GithubContributions | null;
}> {
  const login = options.login ?? profile.githubUser;
  const token = options.token;

  const contributionsPromise = fetchGithubContributions(login, token);

  let usage: GithubUsage | null = null;
  let usageError: unknown;

  try {
    const [user, repoNames] = await Promise.all([
      fetchUserProfile(login, token),
      options.repos ? Promise.resolve(options.repos) : fetchAllUserRepos(login, token),
    ]);
    const repoLangs = await fetchPortfolioReposWithLanguages(repoNames, token);
    usage = buildUsageFromRepos(user, repoLangs, Boolean(token), repoNames.length);
  } catch (error) {
    usageError = error;
  }

  const contributions = await contributionsPromise;

  if (!usage) {
    const error =
      usageError instanceof Error ? usageError : new Error("GitHub usage fetch failed");
    (error as Error & { contributions: GithubContributions | null }).contributions =
      contributions;
    throw error;
  }

  return {
    usage,
    contributions,
  };
}
