// Presenter board: aggregate multi-line submissions for a poem and project the room's
// variation line by line, plus the meter and verse-form tallies. Polls every 3s.
(function () {
  var room = ROOM, timer = null;
  function q(id) { return document.getElementById(id); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  function fetchRows(poemId, cb) {
    var url = SUPA.url + "/rest/v1/scan_submissions?room=eq." + encodeURIComponent(room) +
      "&line_id=like." + encodeURIComponent(poemId + ":") + "*" +
      "&select=line_id,stress,feet,meter,form&order=created_at.desc&limit=1500";
    fetch(url, { headers: { apikey: SUPA.key, Authorization: "Bearer " + SUPA.key } })
      .then(function (r) { return r.json(); }).then(cb).catch(function () { cb([]); });
  }

  function lineHeat(poemLine, rows) {
    var n = poemLine.syl.length, sc = new Array(n).fill(0), bc = new Array(n).fill(0), tot = rows.length || 1;
    rows.forEach(function (r) {
      var s = r.stress || ""; for (var i = 0; i < n; i++) if (s[i] === "S") sc[i]++;
      (r.feet ? r.feet.split(",") : []).forEach(function (k) { k = +k; if (k >= 1 && k < n) bc[k]++; });
    });
    var row = el("div", "boardrow");
    for (var i = 0; i < n; i++) {
      if (i > 0) {
        var g = el("div", "bgap"); var p = bc[i] / tot;
        var bar = el("div", "bar"); bar.style.height = Math.round(4 + p * 44) + "px"; bar.style.opacity = String(0.25 + 0.75 * p);
        g.appendChild(el("div", "bn", bc[i] || "")); g.appendChild(bar);
        if (poemLine.sp[i]) g.style.minWidth = "16px"; row.appendChild(g);
      }
      var col = el("div", "bsyl"); var pct = Math.round(100 * sc[i] / tot);
      col.appendChild(el("div", "pct", pct + "%"));
      var heat = el("div", "heat"); var fill = el("div", "fill"); fill.style.height = pct + "%"; heat.appendChild(fill); col.appendChild(heat);
      col.appendChild(el("div", "btxt", poemLine.syl[i])); row.appendChild(col);
    }
    return row;
  }

  function tally(rows, key) {
    var m = {}; rows.forEach(function (r) { var v = (r[key] || "").trim() || "(none)"; m[v] = (m[v] || 0) + 1; }); return m;
  }
  function tallyUl(m, tot) {
    var ul = el("ul", "metertally"), keys = Object.keys(m).sort(function (a, b) { return m[b] - m[a]; });
    if (!keys.length) { ul.appendChild(el("li", null, "— none yet —")); return ul; }
    keys.forEach(function (k) { var li = el("li"); li.appendChild(el("span", null, k));
      var right = el("span"); right.style.display = "flex"; right.style.gap = "8px"; right.style.alignItems = "center";
      var bar = el("span", "mbar"); bar.style.width = (14 + 90 * m[k] / (tot || 1)) + "px"; right.appendChild(bar);
      right.appendChild(document.createTextNode(" " + m[k])); li.appendChild(right); ul.appendChild(li); });
    return ul;
  }

  function render() {
    var poem = WORKSHOP_POEMS.filter(function (p) { return p.id === q("boardLine").value; })[0];
    if (!poem) return;
    fetchRows(poem.id, function (rows) {
      var byLine = {}; rows.forEach(function (r) { var i = +(r.line_id.split(":")[1]); (byLine[i] = byLine[i] || []).push(r); });
      var first = byLine[0] || [];
      q("bcount").textContent = first.length;
      var host = q("boardViz"); host.innerHTML = "";
      poem.lines.forEach(function (ln, i) { host.appendChild(lineHeat(ln, byLine[i] || [])); });
      host.appendChild(el("div", "src", "Bar height over a syllable = share of the room marking it stressed; the gaps show foot-boundary placements."));
      var mb = q("meterBox"); mb.innerHTML = "";
      mb.appendChild(el("h3", null, "Meter")); mb.appendChild(tallyUl(tally(first, "meter"), first.length));
      mb.appendChild(el("h3", null, "Verse form")); mb.appendChild(tallyUl(tally(first, "form"), first.length));
    });
  }

  function start() { if (timer) clearInterval(timer); render(); timer = setInterval(function () { if (!document.hidden) render(); }, 3000); }

  document.addEventListener("DOMContentLoaded", function () {
    var sel = q("boardLine");
    WORKSHOP_POEMS.forEach(function (p) { sel.appendChild(new Option(p.poet + " · " + p.src, p.id)); });
    q("roomInput").value = room;
    q("roomInput").addEventListener("change", function () { room = this.value.trim() || "disi"; start(); });
    sel.addEventListener("change", start);
    q("refreshBtn").addEventListener("click", render);
    start();
  });
})();
