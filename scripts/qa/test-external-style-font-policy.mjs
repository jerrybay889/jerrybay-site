#!/usr/bin/env node
/**
 * F-006 adversarial self-test for scripts/qa/external-style-font-policy.mjs.
 *
 * Operates entirely on in-memory fixture strings. Never reads, writes, or
 * mutates any committed product HTML/CSS file.
 *
 * PASS requires BOTH:
 *   - every malicious fixture is detected (>=1 violation)
 *   - every allowed fixture remains clean (0 violations)
 * Exit 0 only when both hold; otherwise exit 1.
 */

import { findExternalStyleFontViolations } from "./external-style-font-policy.mjs";

const MALICIOUS = [
  {
    id: "1-html-remote-stylesheet-https",
    source: "html",
    text: '<link rel="stylesheet" href="https://cdn.example.test/assets/site.css">',
  },
  {
    id: "2-html-remote-stylesheet-protocol-relative",
    source: "html",
    text: '<link rel="stylesheet" href="//cdn.example.test/assets/site.css">',
  },
  {
    id: "3-css-remote-import-url-form",
    source: "css",
    text: '@import url("https://cdn.example.test/assets/type.css");',
  },
  {
    id: "4-css-remote-import-bare-string-form",
    source: "css",
    text: '@import "https://cdn.example.test/assets/type.css";',
  },
  {
    id: "5-css-remote-font-face-src-url",
    source: "css",
    text: '@font-face { font-family: "X"; src: url("https://cdn.example.test/assets/x.woff2") format("woff2"); }',
  },
  {
    id: "6-css-remote-font-face-src-list-mixed-with-local",
    source: "css",
    text: '@font-face { font-family: "X"; src: local("X"), url("https://cdn.example.test/assets/x.woff2") format("woff2"); }',
  },
  {
    id: "7-html-inline-style-remote-import",
    source: "html",
    text: '<style>@import url("https://cdn.example.test/assets/type.css");</style>',
  },
  {
    id: "8-html-inline-style-remote-font-face",
    source: "html",
    text: '<style>@font-face { font-family: "X"; src: url("https://cdn.example.test/assets/x.woff2"); }</style>',
  },
  {
    id: "9a-mixed-case-protocol-and-rel",
    source: "html",
    text: '<link REL="StyleSheet" HREF="HTTPS://CDN.EXAMPLE.TEST/assets/site.css">',
  },
  {
    id: "9b-whitespace-variation-import",
    source: "css",
    text: '@import   url(  "https://cdn.example.test/assets/type.css"   ) ;',
  },
  {
    id: "9c-preload-as-font-remote",
    source: "html",
    text: '<link rel="preload" as="font" href="https://cdn.example.test/assets/x.woff2" crossorigin>',
  },
  {
    id: "9d-preload-as-style-remote",
    source: "html",
    text: '<link rel="preload" as="style" href="https://cdn.example.test/assets/site.css">',
  },
  {
    id: "9e-known-google-fonts-stylesheet",
    source: "html",
    text: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">',
  },
  {
    id: "9f-known-gstatic-font-face",
    source: "css",
    text: '@font-face { src: url("https://fonts.gstatic.com/s/inter/v20/x.woff2") format("woff2"); }',
  },
  {
    id: "9g-single-quoted-import",
    source: "css",
    text: "@import url('https://cdn.example.test/assets/type.css');",
  },
];

const ALLOWED = [
  {
    id: "a1-local-absolute-stylesheet",
    source: "html",
    text: '<link rel="stylesheet" href="/assets/css/site.css">',
  },
  {
    id: "a2-relative-font-url-in-font-face",
    source: "css",
    text: '@font-face { font-family: "X"; src: url("../assets/font.woff2") format("woff2"); }',
  },
  {
    id: "a3-system-font-stack-no-url",
    source: "css",
    text: '--font-body: system-ui, -apple-system, "Segoe UI", "Noto Sans KR", sans-serif;',
  },
  {
    id: "a4-ordinary-external-anchor-link",
    source: "html",
    text: '<a href="https://example.com">External reference</a>',
  },
  {
    id: "a5-bare-preconnect-loads-nothing",
    source: "html",
    text: '<link rel="preconnect" href="https://example.com">',
  },
  {
    id: "a6-data-url-font-face",
    source: "css",
    text: "@font-face { font-family: \"X\"; src: url(data:font/woff2;base64,AAAA) format(\"woff2\"); }",
  },
  {
    id: "a7-local-import",
    source: "css",
    text: '@import url("/assets/css/extra.css");',
  },
];

let failed = 0;
const results = [];

for (const f of MALICIOUS) {
  const violations = findExternalStyleFontViolations(f.text, { source: f.source, fileLabel: f.id });
  const ok = violations.length > 0;
  if (!ok) failed++;
  results.push({ group: "malicious", id: f.id, ok, detail: ok ? violations.map((v) => v.mechanism).join(",") : "NOT DETECTED" });
}

for (const f of ALLOWED) {
  const violations = findExternalStyleFontViolations(f.text, { source: f.source, fileLabel: f.id });
  const ok = violations.length === 0;
  if (!ok) failed++;
  results.push({ group: "allowed", id: f.id, ok, detail: ok ? "" : violations.map((v) => `${v.mechanism}:${v.url}`).join(",") });
}

const pad = (s, n) => String(s).padEnd(n);
console.log("\nF-006 adversarial self-test — external-style-font-policy.mjs\n" + "=".repeat(78));
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  [${r.group}]  ${pad(r.id, 42)} ${r.detail}`);
}
console.log("=".repeat(78));
console.log(`${results.length - failed}/${results.length} fixtures behaved correctly `
  + `(${MALICIOUS.length} malicious must be detected, ${ALLOWED.length} allowed must stay clean).\n`);

process.exit(failed ? 1 : 0);
