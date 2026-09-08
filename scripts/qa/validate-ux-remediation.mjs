import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const failures = [];
let passed = 0;

function check(name, condition, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`PASS ${name}`);
    return;
  }
  failures.push({ name, detail });
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

const home = read("index.html");
const business = read("business/index.html");
const about = read("about/index.html");
const contact = read("contact/index.html");
const references = read("references/index.html");
const casper = read("references/projects/casper-electric-ai-drawing/index.html");
const invit = read("references/projects/invit/index.html");
const siteJs = read("assets/js/site.js");
const contentJs = read("assets/js/content-os.js");
const siteCss = read("assets/css/site.css");
const contentCss = read("assets/css/content-os.css");
const sitemap = read("sitemap.xml");
const vercel = JSON.parse(read("vercel.json"));

const navLabels = [...siteJs.matchAll(/key: "[^"]+", label: "([^"]+)"/g)].map((match) => match[1]);
check("P08-UX-001 global nav has one exact label order", JSON.stringify(navLabels) === JSON.stringify(["소개", "기업·기관", "인사이트", "레퍼런스", "협업 문의"]));
check("P08-UX-001 global nav has one shared renderer", siteJs.includes("appendLinks(headerNav)") && siteJs.includes('document.querySelectorAll(".site-footer nav")'));

for (const [name, html] of [["Home", home], ["Business", business], ["About", about], ["Contact fallback", contact]]) {
  const header = html.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0] || "";
  const labels = [...header.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/g)].map((match) => match[1].replace(/<[^>]+>/g, "").trim()).slice(1);
  check(`P08-UX-001 ${name} fallback header`, JSON.stringify(labels) === JSON.stringify(navLabels), labels.join(" / "));
}

const legacyRoutes = ["/capabilities/", "/work/", "/collaborate/"];
const redirectMap = new Map(vercel.redirects.map((entry) => [entry.source, entry.destination]));
check("P08-UX-002 capabilities redirect", redirectMap.get("/capabilities/") === "/about/#capabilities");
check("P08-UX-002 work redirect", redirectMap.get("/work/") === "/references/");
check("P08-UX-002 collaborate redirect", redirectMap.get("/collaborate/") === "/business/");
check("P08-UX-002 legacy and contact routes absent from sitemap", [...legacyRoutes, "/contact/"].every((route) => !sitemap.includes(`www.jerrybay.kr${route}`)));
check("P08-UX-002 About absorbs capabilities", about.includes('id="capabilities"'));

check("P08-UX-003 Business hero flattens to evidence", business.includes('href="#evidence">대표 수행 사례 보기</a>'));
check("P08-UX-003 Business evidence links directly to project details", business.includes('/references/projects/aikus/') && business.includes('/references/projects/casper-electric-ai-drawing/'));
check("P08-UX-003 no filtered-project detour in Business", !business.includes('/references/?type=project') && !business.includes('/references/?filter=project'));

const projectFiles = [
  "references/index.html",
  "references/projects/aikus/index.html",
  "references/projects/omyqt/index.html",
  "references/projects/invit/index.html",
  "references/projects/casper-electric-ai-drawing/index.html",
  "references/projects/renault-sm6-ai-drawing/index.html",
  "references/projects/fashion-ai-generator/index.html",
];
check("P08-UX-004 no self-site screenshot proof in references", projectFiles.every((file) => !read(file).includes('/docs/jerrybay-v4/evidence/screenshots')));
check("P08-UX-004 actual AIKUS and OMYQT product visuals retained", references.includes('/assets/images/projects/aikus-public-home.png') && references.includes('/assets/images/projects/omyqt-reflection-ui.png'));

check("P08-UX-005 popup copy matches behavior", !contact.includes("새 탭") && contact.includes("현재 페이지 위에서 상담 폼이 열립니다"));
check("P08-UX-005 popup source contract retained", siteJs.includes('layout: "modal"') && siteJs.includes("onClose") && siteJs.includes("getCloseFocusTarget"));

check("P08-UX-006 shared header height token", siteCss.includes("--site-header-height: 68px") && siteCss.includes("min-height: var(--site-header-height)") && contentCss.includes("top:var(--site-header-height)"));
check("P08-UX-006 legacy sticky offsets removed", !contentCss.includes("top:58px") && !contentCss.includes("top:72px") && !contentCss.includes("top:118px"));

check("P08-UX-007 Casper scope uses 4-item layout", casper.includes("scope-strip scope-strip--4") && (casper.match(/<dt>/g) || []).length >= 4 && contentCss.includes(".scope-strip--4{grid-template-columns:repeat(4"));
check("P08-UX-008 Casper process uses 5-step layout", casper.includes("process-flow process-flow--5") && (casper.match(/process-flow__step/g) || []).length === 5 && contentCss.includes(".process-flow--5{grid-template-columns:repeat(5"));

const filterBar = references.match(/<div class="editorial-filters"[\s\S]*?<\/div><\/div><\/section>/)?.[0] || "";
check("P08-UX-009 Reference primary filters limited to four", (filterBar.match(/data-editorial-filter=/g) || []).length === 4);
check("P08-UX-009 one content-type taxonomy axis", ["전체 28", "프로젝트 6", "강의·교육 8", "기획·정부사업 14"].every((label) => filterBar.includes(label)) && !filterBar.includes(">AI<") && !filterBar.includes(">커머스<"));
check("P08-UX-009 grouped filter behavior", contentJs.includes("filterTokens") && contentJs.includes("some(token => tokensFor(item).includes(token))"));

check("P08-UX-010 Home label and destination align", home.includes('href="#press">기사·언론</a>') && !home.includes("기사·레퍼런스 보기"));
check("P08-UX-011 shared semantic card tokens", siteCss.includes("--card-radius") && siteCss.includes("--card-outline") && contentCss.includes("border-radius:var(--card-radius)") && contentCss.includes("box-shadow:var(--card-outline)"));

check("Public truth INVIT remains HOLD", invit.includes("HOLD · 가설 검증 대기") && !invit.includes("구축 중 / 출시 준비 검증 중"));
check("Casper claim boundary preserved", casper.includes("현재 ㈜글로보더의 수행실적이 아닙니다") && casper.includes("배제협 개인의 세부 역할은 개인 경력 기술로 구분합니다") && casper.includes("재직 조직 프로젝트 참여 ≠ 개인 직계 고객 사례 ≠ ㈜글로보더 수행실적"));

console.log(`\nUX remediation: ${passed}/${passed + failures.length} PASS`);
if (failures.length) process.exit(1);
