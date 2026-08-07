/* JERRYBAY Personal Revenue Portfolio v3 — progressive enhancement only.
   The site is fully readable and navigable with JavaScript disabled. */
(function () {
  "use strict";

  // Resume print trigger. The button is a real <a href="/resume/"> so the
  // page still works with JS disabled; this only upgrades it to call print().
  document.querySelectorAll("[data-print-trigger]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.print();
    });
  });

  // Content board category filter (/insights/). Without JS every card stays
  // visible, so the board is still fully readable with JS disabled.
  var filterGroup = document.querySelector(".content-filter");
  if (filterGroup) {
    var cards = document.querySelectorAll(".content-card");
    filterGroup.addEventListener("click", function (e) {
      var btn = e.target.closest(".content-filter__btn");
      if (!btn) return;
      filterGroup.querySelectorAll(".content-filter__btn").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      var filter = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = filter === "전체" || card.getAttribute("data-category") === filter;
        card.hidden = !show;
      });
    });
  }

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

  // ESC closes and returns focus to the trigger.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      close(true);
    }
  });

  // Clicking a destination closes the panel.
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) close(false);
  });

  // Leaving the panel by keyboard closes it.
  document.addEventListener("focusin", function (e) {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    close(false);
  });

  // Reset state when crossing the desktop breakpoint.
  var onChange = function () { if (!mq.matches) close(false); };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);

  close(false);
})();
