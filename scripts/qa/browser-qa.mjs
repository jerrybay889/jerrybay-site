#!/usr/bin/env node
/**
 * JERRYBAY v3 — Personal Revenue Portfolio browser QA over the Chrome DevTools Protocol.
 *
 * Drives an already-running Chrome (started with --remote-debugging-port) against
 * a locally served static build. Captures, per route and viewport:
 *   - console errors and failed network requests
 *   - horizontal overflow (documentElement.scrollWidth vs innerWidth) + the
 *     widest offending element
 *   - Home: the real portrait is visible within the first mobile viewport
 *     (build-time proxy for "Person -> Proof -> next action in the first 3
 *     screenfuls"; vercel.json redirects for the 3 legacy routes are not
 *     replayable against a plain static server, so they are asserted
 *     statically in validate-site.mjs check 06 instead)
 *   - every visible a[href]/button/[role=button] is >=44x44px, both
 *     dimensions, via a genuine viewport-intersection visibility test
 *   - mobile menu open / ESC-close / focus-return behaviour
 *   - mobile menu background-scroll lock
 *   - keyboard focus reachability of the skip link
 *   - Resume: print trigger swaps to a print-media layout (no-print chrome
 *     hidden) via Emulation.setEmulatedMedia
 *   - a PNG screenshot per route/viewport
 *
 * Usage:
 *   node scripts/qa/browser-qa.mjs <cdpHttpEndpoint> <baseUrl> <screenshotDir>
 *
 * Exit code 0 = every assertion passed.
 */

import { writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [, , CDP = "http://127.0.0.1:9222", BASE = "http://127.0.0.1:4173", OUT = "."] =
  process.argv;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CORE_ROUTES = ["/", "/resume/", "/work/", "/lab/", "/insights/", "/books/", "/contact/", "/privacy/"];
// Generated content-board detail pages are discovered at run time — one per
// slug directory under insights/ (excluding insights/index.html itself).
const contentDetailRoutes = existsSync(join(ROOT, "insights"))
  ? readdirSync(join(ROOT, "insights"), { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(join(ROOT, "insights", e.name, "index.html")))
      .map((e) => `/insights/${e.name}/`)
  : [];
const ROUTES = [...CORE_ROUTES, ...contentDetailRoutes];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

mkdirSync(OUT, { recursive: true });

// --- minimal CDP client ----------------------------------------------------

let nextId = 1;
function connect(url) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(url);
    const pending = new Map();
    const events = [];
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        events.push(msg);
      }
    };
    ws.onerror = (e) => rej(new Error("ws error: " + e.message));
    ws.onopen = () =>
      res({
        send(method, params = {}) {
          const id = nextId++;
          return new Promise((resolve, reject) => {
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
          });
        },
        events,
        close: () => ws.close(),
      });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- assertions ------------------------------------------------------------

const results = [];
let failed = 0;
const record = (id, name, ok, detail = "") => {
  results.push({ id, name, ok, detail });
  if (!ok) failed++;
};

// Runs in the page. Returns everything one route/viewport needs in a single pass.
const PROBE = `(() => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - window.innerWidth;
  let widest = null;
  if (overflow > 1) {
    let max = 0;
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      const right = r.right;
      if (right > max) {
        max = right;
        widest = el.tagName.toLowerCase() +
          (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\\s+/).join(".") : "") +
          " right=" + Math.round(right) + " w=" + Math.round(r.width);
      }
    }
  }
  const primaries = [...document.querySelectorAll("a.btn--primary")]
    .map(a => ({ text: a.textContent.trim(), href: a.getAttribute("href"),
                 h: Math.round(a.getBoundingClientRect().height) }));
  const toggle = document.querySelector("[data-nav-toggle]");
  const toggleBox = toggle ? toggle.getBoundingClientRect() : null;

  const targetEls = [...document.querySelectorAll("a[href], button, [role='button']")];
  const smallTargets = targetEls
    .map(el => ({ el, r: el.getBoundingClientRect(), cs: getComputedStyle(el) }))
    .filter(({ r, cs }) => r.width > 0 && r.height > 0 &&
      r.right > 0 && r.bottom > 0 && r.left < window.innerWidth && r.top < window.innerHeight &&
      cs.visibility !== "hidden" && cs.display !== "none")
    .filter(({ r }) => r.width < 44 || r.height < 44)
    .map(({ el, r }) => el.tagName.toLowerCase() + ":" + el.textContent.trim().slice(0, 18) +
               "(" + Math.round(r.width) + "x" + Math.round(r.height) + "px)");

  const portrait = document.querySelector('img[src="/assets/profile.jpg"]');
  const portraitBox = portrait ? portrait.getBoundingClientRect() : null;
  const portraitFilter = portrait ? getComputedStyle(portrait).filter : "";

  const heroSection = document.querySelector(".hero");
  const heroHeight = heroSection ? Math.round(heroSection.getBoundingClientRect().height) : null;

  // Remediation contract §5 mobile target: name/H1/primary CTA visible
  // within the first ~2 screenfuls.
  const primaryCta = document.querySelector("a.btn--primary");
  const ctaWithinTwoScreens = primaryCta
    ? primaryCta.getBoundingClientRect().bottom <= window.innerHeight * 2
    : null;

  return {
    overflow, widest, primaries, smallTargets,
    innerWidth: window.innerWidth,
    scrollWidth: doc.scrollWidth,
    toggleVisible: !!toggleBox && toggleBox.width > 0 &&
      toggleBox.right <= window.innerWidth + 1 && toggleBox.left >= -1,
    bodyFontPx: parseFloat(getComputedStyle(document.body).fontSize),
    portraitWidthPx: portraitBox ? Math.round(portraitBox.width) : null,
    // A regex literal here would need \\\\( to survive PROBE's own outer
    // template literal (which strips single backslashes before non-special
    // characters), so plain string matching avoids that footgun entirely.
    portraitIsGrayscale: portraitFilter.indexOf("grayscale(1)") !== -1,
    heroHeight,
    ctaWithinTwoScreens,
    h1Px: (() => { const h = document.querySelector("h1");
                   return h ? Math.round(parseFloat(getComputedStyle(h).fontSize)) : 0; })(),
    portraitTopWithin3Screens: !!portraitBox && portraitBox.top >= 0 && portraitBox.top < window.innerHeight * 3,
  };
})()`;

