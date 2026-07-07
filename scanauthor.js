// Scansion-authoring viewer. Loads window.VERSE_POEMS (syllabified), lets you mark
// stress (click a syllable → ´) and foot boundaries (click a gap), then exports every
// scansion as window.VERSE_SCAN = { id: { lines:[…scanview feet…] } } to wire into the
// versification page. Reuses the tool's scanrow styling.
(function () {
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function readable(line) {
    var s = "";
    for (var i = 0; i < line.syl.length; i++) {
      if (i > 0 && line.sp[i] && !/[-‐‑]$/.test(line.syl[i - 1])) s += " ";
      s += line.syl[i];
    }
    return s;
  }

  function buildRow(line, host) {
    var n = line.syl.length, st = [], bounds = {};
    for (var k = 0; k < n; k++) st.push("u");
    var row = el("div", "scanrow");
    for (var i = 0; i < n; i++) {
      if (i > 0) {
        var mid = !line.sp[i];
        var g = el("span", "gap" + (mid ? "" : " word"), mid ? "‑" : "");
        (function (idx, gg) { gg.addEventListener("click", function () { bounds[idx] = !bounds[idx]; gg.classList.toggle("on", bounds[idx]); }); })(i, g);
        row.appendChild(g);
      }
      var hy = (i + 1 < n && !line.sp[i + 1]) ? "‑" : "";
      var s = el("span", "syl"), mk = el("span", "mark", ""), tx = el("span", "txt", line.syl[i] + hy);
      s.appendChild(mk); s.appendChild(tx);
      (function (idx, sEl, mkEl) { sEl.addEventListener("click", function () {
        st[idx] = st[idx] === "u" ? "S" : "u"; mkEl.textContent = st[idx] === "S" ? "´" : "";
        sEl.classList.toggle("stress", st[idx] === "S"); }); })(i, s, mk);
      row.appendChild(s);
    }
    host.appendChild(row);
    return function () {                          // → scanview feet for this line
      var feet = [], cur = [];
      for (var i = 0; i < n; i++) {
        if (i > 0 && bounds[i]) { feet.push(cur); cur = []; }
        var e = [line.syl[i], st[i]];
        if (i > 0 && !line.sp[i]) e.push(0);
        cur.push(e);
      }
      feet.push(cur);
      return feet;
    };
  }

  function buildPoem(poem, host) {
    var box = el("div", "scanline");
    var head = el("div", "scanhead");
    head.appendChild(el("span", "scanpoet", poem.poet + " · " + poem.src));
    head.appendChild(el("span", "tag tchk", poem.id));
    box.appendChild(head);
    var body = el("div", "scanbody");
    var read = el("div", "scanread"); read.appendChild(el("div", "rdlabel", "Read"));
    poem.lines.forEach(function (ln) { read.appendChild(el("div", "rdline", readable(ln))); });
    var work = el("div", "scanwork");
    body.appendChild(read); body.appendChild(work); box.appendChild(body);
    var getters = poem.lines.map(function (ln) { return buildRow(ln, work); });
    host.appendChild(box);
    return function () { return { lines: getters.map(function (g) { return g(); }) }; };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var host = document.getElementById("author");
    if (!host || !window.VERSE_POEMS) { if (host) host.textContent = "versedata.js not loaded."; return; }
    var collectors = {};
    VERSE_POEMS.forEach(function (p) { collectors[p.id] = buildPoem(p, host); });
    var out = document.getElementById("authorout"), btn = document.getElementById("exportall");
    if (btn) btn.addEventListener("click", function () {
      var obj = {};
      Object.keys(collectors).forEach(function (id) { obj[id] = collectors[id](); });
      var s = "window.VERSE_SCAN = " + JSON.stringify(obj) + ";";
      if (out) { out.value = s; out.focus(); out.select(); }
      if (navigator.clipboard) navigator.clipboard.writeText(s);
      btn.textContent = "✓ Copied — paste it back to me";
      setTimeout(function () { btn.textContent = "⬇ Export all scansions"; }, 2500);
    });
  });
})();
