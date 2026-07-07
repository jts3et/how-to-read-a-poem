// Static aligned scansion. Each syllable is a column: an accent ictus (´) sits above
// the stressed syllable (nothing above a slack), and the syllable text itself goes accent
// when strong — the same visual key the breath page uses to mark beats. Quantitative marks
// (— long, ∪ short) pass through as symbols. A word split across a foot boundary is joined
// with a hyphen. Data: {attr, lines:[[foot,...]]}; foot = [[syl, mark, cont?],…] where
// cont === 0 marks a syllable that continues the previous word (so a hyphen precedes it).
(function () {
  var HY = "‑"; // non-breaking hyphen
  function div(cls, txt) { var e = document.createElement("div"); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function renderScan(el, spec) {
    if (!el) return;
    spec.lines.forEach(function (line) {
      var flat = []; line.forEach(function (f) { f.forEach(function (p) { flat.push(p); }); });
      var gi = 0, ln = div("sline");
      line.forEach(function (foot) {
        var ft = div("sfoot");
        foot.forEach(function (p) {
          var mark = p[1], next = flat[gi + 1];
          var strong = (mark === "S" || mark === "—");
          var quant = (mark === "—" || mark === "∪");   // quantity keeps its symbol; stress shows by weight/colour only
          var hyph = next && next[2] === 0;             // next syllable continues this word
          var sy = div("ssyl" + (strong ? " on" : ""));
          if (quant) sy.appendChild(div("sq", mark));
          sy.appendChild(div("st", p[0] + (hyph ? HY : "")));
          ft.appendChild(sy); gi++;
        });
        ln.appendChild(ft);
      });
      el.appendChild(ln);
    });
    if (spec.attr) el.appendChild(div("sattr", spec.attr));
  }
  window.renderScan = renderScan;
})();