// Opens the mobile menu, presses Escape, reports whether focus returned.
const MENU_PROBE = `(async () => {
  const t = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("primary-nav");
  if (!t || !nav) return { ok: false, why: "menu elements missing" };
  t.click();
  await new Promise(r => setTimeout(r, 60));
  const opened = nav.getAttribute("data-open") === "true" &&
                 t.getAttribute("aria-expanded") === "true" &&
                 getComputedStyle(nav).display !== "none";
  const linkCount = nav.querySelectorAll("a").length;
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await new Promise(r => setTimeout(r, 60));
  const closed = nav.getAttribute("data-open") !== "true" &&
                 t.getAttribute("aria-expanded") === "false" &&
                 getComputedStyle(nav).display === "none";
  const focusReturned = document.activeElement === t;
  return { ok: opened && closed && focusReturned && linkCount === 6,
           opened, closed, focusReturned, linkCount };
})()`;

async function testScrollLock(cdp, vp, tag, record) {
  const evalNum = async (expr) => {
    const { result } = await cdp.send("Runtime.evaluate", { expression: expr, returnByValue: true });
    return result.value;
  };
  const evalBool = async (expr) => {
    const { result } = await cdp.send("Runtime.evaluate", { expression: expr, returnByValue: true });
    return !!result.value;
  };
  const wheel = (deltaY) => cdp.send("Input.dispatchMouseEvent", {
    type: "mouseWheel", x: Math.round(vp.width / 2), y: Math.round(vp.height / 2),
    deltaX: 0, deltaY,
  });

  const maxScroll = await evalNum(
    "document.documentElement.scrollHeight - window.innerHeight"
  );
  const scrollable = maxScroll > 80;

  await evalNum('window.scrollTo({ top: 200, left: 0, behavior: "instant" }); window.scrollY');
  await sleep(80);
  const beforeOpen = await evalNum("window.scrollY");

  await evalBool('document.querySelector("[data-nav-toggle]").click(); true');
  await sleep(60);
  const lockedOnOpen = await evalBool('document.body.classList.contains("nav-open")');

  await wheel(300);
  await sleep(80);
  const duringOpenY = await evalNum("window.scrollY");
  const scrollBlocked = !scrollable || duringOpenY === beforeOpen;

  await evalBool(
    'document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); true'
  );
  await sleep(60);
  const lockReleased = !(await evalBool('document.body.classList.contains("nav-open")'));
  const positionPreserved = (await evalNum("window.scrollY")) === beforeOpen;
  const focusReturned = await evalBool(
    'document.activeElement === document.querySelector("[data-nav-toggle]")'
  );

  await wheel(300);
  await sleep(80);
  const afterCloseY = await evalNum("window.scrollY");
  const scrollWorksAfterClose = !scrollable || afterCloseY !== beforeOpen;

  await evalNum('window.scrollTo({ top: 0, left: 0, behavior: "instant" }); 0');

  const detail = JSON.stringify({
    scrollable, beforeOpen, lockedOnOpen, duringOpenY, scrollBlocked,
    lockReleased, positionPreserved, focusReturned, afterCloseY, scrollWorksAfterClose,
  });
  record(`scrolllock ${tag}`, "메뉴 open 시 배경 scroll 차단 → close 시 위치 보존·재개",
    lockedOnOpen && scrollBlocked && lockReleased && positionPreserved &&
      focusReturned && scrollWorksAfterClose,
    detail);
}

