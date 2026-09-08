/* JERRYBAY preview — progressive enhancement plus bounded owner-review cleanup. */
(function () {
  "use strict";

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  var mq = window.matchMedia("(max-width: 900px)");

  function open() {
    nav.setAttribute("data-open", "true");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "닫기";
    document.body.classList.add("nav-open");
  }

  function close(refocus) {
    nav.removeAttribute("data-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "메뉴";
    document.body.classList.remove("nav-open");
    if (refocus) toggle.focus();
  }

  toggle.addEventListener("click", function () {
    if (toggle.getAttribute("aria-expanded") === "true") close(false);
    else open();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") close(true);
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) close(false);
  });

  document.addEventListener("focusin", function (event) {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    close(false);
  });

  var onChange = function () { if (!mq.matches) close(false); };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);

  close(false);
})();

(function () {
  "use strict";

  var FORM_ID = "Y5bypd";
  var FORM_URL = "https://tally.so/r/" + FORM_ID;
  var WIDGET_URL = "https://tally.so/widgets/embed.js";
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var widgetPromise;
  var opening = false;

  function safeValue(value, maxLength, allowSlash) {
    if (!value) return "";
    var text = String(value).trim();
    if (/@/.test(text) || /(?:\+?\d[\d\s().-]{7,}\d)/.test(text)) return "";
    var unsafe = allowSlash ? /[^\p{L}\p{N} /._~-]/gu : /[^\p{L}\p{N} ._~-]/gu;
    return text.replace(unsafe, "").replace(/\s+/g, " ").slice(0, maxLength);
  }

  function getAttribution(trigger) {
    var fields = {
      source: "jerrybay",
      source_page: safeValue(window.location.pathname, 160, true) || "/",
      cta: safeValue(trigger.getAttribute("data-tally-cta") || trigger.textContent, 80, false) || "consultation",
    };
    var query = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach(function (key) {
      var value = safeValue(query.get(key), 120, false);
      if (value) fields[key] = value;
    });
    return fields;
  }

  function buildFallbackUrl(fields) {
    var url = new URL(FORM_URL);
    Object.keys(fields).forEach(function (key) { url.searchParams.set(key, fields[key]); });
    return url.toString();
  }

  function loadWidget() {
    if (window.Tally && typeof window.Tally.openPopup === "function") return Promise.resolve(window.Tally);
    if (widgetPromise) return widgetPromise;
    widgetPromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = WIDGET_URL;
      script.async = true;
      script.onload = function () {
        if (window.Tally && typeof window.Tally.openPopup === "function") resolve(window.Tally);
        else reject(new Error("Tally widget unavailable"));
      };
      script.onerror = function () { reject(new Error("Tally widget failed to load")); };
      document.head.appendChild(script);
    });
    return widgetPromise;
  }

  function getCloseFocusTarget(trigger) {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var openedFromPrimaryNav = !!trigger.closest("#primary-nav");
    var toggleVisible = navToggle && navToggle.getClientRects().length > 0;
    return openedFromPrimaryNav && toggleVisible ? navToggle : trigger;
  }

  function openPopup(trigger) {
    if (opening) return;
    opening = true;
    var fields = getAttribution(trigger);
    loadWidget().then(function (tally) {
      var originalUrl = window.location.pathname + window.location.search + window.location.hash;
      var strippedQuery = !!window.location.search || !!window.location.hash;
      try {
        if (strippedQuery) window.history.replaceState(window.history.state, "", window.location.pathname);
        tally.openPopup(FORM_ID, {
          layout: "modal",
          width: 540,
          overlay: true,
          hiddenFields: fields,
          onClose: function () { getCloseFocusTarget(trigger).focus(); },
        });
      } finally {
        if (strippedQuery) window.history.replaceState(window.history.state, "", originalUrl);
        opening = false;
      }
    }).catch(function () {
      opening = false;
      window.location.assign(buildFallbackUrl(fields));
    });
  }

  function isInquiryLink(anchor) {
    var href = anchor.getAttribute("href") || "";
    return href === FORM_URL || href.indexOf(FORM_URL + "?") === 0 ||
      href === "#contact" || href === "/#contact" || href === "/contact/" || href === "/contact";
  }

  function normalizeInquiryLinks() {
    document.querySelectorAll("a[href]").forEach(function (anchor) {
      if (!isInquiryLink(anchor)) return;
      anchor.setAttribute("data-tally-popup", "");
      anchor.href = FORM_URL;
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
    });
  }

  function applyOwnerPreviewCleanup() {
    var quickWin = document.getElementById("quick-win");
    if (quickWin) quickWin.remove();

    document.querySelectorAll(".section__label").forEach(function (label) {
      if (label.textContent.trim() === "Detail Migration") {
        var section = label.closest("section");
        if (section) section.remove();
      }
    });

    document.querySelectorAll("a").forEach(function (anchor) {
      var text = anchor.textContent.trim();
      if (text === "실행 근거 확인") {
        anchor.textContent = "프로젝트 상세 보기";
        anchor.href = "/references/?type=project";
      }
      if (text === "외부 기록 보기") anchor.textContent = "언론 기사 보기";
    });
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("a[data-tally-popup]");
    if (!trigger) return;
    event.preventDefault();
    openPopup(trigger);
  });

  function init() {
    applyOwnerPreviewCleanup();
    normalizeInquiryLinks();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();

  window.JerrybayTallyPopup = Object.freeze({ formId: FORM_ID, open: openPopup });
})();
