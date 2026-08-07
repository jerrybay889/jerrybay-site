/* Progressive enhancement for the static, indexable reference archive. */
(function () {
  "use strict";

  var list = document.querySelector("[data-content-list]");
  var result = document.querySelector("[data-content-result]");
  if (!list || !result) return;

  var type = new URLSearchParams(window.location.search).get("type");
  var types = ["project", "lecture", "planning", "government"];
  var activeType = types.indexOf(type) >= 0 ? type : "all";
  var cards = Array.prototype.slice.call(list.querySelectorAll("[data-content-type]"));

  cards.forEach(function (card) {
    card.hidden = activeType !== "all" && card.getAttribute("data-content-type") !== activeType;
  });

  var visibleCount = cards.filter(function (card) { return !card.hidden; }).length;
  var labels = {
    project: "프로젝트",
    lecture: "강의",
    planning: "기획",
    government: "정부사업"
  };
  result.textContent = activeType === "all"
    ? "전체 레퍼런스 " + visibleCount + "개"
    : labels[activeType] + " 레퍼런스 " + visibleCount + "개";

  Array.prototype.forEach.call(document.querySelectorAll("[data-content-filter]"), function (link) {
    if (link.getAttribute("data-content-filter") === activeType) link.setAttribute("aria-current", "page");
  });
})();
