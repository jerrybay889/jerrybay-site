import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function update(relativePath, replacements) {
  const file = path.join(root, relativePath);
  let source = fs.readFileSync(file, "utf8");
  for (const [before, after] of replacements) {
    if (!source.includes(before)) {
      if (source.includes(after)) continue;
      throw new Error(`${relativePath}: replacement source not found: ${before.slice(0, 100)}`);
    }
    source = source.split(before).join(after);
  }
  fs.writeFileSync(file, source, "utf8");
}

function updateOptional(relativePath, replacements) {
  const file = path.join(root, relativePath);
  let source = fs.readFileSync(file, "utf8");
  for (const [before, after] of replacements) source = source.split(before).join(after);
  fs.writeFileSync(file, source, "utf8");
}

function htmlFiles(directory = root) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".git", "node_modules"].includes(entry.name)) return [];
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [path.relative(root, full)] : [];
  });
}

update("references/index.html", [
  ["실행 레퍼런스 — JERRYBAY", "경험·기획 기록 — JERRYBAY"],
  ["무엇을 만들고, 가르치고, 기획하고, 운영해왔는지 근거와 함께 봅니다.", "제품, 프로젝트, 강의, 기획과 정부사업 경험을 역할과 근거로 구분합니다."],
  [">Featured Work<", ">대표 작업<"],
  [">Browse All<", ">전체 보기<"],
  [">실행 레퍼런스 28<", ">경험·기획 기록 28<"],
  ["상세 소개에 필요한 공개 자료가 준비된 항목은 별도 페이지로 연결하고, 아직 공개 자료가 충분하지 않은 항목은 목록 수준에서 사실만 표시합니다.", "현재 제품, 재직 조직 프로젝트, 교육 경험, 개인 기획 기록과 정부·공공 경험을 역할과 근거 수준에 따라 구분합니다."],
  [">PLANNING<", ">개인 기획 기록<"],
  [">Business Route<", ">협업 문의<"],
  ["유사한 문제를 현재 조직의 실행 범위로 바꾸고 싶다면", "비슷한 과제를 현재 조직에 적용할 범위로 정리하고 싶다면"],
  [">프로젝트·컨설팅 문의<", ">기업·기관 협업 문의<"],
]);

update("references/projects/aikus/index.html", [
  ["제품 시스템 · 구축·개선 중", "AI 학습·업무 실행 제품 · 구축·개선 중"],
  ["AI를 배우는 데서 끝내지 않고 실제 업무 결과와 재사용 가능한 지식 자산으로 연결하기 위한 <strong>AI Learning + Work Execution System</strong>입니다.", "AI 학습을 업무 결과와 재사용 가능한 지식 자산으로 연결하기 위한 제품입니다. Learning Lab, Work Studio와 Archive를 하나의 사용 흐름으로 설계하고 있습니다."],
  [">조직 AI 적용 상담 요청<", ">기업·기관 협업 문의<"],
  [">LEARN<", ">학습<"], [">WORK<", ">업무 실행<"], [">ARCHIVE<", ">축적<"], [">REUSE<", ">재사용<"],
  [">Topics / Hashtags<", ">주제<"], [">Project sections<", ">이 페이지의 구성<"], [">Related<", ">관련 콘텐츠<"], [">Business Route<", ">협업 문의<"],
  [">Approach<", ">설계 접근<"], [">Decisions<", ">설계 판단<"], [">Lessons<", ">배운 점<"],
]);

update("references/projects/omyqt/index.html", [
  ["개인정보 보호를 우선한 제품 · 구축·개선 중", "개인정보 보호 우선 AI 성찰 제품 · 구축·개선 중"],
  ["<strong>Privacy-first AI reflection platform</strong>", "<strong>개인정보 보호를 우선한 AI 성찰 제품</strong>"],
  ["구축 중 / 개인정보 보호 검증 진행", "구축 중 · 개인정보 보호 검증 진행"],
  ["Privacy-first · Mobile architecture", "개인정보 보호 우선 · 모바일 제품 구조"],
  [">Classify<", ">데이터 분류<"], [">Authorize<", ">권한 설정<"], [">Generate<", ">AI 입력 구성<"], [">Verify<", ">결과 확인<"],
  [">조직 AI 적용 상담 요청<", ">기업·기관 협업 문의<"], [">Topics / Hashtags<", ">주제<"], [">Project sections<", ">이 페이지의 구성<"], [">Related<", ">관련 콘텐츠<"], [">Business Route<", ">협업 문의<"],
  [">Approach<", ">설계 접근<"], [">Decisions<", ">설계 판단<"], [">Lessons<", ">배운 점<"],
]);

