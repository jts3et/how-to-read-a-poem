// Interactive multi-line 4B4V scansion. Each poem is scanned line by line, with one
// shared meter + verse-form answer. Submit streams every line to the board (no answer);
// Check scores against the answer key. Author mode (?author=1) emits an answer snippet.
(function () {
  var PID = localStorage.getItem("htrap-pid");
  if (!PID) { PID = Math.random().toString(36).slice(2, 8); localStorage.setItem("htrap-pid", PID); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function nameVal() { var n = document.getElementById("scanName"); return (n && n.value.trim()) || PID; }

  function meterCtl() {
    var w = el("span", "meterctl");
    var f = el("select"); f.appendChild(new Option("— foot —", ""));
    FEET.forEach(function (x) { f.appendChild(new Option(x, x)); });
    var l = el("select"); l.appendChild(new Option("— length —", ""));
    LENGTHS.forEach(function (x) { l.appendChild(new Option(x, x)); });
    w._foot = f; w._len = l; w.appendChild(f); w.appendChild(l); return w;
  }
  function formCtl() {
    var w = el("span", "meterctl");
    var s = el("select"); s.appendChild(new Option("— verse form —", ""));
    FORMS.forEach(function (x) { s.appendChild(new Option(x, x)); });
    w._sel = s; w.appendChild(s); return w;
  }

  function buildRow(line, onEdit) {
    var n = line.syl.length, st = line.syl.map(function () { return "u"; }), bounds = {};
    var row = el("div", "scanrow"), syls = [], gaps = [];
    for (var i = 0; i < n; i++) {
      if (i > 0) {
        var g = el("span", "gap" + (line.sp[i] ? " word" : ""));
        (function (idx, gg) { gg.addEventListener("click", function () {
          bounds[idx] = !bounds[idx]; gg.classList.toggle("on", bounds[idx]); onEdit(); }); })(i, g);
        row.appendChild(g); gaps[i] = g;
      }
      var hy = (i + 1 < n && !line.sp[i + 1]) ? "‑" : "";   // word split at the next boundary
      var s = el("span", "syl"), mk = el("span", "mark", ""), tx = el("span", "txt", line.syl[i] + hy);
      s.appendChild(mk); s.appendChild(tx);
      (function (idx, sEl, mkEl) { sEl.addEventListener("click", function () {
        st[idx] = st[idx] === "u" ? "S" : "u"; mkEl.textContent = st[idx] === "S" ? "´" : "";
        sEl.classList.toggle("stress", st[idx] === "S"); onEdit(); }); })(i, s, mk);
      row.appendChild(s); syls[i] = s;
    }
    return {
      row: row, syls: syls, gaps: gaps, n: n,
      stress: function () { return st.join(""); },
      feet: function () { var a = []; for (var k = 1; k < n; k++) if (bounds[k]) a.push(k); return a.join(","); },
      setAnswer: function (ans) {
        for (var i = 0; i < n; i++) { st[i] = ans.stress[i]; syls[i].querySelector(".mark").textContent = ans.stress[i] === "S" ? "´" : ""; syls[i].classList.toggle("stress", ans.stress[i] === "S"); }
        for (var k = 1; k < n; k++) { bounds[k] = ans.feet.indexOf(k) >= 0; if (gaps[k]) gaps[k].classList.toggle("on", bounds[k]); }
      },
      reset: function () {
        for (var i = 0; i < n; i++) { st[i] = "u"; syls[i].querySelector(".mark").textContent = ""; syls[i].classList.remove("stress", "ok", "diff", "flex"); }
        for (var k = 1; k < n; k++) { bounds[k] = false; if (gaps[k]) { gaps[k].classList.remove("on", "gok", "gmiss", "gextra"); } }
      },
      clearFx: function () {
        syls.forEach(function (x) { x.classList.remove("ok", "diff", "flex"); });
        gaps.forEach(function (x) { if (x) x.classList.remove("gok", "gmiss", "gextra"); });
      },
    };
  }

  // reconstruct the plain, readable line from its syllables (space at word breaks,
  // no space after a hyphenated compound)
  function readable(line) {
    var s = "";
    for (var i = 0; i < line.syl.length; i++) {
      if (i > 0 && line.sp[i] && !/[-‐‑]$/.test(line.syl[i - 1])) s += " ";
      s += line.syl[i];
    }
    return s;
  }

  function buildPoem(poem) {
    var box = el("div", "scanline");
    var head = el("div", "scanhead");
    head.appendChild(el("span", "scanpoet", poem.poet + " · " + poem.src));
    head.appendChild(el("span", "tag " + (poem.mode === "submit" ? "tsub" : "tchk"), poem.mode === "submit" ? "Submit" : "Check"));
    box.appendChild(head);

    var body = el("div", "scanbody");
    var read = el("div", "scanread");
    read.appendChild(el("div", "rdlabel", "Read"));
    poem.lines.forEach(function (ln) { read.appendChild(el("div", "rdline", readable(ln))); });
    var work = el("div", "scanwork");
    body.appendChild(read); body.appendChild(work); box.appendChild(body);

    var rows = poem.lines.map(function (ln) { return buildRow(ln, function () { fx.textContent = ""; fx.className = "fx"; rows.forEach(function (r) { r.clearFx(); }); }); });
    rows.forEach(function (r) { work.appendChild(r.row); });

    var ctl = el("div", "ctlrow");
    var meter = meterCtl(), form = formCtl(), actions = el("span", "actions");
    ctl.appendChild(meter); ctl.appendChild(form); ctl.appendChild(actions);
    work.appendChild(ctl);
    var fx = el("div", "fx"); work.appendChild(fx);

    if (poem.mode === "submit") {
      var sub = el("button", "btn", "Submit to the board");
      sub.addEventListener("click", function () {
        sub.disabled = true; sub.textContent = "Submitting…";
        var m = meterString(meter._foot.value, meter._len.value), fm = form._sel.value;
        var payload = rows.map(function (r, i) {
          return { room: ROOM, line_id: poem.id + ":" + i, participant: nameVal(),
                   stress: r.stress(), feet: r.feet(), meter: m, form: fm };
        });
        fetch(SUPA.url + "/rest/v1/scan_submissions", {
          method: "POST", headers: { apikey: SUPA.key, Authorization: "Bearer " + SUPA.key, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify(payload),
        }).then(function (r) {
          if (r.ok) { fx.className = "fx ok"; fx.textContent = "Submitted ✓ — all lines on the board."; box.classList.add("locked"); }
          else { sub.disabled = false; sub.textContent = "Submit to the board"; fx.className = "fx diff"; fx.textContent = "Rejected — check your marks."; }
        }).catch(function () { sub.disabled = false; sub.textContent = "Submit to the board"; fx.className = "fx diff"; fx.textContent = "Network error — try again."; });
      });
      actions.appendChild(sub);
    } else {
      var A = poem.answer;
      var check = el("button", "btn", "Check"), reveal = el("button", "btn", "Reveal"), reset = el("button", "btn", "Reset");
      actions.appendChild(check); actions.appendChild(reveal); actions.appendChild(reset);
      check.addEventListener("click", function () {
        var sm = 0, stot = 0, fbad = 0, ftot = 0;
        rows.forEach(function (r, li) {
          r.clearFx(); var a = A.lines[li];
          for (var i = 0; i < r.n; i++) {
            if (a.flex && a.flex.indexOf(i) >= 0) { r.syls[i].classList.add("flex"); continue; }
            stot++; if (r.stress()[i] === a.stress[i]) { r.syls[i].classList.add("ok"); sm++; } else r.syls[i].classList.add("diff");
          }
          var aB = {}; a.feet.forEach(function (k) { aB[k] = true; }); ftot += a.feet.length;
          var uB = r.feet() ? r.feet().split(",").map(Number) : [];
          for (var k = 1; k < r.n; k++) { var u = uB.indexOf(k) >= 0, has = !!aB[k]; if (has && u) r.gaps[k].classList.add("gok"); else if (has && !u) { r.gaps[k].classList.add("gmiss"); fbad++; } else if (!has && u) { r.gaps[k].classList.add("gextra"); fbad++; } }
        });
        var mUser = meterString(meter._foot.value, meter._len.value).toLowerCase(), mOk = mUser && mUser === (A.meter || "").toLowerCase();
        var fmOk = !A.form || form._sel.value.toLowerCase() === A.form.toLowerCase();
        fx.className = "fx " + (sm === stot && fbad === 0 && mOk && fmOk ? "ok" : "warn");
        fx.textContent = "Stress " + sm + "/" + stot + " · feet off " + fbad + " · meter " + (mOk ? "✓" : "✗") + " · form " + (fmOk ? "✓" : "✗");
      });
      reveal.addEventListener("click", function () {
        rows.forEach(function (r, li) { r.clearFx(); r.setAnswer(A.lines[li]); });
        var parts = (A.meter || "").split(" "), fk = Object.keys(FOOT_ADJ).filter(function (f) { return FOOT_ADJ[f] === parts[0]; })[0] || "";
        meter._foot.value = fk; meter._len.value = parts[1] || ""; if (A.form) form._sel.value = A.form;
        fx.className = "fx"; fx.innerHTML = "<b>" + (A.meter || "") + (A.form ? " · " + A.form : "") + ".</b> " + (A.notes || "");
      });
      reset.addEventListener("click", function () { rows.forEach(function (r) { r.reset(); }); meter._foot.value = ""; meter._len.value = ""; form._sel.value = ""; fx.textContent = ""; fx.className = "fx"; });
    }

    // author: emit a full answer-key snippet for the poem
    var akey = el("button", "btn authoronly", "⚑ Set as answer key");
    akey.addEventListener("click", function () {
      var lines = rows.map(function (r) { return '{ stress: "' + r.stress() + '", feet: [' + r.feet() + '], flex: [] }'; });
      var snip = 'answer: {\n  lines: [\n    ' + lines.join(",\n    ") + ',\n  ],\n  meter: "' + meterString(meter._foot.value, meter._len.value) + '", form: "' + form._sel.value + '", notes: "",\n},  // ' + poem.id;
      var out = document.getElementById("keyout"); if (out) out.value = snip + "\n\n" + out.value;
      if (navigator.clipboard) navigator.clipboard.writeText(snip);
      fx.className = "fx ok"; fx.textContent = "Answer key copied — paste into lines.js (or send to Claude).";
    });
    actions.appendChild(akey);
    return box;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var host = document.getElementById("practice");
    if (!host) return;
    WORKSHOP_POEMS.forEach(function (p) { host.appendChild(buildPoem(p)); });
    var rl = document.getElementById("roomLabel"); if (rl) rl.textContent = ROOM;
  });
})();
