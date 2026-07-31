# How to Read a Poem — DISI Workshop

Source for the workshop site served at
**<https://jts3et.github.io/how-to-read-a-poem/>**.

A public materials hub and presenter run-of-show for a two-hour *How to Read a Poem*
seminar at the Diverse Intelligences Summer Institute. Flat static site — plain HTML,
`style.css`, and vanilla JS. The one moving part is a live scansion board backed by
Supabase, where the room's disagreement over how a line scans lands in real time.

## Pages

| Page | What it is |
|------|-----------|
| [`index.html`](index.html) | Landing + two-hour overview, and the presenter run-of-show. |
| [`scansion.html`](scansion.html) | **Start here** — the 4B4V scansion method and the interactive practice tool. Scan a line syllable by syllable, then Submit (to the board) or Check (against the key). |
| [`board.html`](board.html) | Presenter view — the room's submissions aggregated live: per-syllable stress heatmap, foot-boundary spread, meter tally. |
| [`versification.html`](versification.html) | How English verse was made — meter, form, and genre from Homer to free verse, with real examples. |
| [`breath.html`](breath.html) | The breath cycle — meter as the shape of the breath, why the feet are what they are. |
| [`wasteland.html`](wasteland.html) | Hour 2 — *The Waste Land* (1922) for whole-room recitation. |
| [`glossary.html`](glossary.html) | The prosody terms, for reference. |
| [`scanall.html`](scanall.html) | Authoring view — scan the example lines to produce answer keys (not linked from the participant nav). |

## The scansion tool

Each line is authored in `lines.js` as syllables plus, for Check lines, a correct 4B4V
answer. Syllables are toggle chips (click cycles slack `u` ↔ stress `S`), the gaps
between them take foot boundaries `|`, and a meter control names the line (foot ×
length). Two modes, set per line:

- **Submit** — no answer shown; the scansion streams to `board.html`. Disagreement is
  the teaching, made visible.
- **Check** — compares against the key client-side. Gentle, not binary: agreements
  green, genuine differences amber, and answer-key `alt` readings count as acceptable,
  because stress is relative and contested feet are the point.

Key JS: `scanpractice.js` (the tool), `board.js` (Supabase board), `feet.js` /
`rhyme.js` / `allit.js` (notation, rhyme arcs, alliteration), `paralign.js` (aligned
parallel layout), `versedata.js` / `versescan.js` (versification examples),
`fitverse.js` (scale-to-fit, no horizontal scroll), `pdfpane.js` (Waste Land PDF),
`scanauthor.js` / `scanview.js` (authoring).

## Board backend (Supabase)

Submit mode writes to a `scan_submissions` table (anon insert; the board reads by
`room` + `line_id`). Ephemeral, non-sensitive workshop data. Check mode needs no
backend.

## Deploy

```bash
bash deploy.sh ["commit message"]
```

Stamps a fresh `?v=` cache-buster onto every local `css`/`js` reference (so the
workshop laptop never serves a stale file), commits, pushes to the
`how-to-read-a-poem` repo, and enables GitHub Pages.

## Texts and copyright

Public-domain texts (*The Waste Land* 1922, Beowulf, Chaucer, Shakespeare) render
inline. Still-copyrighted material (Eliot's later prose, recordings) is excerpted and
linked rather than hosted.