update("references/projects/invit/index.html", [
  ["Investment Behavior Correction OS 프로젝트", "투자 행동 자기점검 제품 가설"],
  ["Investment Behavior Correction OS 공개 프로젝트 기록", "투자 행동 자기점검 제품 가설 공개 기록"],
  ["모바일 제품 구상 · HOLD / HYPOTHESIS ONLY", "모바일 제품 가설 · HOLD · 가설 검증 대기"],
  ["<strong>Investment Behavior Correction OS</strong>", "<strong>투자 행동 자기점검 제품 가설</strong>"],
  ["Assessment · Journal · Principles · AI Coaching", "진단 · 기록 · 원칙 · AI 기반 자기점검"],
  ["Bias Assessment, Journal, Discipline Score, Principles, AI Coaching", "진단, 기록, 규율 점검, 원칙, AI 기반 자기점검"],
  [">ASSESS<", ">진단<"], [">RECORD<", ">기록<"], [">CHECK<", ">점검<"], [">REFLECT<", ">성찰<"],
  ["Journal에 남깁니다.", "기록으로 남깁니다."], ["AI coaching은", "AI 기반 자기점검은"],
  ["<h2 id=\"current\">현재 상태</h2><p><strong>HOLD · 가설 검증 대기</strong>는 현재 상시 개발·출시 중인 제품이 아니라는 뜻입니다. 이 문서는 출시 완료, 구독 활성화, 실사용자 수, 투자성과를 주장하지 않습니다.</p>", "<h2 id=\"current\">현재 상태</h2><p>현재 상태는 <strong>HOLD · 가설 검증 대기</strong>입니다. 과거 프로토타입의 기술 범위는 참고 기록으로만 공개하며, 현재 개발이나 출시 준비가 진행 중이라고 표현하지 않습니다.</p>"],
  [">조직 AI 적용 상담 요청<", ">기업·기관 협업 문의<"], [">Topics / Hashtags<", ">주제<"], [">Project sections<", ">이 페이지의 구성<"], [">Related<", ">관련 콘텐츠<"], [">Business Route<", ">협업 문의<"],
  [">Flow<", ">사용 흐름<"], [">Decisions<", ">설계 판단<"], [">Lessons<", ">배운 점<"],
]);

update("references/projects/casper-electric-ai-drawing/index.html", [
  ["Project Experience · 2024 · Prior-employer Context", "재직 조직 프로젝트 참여 · 2024"],
  ["생성형 AI를 ‘보는 기술’에서 ‘직접 만드는 브랜드 경험’으로 바꾼 프로젝트", "캐스퍼 일렉트릭 AI그리기대회: 생성형 AI 기반 브랜드 참여 경험"],
  ["저는 당시 소속 조직의 프로젝트 참여 경험을 이 페이지에 정리합니다. <strong>개인 직계 고객 프로젝트나 현재 ㈜글로보더의 수행 실적으로 재포장하지 않습니다.</strong>", "이 페이지는 당시 소속 조직에서 참여한 경험과 공개 자료에서 확인되는 프로젝트 사실을 구분해 정리합니다. 현재 ㈜글로보더의 수행실적이 아닙니다."],
  [">Jerry 역할 맥락<", ">개인 경력 맥락<"], ["Generative AI · Experience Design · Operations", "생성형 AI · 사용자 경험 기획 · 프로젝트 운영"],
  [">공개 범위<", ">개인 경력 기술<"], ["약 20초의 즉시성", "약 20초의 생성 대기 안내"], ["Experience IP", "재사용 가능한 경험 구조"],
  ["04. 프로젝트에 남은 외부 평가", "04. 프로젝트 단위 외부 수상 기록"],
  ["prior-employer project experience ≠ JERRY direct-client case ≠ GLOBORDER corporate delivery proof.", "재직 조직 프로젝트 참여 ≠ 개인 직계 고객 사례 ≠ ㈜글로보더 수행실적"],
  [">Topics<", ">주제<"], [">Case sections<", ">이 페이지의 구성<"], [">Related Experience<", ">관련 프로젝트 경험<"], [">Business Route<", ">협업 문의<"], [">상담 및 문의<", ">기업·기관 협업 문의<"],
  ["다른 prior-employer 프로젝트 참여 사례", "다른 재직 조직 프로젝트 참여 사례"], ["prior-employer 경험", "재직 조직 프로젝트 참여 경험"],
]);

