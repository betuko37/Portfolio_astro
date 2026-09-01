#!/usr/bin/env node
/**
 * Genera diagramas Archify (HTML) para proyectos del portafolio.
 * Uso: pnpm diagrams:build
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { register } from "node:module";
import { patchDiagramEmbed } from "./patch-diagram-embed.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rootUrl = pathToFileURL(`${root}/`).href;

register(
  `data:text/javascript,${encodeURIComponent(`
    export async function resolve(specifier, context, nextResolve) {
      if (specifier.startsWith("@data/")) {
        const rel = specifier.slice("@data/".length);
        return nextResolve(new URL("./src/data/" + rel + ".ts", ${JSON.stringify(rootUrl)}).href, context);
      }
      if (specifier.startsWith("@lib/")) {
        const rel = specifier.slice("@lib/".length);
        return nextResolve(new URL("./src/lib/" + rel + ".ts", ${JSON.stringify(rootUrl)}).href, context);
      }
      if (specifier.startsWith(".") && !/\\.[a-zA-Z0-9]+$/.test(specifier)) {
        return nextResolve(new URL(specifier + ".ts", context.parentURL).href, context);
      }
      return nextResolve(specifier, context);
    }
  `)}`,
  pathToFileURL(path.join(root, "scripts/build-diagrams.mjs")).href,
);

const vendorArchify = path.join(root, "vendor", "archify");
const archifyBin = path.join(vendorArchify, "bin", "archify.mjs");
const diagramsDir = path.join(root, "diagrams");
const outputDir = path.join(root, "public", "diagrams");

const CARD_DOTS = ["cyan", "emerald", "rose"];

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function normalizeHaystack(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function inferType(layerName, item) {
  const itemHay = item.toLowerCase();
  const hay = `${layerName} ${item}`.toLowerCase();
  if (
    /^shopify$/.test(itemHay) ||
    /storefront api|admin api|customer account|checkout|facturoporti|pac\b/.test(itemHay)
  ) {
    return "external";
  }
  if (/hardware|checador|acs|nfc|usb|lector|acr|biometr|camara|cámara/.test(hay)) return "external";
  if (/postgres|prisma|sql|redis|hive|datos|db\b|s3|almacen/.test(hay)) return "database";
  if (/socket|webhook|event push|tiempo real|io|cola|queue|cron/.test(hay)) return "messagebus";
  if (/cloudflare|tunnel|proxy|firma|hmac|jwt|security|auth|webhook/.test(hay)) return "security";
  if (/panel|web|mui|vue|quasar|flutter|app|mobile|pwa|hydrogen|html|css/.test(hay)) return "frontend";
  if (/aws|s3|openai|cloud|oxygen|vercel|cloudinary|github pages/.test(hay)) return "cloud";
  return "backend";
}

function parseMermaidFlow(source) {
  const labels = new Map();
  const edges = [];
  if (!source) return { labels, edges };

  const defRe =
    /([A-Za-z][\w]*)\s*(?:\[\("([^"]+)"\)\]|\["([^"]+)"\]|\[\(([^)]+)\)\]|\[([^\]]+)\]|\(([^)]+)\))/g;
  const edgeRe =
    /([A-Za-z][\w]*)\s*(?:\[[^\]]*\]|\([^)]*\))?\s*-->(?:\|([^|]+)\|)?\s*([A-Za-z][\w]*)/g;

  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line || /^(flowchart|graph|subgraph|end)\b/i.test(line)) continue;

    defRe.lastIndex = 0;
    let match;
    while ((match = defRe.exec(line))) {
      const label = (match[2] || match[3] || match[4] || match[5] || match[6] || match[1])
        .replace(/\\n/g, " ")
        .trim();
      labels.set(match[1], label);
    }

    edgeRe.lastIndex = 0;
    while ((match = edgeRe.exec(line))) {
      if (!labels.has(match[1])) labels.set(match[1], match[1]);
      if (!labels.has(match[3])) labels.set(match[3], match[3]);
      edges.push({ from: match[1], to: match[3], label: match[2]?.trim() });
    }
  }

  return { labels, edges };
}

const FLOW_ALIASES = {
  js: ["javascript", "script"],
  javascript: ["js", "script"],
  html: ["ui", "index"],
  fetch: ["api"],
  api: ["fetch"],
  pwa: ["web", "dashboard"],
};

function flowTokens(value) {
  const base = normalizeHaystack(value)
    .replace(/[^a-z0-9+]+/g, " ")
    .split(/\s+/)
    .flatMap((token) => token.split("+"))
    .filter((token) => token.length >= 2);
  const expanded = new Set(base);
  for (const token of base) {
    for (const alias of FLOW_ALIASES[token] ?? []) expanded.add(alias);
  }
  return [...expanded];
}

function mermaidMatchScore(query, component, rawItem) {
  const needle = normalizeHaystack(query);
  const haystacks = [component.label, component.sublabel, rawItem, component.id].map(normalizeHaystack);
  let best = 0;

  for (const hay of haystacks) {
    if (!hay) continue;
    if (needle === hay) best = Math.max(best, 100);
    else if (needle.includes(hay) || hay.includes(needle)) best = Math.max(best, 82);
    else {
      const left = new Set(flowTokens(needle));
      const right = new Set(flowTokens(hay));
      let hits = 0;
      for (const token of left) {
        if (right.has(token)) hits += 1;
      }
      if (hits) best = Math.max(best, Math.round((hits / Math.max(left.size, right.size)) * 74));
    }
  }

  return best;
}

function connectionSides(fromComp, toComp) {
  if (toComp.row > fromComp.row) return { fromSide: "bottom", toSide: "top" };
  if (toComp.row < fromComp.row) return { fromSide: "top", toSide: "bottom" };
  if (toComp.col > fromComp.col) return { fromSide: "right", toSide: "left" };
  return { fromSide: "left", toSide: "right" };
}

function sameRowJump(fromComp, toComp, components) {
  if (fromComp.row !== toComp.row) return false;
  const lo = Math.min(fromComp.col, toComp.col);
  const hi = Math.max(fromComp.col, toComp.col);
  return components.some(
    (component) => component.row === fromComp.row && component.col > lo && component.col < hi,
  );
}

function resolveMermaidNode(merId, merLabel, components, rawById) {
  const parts = String(merLabel)
    .split(/\s*(?:\+|\/|&| y )\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);
  const genericId = merId.length <= 3 || /^(api|web|app|io|ui|js|db|wa|ox|sf|ca)$/i.test(merId);
  const queries = parts.length > 1 ? [merLabel, ...parts] : genericId ? [merLabel] : [merLabel, merId];
  const ranked = components
    .map((component) => ({
      component,
      score: Math.max(
        ...queries.map((query) => mermaidMatchScore(query, component, rawById.get(component.id) ?? "")),
      ),
    }))
    .filter((entry) => entry.score >= 70)
    .sort((a, b) => b.score - a.score);

  if (parts.length > 1) {
    const picked = [];
    const used = new Set();
    for (const part of parts) {
      const hit = ranked.find(
        (entry) =>
          !used.has(entry.component.id) &&
          mermaidMatchScore(part, entry.component, rawById.get(entry.component.id) ?? "") >= 70,
      );
      if (hit) {
        used.add(hit.component.id);
        picked.push(hit.component.id);
      }
    }
    if (picked.length) return picked;
  }

  return ranked[0] ? [ranked[0].component.id] : [];
}

function connectionsFromMermaid(project, components, rawById) {
  const { labels, edges } = parseMermaidFlow(project.architecture);
  const connections = [];
  const seen = new Set();
  const byId = new Map(components.map((component) => [component.id, component]));

  for (const [index, edge] of edges.entries()) {
    const fromIds = resolveMermaidNode(edge.from, labels.get(edge.from) ?? edge.from, components, rawById);
    const toIds = resolveMermaidNode(edge.to, labels.get(edge.to) ?? edge.to, components, rawById);
    for (const from of fromIds) {
      for (const to of toIds) {
        if (from === to) continue;
        const fromComp = byId.get(from);
        const toComp = byId.get(to);
        if (!fromComp || !toComp || sameRowJump(fromComp, toComp, components)) continue;
        if (Math.abs(fromComp.row - toComp.row) > 2) continue;
        const key = `${from}->${to}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const hay = normalizeHaystack(`${edge.label ?? ""} ${labels.get(edge.from) ?? ""} ${labels.get(edge.to) ?? ""}`);
        connections.push({
          id: `c${connections.length}-${from.slice(0, 12)}-${to.slice(0, 12)}`.replace(/[^a-z0-9-]/g, "").slice(0, 48),
          from,
          to,
          label: edge.label ? truncate(edge.label, 22) : undefined,
          variant: connections.length === 0 ? "emphasis" : /hmac|jwt|auth|firma|security/.test(hay) ? "security" : undefined,
          ...connectionSides(fromComp, toComp),
        });
      }
    }
  }

  connectOrphanNodes(components, connections);
  return connections;
}

function connectOrphanNodes(components, connections) {
  const linked = new Set(connections.flatMap((edge) => [edge.from, edge.to]));

  for (const component of components) {
    if (linked.has(component.id)) continue;
    const hub = components
      .filter((other) => other.id !== component.id)
      .filter((other) => Math.abs(other.row - component.row) <= 2)
      .filter((other) => !sameRowJump(component, other, components))
      .sort((left, right) => {
        const leftLinked = linked.has(left.id) ? 0 : 1;
        const rightLinked = linked.has(right.id) ? 0 : 1;
        if (leftLinked !== rightLinked) return leftLinked - rightLinked;
        const colDelta = Math.abs(left.col - component.col) - Math.abs(right.col - component.col);
        return colDelta || Math.abs(left.row - component.row) - Math.abs(right.row - component.row);
      })[0];
    if (!hub) continue;
    const from = component.row <= hub.row ? component : hub;
    const to = from === component ? hub : component;
    connections.push({
      id: `c${connections.length}-o-${from.id.slice(0, 8)}-${to.id.slice(0, 8)}`
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 48),
      from: from.id,
      to: to.id,
      ...connectionSides(from, to),
    });
    linked.add(component.id);
    linked.add(hub.id);
  }
}

function truncate(text, max = 32) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1)}…`;
}

function itemLabel(item) {
  const trimmed = item.replace(/^[/\s]+/, "").trim();
  const primary = trimmed.split(/[/:]/)[0]?.trim() || trimmed;
  return truncate(primary || item, 18);
}

function itemSublabel(item) {
  return truncate(item.replace(/^[/\s]+/, "").trim(), 40);
}

function pairLayers(layers) {
  const rows = [];
  for (let i = 0; i < layers.length; i += 1) {
    const layer = layers[i];
    const next = layers[i + 1];
    if (
      layer.lane &&
      next?.lane &&
      layer.lane !== next.lane &&
      !rows.at(-1)?.some((entry) => entry.lane)
    ) {
      rows.push([layer, next]);
      i += 1;
      continue;
    }
    rows.push([layer]);
  }
  return rows;
}

function layersToArchify(project) {
  const layers = project.architectureLayers;
  if (!layers?.length) return null;

  const components = [];
  const hints = {};
  const boundaries = [];
  const rawById = new Map();
  const layerAnchors = [];
  let gridRow = 1;

  for (const rowLayers of pairLayers(layers)) {
    const boundaryIds = [];
    const rowAnchors = [];
    const split = rowLayers.length > 1;
    const slots = split ? [0, 4] : [1];

    rowLayers.forEach((layer, laneIndex) => {
      const colStart = slots[laneIndex] ?? 1;
      const maxCols = split ? 3 : 5;
      const span = Math.min(layer.items.length, maxCols);
      const offset = Math.max(0, Math.floor((maxCols - span) / 2));
      const laneIds = [];

      layer.items.slice(0, maxCols).forEach((item, index) => {
        const id = slugify(`${layer.name}-${item}-${index}`);
        const col = colStart + offset + index;
        const type = inferType(layer.name, item);
        components.push({
          id,
          type,
          label: itemLabel(item),
          sublabel: itemSublabel(item),
          row: gridRow,
          col,
        });
        rawById.set(id, item);
        hints[id] = hintFromItem(project, { id, type, label: itemLabel(item), sublabel: itemSublabel(item) }, layer.name, item);
        laneIds.push(id);
        rowAnchors.push(id);
      });

      boundaryIds.push(...laneIds);
      boundaries.push({
        kind: "region",
        label: layer.name,
        wraps: laneIds,
      });
    });

    layerAnchors.push(rowAnchors[Math.floor(rowAnchors.length / 2)] ?? boundaryIds[0]);
    gridRow += 2;
  }

  let connections = connectionsFromMermaid(project, components, rawById);
  if (!connections.length) {
    for (let i = 0; i < layerAnchors.length - 1; i += 1) {
      const from = layerAnchors[i];
      const to = layerAnchors[i + 1];
      if (!from || !to) continue;
      connections.push({
        id: `flow-${i}`,
        from,
        to,
        variant: i === 0 ? "emphasis" : undefined,
      });
    }
  }

  const cards = project.highlights?.slice(0, 3).map((item, index) => {
    const split = item.match(/^([^:]{4,48}):\s+(.+)$/);
    return {
      dot: CARD_DOTS[index] ?? "cyan",
      title: split?.[1] ?? `Resultado ${index + 1}`,
      items: [split?.[2] ?? item].map((line) => truncate(line, 96)),
    };
  });

  return {
    diagram: {
      schema_version: 1,
      diagram_type: "architecture",
      meta: {
        title: project.title,
        subtitle: truncate(project.tagline, 88),
        quality_profile: "showcase",
        output: `${project.slug}.html`,
      },
      layout: {
        mode: "grid",
        origin: [32, 72],
        cols: 7,
        gapX: 22,
        gapY: 84,
        cellW: 152,
        cellH: 58,
      },
      components,
      boundaries: boundaries.filter((entry) => entry.wraps.length > 0),
      connections,
      cards: cards?.length ? cards : undefined,
    },
    hints,
  };
}

function hintFromItem(project, component, layerName, rawItem) {
  const moduleMatch = project.modules?.find((module) => {
    const hay = normalizeHaystack(`${component.label} ${component.sublabel} ${component.id} ${rawItem}`);
    const tokens = normalizeHaystack(module.name).split(/\s+/).filter((token) => token.length > 4);
    return tokens.some((token) => hay.includes(token));
  });
  const colon = rawItem.match(/^([^:]{4,52}):\s+(.+)$/);
  return {
    title: component.label,
    subtitle: component.sublabel || layerName,
    kind: component.type,
    layer: layerName,
    body: moduleMatch?.description || colon?.[2] || rawItem.replace(/^[/\s]+/, "").trim(),
  };
}

function buildHints(project, components) {
  const hints = {};
  const layerEntries = [];

  for (const layer of project.architectureLayers ?? []) {
    layer.items.forEach((item, index) => {
      layerEntries.push({
        id: slugify(`${layer.name}-${item}-${index}`),
        layer: layer.name,
        item,
      });
    });
  }

  for (const component of components) {
    const layerEntry = layerEntries.find(
      (entry) =>
        entry.id === component.id ||
        itemLabel(entry.item) === component.label ||
        itemSublabel(entry.item) === component.sublabel,
    );
    hints[component.id] = hintFromItem(
      project,
      component,
      layerEntry?.layer ?? component.context ?? "Arquitectura",
      layerEntry?.item ?? component.sublabel ?? component.label,
    );
  }

  return hints;
}

function mergeHints(baseHints, overridePath) {
  if (!fs.existsSync(overridePath)) return baseHints;
  const override = JSON.parse(fs.readFileSync(overridePath, "utf8"));
  return { ...baseHints, ...override };
}

async function writeHints(slug, hints) {
  const hintsPath = path.join(outputDir, `${slug}.hints.json`);
  await fs.promises.writeFile(hintsPath, `${JSON.stringify(hints, null, 2)}\n`, "utf8");
}

async function finalizeDiagram(slug, outputPath, hints) {
  const html = await fs.promises.readFile(outputPath, "utf8");
  await fs.promises.writeFile(outputPath, patchDiagramEmbed(html, slug), "utf8");
  const overridePath = path.join(diagramsDir, `${slug}.hints.json`);
  await writeHints(slug, mergeHints(hints, overridePath));
}

async function loadProjects() {
  const mod = await import(pathToFileURL(path.join(root, "src/data/projects.ts")).href);
  return mod.projects;
}

function ensureArchify() {
  if (fs.existsSync(archifyBin)) return;
  console.error("Archify no está instalado. Ejecuta: pnpm diagrams:setup");
  process.exit(1);
}

function deliver(type, sourcePath, outputPath) {
  for (const quality of ["showcase", "standard"]) {
    const result = spawnSync(
      process.execPath,
      [archifyBin, "deliver", type, sourcePath, outputPath, "--quality", quality, "--json"],
      { encoding: "utf8" },
    );
    if (result.status === 0) {
      if (quality !== "showcase") {
        console.warn(`  ↳ entregado con calidad ${quality}`);
      }
      return true;
    }
    if (quality === "showcase") {
      console.error(result.stdout || result.stderr || `Falló ${sourcePath} (showcase)`);
    }
  }
  return false;
}

async function main() {
  ensureArchify();
  await fs.promises.mkdir(diagramsDir, { recursive: true });
  await fs.promises.mkdir(outputDir, { recursive: true });

  const projects = await loadProjects();
  let ok = 0;
  let skipped = 0;

  for (const project of projects) {
    if (!project.architectureLayers?.length && !project.architecture) {
      skipped += 1;
      continue;
    }

    const customPath = path.join(diagramsDir, `${project.slug}.architecture.json`);
    const generated = layersToArchify(project);
    const sourcePath = path.join(diagramsDir, `${project.slug}.generated.architecture.json`);
    const outputPath = path.join(outputDir, `${project.slug}.html`);

    if (fs.existsSync(customPath)) {
      const custom = JSON.parse(fs.readFileSync(customPath, "utf8"));
      if (!deliver("architecture", customPath, outputPath)) continue;
      await finalizeDiagram(project.slug, outputPath, buildHints(project, custom.components ?? []));
      console.log(`✓ ${project.slug} (custom)`);
      ok += 1;
      continue;
    }

    if (!generated) {
      skipped += 1;
      continue;
    }

    await fs.promises.writeFile(sourcePath, `${JSON.stringify(generated.diagram, null, 2)}\n`, "utf8");
    if (!deliver("architecture", sourcePath, outputPath)) continue;
    await finalizeDiagram(project.slug, outputPath, generated.hints);
    console.log(`✓ ${project.slug}`);
    ok += 1;
  }

  console.log(`\nDiagramas listos: ${ok}. Omitidos: ${skipped}.`);
  if (!ok) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
