// Multi-line scansion practice data. Each poem is scanned line by line, in context.
// All public domain. mode:"submit" streams to the board (no answer shown); mode:"check"
// scores against answer. Justin sets Check answers with Author mode (?author=1).

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
const FORMS = ["sonnet", "ballad", "common measure", "blank verse", "heroic couplet",
  "rhyme royal", "Spenserian stanza", "terza rima", "ode", "villanelle", "free verse", "other"];

// sp[i] (i>0): true = new word begins here (wide gap), false = mid-word (hyphen).
const WORKSHOP_POEMS = [
  {
    id: "yeats-balloon", poet: "W. B. Yeats", src: "The Balloon of the Mind (1919)", mode: "submit",
    lines: [
      { syl: ["Hands","do","what","you’re","bid"], sp: [false,true,true,true,true] },
      { syl: ["Bring","the","bal","loon","of","the","mind"], sp: [false,true,true,false,true,true,true] },
      { syl: ["That","bel","lies","and","drags","in","the","wind"], sp: [false,true,false,true,true,true,true,true] },
      { syl: ["In","to","its","nar","row","shed"], sp: [false,false,true,true,false,true] },
    ], answer: null,
  },
  {
    id: "carroll-jabberwocky", poet: "Lewis Carroll", src: "Jabberwocky (1871), st. 1", mode: "submit",
    lines: [
      { syl: ["’Twas","bril","lig","and","the","sli","thy","toves"], sp: [false,true,false,true,true,true,false,true] },
      { syl: ["Did","gyre","and","gim","ble","in","the","wabe"], sp: [false,true,true,true,false,true,true,true] },
      { syl: ["All","mim","sy","were","the","bo","ro","goves"], sp: [false,true,false,true,true,true,false,false] },
      { syl: ["And","the","mome","raths","out","grabe"], sp: [false,true,true,true,true,false] },
    ], answer: null,
  },
  {
    id: "dickinson-funeral", poet: "Emily Dickinson", src: "I felt a Funeral, in my Brain (1861), st. 1", mode: "submit",
    lines: [
      { syl: ["I","felt","a","Fu","ne","ral","in","my","Brain"], sp: [false,true,true,true,false,false,true,true,true] },
      { syl: ["And","Mour","ners","to","and","fro"], sp: [false,true,false,true,true,true] },
      { syl: ["Kept","tread","ing","tread","ing","till","it","seemed"], sp: [false,true,false,true,false,true,true,true] },
      { syl: ["That","Sense","was","break","ing","through"], sp: [false,true,true,true,false,true] },
    ], answer: null,
  },
  {
    id: "keats-belledame", poet: "John Keats", src: "La Belle Dame sans Merci (1820), st. 1", mode: "submit",
    lines: [
      { syl: ["O","what","can","ail","thee","knight","at","arms"], sp: [false,true,true,true,true,true,true,true] },
      { syl: ["A","lone","and","pale","ly","loi","ter","ing"], sp: [false,false,true,true,false,true,false,false] },
      { syl: ["The","sedge","has","wi","thered","from","the","lake"], sp: [false,true,true,true,false,true,true,true] },
      { syl: ["And","no","birds","sing"], sp: [false,true,true,true] },
    ], answer: null,
  },
];

function meterString(foot, len) { return (!foot || !len) ? "" : FOOT_ADJ[foot] + " " + len; }
