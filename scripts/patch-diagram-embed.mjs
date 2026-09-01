/**
 * Inserta un puente postMessage en diagramas Archify embebidos del portafolio.
 */
const INLINE_EMBED_STYLE = `<style id="portfolio-inline-embed-style">
  html[data-embed="true"]:not([data-fullscreen-embed="true"]) {
    height: 100%;
  }
  html[data-embed="true"]:not([data-fullscreen-embed="true"]) body {
    height: 100%;
    min-height: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  html[data-embed="true"]:not([data-fullscreen-embed="true"]) .container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-width: none;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  html[data-embed="true"]:not([data-fullscreen-embed="true"]) .diagram-container {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
    padding: 0.5rem;
  }
  html[data-embed="true"]:not([data-fullscreen-embed="true"]) .diagram-container > svg {
    flex: 1 1 auto;
    width: 100% !important;
    height: 100% !important;
    max-width: 100%;
    max-height: 100%;
    min-width: 0;
    min-height: 0;
  }
</style>`;

const FULLSCREEN_EMBED_STYLE = `<style id="portfolio-fullscreen-embed-style">
  html[data-fullscreen-embed="true"] { height: 100%; }
  html[data-fullscreen-embed="true"] body {
    height: 100dvh;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  html[data-fullscreen-embed="true"] .container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-width: none;
    width: 100%;
    margin: 0;
  }
  html[data-fullscreen-embed="true"] .diagram-container {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
    padding: 0.75rem;
  }
  html[data-fullscreen-embed="true"] .diagram-container > svg {
    flex: 1 1 auto;
    width: 100% !important;
    height: 100% !important;
    max-width: 100%;
    max-height: 100%;
    min-width: 0;
    min-height: 0;
  }
</style>`;

function applyInlineEmbedPatch(html) {
  if (html.includes('portfolio-inline-embed-style')) {
    return html.replace(
      /<style id="portfolio-inline-embed-style">[\s\S]*?<\/style>/,
      INLINE_EMBED_STYLE.trim(),
    );
  }
  return html.includes('</head>')
    ? html.replace('</head>', `${INLINE_EMBED_STYLE}\n</head>`)
    : `${INLINE_EMBED_STYLE}\n${html}`;
}

function applyFullscreenEmbedPatch(html) {
  let next = html;
  if (!next.includes('data-fullscreen-embed')) {
    next = next.replace(
      `if (new URLSearchParams(window.location.search).get('present') === '1') {
            document.documentElement.setAttribute('data-present', 'true');
          }`,
      `if (new URLSearchParams(window.location.search).get('fullscreen') === '1') {
            document.documentElement.setAttribute('data-fullscreen-embed', 'true');
          }
          if (new URLSearchParams(window.location.search).get('present') === '1') {
            document.documentElement.setAttribute('data-present', 'true');
          }`,
    );
  }
  if (!next.includes('portfolio-fullscreen-embed-style')) {
    next = next.includes('</head>')
      ? next.replace('</head>', `${FULLSCREEN_EMBED_STYLE}\n</head>`)
      : `${FULLSCREEN_EMBED_STYLE}\n${next}`;
  }
  return next;
}

export function patchDiagramEmbed(html, slug) {
  let next = applyInlineEmbedPatch(html);
  next = applyFullscreenEmbedPatch(next);
  const bridge = `
<script id="portfolio-embed-bridge">
(function () {
  var ORIGIN = window.location.origin;
  var SLUG = ${JSON.stringify(slug)};
  var svg = null;

  function nodeLabel(node, fallback) {
    return node.getAttribute("data-node-label") || fallback;
  }

  function relationshipsFor(id) {
    if (!svg) return [];
    var byId = Object.create(null);
    svg.querySelectorAll("[data-node-id]").forEach(function (node) {
      byId[node.getAttribute("data-node-id")] = node;
    });
    var seen = Object.create(null);
    var out = [];
    svg.querySelectorAll("[data-edge-from][data-edge-to]").forEach(function (edge) {
      var from = edge.getAttribute("data-edge-from");
      var to = edge.getAttribute("data-edge-to");
      if (from !== id && to !== id) return;
      var key = edge.getAttribute("data-edge-key") || from + "->" + to;
      if (seen[key]) return;
      seen[key] = true;
      var neighborId = from === id ? to : from;
      var neighbor = byId[neighborId];
      out.push({
        id: neighborId,
        label: neighbor ? nodeLabel(neighbor, neighborId) : neighborId,
        direction: from === id ? "out" : "in",
        edgeLabel: edge.getAttribute("data-edge-label") || "",
      });
    });
    return out;
  }

  function send(payload) {
    try {
      window.parent.postMessage(Object.assign({ source: "portfolio-archify", slug: SLUG }, payload), ORIGIN);
    } catch (_) {}
  }

  function anchorFromNode(node, event) {
    if (event && typeof event.clientX === "number" && typeof event.clientY === "number") {
      return { x: event.clientX, y: event.clientY };
    }
    var rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function focusPayload(node, event) {
    var id = node.getAttribute("data-node-id");
    return {
      type: "node-focus",
      anchor: anchorFromNode(node, event),
      node: {
        id: id,
        label: nodeLabel(node, id),
        sublabel: node.getAttribute("data-node-sublabel") || "",
        kind: node.getAttribute("data-node-kind") || "",
        tag: node.getAttribute("data-node-tag") || "",
        context: node.getAttribute("data-node-context") || "",
        relationships: relationshipsFor(id),
      },
    };
  }

  function init() {
    svg = document.querySelector(".diagram-container svg");
    if (!svg) {
      window.setTimeout(init, 40);
      return;
    }
    var container = document.querySelector(".diagram-container");
    svg.addEventListener("click", function (event) {
      if (container && container.getAttribute("data-just-panned") === "true") return;
      var node = event.target.closest("[data-node-id]");
      if (!node) {
        if (window.Archify && window.Archify.focus && typeof window.Archify.focus.clear === "function") {
          window.Archify.focus.clear();
        }
        send({ type: "clear" });
        return;
      }
      send(focusPayload(node, event));
      if (window.Archify && window.Archify.focus && typeof window.Archify.focus.set === "function") {
        window.Archify.focus.set(node.getAttribute("data-node-id"));
      }
    });
    window.addEventListener("message", function (event) {
      if (event.origin !== ORIGIN) return;
      if (!event.data || event.data.source !== "portfolio-archify-host") return;
      if (event.data.type === "set-focus" && event.data.id && window.Archify && window.Archify.focus) {
        window.Archify.focus.set(event.data.id);
        var target = svg.querySelector('[data-node-id="' + event.data.id + '"]');
        if (target) send(focusPayload(target));
        if (window.Archify.view && typeof window.Archify.view.reveal === "function") {
          window.Archify.view.reveal([event.data.id], { includeNeighbors: true, reason: "focus" });
        }
      }
      if (event.data.type === "clear" && window.Archify && window.Archify.focus && typeof window.Archify.focus.clear === "function") {
        window.Archify.focus.clear();
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
</script>`;

  if (next.includes('id="portfolio-embed-bridge"')) {
    return next.replace(/<script id="portfolio-embed-bridge">[\s\S]*?<\/script>/, bridge.trim());
  }
  if (next.includes("</body>")) {
    return next.replace("</body>", `${bridge}\n</body>`);
  }
  return `${next}\n${bridge}`;
}
