#!/usr/bin/env node
/**
 * JERRYBAY — Personal Revenue Portfolio v3 site validator.
 *
 * Deterministic, dependency-free. Run from the repo root:
 *   node scripts/qa/validate-site.mjs
 *
 * Exit code 0 = all checks passed. 1 = at least one FAIL.
 * This is a build-time contract check, not a substitute for browser QA.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { findExternalStyleFontViolations } from "./external-style-font-policy.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

const ROUTES = [
  { route: "/", file: "index.html" },
  { route: "/resume/", file: "resume/index.html" },
  { route: "/work/", file: "work/index.html" },
  { route: "/lab/", file: "lab/index.html" },
  { route: "/insights/", file: "insights/index.html" },
  { route: "/books/", file: "books/index.html" },
  { route: "/contact/", file: "contact/index.html" },
  { route: "/privacy/", file: "privacy/index.html" },
];
const NAV_ROUTES = ROUTES.filter((r) => r.route !== "/privacy/"); // primary nav excludes Privacy (footer-only), same pattern as v2.
const CANONICAL_TALLY_URL = "https://tally.so/r/Y5bypd";
const APPROVED_EFFECTIVE_DATE = "시행일: 2026년 8월 7일";

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
// 1. Exactly 8 route entry HTML files (7 new IA routes + Privacy), no stray.
// ---------------------------------------------------------------------------
const missing = ROUTES.filter((r) => !existsSync(join(ROOT, r.file)));
check("01a", "8개 route 파일이 모두 존재 (7개 신규 IA + Privacy)", missing.length === 0,
  missing.map((r) => r.file).join(", "));

const allHtml = walkHtml(".").sort();
const expected = ROUTES.map((r) => r.file).sort();
const stray = allHtml.filter((f) => !expected.includes(f));
check("01b", "public HTML 파일이 정확히 8개 (stray 없음, 레거시 about/capabilities/collaborate 제거됨)",
  allHtml.length === 8 && stray.length === 0,
  stray.length ? `stray: ${stray.join(", ")}` : `count=${allHtml.length}`);

// Legacy route directories must be gone — they are replaced by vercel.json redirects.
const legacyDirs = ["about", "capabilities", "collaborate"].filter((d) => existsSync(join(ROOT, d)));
check("01c", "레거시 라우트 디렉터리 제거됨 (about/capabilities/collaborate)",
  legacyDirs.length === 0, legacyDirs.join(", "));

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
// 3. Primary CTA: v3 intentionally has multiple entry paths (Hire/B2B/
// Lecture/Build/Partnership), so there is no single sitewide CTA string.
// Instead: Home/Work/Lab/Insights/Books must each carry >=1 btn--primary,
// Contact/Privacy carry none (Contact IS the destination; Privacy stays
// commerce-free), and exactly one gradient-filled button style exists.
// ---------------------------------------------------------------------------
const PRIMARY_REQUIRED = new Set(["/", "/work/", "/lab/", "/insights/", "/books/"]);
const PRIMARY_NONE = new Set(["/contact/", "/privacy/"]);
const CTA_RE = /<a\b[^>]*class="[^"]*\bbtn--primary\b[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
for (const p of pages) {
  const labels = [...p.html.matchAll(CTA_RE)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  if (PRIMARY_NONE.has(p.route)) {
    check(`03:${p.route}`, "Contact/Privacy는 별도 상업 Primary CTA를 노출하지 않음", labels.length === 0,
      labels.join(" | "));
  } else if (PRIMARY_REQUIRED.has(p.route)) {
    check(`03:${p.route}`, "Primary CTA가 최소 1개 존재", labels.length > 0, "");
  }
}

const cssText = read("assets/css/site.css");
const gradientButtons = [...cssText.matchAll(/\.(btn--[a-z]+)\s*\{[^}]*linear-gradient[^}]*\}/gi)]
  .map((m) => m[1]);
check("04", "gradient primary 버튼 스타일이 하나뿐",
  gradientButtons.length === 1 && gradientButtons[0] === "btn--primary",
  gradientButtons.join(", "));

// ---------------------------------------------------------------------------
// 5. Link + asset resolution, no href="#".
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
// 6. Legacy redirects — vercel.json carries permanent redirects for the
// three retired v2 routes, each mapped into the new v3 IA.
// ---------------------------------------------------------------------------
const vercelJson = existsSync(join(ROOT, "vercel.json")) ? read("vercel.json") : "";
let vercelParsed = {};
try { vercelParsed = JSON.parse(vercelJson); } catch { /* handled by check below */ }
check("06a", "vercel.json이 유효한 JSON", Object.keys(vercelParsed).length > 0 || vercelJson === "", "");

