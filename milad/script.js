/* Milad's page (CPSC 581, Group Project 1) */

const TEAM_LINKS = {
  A: "../annas/index.html", // Annas
  M: "../mo/index.html", // MO
  H: "../hafiz/index.html", // Hafiz
};

(function () {
  const DESIGN_WIDTH = 2400;
  const DESIGN_HEIGHT = 2000;
  const wrap = document.querySelector(".stage-wrap");
  const stage = document.querySelector(".stage");

  // Scale the 2400 x 2000 design to the width of the window.
  function fit() {
    const scale = wrap.clientWidth / DESIGN_WIDTH;
    stage.style.transform = "scale(" + scale + ")";
    wrap.style.height = DESIGN_HEIGHT * scale + "px";
  }
  fit();
  window.addEventListener("resize", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  // Teammate links + highlight a button and its row together.
  document.querySelectorAll(".web .mate").forEach(function (link) {
    const url = TEAM_LINKS[link.dataset.mate];
    if (url) {
      link.setAttribute("href", url);
      link.setAttribute("tabindex", "0");
    }
  });
  document.querySelectorAll("[data-mate]").forEach(function (el) {
    const key = el.dataset.mate;
    const pair = document.querySelectorAll('[data-mate="' + key + '"]');
    function on() { pair.forEach(function (p) { p.classList.add("is-on"); }); }
    function off() { pair.forEach(function (p) { p.classList.remove("is-on"); }); }
    el.addEventListener("mouseenter", on);
    el.addEventListener("mouseleave", off);
    el.addEventListener("focus", on);
    el.addEventListener("blur", off);
  });
})();