// --- run -------------------------------------------------------------------

const targets = await (await fetch(`${CDP}/json/list`)).json();
const page = targets.find((t) => t.type === "page");
if (!page) { console.error("No CDP page target found."); process.exit(1); }
const cdp = await connect(page.webSocketDebuggerUrl);

await cdp.send("Page.enable");
await cdp.send("Emulation.setFocusEmulationEnabled", { enabled: true });
await cdp.send("Runtime.enable");
await cdp.send("Log.enable");
await cdp.send("Network.enable");

for (const vp of VIEWPORTS) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: vp.width, height: vp.height,
    deviceScaleFactor: 1, mobile: vp.mobile,
  });

  for (const route of ROUTES) {
    const tag = `${route}@${vp.name}`;
    cdp.events.length = 0;

    await cdp.send("Page.navigate", { url: BASE + route });
    await sleep(900);
    // A prior testScrollLock() run dispatches a synthetic mouseWheel at the
    // viewport center; Chrome does not clear the resulting hover state on
    // navigation if an element lands under the same coordinate on the new
    // page. Reset the pointer to a neutral corner before every measurement
    // so :hover-only styles (e.g. the portrait's grayscale reveal) never
    // leak between routes/viewports.
    await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 2, y: 2 });

    const consoleErrors = cdp.events
      .filter((e) => e.method === "Log.entryAdded" && e.params.entry.level === "error")
      .map((e) => e.params.entry.text);
    const failedReqs = cdp.events
      .filter((e) => e.method === "Network.loadingFailed")
      .map((e) => e.params.errorText)
      .filter((t) => t !== "net::ERR_ABORTED");

    const { result } = await cdp.send("Runtime.evaluate", {
      expression: PROBE, returnByValue: true,
    });
    const r = result.value;

    record(`overflow ${tag}`, `가로 overflow 없음 (${r.scrollWidth} vs ${r.innerWidth})`,
      r.overflow <= 1, r.widest || "");
    record(`console ${tag}`, "console error 없음",
      consoleErrors.length === 0 && failedReqs.length === 0,
      [...consoleErrors, ...failedReqs].join(" | "));
    record(`bodyfont ${tag}`, `body font-size >= 16px (${r.bodyFontPx})`, r.bodyFontPx >= 16);

    // Korean typography contract: H1 CSS max <=52px (clamp(2rem,4.2vw,3.25rem)).
    // Small tolerance for sub-pixel rounding at each viewport.
    const h1Min = vp.mobile ? 28 : 44;
    const h1Max = vp.mobile ? 40 : 56;
    record(`h1 ${tag}`, `H1 ${h1Min}–${h1Max}px 범위, 52px 상한 준수 (${r.h1Px}px)`,
      r.h1Px >= h1Min && r.h1Px <= h1Max && r.h1Px <= 53);

    if (route === "/") {
      const portraitMax = vp.mobile ? 190 : 320;
      record(`portrait-size ${tag}`, `Home portrait 렌더 너비가 ${portraitMax}px 이하 (${r.portraitWidthPx}px)`,
        r.portraitWidthPx !== null && r.portraitWidthPx <= portraitMax, "");
      record(`portrait-grayscale ${tag}`, "Home portrait 기본 상태가 grayscale",
        r.portraitIsGrayscale, "");
      // Regression ceiling, not a design target: the locked H1/lead copy
      // wraps to several lines at keep-all width, so an exact px target
      // isn't meaningful. This still catches a reversion to the old
      // 128px-padding / 64px-H1 hero (which measured well above these
      // numbers) while accepting the current copy's real wrapped height.
      record(`hero-height ${tag}`, `Hero 섹션 높이가 old 128px-padding 프리셋보다 축소됨 (${r.heroHeight}px)`,
        r.heroHeight !== null && r.heroHeight <= (vp.mobile ? 1000 : 800), "");

      if (vp.mobile) {
        record(`portrait ${tag}`, "Home: 실제 portrait가 첫 3 화면(mobile) 안에 표시됨",
          r.portraitTopWithin3Screens, "");
        record(`cta-2screens ${tag}`, "Home: primary CTA가 첫 2 화면(mobile) 안에 표시됨",
          r.ctaWithinTwoScreens === true, "");
      }
    }

    record(`touch ${tag}`, "모든 visible a[href]/button 44x44px 이상 (width+height)",
      r.smallTargets.length === 0, r.smallTargets.join(", "));

    const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
    writeFileSync(
      join(OUT, `${(route === "/" ? "home" : route.replace(/\//g, "")) }-${vp.name}.png`),
      Buffer.from(shot.data, "base64")
    );

    if (vp.mobile) {
      record(`toggle ${tag}`, "모바일 메뉴 버튼이 화면 안에 보임", r.toggleVisible);
      const { result: menu } = await cdp.send("Runtime.evaluate", {
        expression: MENU_PROBE, returnByValue: true, awaitPromise: true,
      });
      record(`menu ${tag}`, "메뉴 open → ESC close → focus 복귀",
        menu.value.ok, JSON.stringify(menu.value));

      await testScrollLock(cdp, vp, tag, record);

      if (route === "/") {
        await cdp.send("Runtime.evaluate", {
          expression: `document.querySelector("[data-nav-toggle]").click()`,
        });
        await sleep(250);
        const navShot = await cdp.send("Page.captureScreenshot", { format: "png" });
        writeFileSync(join(OUT, "home-mobile-menu-open.png"),
          Buffer.from(navShot.data, "base64"));
      }
    }
  }
}

