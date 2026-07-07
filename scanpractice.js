// Interactive 4B4V scansion practice. Two modes per line: "submit" (post to board,
// no answer) and "check" (compare to the answer key client-side).
(function () {
  var PID = localStorage.getItem("htrap-pid");
  if (!PID) { PID = Math.random().toString(36).slice(2, 8); localStorage.setItem("htrap-pid", PID); }

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  function nameVal() { var n = document.getElementById("scanName"); return (n && n.value.trim()) || PID; }

  function buildMeterCtl() {
    var wrap = el("span", "meterctl");
    var f = el("select"); f.appendChild(new Option("— foot —", ""));
    FEET.forEach(function (x) { f.appendChild(new Option(x, x)); });
    var l = el("select"); l.appendChild(new Option("— length —", ""));
    LENGTHS.forEach(function (x) { l.appendChild(new Option(x, x)); });
    wrap._foot = f; wrap._len = l;
    wrap.appendChild(f); wrap.appendChild(l);
    return wrap;
  }

  function buildLine(line) {
    var n = line.syl.length;
    var st = line.syl.map(function () { return "u"; });   // stress state
    var bounds = {};                                       // boundary-before-i flags

    var box = el("div", "scanline");
    var head = el("div", "scanhead");
    head.appendChild(el("span", "scanpoet", line.poet + " · " + line.src));
    head.appendChild(el("span", "tag " + (line.mode === "submit" ? "tsub" : "tchk"),
      line.mode === "submit" ? "Submit" : "Check"));
    box.appendChild(head);

    var row = el("div", "scanrow");
    var syls = [], gaps = [];
    for (var i = 0; i < n; i++) {
      if (i > 0) {
        var g = el("span", "gap" + (line.sp[i] ? " word" : ""));
        (function (idx) { g.addEventListener("click", function () {
          bounds[idx] = !bounds[idx]; g.classList.toggle("on", bounds[idx]); clearFx(); }); })(i);
        row.appendChild(g); gaps[i] = g;
      }
      var s = el("span", "syl");
      var mk = el("span", "mark", "u"); var tx = el("span", "txt", line.syl[i]);
      s.appendChild(mk); s.appendChild(tx);
      (function (idx, sEl, mkEl) { sEl.addEventListener("click", function () {
        st[idx] = st[idx] === "u" ? "S" : "u"; mkEl.textContent = st[idx];
        sEl.classList.toggle("stress", st[idx] === "S"); clearFx(); }); })(i, s, mk);
      row.appendChild(s); syls[i] = s;
    }
    box.appendChild(row);

    var ctlrow = el("div", "ctlrow");
    var meter = buildMeterCtl(); ctlrow.appendChild(meter);
    var actions = el("span", "actions"); ctlrow.appendChild(actions);
    box.appendChild(ctlrow);
    var fx = el("div", "fx"); box.appendChild(fx);

    function clearFx() {
      fx.textContent = ""; fx.className = "fx";
      syls.forEach(function (x) { x.classList.remove("ok", "diff", "flex"); });
      gaps.forEach(function (x) { if (x) x.classList.remove("gok", "gmiss", "gextra"); });
    }
    function feetStr() { var a = []; for (var k = 1; k < n; k++) if (bounds[k]) a.push(k); return a.join(","); }

    if (line.mode === "submit") {
      var subBtn = el("button", "btn", "Submit to the board");
      subBtn.addEventListener("click", function () {
        subBtn.disabled = true; subBtn.textContent = "Submitting…";
        fetch(SUPA.url + "/rest/v1/scan_submissions", {
          method: "POST",
          headers: { apikey: SUPA.key, Authorization: "Bearer " + SUPA.key,
            "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ room: ROOM, line_id: line.id, participant: nameVal(),
            stress: st.join(""), feet: feetStr(), meter: meterString(meter._foot.value, meter._len.value) }),
        }).then(function (r) {
          if (r.ok) { fx.className = "fx ok"; fx.textContent = "Submitted ✓ — projected to the board."; box.classList.add("locked"); }
          else { subBtn.disabled = false; subBtn.textContent = "Submit to the board";
            fx.className = "fx diff"; fx.textContent = "Submission rejected (check your marks)."; }
        }).catch(function () { subBtn.disabled = false; subBtn.textContent = "Submit to the board";
          fx.className = "fx diff"; fx.textContent = "Network error — try again."; });
      });
      actions.appendChild(subBtn);
    } else {
      var checkBtn = el("button", "btn", "Check");
      var revealBtn = el("button", "btn", "Reveal");
      var resetBtn = el("button", "btn", "Reset");
      actions.appendChild(checkBtn); actions.appendChild(revealBtn); actions.appendChild(resetBtn);
      var A = line.answer;

      checkBtn.addEventListener("click", function () {
        clearFx();
        var sMatch = 0, sTot = 0;
        for (var i = 0; i < n; i++) {
          if (A.flex && A.flex.indexOf(i) >= 0) { syls[i].classList.add("flex"); continue; }
          sTot++;
          if (st[i] === A.stress[i]) { syls[i].classList.add("ok"); sMatch++; }
          else syls[i].classList.add("diff");
        }
        var aB = {}; A.feet.forEach(function (k) { aB[k] = true; });
        var fOk = 0, fBad = 0;
        for (var k = 1; k < n; k++) {
          var u = !!bounds[k], a = !!aB[k];
          if (a && u) { gaps[k].classList.add("gok"); fOk++; }
          else if (a && !u) { gaps[k].classList.add("gmiss"); fBad++; }
          else if (!a && u) { gaps[k].classList.add("gextra"); fBad++; }
        }
        var mUser = meterString(meter._foot.value, meter._len.value).toLowerCase();
        var mAns = A.meter.toLowerCase();
        var mOk = mUser && (mUser === mAns);
        fx.className = "fx " + (sMatch === sTot && fBad === 0 && mOk ? "ok" : "warn");
        fx.textContent = "Stress " + sMatch + "/" + sTot + " · feet " + fOk + "/" + A.feet.length +
          (fBad ? " (" + fBad + " off)" : "") + " · meter " + (mOk ? "✓" : "✗") +
          (A.flex && A.flex.length ? " · grey syllables are contested — either mark passes." : "");
      });
      revealBtn.addEventListener("click", function () {
        clearFx();
        for (var i = 0; i < n; i++) {
          st[i] = A.stress[i]; syls[i].querySelector(".mark").textContent = A.stress[i];
          syls[i].classList.toggle("stress", A.stress[i] === "S");
        }
        for (var k = 1; k < n; k++) { bounds[k] = A.feet.indexOf(k) >= 0; gaps[k].classList.toggle("on", bounds[k]); }
        var parts = A.meter.split(" ");
        var footKey = Object.keys(FOOT_ADJ).filter(function (f) { return FOOT_ADJ[f] === parts[0]; })[0] || "";
        meter._foot.value = footKey; meter._len.value = parts[1] || "";
        fx.className = "fx"; fx.innerHTML = "<b>" + A.meter + ".</b> " + (A.notes || "");
      });
      resetBtn.addEventListener("click", function () {
        clearFx();
        for (var i = 0; i < n; i++) { st[i] = "u"; syls[i].querySelector(".mark").textContent = "u"; syls[i].classList.remove("stress"); }
        for (var k = 1; k < n; k++) { bounds[k] = false; gaps[k].classList.remove("on"); }
        meter._foot.value = ""; meter._len.value = "";
      });
    }
    // Author mode: emit an answer-key snippet from the current marks.
    var akey = el("button", "btn authoronly", "⚑ Set as answer key");
    akey.addEventListener("click", function () {
      var snip = 'answer: { stress: "' + st.join("") + '", feet: [' + feetStr() +
        '], meter: "' + meterString(meter._foot.value, meter._len.value) +
        '", flex: [], notes: "" },  // ' + line.id;
      var out = document.getElementById("keyout");
      if (out) { out.value = snip + "\n" + out.value; }
      if (navigator.clipboard) navigator.clipboard.writeText(snip);
      fx.className = "fx ok"; fx.textContent = "Answer key copied — paste into lines.js (or send it to Claude).";
    });
    actions.appendChild(akey);
    return box;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var host = document.getElementById("practice");
    if (!host) return;
    WORKSHOP_LINES.forEach(function (line) { host.appendChild(buildLine(line)); });
    var rl = document.getElementById("roomLabel"); if (rl) rl.textContent = ROOM;
    var ab = document.getElementById("authorBtn");
    if (ab) ab.addEventListener("click", function () {
      var on = !document.body.classList.contains("author");
      document.body.classList.toggle("author", on);
      ab.classList.toggle("active", on);
      ab.textContent = on ? "Author mode: on" : "Author mode";
    });
  });
})();