const REQUIRED_REDIRECTS = [
  ["/about", "/resume/"], ["/about/", "/resume/"],
  ["/capabilities", "/contact/"], ["/capabilities/", "/contact/"],
  ["/collaborate", "/contact/"], ["/collaborate/", "/contact/"],
];
const redirects = Array.isArray(vercelParsed.redirects) ? vercelParsed.redirects : [];
const missingRedirects = REQUIRED_REDIRECTS.filter(
  ([source, destination]) =>
    !redirects.some((r) => r.source === source && r.destination === destination && r.permanent === true)
);
check("06b", "레거시 3개 라우트(about/capabilities/collaborate)가 permanent redirect로 매핑됨",
  missingRedirects.length === 0,
  missingRedirects.map(([s, d]) => `${s}→${d}`).join(", "));

// ---------------------------------------------------------------------------
// 7. Tally URL is unchanged everywhere it is used.
// ---------------------------------------------------------------------------
for (const p of pages) {
  const urls = [...p.html.matchAll(/https:\/\/tally\.so\/[^\s"'<>]*/g)].map((m) => m[0]);
  const wrong = urls.filter((u) => u !== CANONICAL_TALLY_URL);
  check(`07:${p.route}`, `Tally URL이 정확히 "${CANONICAL_TALLY_URL}"로 유지됨`,
    wrong.length === 0, wrong.join(", "));
}

// ---------------------------------------------------------------------------
// 8. No invented privacy dates / retention / officer contact.
// The approved Privacy effective date (released 2026-08-07) is the one
// concrete date exempted from the fabrication scan.
// ---------------------------------------------------------------------------
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
// 9. Prohibited unverified claim patterns (no invented KPI/testimonial).
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
// 가격·연도·기간·전화번호·프로젝트 건수는 승인된 값이므로 예외.
const ALLOWED_NUMERIC = /₩[\d,]+|\d+–\d+\s*(?:주|분)|Books\s*01|1999년|010-3878-9581|20\d\d(?:\.\d\d)?(?:\s*[~∼–-]\s*(?:현재|20\d\d(?:\.\d\d)?))?|\d+건|\d+년\s*(?:넘게|동안)/g;
for (const p of pages) {
  const scrubbed = p.text.replace(ALLOWED_NUMERIC, " ");
  const hits = PROHIBITED.filter((c) => c.re.test(scrubbed)).map((c) => c.label);
  check(`09:${p.route}`, "미검증 실적/성과 주장 패턴 없음", hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 10. Work cards: 3 P0 commercial cases, each with status + evidence link +
// claim boundary. Lab cards: >=3 self-built entries with truthful status,
// OMYQT specifically carries a live-proof link.
// ---------------------------------------------------------------------------
const workPage = pages.find((p) => p.route === "/work/");
if (workPage) {
  const cards = [...workPage.html.matchAll(/<article\b[\s\S]*?<\/article>/gi)].map((m) => m[0]);
  const okCards = cards.filter(
    (c) => /class="chip/.test(c) &&
           /PUBLIC VERIFIED/.test(c) &&
           /Public Claim Boundary/.test(c) &&
           /(Role Evidence|Public Proof)/.test(c) &&
           /https:\/\//.test(c)
  );
  check("10a", "Work에 P0 상용 프로젝트 카드 3개, 각각 status + 외부 근거 링크 + claim boundary 보유",
    cards.length === 3 && okCards.length === 3, `cards=${cards.length}, ok=${okCards.length}`);
}

const labPage = pages.find((p) => p.route === "/lab/");
if (labPage) {
  const cards = [...labPage.html.matchAll(/<article\b[\s\S]*?<\/article>/gi)].map((m) => m[0]);
  check("10b", "Lab에 자체 프로젝트 카드가 3개 이상", cards.length >= 3, `cards=${cards.length}`);
  const omyqt = cards.find((c) => /OMYQT/.test(c));
  check("10c", "OMYQT 카드가 실제 live 링크(omyqt.com)를 보유",
    !!omyqt && /https:\/\/www\.omyqt\.com\//.test(omyqt), "");
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

for (const p of pages) {
  check(`11b:${p.route}`, "inline font-size 오버라이드 없음",
    !/style="[^"]*font-size/i.test(p.html), "");
}

// ---------------------------------------------------------------------------
// 12. Landmarks, heading order, skip link, lang, nav completeness.
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

  const navOk = /data-nav-toggle[^>]*aria-expanded="false"[^>]*aria-controls="primary-nav"/.test(p.html)
    && /<nav class="nav" id="primary-nav"/.test(p.html);
  check(`12b:${p.route}`, "모바일 메뉴 버튼 aria 연결", navOk, "");

  // Primary nav must carry the 7 v3 IA links (Privacy stays footer-only).
  const navBlock = (p.html.match(/<nav class="nav" id="primary-nav"[\s\S]*?<\/nav>/) || [""])[0];
  const navLinkCount = (navBlock.match(/<a\s+href=/g) || []).length;
  check(`12e:${p.route}`, "주 메뉴에 v3 IA 7개 링크 (홈/Resume/Work/Lab/Insights/Books/Contact)",
    navLinkCount === 7, `count=${navLinkCount}`);
}

for (const p of pages) {
  const imgs = [...p.html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((i) => !/\balt=/.test(i));
  check(`12d:${p.route}`, "모든 img에 alt 존재", noAlt.length === 0, noAlt.join(" "));
}

// Home hero must carry the real portrait, above the Proof Strip section,
// as the build-time proxy for "Person -> Proof -> next action" ordering.
const home = pages.find((p) => p.route === "/");
if (home) {
  const heroIdx = home.html.indexOf('class="hero hero--profile"');
  const heroEndIdx = home.html.indexOf('</section>', heroIdx);
  const heroBlock = heroIdx >= 0 ? home.html.slice(heroIdx, heroEndIdx) : "";
  const portraitIdx = home.html.indexOf('src="/assets/profile.jpg"');
  const proofIdx = home.html.indexOf('id="proof-h"');
  const ctaInHero = heroBlock.includes('href="/contact/"');
  check("12f", "Home: 실제 portrait가 Hero에 존재하고, Hero -> Proof Strip 순서, Hero 안에 Contact CTA 포함",
    heroIdx >= 0 && portraitIdx > heroIdx && portraitIdx < heroEndIdx && proofIdx > heroEndIdx && ctaInHero,
    `hero=${heroIdx}, heroEnd=${heroEndIdx}, portrait=${portraitIdx}, proof=${proofIdx}, ctaInHero=${ctaInHero}`);
}

// ---------------------------------------------------------------------------
// 13. Privacy carries the approved canonical disclosures (unchanged substance).
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
// 14. robots.txt permits public crawling; vercel.json carries no noindex.
// ---------------------------------------------------------------------------
const robots = existsSync(join(ROOT, "robots.txt")) ? read("robots.txt") : "";
check("14", "robots.txt가 공개 크롤링을 허용 (Disallow: / 없음)",
  /User-agent:\s*\*/i.test(robots) && /^\s*Allow:\s*\/\s*$/im.test(robots) &&
  !/^\s*Disallow:\s*\/\s*$/im.test(robots), "");

check("14b", "vercel.json에 X-Robots-Tag noindex/nofollow 없음",
  !/X-Robots-Tag/i.test(vercelJson) || !/noindex|nofollow/i.test(vercelJson), "");

// ---------------------------------------------------------------------------
// 14c. Zero internal workflow markers in visible public copy.
// ---------------------------------------------------------------------------
const INTERNAL_MARKERS = ["PRIVATE PREVIEW", "NOT FOR PUBLIC RELEASE", "OWNER REVIEW REQUIRED", "Phase 1"];
for (const p of pages) {
  const hits = INTERNAL_MARKERS.filter((m) => p.text.includes(m) || p.html.includes(m));
  check(`14c:${p.route}`, "내부 워크플로 마커 0개",
    hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 14d. No registered business address on any JERRYBAY marketing/legal page.
// ---------------------------------------------------------------------------
const ADDRESS_MARKERS = ["구로구", "디지털로", "에이스하이엔드타워"];
for (const p of pages) {
  const hits = ADDRESS_MARKERS.filter((m) => p.text.includes(m));
  check(`14d:${p.route}`, "등록 사업장 주소 미노출", hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 14e. No sibling private repo URLs/paths exposed (AIKUS/INVIT/OMYQT/ORCA).
// ---------------------------------------------------------------------------
const REPO_LEAK_MARKERS = ["github.com/jerrybay889/aikus", "github.com/jerrybay889/invit_staging", "invit_staging", "aikus-full-service", "omyqt-app"];
for (const p of pages) {
  const hits = REPO_LEAK_MARKERS.filter((m) => p.html.toLowerCase().includes(m.toLowerCase()));
  check(`14e:${p.route}`, "형제 저장소 URL/경로 미노출", hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 14f. Books ships in v3, with a truthful checkout-pending state and no
// invented native checkout/payment.
// ---------------------------------------------------------------------------
const books = pages.find((p) => p.route === "/books/");
if (books) {
  check("14f", "Books가 '출시 준비 중' 상태를 정확히 표기", books.text.includes("출시 준비 중"), "");
  const paymentMarkers = ["latpeed.com/checkout", "stripe.com", "paypal.com", "toss", "결제하기", "구매하기"];
  const hits = paymentMarkers.filter((m) => books.html.toLowerCase().includes(m.toLowerCase()));
  check("14g", "Books에 미준비 상태의 결제/체크아웃 링크 없음", hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 14h. Contact has no in-page data-collection form (Tally remains the only
// collector, per the preserved Privacy substance).
// ---------------------------------------------------------------------------
const contact = pages.find((p) => p.route === "/contact/");
check("14h", "Contact에 데이터 수집 form 없음",
  !!contact && !/<form\b/i.test(contact.html) && !/<input\b/i.test(contact.html), "");

// ---------------------------------------------------------------------------
// 14i. No analytics/tracking script added anywhere (regression guard).
// ---------------------------------------------------------------------------
const TRACKING_MARKERS = ["gtag(", "googletagmanager", "google-analytics", "clarity.ms", "hotjar", "fbq(", "facebook.net/"];
for (const p of pages) {
  const hits = TRACKING_MARKERS.filter((m) => p.html.toLowerCase().includes(m.toLowerCase()));
  check(`14i:${p.route}`, "analytics/tracking 스크립트 없음", hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 14j. No CMS/backend/payment/auth/database framework markers.
// ---------------------------------------------------------------------------
const BACKEND_MARKERS = ["<form", "action=\"/api", "supabase.", "firebase.", "auth0.", "/wp-admin", "wp-content"];
for (const p of pages) {
  const hits = BACKEND_MARKERS.filter((m) => p.html.toLowerCase().includes(m.toLowerCase()));
  check(`14j:${p.route}`, "CMS/backend/auth/database 마커 없음", hits.length === 0, hits.join(", "));
}

// ---------------------------------------------------------------------------
// 15. Public evidence wall: >=5 external lecture/media links (Insights),
// and Insights/Home together must reach the P0 evidence-wall minimum.
// ---------------------------------------------------------------------------
const insights = pages.find((p) => p.route === "/insights/");
if (insights) {
  const evLinks = [...insights.html.matchAll(/class="evidence-list[^"]*"[\s\S]*?<\/ul>/g)]
    .flatMap((m) => [...m[0].matchAll(/href="(https:\/\/[^"]+)"/g)])
    .map((m) => m[1]);
  check("15a", "Insights Public Evidence Wall에 외부 링크 5개 이상", evLinks.length >= 5, `count=${evLinks.length}`);
  const badTarget = [...insights.html.matchAll(/<a\b[^>]*href="https:\/\/[^"]+"[^>]*>/g)]
    .map((m) => m[0])
    .filter((a) => !/target="_blank"/.test(a) || !/rel="noopener noreferrer"/.test(a));
  check("15b", "Insights 외부 링크가 모두 target=_blank rel=noopener noreferrer", badTarget.length === 0,
    badTarget.slice(0, 3).join(" | "));
}

// All external links sitewide must use a safe target/rel.
for (const p of pages) {
  const externalAnchors = [...p.html.matchAll(/<a\b[^>]*href="https:\/\/[^"]+"[^>]*>/g)].map((m) => m[0]);
  const bad = externalAnchors.filter((a) => !/target="_blank"/.test(a) || !/rel="[^"]*noopener[^"]*noreferrer/.test(a));
  check(`15c:${p.route}`, "외부 링크가 모두 안전한 target/rel 보유", bad.length === 0, bad.slice(0, 3).join(" | "));
}

// ---------------------------------------------------------------------------
// 16. Resume print stylesheet exists and the resume page wires the required
// print-only affordances (no-print chrome, print trigger, timeline markup).
// ---------------------------------------------------------------------------
check("16a", "site.css에 @media print 블록 존재", /@media\s+print/.test(cssText), "");
const resume = pages.find((p) => p.route === "/resume/");
if (resume) {
  check("16b", "Resume 페이지에 인쇄 트리거·no-print 헤더/푸터·타임라인 마크업 존재",
    /data-print-trigger/.test(resume.html) &&
    /<header class="site-header no-print"/.test(resume.html) &&
    /<footer class="site-footer no-print"/.test(resume.html) &&
    /class="timeline/.test(resume.html), "");
}

// ---------------------------------------------------------------------------
// 17. Zero external font/icon-font network dependency (F-003 remediation).
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
  check(`17:${p.route}`, "외부 font/icon-font 네트워크 요청 0개", hits.length === 0, hits.join(", "));
}
const cssHits = EXTERNAL_FONT_PATTERNS.filter((f) => f.re.test(cssText)).map((f) => f.label);
check("17:site.css", "site.css에 외부 font 참조 0개", cssHits.length === 0, cssHits.join(", "));

// ---------------------------------------------------------------------------
// 18. F-006-class mechanism guard: remote stylesheet/font loading mechanism,
// not just a vendor denylist (see external-style-font-policy.mjs).
// ---------------------------------------------------------------------------
for (const p of pages) {
  const violations = findExternalStyleFontViolations(p.html, { source: "html", fileLabel: p.route });
  check(`18:${p.route}`, "외부 stylesheet/font 로딩 메커니즘 0개 (mechanism-class guard)",
    violations.length === 0,
    violations.map((v) => `${v.mechanism}:${v.url}`).join(", "));
}
const cssViolations = findExternalStyleFontViolations(cssText, { source: "css", fileLabel: "assets/css/site.css" });
check("18:site.css", "site.css에 외부 stylesheet/font 로딩 메커니즘 0개",
  cssViolations.length === 0,
  cssViolations.map((v) => `${v.mechanism}:${v.url}`).join(", "));

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const pad = (s, n) => String(s).padEnd(n);
console.log("\nJERRYBAY v3 — Personal Revenue Portfolio QA\n" + "=".repeat(72));
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${pad(r.id, 22)} ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
}
console.log("=".repeat(72));
console.log(`${results.length - failed}/${results.length} checks passed.\n`);
process.exit(failed ? 1 : 0);
