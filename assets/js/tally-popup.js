/* Shared JERRYBAY consultation popup.
   Tally owns the visible form title; site code only controls the modal shell
   and public-safe attribution. */
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

    // Do not forward values that resemble common direct identifiers.
    if (/@/.test(text) || /(?:\+?\d[\d\s().-]{7,}\d)/.test(text)) return "";

    var unsafe = allowSlash
      ? /[^\p{L}\p{N} /._~-]/gu
      : /[^\p{L}\p{N} ._~-]/gu;
    return text.replace(unsafe, "").replace(/\s+/g, " ").slice(0, maxLength);
  }

  function getAttribution(trigger) {
    var fields = {
      source: "jerrybay",
      source_page: safeValue(window.location.pathname, 160, true) || "/",
      cta: safeValue(
        trigger.getAttribute("data-tally-cta") || trigger.textContent,
        80,
        false
      ) || "consultation",
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
    Object.keys(fields).forEach(function (key) {
      url.searchParams.set(key, fields[key]);
    });
    return url.toString();
  }

  function loadWidget() {
    if (window.Tally && typeof window.Tally.openPopup === "function") {
      return Promise.resolve(window.Tally);
    }
    if (widgetPromise) return widgetPromise;

    widgetPromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = WIDGET_URL;
      script.async = true;
      script.dataset.tallyWidget = "true";
      script.onload = function () {
        if (window.Tally && typeof window.Tally.openPopup === "function") {
          resolve(window.Tally);
        } else {
          reject(new Error("Tally widget unavailable"));
        }
      };
      script.onerror = function () {
        reject(new Error("Tally widget failed to load"));
      };
      document.head.appendChild(script);
    });

    return widgetPromise;
  }

  function getCloseFocusTarget(trigger) {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var openedFromPrimaryNav = !!trigger.closest("#primary-nav");
    var toggleIsVisible = navToggle && navToggle.getClientRects().length > 0;

    return openedFromPrimaryNav && toggleIsVisible ? navToggle : trigger;
  }

  function openPopup(trigger) {
    if (opening) return;
    opening = true;
    var fields = getAttribution(trigger);

    loadWidget().then(function (tally) {
      var originalUrl = window.location.pathname + window.location.search + window.location.hash;
      var strippedQuery = !!window.location.search || !!window.location.hash;

      try {
        // Tally also forwards the host query automatically. Strip it only for
        // the synchronous popup creation so only the safe whitelist is sent.
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

  function addFloatingTrigger() {
    if (document.querySelector("[data-tally-floating]")) return;
    var trigger = document.createElement("a");
    trigger.href = FORM_URL;
    trigger.className = "tally-floating-trigger";
    trigger.setAttribute("data-tally-popup", "");
    trigger.setAttribute("data-tally-floating", "");
    trigger.setAttribute("data-tally-cta", "floating-consultation");
    trigger.setAttribute("aria-label", "상담 문의 열기");
    trigger.innerHTML = '<span aria-hidden="true">✦</span><span>상담 문의</span>';
    document.body.appendChild(trigger);
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-tally-popup]");
    if (!trigger) return;
    event.preventDefault();
    openPopup(trigger);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addFloatingTrigger, { once: true });
  } else {
    addFloatingTrigger();
  }

  window.JerrybayTallyPopup = Object.freeze({ formId: FORM_ID, open: openPopup });
})();
