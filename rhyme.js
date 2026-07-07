// Map a rhyme scheme onto the actual poem: each line gets a coloured rhyme badge,
// and an SVG arc diagram in the left gutter links the rhyming lines (nested for
// enclosed rhyme, crossing for alternating) — the computational-poetics view.
// mapRhyme(el, {scheme, marks, meta}); el holds the poem as text (newlines = breaks,
// blank line = stanza break, a line starting with an em dash = attribution).
(function () {
  var COLORS = ["#b8593f","#4a6b78","#5a8a5f","#b8860b","#7a6b9a","#6b8cae",
                "#a07850","#a85a6e","#3f7d54","#8a6d3b","#527a86","#96602f"];
  function color(l) { var i = l.toUpperCase().charCodeAt(0) - 65; return COLORS[((i % COLORS.length) + COLORS.length) % COLORS.length]; }
  function div(c, t) { var e = document.createElement("div"); if (c) e.className = c; if (t != null) e.textContent = t; return e; }
  var NS = "http://www.w3.org/2000/svg";

  function drawArcs(el, rows) {
    var svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "rhyme-arcs"); el.appendChild(svg);
    function draw() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var W = 30, H = el.scrollHeight;
      svg.setAttribute("width", W); svg.setAttribute("height", H); svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      var byLetter = {};
      rows.forEach(function (r) { (byLetter[r.letter] = byLetter[r.letter] || []).push(r); });
      Object.keys(byLetter).forEach(function (L) {
        var arr = byLetter[L]; if (!L || arr.length < 2) return;
        for (var i = 0; i < arr.length - 1; i++) {
          var y1 = arr[i].badge.offsetTop + arr[i].badge.offsetHeight / 2;
          var y2 = arr[i + 1].badge.offsetTop + arr[i + 1].badge.offsetHeight / 2;
          var depth = Math.min(W - 3, 5 + Math.abs(y2 - y1) * 0.14);
          var p = document.createElementNS(NS, "path");
          p.setAttribute("d", "M " + (W - 1) + " " + y1 + " C " + (W - 1 - depth) + " " + y1 +
            " " + (W - 1 - depth) + " " + y2 + " " + (W - 1) + " " + y2);
          p.setAttribute("fill", "none"); p.setAttribute("stroke", color(L));
          p.setAttribute("stroke-width", "1.6"); p.setAttribute("opacity", "0.75");
          svg.appendChild(p);
        }
      });
    }
    requestAnimationFrame(draw);
    window.addEventListener("resize", draw);
  }

  function mapRhyme(el, spec) {
    var letters = (spec.scheme || "").replace(/\s+/g, "").split("");
    var lines = (el.textContent || "").replace(/\r/g, "").split("\n");
    while (lines.length && lines[0].trim() === "") lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    el.textContent = ""; el.className = "poem";
    var rows = [], li = 0, lineNo = 0;
    lines.forEach(function (ln) {
      var tr = ln.trim();
      if (tr === "") { el.appendChild(div("pgap")); return; }
      if (tr.charAt(0) === "—") { el.appendChild(div("pattr", tr)); return; }
      lineNo++;
      var row = div("pline"), letter = letters[li++] || "";
      var b = div("rl", letter ? letter.toUpperCase() : "");
      b.style.background = letter ? color(letter) : "transparent";
      row.appendChild(b); row.appendChild(div("ptext", tr));
      if (spec.marks && spec.marks[lineNo]) row.appendChild(div("plabel", spec.marks[lineNo]));
      el.appendChild(row); rows.push({ badge: b, letter: letter });
    });
    if (spec.meta) el.appendChild(div("pmeta", spec.meta));
    drawArcs(el, rows);
  }
  window.mapRhyme = mapRhyme;
})();
