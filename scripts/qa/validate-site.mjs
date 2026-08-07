#!/usr/bin/env node
/**
 * JERRYBAY — Public Production site validator.
 *
 * Deterministic, dependency-free. Run from the repo root:
 *   node scripts/qa/validate-site.mjs
 *
 * Exit code 0 = all checks passed. 1 = at least one FAIL.
 * This is a build-time contract check, not a substitute for browser QA.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { findExternalStyleFontViolations } from "./external-style-font-policy.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

const ROUTES = [
  { route: "/", file: "index.html" },
  { route: "/capabilities/", file: "capabilities/index.html" },
  { route: "/work/", file: "work/index.html" },
  { route: "/collaborate/", file: "collaborate/index.html" },
  { route: "/about/", file: "about/index.html" },
  { route: "/contact/", file: "contact/index.html" },
  { route: "/privacy/", file: "privacy/index.html" },
];

const DEFAULT_PRIMARY_CTA = "조직 AI 적용 상담 요청";
const PRIMARY_CTA_BY_ROUTE = new Map([
  ["/", "프로젝트·컨설팅 문의"],
]);

const results = [];
let failed = 0;

function check(id, name, ok, detail = "") {
  results.push({ id, name, ok, detail });
  if (!ok) failed++;
}

function read(file) {
  return readFileSync(join(ROOT, file), "utf8");
}

/** Strip <script>/<style> so text checks only see rendered copy. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function walkHtml(dir, acc = []) {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = posix.join(dir, entry.name);
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "docs") continue;
    if (entry.isDirectory()) walkHtml(rel, acc);
    else if (entry.name.endsWith(".html")) acc.push(rel.replace(/^\.\//, ""));
  }
  return acc;
}

// ---------------------------------------------------------------------------
// 1. Exactly 7 route entry HTML files, and no stray public HTML.
// ---------------------------------------------------------------------------
const missing = ROUTES.filter((r) => !existsSync(join(ROOT, r.file)));
check("01a", "7개 route 파일이 모두 존재", missing.length === 0,
  missing.map((r) => r.file).join(", "));

const allHtml = walkHtml(".").sort();
const expected = ROUTES.map((r) => r.file).sort();
const stray = allHtml.filter((f) => !expected.includes(f));
check("01b", "public HTML 파일이 정확히 7개 (stray 없음)",
  allHtml.length === 7 && stray.length === 0,
  stray.length ? `stray: ${stray.join(", ")}` : `count=${allHtml.length}`);

// Load every page once.
const pages = ROUTES.filter((r) => existsSync(join(ROOT, r.file)))
  .map((r) => ({ ...r, html: read(r.file) }))
  .map((p) => ({ ...p, text: visibleText(p.html) }));

// ---------------------------------------------------------------------------
// 2. Head contract: title, description, viewport, no noindex/nofollow.
// ---------------------------------------------------------------------------
for (const p of pages) {
  const hasTitle = /<title>\s*\S[\s\S]*?<\/title>/i.test(p.html);
  const hasDesc = /<meta\s+name="description"\s+content="[^"]{20,}"/i.test(p.html);
  const hasViewport = /<meta\s+name="viewport"\s+content="[^"]*width=device-width/i.test(p.html);
  const hasNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(p.html);
  check(`02:${p.route}`, `head 계약 (title/description/viewport/no-noindex)`,
    hasTitle && hasDesc && hasViewport && !hasNoindex,
    [!hasTitle && "title", !hasDesc && "description", !hasViewport && "viewport",
     hasNoindex && "noindex meta 잔존"].filter(Boolean).join(", "));
}

// ---------------------------------------------------------------------------
// 3. Primary CTA wording is exact, and 4. nothing competes with it.
// ---------------------------------------------------------------------------
const CTA_RE = /<a\b[^>]*class="[^"]*\bbtn--primary\b[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
for (const p of pages) {
  const labels = [...p.html.matchAll(CTA_RE)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  if (p.route === "/privacy/") {
    check(`03:${p.route}`, "Privacy는 상업 CTA를 노출하지 않음", labels.length === 0,
      labels.join(" | "));
    continue;
  }
  const expectedCta = PRIMARY_CTA_BY_ROUTE.get(p.route) || DEFAULT_PRIMARY_CTA;
  const allExact = labels.length > 0 && labels.every((l) => l === expectedCta);
  check(`03:${p.route}`, `Primary CTA 문구가 정확히 "${expectedCta}"`, allExact,
    labels.length ? labels.join(" | ") : "primary CTA 없음");
}

// A competing primary must not appear as a second gradient-filled button style.
const primaryClassDefs = (read("assets/css/site.css").match(/\.btn--primary\b/g) || []).length;
const otherFilledCta = /\.btn--[a-z]+\s*\{[^}]*linear-gradient/gi;
const cssText = read("assets/css/site.css");
const gradientButtons = [...cssText.matchAll(/\.(btn--[a-z]+)\s*\{[^}]*linear-gradient[^}]*\}/gi)]
  .map((m) => m[1]);
check("04", "gradient primary 버튼 스타일이 하나뿐",
  gradientButtons.length === 1 && gradientButtons[0] === "btn--primary",
  gradientButtons.join(", ") || `defs=${primaryClassDefs}`);

// ---------------------------------------------------------------------------
// 5/6/7. Link + asset resolution, no href="#".
// ---------------------------------------------------------------------------
const routeSet = new Set(ROUTES.map((r) => r.route));
for (const p of pages) {
  const hrefs = [...p.html.matchAll(/\b(?:href|src)="([^"]*)"/g)].map((m) => m[1]);
  const bad = [];
  for (const h of hrefs) {
    if (h === "#") { bad.push('href="#"'); continue; }
    if (/^(https?:|mailto:|tel:|data:)/i.test(h)) continue;
    const [pathOnly] = h.split("#");
    if (!pathOnly) continue;
    if (!pathOnly.startsWith("/")) { bad.push(`relative: ${h}`); continue; }
    if (routeSet.has(pathOnly)) continue;
    if (!existsSync(join(ROOT, pathOnly.replace(/^\//, "")))) bad.push(`unresolved: ${h}`);
  }
  check(`05:${p.route}`, "내부 링크·에셋 경로가 모두 해석됨 (href=\"#\" 없음)",
    bad.length === 0, bad.join(", "));
}

// ---------------------------------------------------------------------------
// 8. No invented privacy dates / retention / officer contact.
// The approved Privacy effective date (released 2026-08-07) is the one
// concrete date exempted from the fabrication scan; check 13b asserts it
// appears verbatim instead of being flagged as invented.
// ---------------------------------------------------------------------------
const APPROVED_EFFECTIVE_DATE = "시행일: 2026년 8월 7일";
const FABRICATED_LEGAL = [
  { re: /privacy@/i, label: "전용 privacy 이메일" },
  { re: /시행일\s*[::]\s*\S/, label: "시행일 값" },
  { re: /개정일\s*[::]\s*\S/, label: "개정일 값" },
  { re: /보유\s*기간\s*[::]\s*\S/, label: "보유기간 값" },
  { re: /\d+\s*년\s*(?:간)?\s*보(?:유|관)/, label: "N년 보유 문구" },
  { re: /개인정보\s*보호책임자\s*[::]\s*\S/, label: "보호책임자 값" },
  { re: /운영팀/, label: "미확정 운영 주체 명칭" },
  { re: /\d{4}\s*년\s*\d{1,2}\s*월\s*\d{1,2}\s*일/, label: "구체적 법률 날짜" },
];
for (const p of pages) {
  const scrubbed = p.text.split(APPROVED_EFFECTIVE_DATE).join(" ");
  const hits = FABRICATED_LEGAL.filter((f) => f.re.test(scrubbed)).map((f) => f.label);
  check(`08:${p.route}`, "임의 생성된 법률 정보 없음 (승인된 시행일 제외)", hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 9. Prohibited unverified claim patterns.
// ---------------------------------------------------------------------------
const PROHIBITED = [
  { re: /\d+\s*인\s*(?:대상|교육|참여)/, label: "인원 수 주장" },
  { re: /\d+\s*개?\s*(?:조직|기업|기관|스타트업)/, label: "조직 수 주장" },
  { re: /\d+\s*회차/, label: "회차 수 주장" },
  { re: /실제\s*운영\s*완료/, label: "운영 완료 주장" },
  { re: /성과\s*검증/, label: "성과 검증 주장" },
  { re: /검증\s*완료/, label: "검증 완료 주장" },
  { re: /파일럿\s*(?:성공|완료)/, label: "파일럿 성공 주장" },
  { re: /매출\s*\d/, label: "매출 수치" },
  { re: /(?:전환율|효율)\s*\d+\s*%/, label: "성과 퍼센트" },
  { re: /\d+\s*%\s*(?:향상|개선|증가|절감)/, label: "개선율 주장" },
  { re: /(?:고객|참여자|수강생)\s*(?:후기|추천사)/, label: "추천사" },
];
// 가격·기간·통화 시간은 승인된 Commercial Lock 값이므로 예외.
const ALLOWED_NUMERIC = /₩[\d,]+|\d+–\d+\s*(?:주|분)|Books\s*01|1999년/g;
for (const p of pages) {
  const scrubbed = p.text.replace(ALLOWED_NUMERIC, " ");
  const hits = PROHIBITED.filter((c) => c.re.test(scrubbed)).map((c) => c.label);
  check(`09:${p.route}`, "미검증 실적/성과 주장 패턴 없음", hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 10. Every Work card carries a status chip and a claim boundary.
// ---------------------------------------------------------------------------
const workPage = pages.find((p) => p.route === "/work/");
if (workPage) {
  const cards = [...workPage.html.matchAll(/<article\b[\s\S]*?<\/article>/gi)].map((m) => m[0]);
  const okCards = cards.filter(
    (c) => /class="chip"/.test(c) &&
           /(BUILT|PROTOTYPED|DESIGNED|PROVEN|EXPLORING)/.test(c) &&
           /Public Claim Boundary/.test(c) &&
           /Current Status/.test(c)
  );
  check("10", "Work 카드 전부가 status + claim boundary 보유",
    cards.length === 3 && okCards.length === 3, `cards=${cards.length}, ok=${okCards.length}`);

  // PROVEN must not appear without an evidence id.
  check("10b", "Evidence 없는 PROVEN 라벨 없음", !/\bPROVEN\b/.test(workPage.text.replace(/PROVEN은[\s\S]{0,80}/, "")), "");
}

// ---------------------------------------------------------------------------
// 11. Body font-size floor: no rule below 0.875rem / 14px.
// ---------------------------------------------------------------------------
const fontSizes = [...cssText.matchAll(/font-size:\s*([\d.]+)(rem|px)/g)].map((m) => ({
  raw: m[0],
  px: m[2] === "rem" ? parseFloat(m[1]) * 16 : parseFloat(m[1]),
}));
const tooSmall = fontSizes.filter((f) => f.px < 14);
const bodyRule = /body\s*\{[^}]*font-size:\s*1rem/.test(cssText);
check("11", "body 16px 기준, 모든 font-size >= 14px",
  bodyRule && tooSmall.length === 0,
  tooSmall.map((f) => f.raw).join(", ") || (bodyRule ? "" : "body font-size 규칙 없음"));

// Inline font-size overrides are not allowed.
for (const p of pages) {
  check(`11b:${p.route}`, "inline font-size 오버라이드 없음",
    !/style="[^"]*font-size/i.test(p.html), "");
}

// ---------------------------------------------------------------------------
// 12. Landmarks, heading order, skip link, lang.
// ---------------------------------------------------------------------------
for (const p of pages) {
  const hasLang = /<html\s+lang="ko"/.test(p.html);
  const hasSkip = /class="skip-link"\s+href="#main"/.test(p.html);
  const landmarks = ["<header", "<nav", '<main id="main"', "<footer"].every((t) => p.html.includes(t));
  const h1s = (p.html.match(/<h1\b/g) || []).length;

  const order = [...p.html.matchAll(/<h([1-4])\b/g)].map((m) => Number(m[1]));
  let jump = "";
  for (let i = 1; i < order.length; i++) {
    if (order[i] - order[i - 1] > 1) { jump = `h${order[i - 1]} → h${order[i]}`; break; }
  }

  check(`12:${p.route}`, "landmark/skip link/h1 1개/heading 단계 준수",
    hasLang && hasSkip && landmarks && h1s === 1 && !jump,
    [!hasLang && "lang", !hasSkip && "skip-link", !landmarks && "landmark",
     h1s !== 1 && `h1=${h1s}`, jump && `heading jump ${jump}`].filter(Boolean).join(", "));

  // Mobile menu control must be wired for assistive tech.
  const navOk = /data-nav-toggle[^>]*aria-expanded="false"[^>]*aria-controls="primary-nav"/.test(p.html)
    && /<nav class="nav" id="primary-nav"/.test(p.html);
  check(`12b:${p.route}`, "모바일 메뉴 버튼 aria 연결", navOk, "");

  // Preview banner must be gone in public production.
  check(`12c:${p.route}`, "PRIVATE PREVIEW 배너 부재",
    !p.html.includes('class="preview-banner"') &&
    !p.text.includes("PRIVATE PREVIEW · NOT FOR PUBLIC RELEASE"), "");
}

// Every img needs alt text.
for (const p of pages) {
  const imgs = [...p.html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((i) => !/\balt=/.test(i));
  check(`12d:${p.route}`, "모든 img에 alt 존재", noAlt.length === 0, noAlt.join(" "));
}

// ---------------------------------------------------------------------------
// 13. Privacy carries the approved G3C canonical disclosures.
// ---------------------------------------------------------------------------
const privacy = pages.find((p) => p.route === "/privacy/");
const REQUIRED_PRIVACY_TERMS = [
  "㈜글로보더",
  "이름, 전화번호",
  "90일",
  "Tally",
  "Belgium",
  "jerrybay889@gmail.com",
];
const privacyMissing = REQUIRED_PRIVACY_TERMS.filter((t) => !privacy?.text.includes(t));
check("13", "Privacy 필수 공개 항목 존재 (개인정보처리자/필수항목/보유기간/외부처리자/국외이전/권리행사연락처)",
  !!privacy && privacyMissing.length === 0, privacyMissing.join(", "));

check("13b", `Privacy가 승인된 시행일을 정확히 표기 ("${APPROVED_EFFECTIVE_DATE}")`,
  !!privacy && privacy.text.includes(APPROVED_EFFECTIVE_DATE), "");

// ---------------------------------------------------------------------------
// 14. robots.txt permits public crawling.
// ---------------------------------------------------------------------------
const robots = existsSync(join(ROOT, "robots.txt")) ? read("robots.txt") : "";
check("14", "robots.txt가 공개 크롤링을 허용 (Disallow: / 없음)",
  /User-agent:\s*\*/i.test(robots) && /^\s*Allow:\s*\/\s*$/im.test(robots) &&
  !/^\s*Disallow:\s*\/\s*$/im.test(robots), "");

