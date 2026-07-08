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
      { syl: ["Hands,","do","what","you’re","bid:"], sp: [false,true,true,true,true] },
      { syl: ["Bring","the","bal","loon","of","the","mind"], sp: [false,true,true,false,true,true,true] },
      { syl: ["That","bel","lies","and","drags","in","the","wind"], sp: [false,true,false,true,true,true,true,true] },
      { syl: ["In","to","its","nar","row","shed."], sp: [false,false,true,true,false,true] },
    ], answer: null,
  },
  {
    id: "carroll-jabberwocky", poet: "Lewis Carroll", src: "Jabberwocky (1871), st. 1", mode: "submit",
    lines: [
      { syl: ["’Twas","bril","lig,","and","the","sli","thy","toves"], sp: [false,true,false,true,true,true,false,true] },
      { syl: ["Did","gyre","and","gim","ble","in","the","wabe:"], sp: [false,true,true,true,false,true,true,true] },
      { syl: ["All","mim","sy","were","the","bo","ro","goves,"], sp: [false,true,false,true,true,true,false,false] },
      { syl: ["And","the","mome","raths","out","grabe."], sp: [false,true,true,true,true,false] },
    ], answer: null,
  },
  {
    id: "dickinson-funeral", poet: "Emily Dickinson", src: "I felt a Funeral, in my Brain (1861), st. 1", mode: "submit",
    lines: [
      { syl: ["I","felt","a","Fu","ne","ral,","in","my","Brain,"], sp: [false,true,true,true,false,false,true,true,true] },
      { syl: ["And","Mour","ners","to","and","fro"], sp: [false,true,false,true,true,true] },
      { syl: ["Kept","tread","ing—","tread","ing—","till","it","seemed"], sp: [false,true,false,true,false,true,true,true] },
      { syl: ["That","Sense","was","break","ing","through—"], sp: [false,true,true,true,false,true] },
    ], answer: null,
  },
  {
    id: "keats-belledame", poet: "John Keats", src: "La Belle Dame sans Merci (1820), st. 1", mode: "submit",
    lines: [
      { syl: ["O","what","can","ail","thee,","knight-","at-","arms,"], sp: [false,true,true,true,true,true,true,true] },
      { syl: ["A","lone","and","pale","ly","loi","ter","ing?"], sp: [false,false,true,true,false,true,false,false] },
      { syl: ["The","sedge","has","wi","thered","from","the","lake,"], sp: [false,true,true,true,false,true,true,true] },
      { syl: ["And","no","birds","sing."], sp: [false,true,true,true] },
    ], answer: null,
  },
  {
    id: "hopkins-grandeur", poet: "Gerard Manley Hopkins", src: "God’s Grandeur (1918)", mode: "submit",
    lines: [
      { syl: ["The","world","is","charged","with","the","gran","deur","of","God."], sp: [false,true,true,true,true,true,true,false,true,true] },
      { syl: ["It","will","flame","out,","like","shi","ning","from","shook","foil;"], sp: [false,true,true,true,true,true,false,true,true,true] },
      { syl: ["It","ga","thers","to","a","great","ness,","like","the","ooze","of","oil"], sp: [false,true,false,true,true,true,false,true,true,true,true,true] },
      { syl: ["Crushed.","Why","do","men","then","now","not","reck","his","rod?"], sp: [false,true,true,true,true,true,true,true,true,true] },
      { syl: ["Gen","er","a","tions","have","trod,","have","trod,","have","trod;"], sp: [false,false,false,false,true,true,true,true,true,true] },
      { syl: ["And","all","is","seared","with","trade;","bleared,","smeared","with","toil;"], sp: [false,true,true,true,true,true,true,true,true,true] },
      { syl: ["And","wears","man’s","smudge","and","shares","man’s","smell:","the","soil"], sp: [false,true,true,true,true,true,true,true,true,true] },
      { syl: ["Is","bare","now,","nor","can","foot","feel,","be","ing","shod."], sp: [false,true,true,true,true,true,true,true,false,true] },
      { syl: ["And","for","all","this,","na","ture","is","ne","ver","spent;"], sp: [false,true,true,true,true,false,true,true,false,true] },
      { syl: ["There","lives","the","dear","est","fresh","ness","deep","down","things;"], sp: [false,true,true,true,false,true,false,true,true,true] },
      { syl: ["And","though","the","last","lights","off","the","black","West","went"], sp: [false,true,true,true,true,true,true,true,true,true] },
      { syl: ["Oh,","morn","ing,","at","the","brown","brink","east","ward,","springs—"], sp: [false,true,false,true,true,true,true,true,false,true] },
      { syl: ["Be","cause","the","Ho","ly","Ghost","o","ver","the","bent"], sp: [false,false,true,true,false,true,true,false,true,true] },
      { syl: ["World","broods","with","warm","breast","and","with","ah!","bright","wings."], sp: [false,true,true,true,true,true,true,true,true,true] },
    ], answer: null,
  },
  {
    id: "ebb-instrument", poet: "Elizabeth Barrett Browning", src: "A Musical Instrument (1860), st. 1", mode: "submit",
    lines: [
      { syl: ["What","was","he","do","ing,","the","great","god","Pan,"], sp: [false,true,true,true,false,true,true,true,true] },
      { syl: ["Down","in","the","reeds","by","the","ri","ver?"], sp: [false,true,true,true,true,true,true,false] },
      { syl: ["Spread","ing","ru","in","and","scat","ter","ing","ban,"], sp: [false,false,true,false,true,true,false,false,true] },
      { syl: ["Splash","ing","and","pad","dling","with","hoofs","of","a","goat,"], sp: [false,false,true,true,false,true,true,true,true,true] },
      { syl: ["And","break","ing","the","gol","den","li","lies","a","float"], sp: [false,true,false,true,true,false,true,false,true,false] },
      { syl: ["With","the","dra","gon-","fly","on","the","ri","ver."], sp: [false,true,true,false,true,true,true,true,false] },
    ], answer: null,
  },
  {
    id: "spenser-amoretti", poet: "Edmund Spenser", src: "Amoretti 75 (1595)", mode: "check",
    lines: [
      { syl: ["One","day","I","wrote","her","name","up","on","the","strand,"], sp: [false,true,true,true,true,true,true,false,true,true] },
      { syl: ["But","came","the","waves","and","wash","èd","it","a","way:"], sp: [false,true,true,true,true,true,false,true,true,false] },
      { syl: ["A","gain","I","wrote","it","with","a","se","cond","hand,"], sp: [false,false,true,true,true,true,true,true,false,true] },
      { syl: ["But","came","the","tide,","and","made","my","pains","his","prey."], sp: [false,true,true,true,true,true,true,true,true,true] },
      { syl: ["“Vain","man,”","said","she,","“that","dost","in","vain","as","say,"], sp: [false,true,true,true,true,true,true,true,true,false] },
      { syl: ["A","mor","tal","thing","so","to","im","mor","tal","ize;"], sp: [false,true,false,true,true,true,true,false,false,false] },
      { syl: ["For","I","my","self","shall","like","to","this","de","cay,"], sp: [false,true,true,false,true,true,true,true,true,false] },
      { syl: ["And","eek","my","name","be","wi","pèd","out","like","wise.”"], sp: [false,true,true,true,true,true,false,true,true,false] },
      { syl: ["“Not","so,”","quod","I,","“let","ba","ser","things","de","vise"], sp: [false,true,true,true,true,true,false,true,true,false] },
      { syl: ["To","die","in","dust,","but","you","shall","live","by","fame:"], sp: [false,true,true,true,true,true,true,true,true,true] },
      { syl: ["My","verse","your","vir","tues","rare","shall","e","ter","nize,"], sp: [false,true,true,true,false,true,true,true,false,false] },
      { syl: ["And","in","the","hea","vens","write","your","glo","rious","name:"], sp: [false,true,true,true,false,true,true,true,false,true] },
      { syl: ["Where","whe","nas","Death","shall","all","the","world","sub","due,"], sp: [false,true,false,true,true,true,true,true,true,false] },
      { syl: ["Our","love","shall","live,","and","la","ter","life","re","new.”"], sp: [false,true,true,true,true,true,false,true,true,false] },
    ],
    answer: {
  lines: [
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSSuuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
  ],
  meter: "iambic pentameter", form: "Spenserian stanza", notes: "Spenserian sonnet — the quatrains interlock (ababbcbccdcdee); regular iambic pentameter.",
},
  },
  {
    id: "shakespeare-henryv", poet: "Shakespeare", src: "Henry V III.i.1–4 (1599)", mode: "check",
    lines: [
      { syl: ["Once","more","un","to","the","breach,","dear","friends,","once","more;"], sp: [false,true,true,false,true,true,true,true,true,true] },
      { syl: ["Or","close","the","wall","up","with","our","Eng","lish","dead."], sp: [false,true,true,true,true,true,true,true,false,true] },
      { syl: ["In","peace","there’s","no","thing","so","be","comes","a","man"], sp: [false,true,true,true,false,true,true,false,true,true] },
      { syl: ["As","mo","dest","still","ness","and","hu","mi","li","ty:"], sp: [false,true,false,true,false,true,true,false,false,false] },
    ],
    answer: {
  lines: [
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
  ],
  meter: "iambic pentameter", form: "blank verse", notes: "Blank verse: unrhymed iambic pentameter (one reading — mark the spondaic Once more if you hear it).",
},
  },
  {
    id: "shelley-ozymandias", poet: "Percy Bysshe Shelley", src: "Ozymandias (1818)", mode: "check",
    lines: [
      { syl: ["I","met","a","tra","vel","ler","from","an","an","tique","land"], sp: [false,true,true,true,false,false,true,true,true,false,true] },
      { syl: ["Who","said:","“Two","vast","and","trunk","less","legs","of","stone"], sp: [false,true,true,true,true,true,false,true,true,true] },
      { syl: ["Stand","in","the","de","sert.","Near","them,","on","the","sand,"], sp: [false,true,true,true,false,true,true,true,true,true] },
      { syl: ["Half","sunk,","a","shat","tered","vi","sage","lies,","whose","frown,"], sp: [false,true,true,true,false,true,false,true,true,true] },
      { syl: ["And","wrin","kled","lip,","and","sneer","of","cold","com","mand,"], sp: [false,true,false,true,true,true,true,true,true,false] },
      { syl: ["Tell","that","its","sculp","tor","well","those","pas","sions","read"], sp: [false,true,true,true,false,true,true,true,false,true] },
      { syl: ["Which","yet","sur","vive,","stamped","on","these","life","less","things,"], sp: [false,true,true,false,true,true,true,true,false,true] },
      { syl: ["The","hand","that","mocked","them,","and","the","heart","that","fed;"], sp: [false,true,true,true,true,true,true,true,true,true] },
      { syl: ["And","on","the","pe","des","tal","these","words","ap","pear:"], sp: [false,true,true,true,false,false,true,true,true,false] },
      { syl: ["‘My","name","is","O","zy","man","di","as,","King","of","Kings;"], sp: [false,true,true,true,false,false,false,false,true,true,true] },
      { syl: ["Look","on","my","Works,","ye","Migh","ty,","and","de","spair!’"], sp: [false,true,true,true,true,true,false,true,true,false] },
      { syl: ["No","thing","be","side","re","mains.","Round","the","de","cay"], sp: [false,false,true,false,true,false,true,true,true,false] },
      { syl: ["Of","that","co","los","sal","Wreck,","bound","less","and","bare"], sp: [false,true,true,false,false,true,true,false,true,true] },
      { syl: ["The","lone","and","le","vel","sands","stretch","far","a","way.”"], sp: [false,true,true,true,false,true,true,true,true,false] },
    ],
    answer: {
  lines: [
    { stress: "uSuSuSuSuSu", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuSu", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
    { stress: "uSuSuSuSuS", feet: [2,4,6,8], flex: [] },
  ],
  meter: "iambic pentameter", form: "sonnet", notes: "A sonnet; iambic pentameter runs steady beneath the ruin (one reading — Half sunk, Look on may take substitutions).",
},
  },
];

function meterString(foot, len) { return (!foot || !len) ? "" : FOOT_ADJ[foot] + " " + len; }
