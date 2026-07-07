// Render an Old English alliterative line: four strong beats (two per half-line),
// a medial caesura, and the alliterating staves highlighted. Each word is
// [text, lift(0|1), stave(0|1)]; lift = a strong beat, stave = an alliterating word.
// renderAllit(el, {lines:[{up?, a:[…words…], b:[…words…]}], legend?, attr?})
(function () {
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function word(w) {
    var d = el("span", "al-w" + (w[1] ? " lift" : "") + (w[2] ? " stave" : ""));
    d.appendChild(el("span", "wt", w[0]));   // lifts show by weight, staves by colour — no mark row
    return d;
  }
  function half(arr) { var h = el("span", "al-half"); arr.forEach(function (w) { h.appendChild(word(w)); }); return h; }
  function renderAllit(node, spec) {
    if (!node) return;
    node.textContent = ""; node.className = "allit";
    spec.lines.forEach(function (L) {
      var line = el("div", "al-line");
      if (L.up) line.appendChild(el("span", "al-up", L.up));
      line.appendChild(half(L.a));
      line.appendChild(el("span", "al-caes", "‖"));       // ‖ caesura
      line.appendChild(half(L.b));
      node.appendChild(line);
    });
    if (spec.legend) node.appendChild(el("div", "al-legend", spec.legend));
    if (spec.attr) node.appendChild(el("div", "al-attr", spec.attr));
  }
  window.renderAllit = renderAllit;
})();
