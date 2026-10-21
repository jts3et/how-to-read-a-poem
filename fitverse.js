// Keep each line of verse on one line. A verse line must never break before its
// real line break, so when a card (or the column a card is inset in) is too narrow,
// shrink the type just enough that the longest line fits — uniformly across the
// block, so every line of one poem stays the same size. Lineation preserved, no
// horizontal scroll. Below a readable floor we let the line wrap (with a hanging
// indent) rather than shrink further.
//
// Covers the three ways the site sets verse:
//   .verse   plain pre-wrap block (one element, many lines)
//   .poem    rhyme-mapped poem (rhyme.js): one .ptext per line
//   .palign  aligned parallel columns (paralign.js): one .pa-txt / .ptext per cell
(function () {
  var FLOOR = 11, t;

  function base(el) {                       // the element's own size before we touched it
    if (!el.dataset.fitBase) el.dataset.fitBase = parseFloat(getComputedStyle(el).fontSize);
    return parseFloat(el.dataset.fitBase);
  }
  function reset(el) { el.style.fontSize = ""; el.style.whiteSpace = ""; el.style.minWidth = ""; el.classList.remove("fit-wrap"); }
  function ratio(el) {                      // available / needed width for a one-line element
    el.style.whiteSpace = "nowrap"; el.style.minWidth = "0";
    var need = el.scrollWidth, have = el.clientWidth;
    return need > have + 1 ? have / need : 1;
  }

  // Fit a group of single-line elements with one shared scale factor.
  function fitLines(lines) {
    if (!lines.length) return;
    lines.forEach(function (el) { base(el); reset(el); var r = el.parentNode; if (r && r.classList.contains("pline")) r.classList.remove("lab-below"); });
    lines.forEach(function (el) {           // a margin label (e.g. "alexandrine") drops below its line before the line shrinks
      var row = el.parentNode;
      if (row && row.classList.contains("pline") && row.querySelector(".plabel") && ratio(el) < 1) row.classList.add("lab-below");
    });
    var k = 1;
    lines.forEach(function (el) { k = Math.min(k, ratio(el)); });
    if (k >= 1) return;
    lines.forEach(function (el) { el.style.fontSize = Math.max(FLOOR, base(el) * k * 0.985) + "px"; });
    lines.forEach(function (el) {           // one correction pass, then allow wrap if still too long
      var r = ratio(el);
      if (r < 1) {
        var fs = parseFloat(el.style.fontSize) * r * 0.99;
        if (fs >= FLOOR) el.style.fontSize = fs + "px";
        else { el.style.whiteSpace = ""; el.classList.add("fit-wrap"); }
      }
    });
  }

  // Plain .verse: the block is one element whose lines are newline-separated.
  function fitBlock(el) {
    base(el); el.style.fontSize = "";
    var cs = getComputedStyle(el);
    var have = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var probe = el.cloneNode(true);
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;width:auto;font-size:" + cs.fontSize;
    el.parentNode.appendChild(probe);
    var need = probe.scrollWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    probe.remove();
    if (need > have + 1) el.style.fontSize = Math.max(FLOOR, base(el) * (have / need) * 0.985) + "px";
  }

  function all() {
    var q = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
    q(".palign").forEach(function (g) {     // each column is one poem: fit the columns separately
      var cells = q(":scope > .pa-cell", g), cols = [[], []];
      cells.forEach(function (c, i) {
        if (!c.classList.contains("pa-acell")) q(".pa-txt, .ptext", c).concat(c.classList.contains("pa-txt") ? [c] : []).forEach(function (l) { cols[i % 2].push(l); });
      });
      cols.forEach(fitLines);
    });
    q(".poem").forEach(function (p) {
      if (p.closest(".palign")) return;    // already fitted with its grid
      fitLines(q(".ptext", p));
    });
    q(".verse").forEach(function (v) { if (!v.closest(".palign")) fitBlock(v); });
    document.dispatchEvent(new Event("versefit"));   // rhyme arcs redraw against the new line heights
  }

  function run() { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(all); }
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run);   // load after paralign.js so the grids exist first
  window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(all, 150); });
})();
