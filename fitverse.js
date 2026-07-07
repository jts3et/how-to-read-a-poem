// Shrink each verse/translation block just enough that its longest line fits the
// column width — lineation preserved (no wrap), no horizontal scroll.
(function () {
  var t;
  function fit(el) {
    el.style.fontSize = "";
    if (el.scrollWidth <= el.clientWidth + 1) return;
    var base = parseFloat(getComputedStyle(el).fontSize);
    var size = Math.max(9, base * (el.clientWidth / el.scrollWidth) * 0.985);
    el.style.fontSize = size + "px";
    if (el.scrollWidth > el.clientWidth + 1) {                    // one correction pass
      size = Math.max(9, size * (el.clientWidth / el.scrollWidth) * 0.99);
      el.style.fontSize = size + "px";
    }
  }
  function all() { Array.prototype.forEach.call(document.querySelectorAll(".verse"), fit); }
  if (document.readyState === "complete") all();
  else window.addEventListener("load", all);
  window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(all, 150); });
})();