// ---------------------------------------------------------------------------
// 14b. vercel.json carries no noindex/nofollow X-Robots-Tag header.
// ---------------------------------------------------------------------------
const vercelJson = existsSync(join(ROOT, "vercel.json")) ? read("vercel.json") : "";
check("14b", "vercel.json에 X-Robots-Tag noindex/nofollow 없음",
  !/X-Robots-Tag/i.test(vercelJson) || !/noindex|nofollow/i.test(vercelJson), "");

// ---------------------------------------------------------------------------
// 14c. Zero internal workflow markers in visible public copy.
// ---------------------------------------------------------------------------
const INTERNAL_MARKERS = ["PRIVATE PREVIEW", "NOT FOR PUBLIC RELEASE", "OWNER REVIEW REQUIRED", "Phase 1"];
for (const p of pages) {
  const hits = INTERNAL_MARKERS.filter((m) => p.text.includes(m) || p.html.includes(m));
  check(`14c:${p.route}`, "내부 워크플로 마커 0개 (PRIVATE PREVIEW/NOT FOR PUBLIC RELEASE/OWNER REVIEW REQUIRED/Phase 1)",
    hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 15. Deferred scope must be absent.
// ---------------------------------------------------------------------------
const deferredDirs = ["ideas-lab", "books", "newsletter", "search", "admin", "dashboard", "api"];
const presentDirs = deferredDirs.filter((d) => existsSync(join(ROOT, d)));
check("15a", "Phase 1.5+ 라우트 디렉터리 없음", presentDirs.length === 0, presentDirs.join(", "));

const deferredLinks = pages.flatMap((p) =>
  deferredDirs.filter((d) => new RegExp(`href="/${d}`).test(p.html)).map((d) => `${p.route}→/${d}`)
);
check("15b", "Ideas Lab 등 이연 라우트 링크 없음", deferredLinks.length === 0, deferredLinks.join(", "));

// Contact must not collect data in-page.
const contact = pages.find((p) => p.route === "/contact/");
check("15c", "Contact에 데이터 수집 form 없음",
  !!contact && !/<form\b/i.test(contact.html) && !/<input\b/i.test(contact.html), "");

// ---------------------------------------------------------------------------
// 16. Zero external font/icon-font network dependency (F-003 remediation).
// Independent review measured 18-19 Google Fonts requests / ~361-432KB
// causing Home Mobile DevTools Lighthouse Performance to fail at 60-61
// (threshold 75). The fix removed every Google Fonts <link> in favor of a
// system-font stack; this guard keeps it removed on every future edit.
// ---------------------------------------------------------------------------
const EXTERNAL_FONT_PATTERNS = [
  { re: /fonts\.googleapis\.com/i, label: "fonts.googleapis.com" },
  { re: /fonts\.gstatic\.com/i, label: "fonts.gstatic.com" },
  { re: /@import\s+url\([^)]*font/i, label: "remote @import font" },
  { re: /material[\s-]?symbols/i, label: "Material Symbols icon font" },
  { re: /material[\s-]?icons/i, label: "Material Icons icon font" },
  { re: /use\.typekit\.net|fast\.fonts\.net|fonts\.adobe\.com/i, label: "other external font CDN" },
];
for (const p of pages) {
  const hits = EXTERNAL_FONT_PATTERNS.filter((f) => f.re.test(p.html)).map((f) => f.label);
  check(`16:${p.route}`, "외부 font/icon-font 네트워크 요청 0개", hits.length === 0, hits.join(", "));
}
const cssHits = EXTERNAL_FONT_PATTERNS.filter((f) => f.re.test(cssText)).map((f) => f.label);
check("16:site.css", "site.css에 외부 font 참조 0개", cssHits.length === 0, cssHits.join(", "));

// ---------------------------------------------------------------------------
// 17. F-006 remediation: mechanism-class remote stylesheet/font guard.
// Check 16 above is a host/vendor-name denylist — it proves the *specific*
// Google Fonts URLs are gone but cannot reject an ordinary remote
// stylesheet, remote @import, or remote @font-face src from ANY origin.
// This check detects the mechanism itself (see external-style-font-policy.mjs
// for the full rationale and the adversarial self-test that proves it can't
// be bypassed by the four payloads an independent review demonstrated evade
// check 16: a remote <link rel="stylesheet">, a remote @import, a remote
// @font-face src url(), and the same inside an inline <style> block).
// ---------------------------------------------------------------------------
for (const p of pages) {
  const violations = findExternalStyleFontViolations(p.html, { source: "html", fileLabel: p.route });
  check(`17:${p.route}`, "외부 stylesheet/font 로딩 메커니즘 0개 (mechanism-class guard)",
    violations.length === 0,
    violations.map((v) => `${v.mechanism}:${v.url}`).join(", "));
}
const cssViolations = findExternalStyleFontViolations(cssText, { source: "css", fileLabel: "assets/css/site.css" });
check("17:site.css", "site.css에 외부 stylesheet/font 로딩 메커니즘 0개",
  cssViolations.length === 0,
  cssViolations.map((v) => `${v.mechanism}:${v.url}`).join(", "));

// ---------------------------------------------------------------------------
// 18. V4-G1 original-first home contract.
// ---------------------------------------------------------------------------
const home = pages.find((p) => p.route === "/");
const HOME_SECTION_IDS = [
  "hero", "expertise", "career", "projects", "lectures", "gov-projects", "press", "contact",
];
const missingHomeSections = HOME_SECTION_IDS.filter(
  (id) => !home || !new RegExp(`<section\\b[^>]*\\bid="${id}"`).test(home.html),
);
check("18a", "V4-G1 long-form 홈 8개 section 존재",
  !!home && missingHomeSections.length === 0,
  missingHomeSections.join(", "));

const HOME_COPY = [
  "25년 동안 디지털 사업을 기획하고 실행해왔습니다.",
  "지금은 AI로 새로운 제품과 업무 시스템을 만듭니다.",
  "AI Product Strategy · AI Consulting & Education · No-Code Product Build · Agentic Operations",
];
const missingHomeCopy = HOME_COPY.filter((copy) => !home?.text.includes(copy));
check("18b", "V4 Hero positioning 문구 정확",
  !!home && missingHomeCopy.length === 0,
  missingHomeCopy.join(" | "));

check("18c", "실제 profile.jpg를 eager image로 사용",
  !!home && /<img\b[^>]*src="\/assets\/profile\.jpg"[^>]*alt="[^"]+"[^>]*loading="eager"/i.test(home.html), "");

const HOME_ANCHORS = ["#projects", "#lectures", "#press"];
const missingHomeAnchors = HOME_ANCHORS.filter((href) => !home?.html.includes(`href="${href}"`));
check("18d", "구축·강의·기사 보조 CTA가 홈 anchor로 연결",
  !!home && missingHomeAnchors.length === 0,
  missingHomeAnchors.join(", "));

const BUILD_STATUSES = [
  "IN BUILD / PRODUCTION ITERATION",
  "IN BUILD / PRIVACY-GATED",
  "IN BUILD / RELEASE-GATED",
];
const missingBuildStatuses = BUILD_STATUSES.filter((status) => !home?.text.includes(status));
check("18e", "AIKUS·OMYQT·INVIT 상태 label 정확",
  !!home && missingBuildStatuses.length === 0,
  missingBuildStatuses.join(", "));

const HOME_FORBIDDEN = [
  "SSOT", "V4-G", "OWNER", "Evidence Contract", "IDEA DB", "기도제목", "test user",
];
const homeForbiddenHits = HOME_FORBIDDEN.filter((term) => home?.text.includes(term));
check("18f", "공개 홈에 내부 workflow·민감 marker 없음",
  !!home && homeForbiddenHits.length === 0,
  homeForbiddenHits.join(", "));

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const pad = (s, n) => String(s).padEnd(n);
console.log("\nJERRYBAY — Public Production QA\n" + "=".repeat(72));
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${pad(r.id, 22)} ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
}
console.log("=".repeat(72));
console.log(`${results.length - failed}/${results.length} checks passed.\n`);
process.exit(failed ? 1 : 0);
