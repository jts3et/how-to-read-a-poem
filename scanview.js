// Static aligned scansion display. Each syllable is a column with its mark above
// it; feet are divided by rules. Data: {attr, lines:[[foot,...]]}, foot = [[syl,mark],...].
(function () {
  function div(cls, txt) { var e = document.createElement("div"); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function renderScan(el, spec) {
    spec.lines.forEach(function (line) {
      var ln = div("sline");
      line.forEach(function (foot) {
        var ft = div("sfoot");
        foot.forEach(function (p) {
          var sy = div("ssyl");
          sy.appendChild(div("sq", p[1]));
          sy.appendChild(div("st", p[0]));
          ft.appendChild(sy);
        });
        ln.appendChild(ft);
      });
      el.appendChild(ln);
    });
    if (spec.attr) el.appendChild(div("sattr", spec.attr));
  }
  window.renderScan = renderScan;
})();
