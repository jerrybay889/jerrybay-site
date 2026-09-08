/* JERRYBAY source-finalized progressive enhancement. */
(function () {
  "use strict";

  var FORM_URL = "https://tally.so/r/Y5bypd";
  var pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  var links = [
    { key: "about", label: "소개", href: "/about/" },
    { key: "business", label: "기업·기관", href: "/business/" },
    { key: "insights", label: "인사이트", href: "/insights/" },
    { key: "references", label: "레퍼런스", href: "/references/" },
    { key: "inquiry", label: "협업 문의", href: FORM_URL, popup: true },
  ];

  function isCurrent(key) {
    if (key === "about") return pathname === "/about";
    if (key === "business") return pathname === "/business";
    if (key === "insights") return pathname === "/insights" || pathname.indexOf("/insights/") === 0;
    if (key === "references") return pathname === "/references" || pathname.indexOf("/references/") === 0;
    return false;
  }

  function appendLinks(nav) {
    var fragment = document.createDocumentFragment();
    links.forEach(function (item) {
      var anchor = document.createElement("a");
      anchor.href = item.href;
      anchor.textContent = item.label;
      if (item.popup) anchor.setAttribute("data-tally-popup", "");
      if (isCurrent(item.key)) anchor.setAttribute("aria-current", "page");
      fragment.appendChild(anchor);
    });
    nav.replaceChildren(fragment);
  }

  var headerNav = document.getElementById("primary-nav");
  if (headerNav) {
    headerNav.setAttribute("aria-label", "주 메뉴");
    appendLinks(headerNav);
  }
  document.querySelectorAll(".site-footer nav").forEach(function (nav) { appendLinks(nav); });

  var brand = document.querySelector(".site-header .brand");
  if (brand) {
    if (pathname === "/") brand.setAttribute("aria-current", "page");
    else brand.removeAttribute("aria-current");
  }
})();

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
      anchor.textContent = anchor.closest("nav") ? "협업 문의" : "기업·기관 협업 문의";
    });
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("a[data-tally-popup]");
    if (!trigger) return;
    event.preventDefault();
    openPopup(trigger);
  });

  function init() {
    normalizeInquiryLinks();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();

  window.JerrybayTallyPopup = Object.freeze({ formId: FORM_ID, open: openPopup });
})();
