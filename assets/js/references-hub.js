/* Progressive enhancement for the static, indexable content archive. */
(function () {
  "use strict";

  var list = document.querySelector("[data-content-list]");
  var result = document.querySelector("[data-content-result]");
  if (!list || !result) return;

  var type = new URLSearchParams(window.location.search).get("type");
  var activeType = type === "project" ? "project" : "all";
  var cards = Array.prototype.slice.call(list.querySelectorAll("[data-content-type]"));

  cards.forEach(function (card) {
    card.hidden = activeType !== "all" && card.getAttribute("data-content-type") !== activeType;
  });

  var visibleCount = cards.filter(function (card) { return !card.hidden; }).length;
  result.textContent = activeType === "project" ? "프로젝트 " + visibleCount + "개" : "전체 콘텐츠 " + visibleCount + "개";

  Array.prototype.forEach.call(document.querySelectorAll("[data-content-filter]"), function (link) {
    if (link.getAttribute("data-content-filter") === activeType) link.setAttribute("aria-current", "page");
  });
})();
