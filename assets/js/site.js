/* JERRYBAY Phase 1 Private Preview — progressive enhancement only.
   The site is fully readable and navigable with JavaScript disabled. */
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