update("references/projects/renault-sm6-ai-drawing/index.html", [
  ["Renault Korea SM6 AI Drawing Experience", "르노코리아 SM6 생성형 AI 브랜드 경험 프로젝트"],
  ["Project Experience · 2024", "재직 조직 프로젝트 참여 · 2024"],
  ["재직 조직 프로젝트에서 참여한 생성형 AI 기반 브랜드 경험 기획·운영 사례입니다. 개인 직계 고객 프로젝트로 표현하지 않고 당시 소속 조직에서의 프로젝트 참여 경험이라는 범위를 유지합니다.", "재직 조직 프로젝트에 참여한 생성형 AI 기반 브랜드 경험 사례입니다. 당시 소속 조직에서의 프로젝트 참여 경험이며, 개인 직계 고객 사례나 현재 ㈜글로보더의 수행실적이 아닙니다."],
  ["Generative AI · Brand Experience · Operations", "생성형 AI · 브랜드 경험 기획 · 프로젝트 운영"],
  ["<h2 id=\"role\">공개 가능한 역할 범주</h2>", "<h2 id=\"role\">개인 경력 기준 역할 범주</h2>"],
  ["Generative AI · Brand Experience · Project Operations", "개인 경력 기술 · 생성형 AI · 브랜드 경험 기획 · 프로젝트 운영"],
  ["실제 프로젝트 실행 흐름 안에서", "프로젝트 실행 흐름 안에서"],
  [">Brand Experience<", ">브랜드 경험 기획<"], [">Operational Reality<", ">운영 관점<"], [">BRAND<", ">브랜드 목표<"], [">PARTICIPATE<", ">참여 흐름<"], [">GUARD<", ">안전 기준<"], [">OPERATE<", ">운영 조건<"],
  ["상세 내부 업무 분장,", "현재 공개 근거로 확인되지 않는 내부 캠페인 운영 수치, 제작 과정과 세부 역할 분담,"],
  [">외부 공개 기록 ↗<", ">언론 기사 확인 ↗<"], [">언론 기사 보기<", ">언론 기사 확인<"], [">조직 AI 적용 상담 요청<", ">기업·기관 협업 문의<"],
  [">Topics / Hashtags<", ">주제<"], [">Project sections<", ">이 페이지의 구성<"], [">Related<", ">관련 콘텐츠<"], [">Business Route<", ">협업 문의<"],
  [">Context<", ">배경<"], [">Role<", ">역할<"], [">Checklist<", ">확인 기준<"],
]);

update("references/projects/fashion-ai-generator/index.html", [
  ["Fashion AI Generator", "패션 산업 생성형 AI 서비스 기획·운영 경험"],
  ["Project Experience · Fashion / Generative AI", "재직 조직 프로젝트 참여 · 패션 / 생성형 AI"],
  ["Generative AI · Service Planning · Operations", "생성형 AI · 서비스 기획 · 프로젝트 운영"],
  ["<h2 id=\"role\">공개 가능한 역할</h2>", "<h2 id=\"role\">개인 경력 기준 역할</h2>"],
  ["<strong>생성형 AI · 서비스 기획 · 프로젝트 운영</strong>입니다.", "<strong>개인 경력 기술 · 생성형 AI · 서비스 기획 · 프로젝트 운영</strong>입니다."],
  [">Service Planning<", ">서비스 기획<"], [">Operations<", ">운영<"], [">USE CASE<", ">사용 목적<"], [">INPUT<", ">입력<"], [">GENERATE<", ">생성<"], [">USE<", ">활용<"],
  [">외부 공개 기사 ↗<", ">언론 기사 확인 ↗<"], [">언론 기사 보기<", ">언론 기사 확인<"], [">조직 AI 적용 상담 요청<", ">기업·기관 협업 문의<"],
  [">Topics / Hashtags<", ">주제<"], [">Project sections<", ">이 페이지의 구성<"], [">Related<", ">관련 콘텐츠<"], [">Business Route<", ">협업 문의<"],
  [">Context<", ">배경<"], [">Role<", ">역할<"], [">Checklist<", ">확인 기준<"],
]);

update("insights/aikus-learning-to-work-execution/index.html", [
  ["AIKUo", "AIKUS"],
]);

for (const file of ["about/index.html", "contact/index.html"]) {
  update(file, [
    [">조직 AI 적용 상담 요청<", ">기업·기관 협업 문의<"],
    [">문의<", ">협업 문의<"],
  ]);
}

