// A metrical foot drawn as a walk between the two levels of the voice — long (high)
// and short (low). Each syllable is a point; the line between points is the movement.
// footWalk("—∪∪") returns an <svg>. Longer runs make longer walks; that is the whole
// combinatorial point rendered visible.
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function elNS(t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); return e; }

  function footWalk(pattern, opts) {
    opts = opts || {};
    var syl = pattern.split("").filter(function (c) { return c === "—" || c === "∪"; });
    var n = syl.length, step = opts.step || 20, padX = 11, hi = 9, lo = 29, h = 40;
    var w = n <= 1 ? padX * 2 + 6 : padX * 2 + (n - 1) * step;
    var svg = elNS("svg", { viewBox: "0 0 " + w + " " + h, width: w, height: h, "class": "walk" });
    [hi, lo].forEach(function (y) { svg.appendChild(elNS("line", { x1: padX, x2: w - padX, y1: y, y2: y, "class": "wg" })); });
    var pts = syl.map(function (c, i) { return [padX + (n <= 1 ? 3 : i * step), c === "—" ? hi : lo]; });
    svg.appendChild(elNS("polyline", { points: pts.map(function (p) { return p[0] + "," + p[1]; }).join(" "), "class": "wl" }));
    pts.forEach(function (p) { svg.appendChild(elNS("circle", { cx: p[0], cy: p[1], r: 3, "class": "wd" })); });
    return svg;
  }

  // Build a labelled card (walk + name + pattern) for a foot.
  function footCard(foot) {
    var d = document.createElement("div"); d.className = "footcard" + (foot.prod ? " prod" : "");
    d.appendChild(footWalk(foot.p));
    var nm = document.createElement("div"); nm.className = "fname"; nm.textContent = foot.n; d.appendChild(nm);
    var pt = document.createElement("div"); pt.className = "fpat"; pt.textContent = foot.p; d.appendChild(pt);
    return d;
  }

  window.footWalk = footWalk;
  window.footCard = footCard;
})();
