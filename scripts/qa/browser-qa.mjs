#!/usr/bin/env node
/**
 * JERRYBAY Phase 1 — browser QA over the Chrome DevTools Protocol.
 *
 * Drives an already-running Chrome (started with --remote-debugging-port) against
 * a locally served build. Captures, per route and viewport:
 *   - console errors and failed network requests
 *   - horizontal overflow (documentElement.scrollWidth vs innerWidth) + the
 *     widest offending element, so a failure names its own cause
 *   - primary CTA presence, wording and target
 *   - every visible a[href]/button/[role=button] is >=44x44px, both
 *     dimensions, via a genuine viewport-intersection visibility test
 *     (not a partial selector list — see the F-001 remediation note inline)
 *   - mobile menu open / ESC-close / focus-return behaviour
 *   - mobile menu background-scroll lock: open blocks real (CDP-level
 *     trusted) wheel scrolling, close restores position and re-enables it,
 *     and resizing past the desktop breakpoint releases the lock too
 *   - keyboard focus reachability of the skip link
 *   - a PNG screenshot
 *
 * Usage:
 *   node scripts/qa/browser-qa.mjs <cdpHttpEndpoint> <baseUrl> <screenshotDir>
 *
 * Exit code 0 = every assertion passed.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [, , CDP = "http://127.0.0.1:9222", BASE = "http://127.0.0.1:4173", OUT = "."] =
  process.argv;

const ROUTES = ["/", "/capabilities/", "/work/", "/collaborate/", "/about/", "/contact/", "/privacy/"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const PRIMARY_CTA = "조직 AI 적용 상담 요청";

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

  // F-001: every visible a[href]/button/[role=button], width AND height,
  // not a partial selector list. "Visible" is a genuine viewport-intersection
  // test (real box, non-zero size, actually on-screen) rather than a
  // hardcoded class exclusion — this is what correctly excludes the
  // skip-link's offscreen idle state (top:-100px) without special-casing it,
  // while a separate skiplink test below still covers its focused state.
  const targetEls = [...document.querySelectorAll("a[href], button, [role='button']")];
  const smallTargets = targetEls
    .map(el => ({ el, r: el.getBoundingClientRect(), cs: getComputedStyle(el) }))
    .filter(({ r, cs }) => r.width > 0 && r.height > 0 &&
      r.right > 0 && r.bottom > 0 && r.left < window.innerWidth && r.top < window.innerHeight &&
      cs.visibility !== "hidden" && cs.display !== "none")
    .filter(({ r }) => r.width < 44 || r.height < 44)
    .map(({ el, r }) => el.tagName.toLowerCase() + ":" + el.textContent.trim().slice(0, 18) +
               "(" + Math.round(r.width) + "x" + Math.round(r.height) + "px)");
  return {
    overflow, widest, primaries, smallTargets,
    innerWidth: window.innerWidth,
    scrollWidth: doc.scrollWidth,
    toggleVisible: !!toggleBox && toggleBox.width > 0 &&
      toggleBox.right <= window.innerWidth + 1 && toggleBox.left >= -1,
    bannerVisible: !!document.querySelector(".preview-banner"),
    bodyFontPx: parseFloat(getComputedStyle(document.body).fontSize),
    h1Px: (() => { const h = document.querySelector("h1");
                   return h ? Math.round(parseFloat(getComputedStyle(h).fontSize)) : 0; })(),
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

// F-002: verifies background scroll is actually locked while the mobile menu
// is open. Uses CDP's Input.dispatchMouseEvent(mouseWheel) rather than a
// page-script-dispatched WheelEvent, because a script-dispatched event never
// triggers the browser's native scroll response (only trusted/OS-level input
// does) — a script-only test here would pass regardless of whether the CSS
// fix works, which is exactly the kind of check that missed real defects
// before (see F-001's prior partial-selector audit).
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

  // behavior:"instant" overrides the site's CSS scroll-behavior:smooth for
  // this call — without it, scrollTo animates and every read below lands
  // mid-animation, producing unstable, non-reproducible baseline values.
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
// Headless windows are never "active", so :focus / :focus-visible would not match
// and focus assertions would fail for harness reasons rather than page defects.
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
    record(`banner ${tag}`, "PRIVATE PREVIEW 배너 렌더링", r.bannerVisible);
    record(`bodyfont ${tag}`, `body font-size >= 16px (${r.bodyFontPx})`, r.bodyFontPx >= 16);

    const h1Min = vp.mobile ? 36 : 48;
    const h1Max = vp.mobile ? 44 : 64;
    record(`h1 ${tag}`, `H1 ${h1Min}–${h1Max}px 범위 (${r.h1Px}px)`,
      r.h1Px >= h1Min && r.h1Px <= h1Max);

    if (route !== "/privacy/") {
      const ctas = r.primaries;
      record(`cta ${tag}`, `Primary CTA 문구·링크 정확`,
        ctas.length > 0 &&
        ctas.every((c) => c.text === PRIMARY_CTA) &&
        ctas.every((c) => c.href === "/contact/" || c.href.startsWith("mailto:")) &&
        ctas.every((c) => c.h >= 44),
        JSON.stringify(ctas));
    }

    record(`touch ${tag}`, "모든 visible a[href]/button 44x44px 이상 (width+height)",
      r.smallTargets.length === 0, r.smallTargets.join(", "));

    // Screenshot before any interaction, so the evidence shows the default state.
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

      // Capture the open mobile navigation as its own required page state.
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
    // The reveal is a 0.15s transition; measure after it settles.
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
console.log("\nJERRYBAY Phase 1 — Browser QA (Chrome / CDP)\n" + "=".repeat(78));
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${pad(r.id, 26)} ${r.name}${r.detail ? `  [${r.detail}]` : ""}`);
}
console.log("=".repeat(78));
console.log(`${results.length - failed}/${results.length} browser checks passed.\n`);
process.exit(failed ? 1 : 0);