for (const file of htmlFiles()) {
  updateOptional(file, [
    [">조직 AI 적용 상담 요청<", ">기업·기관 협업 문의<"],
    [">프로젝트·컨설팅 문의<", ">기업·기관 협업 문의<"],
    [">상담 및 문의<", ">기업·기관 협업 문의<"],
    [">문의<", ">협업 문의<"],
    [">언론 기사 보기<", ">언론 기사 확인<"],
  ]);
}

updateOptional("insights/ai-pilot-to-operating-system/index.html", [[">Related<", ">관련 콘텐츠<"]]);
updateOptional("contact/index.html", [["조직 AI 적용 상담 요청.", "기업·기관 협업 문의."]]);
updateOptional("index.html", [
  ["Selected Commercial Project Experience", "주요 재직 조직 프로젝트 경험"],
  ["PROJECT EXPERIENCE · 2024", "재직 조직 프로젝트 참여 · 2024"],
  ["PROJECT EXPERIENCE", "재직 조직 프로젝트 참여"],
]);
updateOptional("references/index.html", [
  ["PROJECT EXPERIENCE · 2024", "재직 조직 프로젝트 참여 · 2024"],
  ["PROJECT EXPERIENCE", "재직 조직 프로젝트 참여"],
]);
updateOptional("references/projects/renault-sm6-ai-drawing/index.html", [["PROJECT EXPERIENCE · 2024", "재직 조직 프로젝트 참여 · 2024"]]);
updateOptional("references/projects/fashion-ai-generator/index.html", [
  ["PROJECT EXPERIENCE", "재직 조직 프로젝트 참여"],
  ["Service Planning과 Operations", "서비스 기획과 운영"],
]);
updateOptional("references/projects/casper-electric-ai-drawing/index.html", [
  ["언론 기사 확인 — 아시아투데이", "언론 기사 확인 — 아시아투데이"],
  [">현대자동차 공식 캠페인<", ">현대자동차 공식 자료 확인<"],
]);

function ensureSingleInsertion(relativePath, anchor, insertion) {
  const file = path.join(root, relativePath);
  let source = fs.readFileSync(file, "utf8");
  source = source.split(insertion).join("");
  if (!source.includes(anchor)) throw new Error(`${relativePath}: insertion anchor not found`);
  source = source.replace(anchor, `${anchor}${insertion}`);
  fs.writeFileSync(file, source, "utf8");
}

ensureSingleInsertion(
  "references/index.html",
  "<!-- planning -->",
  "\n<div class=\"editorial-group-note\" data-editorial-group-note=\"planning\"><strong>개인 기획 기록</strong><p>아래 항목은 배제협이 검토·기획해온 사업 및 제품 주제입니다. 별도의 고객 수행실적이나 현재 ㈜글로보더의 납품 사례를 의미하지 않습니다.</p></div>",
);
ensureSingleInsertion(
  "references/projects/casper-electric-ai-drawing/index.html",
  "당시 소속 조직의 프로젝트에서 생성형 AI가 사용자 참여 경험으로 작동하도록 기획·운영하는 맥락을 경험했다는 수준까지 공개합니다.</p>",
  "<p class=\"claim-note\"><strong>근거 경계:</strong> 외부 자료는 프로젝트의 존재, 캠페인 내용과 수상 기록을 확인하는 근거입니다. 배제협 개인의 세부 역할은 개인 경력 기술로 구분합니다.</p>",
);
ensureSingleInsertion(
  "references/projects/renault-sm6-ai-drawing/index.html",
  "프로젝트 실행 흐름 안에서 운영을 연결한 경험으로 설명합니다.</p>",
  "<p class=\"claim-note\"><strong>근거 경계:</strong> 외부 자료는 프로젝트의 공개 맥락을 확인하는 근거이며, 배제협 개인의 세부 역할을 직접 증명하는 자료는 아닙니다.</p>",
);
ensureSingleInsertion(
  "references/projects/fashion-ai-generator/index.html",
  "프로젝트 실행 관점에서 운영을 연결한 경험으로 설명합니다.</p>",
  "<p class=\"claim-note\"><strong>근거 경계:</strong> 이 역할 설명은 배제협의 개인 경력 기술입니다. 외부 자료가 개인의 세부 업무 분장을 직접 증명한다는 의미는 아닙니다.</p>",
);

console.log("Content and claim audit replacements applied.");
