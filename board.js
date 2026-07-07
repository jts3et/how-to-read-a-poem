// Presenter board: poll scan_submissions for a room+line and project the room's variation.
(function () {
  var room = ROOM, timer = null;

  function q(id) { return document.getElementById(id); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  function fetchRows(lineId, cb) {
    var url = SUPA.url + "/rest/v1/scan_submissions?room=eq." + encodeURIComponent(room) +
      "&line_id=eq." + encodeURIComponent(lineId) + "&select=stress,feet,meter,participant&order=created_at.desc&limit=500";
    fetch(url, { headers: { apikey: SUPA.key, Authorization: "Bearer " + SUPA.key } })
      .then(function (r) { return r.json(); }).then(cb).catch(function () { cb([]); });
  }

  function render() {
    var line = WORKSHOP_LINES.filter(function (l) { return l.id === q("boardLine").value; })[0];
    if (!line) return;
    fetchRows(line.id, function (rows) {
      q("bcount").textContent = rows.length;
      var n = line.syl.length;
      var sc = new Array(n).fill(0), bc = new Array(n).fill(0), meters = {};
      rows.forEach(function (r) {
        var s = r.stress || "";
        for (var i = 0; i < n; i++) if (s[i] === "S") sc[i]++;
        (r.feet ? r.feet.split(",") : []).forEach(function (k) { k = +k; if (k >= 1 && k < n) bc[k]++; });
        var m = (r.meter || "").trim() || "(none named)"; meters[m] = (meters[m] || 0) + 1;
      });
      var tot = rows.length || 1;

      var row = el("div", "boardrow");
      for (var i = 0; i < n; i++) {
        if (i > 0) {
          var g = el("div", "bgap");
          var pct = bc[i] / tot;
          var bar = el("div", "bar"); bar.style.height = Math.round(4 + pct * 60) + "px";
          bar.style.opacity = String(0.25 + 0.75 * pct);
          g.appendChild(el("div", "bn", bc[i] || ""));
          g.appendChild(bar);
          if (line.sp[i]) g.style.minWidth = "20px";
          row.appendChild(g);
        }
        var col = el("div", "bsyl");
        var p = Math.round(100 * sc[i] / tot);
        col.appendChild(el("div", "pct", p + "%"));
        var heat = el("div", "heat");
        var fill = el("div", "fill"); fill.style.height = p + "%"; heat.appendChild(fill);
        col.appendChild(heat);
        col.appendChild(el("div", "btxt", line.syl[i]));
        row.appendChild(col);
      }
      var host = q("boardViz"); host.innerHTML = ""; host.appendChild(row);
      host.appendChild(el("div", "src", "Bar height = share of the room marking that syllable stressed; the gaps show how many placed a foot boundary there."));

      var ul = el("ul", "metertally");
      var keys = Object.keys(meters).sort(function (a, b) { return meters[b] - meters[a]; });
      if (!keys.length) ul.appendChild(el("li", null, "— no meters named yet —"));
      keys.forEach(function (k) {
        var li = el("li");
        li.appendChild(el("span", null, k));
        var right = el("span"); var bar = el("span", "mbar"); bar.style.width = (14 + 90 * meters[k] / tot) + "px";
        right.appendChild(bar); right.appendChild(document.createTextNode(" " + meters[k]));
        right.style.display = "flex"; right.style.gap = "8px"; right.style.alignItems = "center";
        li.appendChild(right); ul.appendChild(li);
      });
      var mh = q("meterBox"); mh.innerHTML = ""; mh.appendChild(ul);
    });
  }

  function start() {
    if (timer) clearInterval(timer);
    render();
    timer = setInterval(function () { if (!document.hidden) render(); }, 3000);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var sel = q("boardLine");
    WORKSHOP_LINES.forEach(function (l) {
      var label = (l.mode === "submit" ? "▶ " : "") + l.poet + " — " + l.syl.join("").replace(/([a-z])([A-Z])/g, "$1 $2").slice(0, 28);
      sel.appendChild(new Option(l.poet + " · " + l.src, l.id));
    });
    q("roomInput").value = room;
    q("roomInput").addEventListener("change", function () { room = this.value.trim() || "disi"; start(); });
    sel.addEventListener("change", start);
    q("refreshBtn").addEventListener("click", render);
    start();
  });
})();
