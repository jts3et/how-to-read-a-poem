// Shared config + practice lines for the scansion tool and the board.
// PROVISIONAL: answer keys for Check lines are best-effort 4B4V and are meant to be
// replaced by Justin's official scansions once the poems are fixed.

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
    id: "gray", poet: "Thomas Gray", src: "Elegy Written in a Country Churchyard",
    mode: "submit",
    syl: ["The","cur","few","tolls","the","knell","of","part","ing","day"],
    sp:  [false,true,false,true,true,true,true,true,false,true],
    answer: { stress: "uSuSuSuSuS", feet: [2,4,6,8], meter: "iambic pentameter", flex: [],
      notes: "The cleanest metronome in English — perfectly regular iambic pentameter." },
  },
  {
    id: "shak18", poet: "Shakespeare", src: "Sonnet 18",
    mode: "check",
    syl: ["Shall","I","com","pare","thee","to","a","sum","mer's","day"],
    sp:  [false,true,true,false,true,true,true,true,false,true],
    answer: { stress: "uSuSuSuSuS", feet: [2,4,6,8], meter: "iambic pentameter", flex: [4,5],
      notes: "Regular iambic pentameter. Foot 3 (thee TO) is the classic dispute: the meter promotes 'to', many readers stress 'thee'. Either passes." },
  },
  {
    id: "blake", poet: "William Blake", src: "The Tyger",
    mode: "check",
    syl: ["Ty","ger","Ty","ger","burn","ing","bright"],
    sp:  [false,false,true,false,true,false,true],
    answer: { stress: "SuSuSuS", feet: [2,4,6], meter: "trochaic tetrameter", flex: [],
      notes: "Trochaic tetrameter, catalectic — the fourth foot drops its slack (BRIGHT). Falling rhythm against the rising norm." },
  },
  {
    id: "donne", poet: "John Donne", src: "Holy Sonnet 14",
    mode: "submit",
    syl: ["Bat","ter","my","heart","three","per","soned","God","for","you"],
    sp:  [false,false,true,true,true,false,false,true,true,true],
    answer: null, // contested on purpose — trochaic inversion + spondees
  },
  {
    id: "chaucer", poet: "Chaucer", src: "General Prologue",
    mode: "submit",
    syl: ["Whan","that","A","pril","le","with","his","shou","res","soo","te"],
    sp:  [false,true,true,false,false,true,true,true,false,true,false],
    answer: null, // Middle English: sounded final -e, feminine ending — hear it, don't grade it
  },
  {
    id: "april", poet: "T. S. Eliot", src: "The Waste Land, l.1",
    mode: "submit",
    syl: ["A","pril","is","the","cru","el","lest","month","breed","ing"],
    sp:  [false,false,true,true,true,false,false,true,true,false],
    answer: null, // trochaic opening, feminine ending — the hand-off into Hour 2
  },
];

function meterString(foot, len) {
  if (!foot || !len) return "";
  return FOOT_ADJ[foot] + " " + len;
}
