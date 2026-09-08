import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
let passed = 0;
const check = (name, condition) => condition ? passed++ : failures.push(name);

const files = [
  "index.html", "business/index.html", "insights/index.html",
  "insights/aikus-learning-to-work-execution/index.html",
  "insights/ai-pilot-to-operating-system/index.html",
  "insights/static-first-search-foundation/index.html",
  "references/index.html", "references/projects/aikus/index.html",
  "references/projects/omyqt/index.html", "references/projects/invit/index.html",
  "references/projects/casper-electric-ai-drawing/index.html",
  "references/projects/renault-sm6-ai-drawing/index.html",
  "references/projects/fashion-ai-generator/index.html",
];
const pages = Object.fromEntries(files.map((file) => [file, read(file)]));
const corpus = Object.values(pages).join("\n");
const home = pages["index.html"];
const business = pages["business/index.html"];
const references = pages["references/index.html"];
const aikusInsight = pages["insights/aikus-learning-to-work-execution/index.html"];
const invit = pages["references/projects/invit/index.html"];
const casper = pages["references/projects/casper-electric-ai-drawing/index.html"];
const renault = pages["references/projects/renault-sm6-ai-drawing/index.html"];
const fashion = pages["references/projects/fashion-ai-generator/index.html"];
const siteJs = read("assets/js/site.js");
const contentJs = read("assets/js/content-os.js");

const corrupted = ["AIKUo", "Work otudio", "Workotudio", "ApplyWork otudio", "Account / oubscription", "oources", "okills", "NextJo", "oupabase"];
check("corrupted AIKUS strings removed", corrupted.every((term) => !corpus.includes(term)));
check("stale commercial claims remain absent", ["2영업일", "선착순 3명", "99,000원"].every((term) => !corpus.includes(term)));

check("Home buyer-facing hero", home.includes("기업·기관의 AI 제품·업무 시스템·교육을 기획하고 구축합니다."));
check("Home personal and corporate boundary", home.includes("JERRYBAY는 배제협의 개인 포트폴리오이며, 계약과 납품은 ㈜글로보더를 통해 진행합니다."));
check("Home canonical product statuses", ["구축·개선 중", "구축 중 · 개인정보 보호 검증 진행", "HOLD · 가설 검증 대기"].every((term) => home.includes(term)));

check("Business role split", business.includes("JERRYBAY는 배제협의 개인 전문성·방법론·경력 레퍼런스를 소개합니다.") && business.includes("계약과 납품은 ㈜글로보더를 통해 진행합니다."));
check("Business inquiry preparation", business.includes("협업 전에 준비할 정보") && business.includes("예산 범위는 선택 사항입니다."));

check("References proof hierarchy", references.includes("경험·기획 기록 28") && references.includes("개인 기획 기록") && references.includes("별도의 고객 수행실적이나 현재 ㈜글로보더의 납품 사례를 의미하지 않습니다."));
check("References planning note filter-aware", (references.match(/data-editorial-group-note=/g) || []).length === 1 && contentJs.includes("data-editorial-group-note") && contentJs.includes("groupNotes"));

check("AIKUS insight corrected", aikusInsight.includes("AIKUS") && aikusInsight.includes("Work Studio") && !corrupted.some((term) => aikusInsight.includes(term)));
check("INVIT HOLD is canonical", invit.includes("현재 상태는 <strong>HOLD · 가설 검증 대기</strong>입니다.") && !invit.includes("출시 준비 검증 중") && !invit.includes("HOLD / HYPOTHESIS ONLY"));

check("Casper attribution note", (casper.match(/class="claim-note"/g) || []).length === 1 && casper.includes("배제협 개인의 세부 역할은 개인 경력 기술로 구분합니다."));
check("Casper claim boundary preserved", casper.includes("재직 조직 프로젝트 참여 ≠ 개인 직계 고객 사례 ≠ ㈜글로보더 수행실적") && casper.includes("6일") && casper.includes("1,164"));
check("Renault attribution note", (renault.match(/class="claim-note"/g) || []).length === 1 && renault.includes("배제협 개인의 세부 역할을 직접 증명하는 자료는 아닙니다."));
check("Fashion attribution note", (fashion.match(/class="claim-note"/g) || []).length === 1 && fashion.includes("외부 자료가 개인의 세부 업무 분장을 직접 증명한다는 의미는 아닙니다."));

const retiredUi = ["Answer First", "Sources / Evidence", "Topics / Hashtags", "In this article", "Project sections", "Case sections", "Related Experience", "Business Route", "Qualified B2B Inquiry", "Featured Work", "Browse All"];
check("retired English UI labels removed", retiredUi.every((term) => !corpus.includes(term)));
check("CTA house standard in shared runtime", siteJs.includes('label: "협업 문의"') && siteJs.includes('anchor.closest("nav") ? "협업 문의" : "기업·기관 협업 문의"'));
check("CTA copy standardized in audit pages", !["조직 AI 적용 상담 요청", "프로젝트·컨설팅 문의", "상담 및 문의"].some((term) => corpus.includes(term)));
check("inquiry remains popup-based", siteJs.includes('layout: "modal"') && siteJs.includes("normalizeInquiryLinks"));

if (failures.length) {
  console.error(`CONTENT_CLAIM_QA FAIL (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`CONTENT_CLAIM_QA PASS (${passed}/${passed})`);
