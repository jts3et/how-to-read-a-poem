// Shared config + practice lines for the scansion tool and the board.
// All lines are public domain. Check-line answer keys are best-effort 4B4V; set your
// own with Author mode (open scansion.html?author=1, scan correctly, "Set as answer key").

const SUPA = {
  url: "https://rqglsndtkwwlrcdjkgcu.supabase.co",
  key: "sb_publishable_h8v9CdNaLWy6V-tF8wS51A_kfGPhPjo",
};

const ROOM = new URLSearchParams(location.search).get("room") || "disi";

const FEET = ["iamb", "trochee", "anapest", "dactyl", "spondee", "pyrrhic"];
const FOOT_ADJ = { iamb: "iambic", trochee: "trochaic", anapest: "anapestic",
  dactyl: "dactylic", spondee: "spondaic", pyrrhic: "pyrrhic" };
const LENGTHS = ["monometer", "dimeter", "trimeter", "tetrameter",
  "pentameter", "hexameter", "heptameter"];

// sp[i] (i>0): true = a new word begins here (wide gap), false = mid-word (hyphen gap).
const WORKSHOP_LINES = [
  {
    id: "wheatley", poet: "Phillis Wheatley", src: "On Being Brought from Africa (1773)",
    mode: "submit",
    syl: ["’Twas","mer","cy","brought","me","from","my","Pa","gan","land"],
    sp:  [false,true,false,true,true,true,true,true,false,true],
    answer: null,   // calibrator: near-regular iambic pentameter — hear the norm
  },
  {
    id: "ebb", poet: "Elizabeth Barrett Browning", src: "Sonnet 43 (1850)",
    mode: "check",
    syl: ["How","do","I","love","thee","Let","me","count","the","ways"],
    sp:  [false,true,true,true,true,true,true,true,true,true],
    answer: { stress: "uSuSuSuSuS", feet: [2,4,6,8], meter: "iambic pentameter", flex: [0,1],
      notes: "Iambic pentameter, but the crux is the promoted 'do' — the meter lifts an ordinarily weak word, and the lift is the feeling. Some readers stress 'How' instead; both are defensible." },
  },
  {
    id: "dickinson", poet: "Emily Dickinson", src: "Because I could not stop for Death (c.1863)",
    mode: "check",
    syl: ["Be","cause","I","could","not","stop","for","Death"],
    sp:  [false,false,true,true,true,true,true,true],
    answer: { stress: "uSuSuSuS", feet: [2,4,6], meter: "iambic tetrameter", flex: [3,4],
      notes: "Iambic tetrameter — the first line of a common (ballad / hymn) stanza that alternates four-beat and three-beat lines. 'Could not stop' tempts a spondee; the hymn norm pulls it back to iambs." },
  },
  {
    id: "blake", poet: "William Blake", src: "The Tyger (1794)",
    mode: "check",
    syl: ["Ty","ger","Ty","ger","burn","ing","bright"],
    sp:  [false,false,true,false,true,false,true],
    answer: { stress: "SuSuSuS", feet: [2,4,6], meter: "trochaic tetrameter", flex: [],
      notes: "Trochaic tetrameter, catalectic — the fourth foot drops its slack (BRIGHT). A falling rhythm against the rising norm." },
  },
  {
    id: "teasdale", poet: "Sara Teasdale", src: "There Will Come Soft Rains (1918)",
    mode: "submit",
    syl: ["There","will","come","soft","rains","and","the","smell","of","the","ground"],
    sp:  [false,true,true,true,true,true,true,true,true,true,true],
    answer: null,   // largely anapestic — three-syllable feet, a running rhythm
  },
  {
    id: "chaucer", poet: "Chaucer", src: "General Prologue (c.1400)",
    mode: "submit",
    syl: ["Whan","that","A","pril","le","with","his","shou","res","soo","te"],
    sp:  [false,true,true,false,false,true,true,true,false,true,false],
    answer: null,   // Middle English: sounded final -e, feminine ending — hear it, don't grade it
  },
];

function meterString(foot, len) {
  if (!foot || !len) return "";
  return FOOT_ADJ[foot] + " " + len;
}
