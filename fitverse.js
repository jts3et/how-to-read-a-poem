// A line of verse never breaks before its real line break. Readers new to poems
// take a wrapped line for two lines, so lineation is the one thing this script will
// not give up. In order of preference, when a card (or the column a card is inset
// in) is too narrow for its longest line:
//   1. a margin label ("alexandrine") drops below its line;
//   2. the type shrinks, uniformly across the poem, down to FLOOR px;
//   3. a side-by-side block (poem | translation, poem | scansion) goes interlinear;
//   4. the card scrolls sideways. The line still never wraps.
//
// Covers every way the site sets verse:
//   .verse   plain pre-wrap block (one element, many lines)
//   .poem    rhyme-mapped poem (rhyme.js): one .ptext per line
//   .palign  aligned parallel columns (paralign.js): one .pa-txt / .ptext per cell
//   .sline / .al-line  scansion and alliteration rows (fixed-size chips; scaled by zoom)
(function () {
  var FLOOR = 11, ZMIN = 0.6, STACK = 0.75, t;
  var q = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  function base(el) {                       // the element's own size before we touched it
    if (!el.dataset.fitBase) el.dataset.fitBase = parseFloat(getComputedStyle(el).fontSize);
    return parseFloat(el.dataset.fitBase);
  }
  function ratio(el) {                      // available / needed width; the line is held on one line
    el.style.whiteSpace = "nowrap"; el.style.minWidth = "0";
    var need = el.scrollWidth, have = el.clientWidth;
    return need > have + 1 ? have / need : 1;
  }

  // Fit a group of one-line elements with one shared scale factor.
  // Returns false when the longest line still does not fit at FLOOR.
  function fitLines(lines) {
    lines = lines.filter(function (el) { return el.clientWidth > 0 || el.offsetParent; });
    if (!lines.length) return true;
    lines.forEach(function (el) {
      base(el); el.style.fontSize = "";
      var row = el.parentNode; if (row && row.classList.contains("pline")) row.classList.remove("lab-below");
    });
    lines.forEach(function (el) {
      var row = el.parentNode;
      if (row && row.classList.contains("pline") && row.querySelector(".plabel") && ratio(el) < 1) row.classList.add("lab-below");
    });
    var k = 1;
    lines.forEach(function (el) { k = Math.min(k, ratio(el)); });
    if (k >= 1) return true;
    lines.forEach(function (el) { el.style.fontSize = Math.max(FLOOR, base(el) * k * 0.985) + "px"; });
    var ok = true;
    lines.forEach(function (el) {           // one correction pass at the new size
      var r = ratio(el);
      if (r < 1) {
        var fs = parseFloat(el.style.fontSize) * r * 0.99;
        if (fs >= FLOOR) el.style.fontSize = fs + "px";
        else { el.style.fontSize = FLOOR + "px"; ok = false; }
      }
    });
    return ok;
  }

  // Plain .verse: one element whose lines are newline-separated.
  function fitBlock(el) {
    base(el); el.style.fontSize = ""; el.classList.remove("fit-scroll");
    if (!el.clientWidth) return;
    var cs = getComputedStyle(el);
    var pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    var have = el.clientWidth - pad;
    var probe = el.cloneNode(true);
    probe.removeAttribute("style");
    probe.style.position = "absolute"; probe.style.visibility = "hidden";
    probe.style.whiteSpace = "pre"; probe.style.width = "auto"; probe.style.fontSize = cs.fontSize;
    el.parentNode.appendChild(probe);
    var need = probe.scrollWidth - pad;
    probe.remove();
    if (need <= have + 1) return;
    var fs = base(el) * (have / need) * 0.985;
    el.style.fontSize = Math.max(FLOOR, fs) + "px";
    if (fs < FLOOR) el.classList.add("fit-scroll");   // pre + sideways scroll: never wrap
  }

  // Scansion and alliteration rows: scale each row whole with CSS zoom, one factor per block.
  function room(el) {
    var p = el.parentNode, cs = getComputedStyle(p);
    return p.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  }
  function fitChips(rows) {                 // returns the zoom applied (1 = untouched)
    if (!rows.length) return 1;
    rows.forEach(function (el) { el.style.zoom = ""; });
    var k = 1;
    rows.forEach(function (el) { var w = el.scrollWidth, r = room(el); if (w && r > 0) k = Math.min(k, r / w); });
    if (k >= 1) return 1;
    var z = Math.max(ZMIN, k * 0.985);
    rows.forEach(function (el) { el.style.zoom = z; });
    return z;
  }

  function fitGrid(g) {
    var cells = q(":scope > .pa-cell", g), cols = [[], []], chips = [[], []];
    cells.forEach(function (c, i) {
      if (c.classList.contains("pa-acell")) return;
      q(".pa-txt, .ptext", c).concat(c.classList.contains("pa-txt") ? [c] : []).forEach(function (l) { cols[i % 2].push(l); });
      q(".sline, .al-line", c).forEach(function (l) { chips[i % 2].push(l); });
    });
    function pass() {
      var ok = cols.map(fitLines).every(Boolean);
      var z = Math.min.apply(null, chips.map(fitChips));
      return ok && z >= STACK;
    }
    g.classList.remove("pa-stack", "fit-scroll");
    if (pass()) return;
    g.classList.add("pa-stack");            // interlinear: each line with its partner beneath
    if (!pass()) g.classList.add("fit-scroll");
  }

  function all() {
    q(".palign").forEach(fitGrid);
    q(".scanbox, .scanmod, .allit").forEach(function (b) {
      if (!b.closest(".palign")) fitChips(q(".sline, .al-line", b));
    });
    q(".poem").forEach(function (p) {
      if (p.closest(".palign")) return;
      p.classList.remove("fit-scroll");
      if (!fitLines(q(".ptext", p))) p.classList.add("fit-scroll");
    });
    q(".verse").forEach(function (v) { if (!v.closest(".palign")) fitBlock(v); });
    document.dispatchEvent(new Event("versefit"));   // rhyme arcs redraw against the new line heights
  }

  function run() { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(all); }
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run);   // load after paralign.js so the grids exist first
  window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(all, 150); });
  // an era opening, or the page becoming visible, can change the room a card has
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".era > h2")) setTimeout(all, 60); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) all(); });
})();
