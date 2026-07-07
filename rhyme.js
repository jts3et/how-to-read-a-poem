// Visual rhyme-scheme diagram. renderRhyme(el, {cap, scheme, meta, marks}).
// scheme: letters, whitespace separates stanza groups (e.g. "ABAB CDCD EFEF GG").
// marks: {lineNumber: "label"} to annotate a line (volta, refrain, ...).
(function () {
  var COLORS = ["#b8593f","#4a6b78","#5a8a5f","#b8860b","#7a6b9a","#6b8cae",
                "#a07850","#a85a6e","#3f7d54","#8a6d3b","#527a86","#96602f"];
  function color(l) { var i = l.toUpperCase().charCodeAt(0) - 65; return COLORS[((i % COLORS.length) + COLORS.length) % COLORS.length]; }
  function div(c, t) { var e = document.createElement("div"); if (c) e.className = c; if (t != null) e.textContent = t; return e; }
  function renderRhyme(el, spec) {
    el.classList.add("rhyme");
    if (spec.cap) el.appendChild(div("rcap", spec.cap));
    var groups = spec.scheme.trim().split(/\s+/), n = 0;
    groups.forEach(function (g, gi) {
      g.split("").forEach(function (ltr, li) {
        n++;
        var row = div("rrow" + (gi > 0 && li === 0 ? " brk" : ""));
        var b = div("rbadge", ltr.toUpperCase()); b.style.background = color(ltr);
        row.appendChild(b); row.appendChild(div("rline"));
        if (spec.marks && spec.marks[n]) row.appendChild(div("rlabel", spec.marks[n]));
        el.appendChild(row);
      });
    });
    if (spec.meta) el.appendChild(div("rmeta", spec.meta));
  }
  window.renderRhyme = renderRhyme;
})();
