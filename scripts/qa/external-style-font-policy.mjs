/**
 * JERRYBAY Phase 1 — external stylesheet / remote font policy.
 *
 * F-006 remediation: the prior guard (validate-site.mjs check 16, pre-fix)
 * was a host/vendor-name denylist (fonts.googleapis.com, Material Symbols,
 * etc.). It proved the *specific* Google Fonts URLs were gone but could not
 * reject the general mechanism class — any ordinary remote stylesheet,
 * remote `@import`, or remote `@font-face src: url(...)` from *any* origin
 * bypassed it undetected, so a future regression equivalent to F-003 could
 * reintroduce the same performance failure under a different domain.
 *
 * This module detects the mechanism, not the vendor:
 *   - <link> tags that actually load a stylesheet or font (rel~=stylesheet,
 *     or rel=preload with as=style|font) whose href is remote
 *     (http:, https:, or protocol-relative //)
 *   - CSS @import whose target is remote
 *   - CSS @font-face blocks whose `src:` list contains any remote url(...),
 *     even when mixed with a local `local(...)` entry in the same list
 *   - the above two also inside inline <style> blocks in HTML
 *
 * Policy: zero remote stylesheets/fonts unless explicitly allowlisted below
 * with documented Owner approval. The allowlist is empty by default.
 *
 * Explicitly NOT flagged (by design, not oversight):
 *   - ordinary <a href="https://..."> links — not a stylesheet/font load
 *   - bare <link rel="preconnect"|"dns-prefetch"> — a connection hint that
 *     loads no resource by itself
 *   - data: URLs — not a remote-network request
 *   - local/relative paths — the allowed, intended case
 */

/** Owner-approved remote origins for stylesheet/font loading. Empty by default. */
export const ALLOWLISTED_ORIGINS = [];

const REMOTE_URL_RE = /^(?:https?:)?\/\//i;

function isRemote(url) {
  const trimmed = (url || "").trim();
  if (!REMOTE_URL_RE.test(trimmed)) return false;
  return !ALLOWLISTED_ORIGINS.some((origin) => trimmed.toLowerCase().startsWith(origin.toLowerCase()));
}

/** Every attribute="value" pair on a tag, case-insensitive keys. */
function parseAttrs(tagSrc) {
  const attrs = {};
  const re = /([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let m;
  while ((m = re.exec(tagSrc))) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return attrs;
}

/** Scans raw CSS text for remote @import and remote @font-face src urls. */
function findCssViolations(cssText, violations, fileLabel) {
  // @import url(...) or @import "..." — remote target.
  const importRe = /@import\s+(?:url\(\s*(['"]?)([^)'"]+)\1\s*\)|(['"])([^'"]+)\3)/gi;
  let m;
  while ((m = importRe.exec(cssText))) {
    const url = m[2] ?? m[4] ?? "";
    if (isRemote(url)) {
      violations.push({
        file: fileLabel, mechanism: "remote-import", url,
        snippet: m[0].slice(0, 120),
      });
    }
  }

  // @font-face { ... } blocks — @font-face bodies don't nest, so a
  // non-greedy match to the next "}" is sufficient.
  const fontFaceRe = /@font-face\s*\{([^}]*)\}/gi;
  let ff;
  while ((ff = fontFaceRe.exec(cssText))) {
    const body = ff[1];
    const srcRe = /src\s*:\s*([^;]+);?/gi;
    let sm;
    while ((sm = srcRe.exec(body))) {
      const srcList = sm[1];
      const urlRe = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi;
      let um;
      while ((um = urlRe.exec(srcList))) {
        const url = um[2];
        if (isRemote(url)) {
          violations.push({
            file: fileLabel, mechanism: "remote-font-face", url,
            snippet: sm[0].slice(0, 160),
          });
        }
      }
    }
  }
}

/**
 * Scans raw HTML text (a full page or an inline <style> body's owner page)
 * for remote stylesheet/font <link> tags, then recurses into every inline
 * <style> block's content as CSS.
 */
export function findExternalStyleFontViolations(text, { source = "html", fileLabel = "" } = {}) {
  const violations = [];

  if (source === "css") {
    findCssViolations(text, violations, fileLabel);
    return violations;
  }

  // source === "html"
  const linkRe = /<link\b[^>]*>/gi;
  let lm;
  while ((lm = linkRe.exec(text))) {
    const attrs = parseAttrs(lm[0]);
    // F-006.1: canonicalize semantic attribute values (trim + lowercase)
    // before comparison. `rel` is tokenized so its own whitespace splitting
    // already tolerated stray leading/trailing space, but `as` is compared
    // with exact string equality — without trim(), `as="  style  "` never
    // equals "style" and the whole <link> silently evades classification
    // even though its href is remote. Both are normalized the same way here
    // so neither can drift out of sync again.
    const normalize = (v) => (v || "").trim().toLowerCase();
    const rel = normalize(attrs.rel);
    const relTokens = rel.split(/\s+/).filter(Boolean);
    const as = normalize(attrs.as);
    const href = attrs.href || "";

    const isStylesheetLink = relTokens.includes("stylesheet");
    const isFontOrStylePreload = relTokens.includes("preload") && (as === "font" || as === "style");

    if ((isStylesheetLink || isFontOrStylePreload) && isRemote(href)) {
      violations.push({
        file: fileLabel,
        mechanism: isStylesheetLink ? "remote-stylesheet" : "remote-font-preload",
        url: href,
        snippet: lm[0].slice(0, 160),
      });
    }
  }

  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let sm2;
  while ((sm2 = styleRe.exec(text))) {
    findCssViolations(sm2[1], violations, fileLabel);
  }

  return violations;
}