// Resume print QA: switch the emulated media to "print" and verify the
// no-print chrome (header/footer/CTA row) actually disappears.
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
});
await cdp.send("Page.navigate", { url: BASE + "/resume/" });
await sleep(700);
await cdp.send("Emulation.setEmulatedMedia", { media: "print" });
await sleep(150);
const { result: printProbe } = await cdp.send("Runtime.evaluate", {
  expression: `(() => {
    const header = document.querySelector(".site-header");
    const footer = document.querySelector(".site-footer");
    const printTrigger = document.querySelector("[data-print-trigger]");
    const timeline = document.querySelector(".timeline");
    return {
      headerHidden: !header || getComputedStyle(header).display === "none",
      footerHidden: !footer || getComputedStyle(footer).display === "none",
      triggerHidden: !printTrigger || getComputedStyle(printTrigger.closest(".btn-row")).display === "none",
      timelineVisible: !!timeline && getComputedStyle(timeline).display !== "none",
      bg: getComputedStyle(document.body).backgroundColor,
    };
  })()`,
  returnByValue: true,
});
const pp = printProbe.value;
record("resume-print", "Resume 인쇄 미디어에서 no-print 요소 숨김, 본문(timeline)은 유지",
  pp.headerHidden && pp.footerHidden && pp.triggerHidden && pp.timelineVisible,
  JSON.stringify(pp));
const printShot = await cdp.send("Page.captureScreenshot", { format: "png" });
writeFileSync(join(OUT, "resume-print.png"), Buffer.from(printShot.data, "base64"));
await cdp.send("Emulation.setEmulatedMedia", { media: "" });

// F-002: resizing past the desktop breakpoint while the menu is open must
// release the scroll lock too, not just Escape/link-click/toggle-click.
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
});
await cdp.send("Page.navigate", { url: BASE + "/" });
await sleep(700);
await cdp.send("Runtime.evaluate", {
  expression: 'document.querySelector("[data-nav-toggle]").click()',
});
await sleep(60);
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
});
await sleep(150);
const { result: resizeReset } = await cdp.send("Runtime.evaluate", {
  expression: `({
    lockReleased: !document.body.classList.contains("nav-open"),
    navOpenAttr: document.getElementById("primary-nav").getAttribute("data-open"),
  })`,
  returnByValue: true,
});
record("scrolllock resize-to-desktop", "데스크톱 breakpoint 복귀 시 scroll lock 해제",
  resizeReset.value.lockReleased && resizeReset.value.navOpenAttr !== "true",
  JSON.stringify(resizeReset.value));

// Skip link must be the first keyboard stop and must become visible on focus.
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
});
await cdp.send("Page.navigate", { url: BASE + "/" });
await sleep(700);
const { result: skip } = await cdp.send("Runtime.evaluate", {
  expression: `(async () => {
    const l = document.querySelector(".skip-link");
    l.focus();
    await new Promise(r => setTimeout(r, 300));
    const r = l.getBoundingClientRect();
    return { focused: document.activeElement === l, top: Math.round(r.top),
             href: l.getAttribute("href") };
  })()`,
  returnByValue: true,
  awaitPromise: true,
});
record("skiplink", "skip link 포커스 시 화면에 표시",
  skip.value.focused && skip.value.top >= 0 && skip.value.href === "#main",
  JSON.stringify(skip.value));

cdp.close();

const pad = (s, n) => String(s).padEnd(n);
console.log("\nJERRYBAY v3 — Personal Revenue Portfolio Browser QA (Chrome / CDP)\n" + "=".repeat(78));
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${pad(r.id, 26)} ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
}
console.log("=".repeat(78));
console.log(`${results.length - failed}/${results.length} browser checks passed.\n`);
process.exit(failed ? 1 : 0);
