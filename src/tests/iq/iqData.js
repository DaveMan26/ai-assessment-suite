export const DIMS = {
  LOGIC: {
    key: "LOGIC", name: "Logické uvažování", full: "Logické uvažování",
    eng: "Logical Reasoning", icon: "◈", color: "#2D6A9F", colorLight: "#2D6A9F18",
    desc: "Schopnost identifikovat vzorce, pravidla a logické vztahy v abstraktních sekvencích.",
    lowDesc: "Logické vzorce a abstraktní pravidla nejsou tvou nejsilnější stránkou. Spíš se orientuješ intuitivně nebo na základě zkušeností.",
    midDesc: "Logické uvažování máš na solidní úrovni — dokážeš rozpoznat vzorce a aplikovat pravidla, i když komplexnější sekvence mohou být výzvou.",
    highDesc: "Excelentní schopnost rozpoznávat vzorce a pravidla. Abstraktní logika ti jde přirozeně — rychle identifikuješ souvislosti a vztahy."
  },
  VERBAL: {
    key: "VERBAL", name: "Verbální inteligence", full: "Verbální inteligence",
    eng: "Verbal Intelligence", icon: "✎", color: "#3D7B8A", colorLight: "#3D7B8A18",
    desc: "Schopnost rozumět slovním vztahům, analogiím a jazykovým vzorcům.",
    lowDesc: "Verbální analogie a jazykové vzorce ti dělají větší potíže. Tvé silné stránky leží pravděpodobně jinde — v praktických nebo vizuálních oblastech.",
    midDesc: "Verbální inteligence je na dobré úrovni. Rozumíš jazykovým vztahům a analogiím, i když některé abstraktnější úlohy mohou být náročnější.",
    highDesc: "Silná verbální inteligence — snadno chytáš jazykové vzorce, analogie a abstraktní vztahy mezi koncepty. Přirozený cit pro jazyk a význam."
  },
  NUMERICAL: {
    key: "NUMERICAL", name: "Numerické uvažování", full: "Numerické uvažování",
    eng: "Numerical Reasoning", icon: "∑", color: "#E8A838", colorLight: "#E8A83818",
    desc: "Schopnost pracovat s číselnými sekvencemi, matematickými vzorci a kvantitativními vztahy.",
    lowDesc: "Číselné vzorce a matematické sekvence nejsou tvou nejsilnější doménou. Preferuješ pravděpodobně jiné typy problémů.",
    midDesc: "S čísly si rozumíš na solidní úrovni — dokážeš identifikovat vzorce v sekvencích a pracovat s matematickými vztahy.",
    highDesc: "Výborné numerické uvažování — rychle identifikuješ matematické vzorce, sekvence a kvantitativní vztahy. Čísla jsou tvůj živel."
  },
  SPATIAL: {
    key: "SPATIAL", name: "Prostorová představivost", full: "Prostorová představivost",
    eng: "Spatial Imagination", icon: "⬡", color: "#5BA4D9", colorLight: "#5BA4D918",
    desc: "Schopnost mentálně manipulovat s tvary, rozpoznávat rotace a prostorové transformace.",
    lowDesc: "Prostorová manipulace a mentální rotace jsou pro tebe náročnější. Spíš se spoléháš na slovní nebo číselné zpracování.",
    midDesc: "Prostorová představivost je na průměrné úrovni — základní rotace a transformace zvládáš, komplexnější tvary mohou být výzvou.",
    highDesc: "Vynikající prostorová představivost — snadno si představíš rotace, transformace a prostorové vztahy mezi objekty."
  },
  MEMORY: {
    key: "MEMORY", name: "Pracovní paměť", full: "Pracovní paměť",
    eng: "Working Memory", icon: "▣", color: "#8FBCD4", colorLight: "#8FBCD418",
    desc: "Kapacita krátkodobě uchovat a manipulovat s informacemi v mysli.",
    lowDesc: "Pracovní paměť je tvou slabší stránkou — delší sekvence a manipulace s informacemi v hlavě ti dělají potíže.",
    midDesc: "Pracovní paměť máš na průměrné úrovni — běžné sekvence si zapamatuješ, ale s delšími řadami se můžeš potýkat.",
    highDesc: "Silná pracovní paměť — dokážeš v hlavě udržet a zpracovávat více informací najednou, což ti dává výhodu při řešení složitých problémů."
  },
  SPEED: {
    key: "SPEED", name: "Rychlost zpracování", full: "Rychlost zpracování",
    eng: "Processing Speed", icon: "⚡", color: "#2A4858", colorLight: "#2A485818",
    desc: "Rychlost a přesnost při zpracování jednoduchých kognitivních úloh pod časovým tlakem.",
    lowDesc: "Při časovém tlaku se tvá přesnost snižuje — preferuješ důkladnější a pomalejší přístup k řešení problémů.",
    midDesc: "Rychlost zpracování je na průměrné úrovni — pod tlakem dokážeš pracovat efektivně, i když ne vždy optimálně.",
    highDesc: "Vysoká rychlost kognitivního zpracování — pod časovým tlakem si udržuješ přesnost a efektivitu. Rychlé rozhodování ti jde přirozeně."
  }
};

export const DIM_ORDER = ["LOGIC", "VERBAL", "NUMERICAL", "SPATIAL", "MEMORY", "SPEED"];

export const S = 35; // center of a 70x70 cell

export const LOGIC_TASKS = [
  {
    difficulty: 1,
    instruction: "Jaký tvar logicky pokračuje v sekvenci?",
    sequence: [
      [{ type: "circle", x: S, y: S, size: 50, stroke: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 50, stroke: "#2D6A9F" }, { type: "circle", x: S, y: S, size: 28, stroke: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 50, stroke: "#2D6A9F" }, { type: "circle", x: S, y: S, size: 28, stroke: "#2D6A9F" }, { type: "circle", x: S, y: S, size: 14, stroke: "#2D6A9F" }],
    ],
    options: [
      [{ type: "circle", x: S, y: S, size: 50, stroke: "#2D6A9F" }, { type: "circle", x: S, y: S, size: 28, stroke: "#2D6A9F" }, { type: "circle", x: S, y: S, size: 14, stroke: "#2D6A9F" }, { type: "circle", x: S, y: S, size: 7, stroke: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 50, fill: "#2D6A9F", stroke: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 50, stroke: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 50, stroke: "#2D6A9F" }, { type: "circle", x: S, y: S, size: 38, stroke: "#2D6A9F" }],
    ],
    correct: 0
  },
  {
    difficulty: 1,
    instruction: "Jaký tvar logicky pokračuje v sekvenci?",
    sequence: [
      [{ type: "circle", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "triangle", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
    ],
    options: [
      [{ type: "circle", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "diamond", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "star", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
    ],
    correct: 1
  },
  {
    difficulty: 2,
    instruction: "Jaký tvar logicky pokračuje v sekvenci?",
    sequence: [
      [{ type: "circle", x: S, y: S, size: 30, stroke: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 38, stroke: "#2D6A9F", fill: "#2D6A9F22" }],
      [{ type: "triangle", x: S, y: S, size: 46, stroke: "#2D6A9F" }],
      [{ type: "diamond", x: S, y: S, size: 54, stroke: "#2D6A9F", fill: "#2D6A9F22" }],
    ],
    options: [
      [{ type: "star", x: S, y: S, size: 62, stroke: "#2D6A9F" }],
      [{ type: "hexagon", x: S, y: S, size: 62, stroke: "#2D6A9F", fill: "#2D6A9F22" }],
      [{ type: "circle", x: S, y: S, size: 62, stroke: "#2D6A9F" }],
      [{ type: "star", x: S, y: S, size: 54, stroke: "#2D6A9F", fill: "#2D6A9F22" }],
    ],
    correct: 0
  },
  {
    difficulty: 2,
    instruction: "Který tvar doplní mřížku? Sleduj vzorce v řádcích i sloupcích.",
    grid: [
      [{ type: "circle", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
      null,
    ],
    gridCols: 2,
    options: [
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
      [{ type: "diamond", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
    ],
    correct: 0
  },
  {
    difficulty: 3,
    instruction: "Který tvar doplní mřížku 3×3? Sleduj pravidla v řádcích i sloupcích.",
    grid: [
      [{ type: "circle", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F33" }],
      [{ type: "square", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F33" }],
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F33" }],
      [{ type: "circle", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      null,
    ],
    gridCols: 3,
    options: [
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      [{ type: "diamond", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 44, stroke: "#2D6A9F", fill: "#2D6A9F" }],
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
    ],
    correct: 0
  },
  {
    difficulty: 3,
    instruction: "Který tvar doplní mřížku 3×3? Pozor na rotace a výplně.",
    grid: [
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 0 }],
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 90 }],
      [{ type: "triangle", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 180 }],
      [{ type: "square", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 0 }],
      [{ type: "square", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 45 }],
      [{ type: "square", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 90 }],
      [{ type: "diamond", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 0 }],
      [{ type: "diamond", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 45 }],
      null,
    ],
    gridCols: 3,
    options: [
      [{ type: "diamond", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 90 }],
      [{ type: "diamond", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 0 }],
      [{ type: "circle", x: S, y: S, size: 44, stroke: "#2D6A9F" }],
      [{ type: "diamond", x: S, y: S, size: 44, stroke: "#2D6A9F", rotation: 135 }],
    ],
    correct: 0
  }
];

export const VERBAL_TASKS = [
  { type: "analogy", difficulty: 1, stem: "Horký → Studený", analogy: "Velký → ???", options: ["Těžký", "Malý", "Silný", "Starý"], correct: 1 },
  { type: "analogy", difficulty: 2, stem: "Chirurg → Skalpel", analogy: "Malíř → ???", options: ["Plátno", "Štětec", "Barva", "Galerie"], correct: 1 },
  { type: "analogy", difficulty: 2, stem: "Strom → Les", analogy: "Písmeno → ???", options: ["Abeceda", "Slovo", "Věta", "Kniha"], correct: 1 },
  { type: "analogy", difficulty: 3, stem: "Hypotéza → Teorie", analogy: "Podezřelý → ???", options: ["Zločinec", "Odsouzený", "Vyšetřování", "Svědek"], correct: 1 },
  { type: "synonym", difficulty: 1, instruction: "Které slovo má NEJBLIŽŠÍ význam ke slovu:", word: "ODVAHA", options: ["Strach", "Statečnost", "Síla", "Rozhodnost"], correct: 1 },
  { type: "antonym", difficulty: 2, instruction: "Které slovo má OPAČNÝ význam ke slovu:", word: "REZIGNACE", options: ["Odhodlání", "Klid", "Smíření", "Únava"], correct: 0 },
  { type: "text_conclusion", difficulty: 2, passage: "Všechny kovové předměty vedou elektřinu. Měděný drát je vyroben z kovu.", question: "Který závěr LOGICKY vyplývá z textu?", options: ["Měděný drát vede elektřinu", "Všechny dráty jsou kovové", "Elektřina potřebuje kov", "Měď je nejlepší vodič"], correct: 0 },
  { type: "text_conclusion", difficulty: 3, passage: "Všichni členové výboru hlasovali pro návrh. Petr je členem výboru. Někteří členové výboru jsou zároveň členy rady.", question: "Který závěr LOGICKY vyplývá z textu?", options: ["Petr hlasoval pro návrh", "Petr je členem rady", "Většina rady hlasovala pro návrh", "Výbor má víc členů než rada"], correct: 0 },
];

export const NUMERICAL_TASKS = [
  { difficulty: 1, sequence: [2, 4, 6, 8], options: [9, 10, 12, 11], correct: 1, hint: "Najdi další číslo v řadě." },
  { difficulty: 1, sequence: [3, 6, 12, 24], options: [36, 48, 30, 42], correct: 1, hint: "Najdi další číslo v řadě." },
  { difficulty: 2, sequence: [1, 1, 2, 3, 5, 8], options: [11, 12, 13, 15], correct: 2, hint: "Najdi další číslo v řadě." },
  { difficulty: 2, sequence: [2, 6, 18, 54], options: [108, 162, 72, 128], correct: 1, hint: "Najdi další číslo v řadě." },
  { difficulty: 3, sequence: [1, 4, 9, 16, 25], options: [30, 36, 49, 32], correct: 1, hint: "Najdi další číslo v řadě." },
  { difficulty: 3, sequence: [0, 1, 1, 2, 4, 7, 13], options: [20, 24, 21, 26], correct: 1, hint: "Najdi další číslo (každé = součet 3 předchozích)." },
];

export const SPATIAL_TASKS = [
  {
    difficulty: 1,
    instruction: "Který z tvarů je otočenou verzí referenčního tvaru?",
    reference: [
      { type: "square", x: 25, y: 35, size: 40, stroke: "#5BA4D9", strokeWidth: 2.5 },
      { type: "circle", x: 50, y: 20, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
    ],
    options: [
      [
        { type: "square", x: 35, y: 25, size: 40, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "circle", x: 50, y: 50, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
      ],
      [
        { type: "square", x: 25, y: 35, size: 40, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "circle", x: 50, y: 20, size: 24, stroke: "#5BA4D9" },
      ],
      [
        { type: "square", x: 35, y: 35, size: 40, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "triangle", x: 50, y: 20, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
      ],
      [
        { type: "circle", x: 25, y: 35, size: 40, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "square", x: 50, y: 20, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
      ],
    ],
    correct: 0
  },
  {
    difficulty: 1,
    instruction: "Který z tvarů je otočenou verzí referenčního tvaru?",
    reference: [
      { type: "triangle", x: 35, y: 40, size: 50, stroke: "#5BA4D9", strokeWidth: 2.5 },
      { type: "line_h", x: 35, y: 18, size: 50, stroke: "#5BA4D9" },
    ],
    options: [
      [
        { type: "triangle", x: 35, y: 40, size: 50, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "line_h", x: 35, y: 54, size: 50, stroke: "#5BA4D9" },
      ],
      [
        { type: "triangle", x: 35, y: 30, size: 50, stroke: "#5BA4D9", strokeWidth: 2.5, rotation: 180 },
        { type: "line_h", x: 35, y: 52, size: 50, stroke: "#5BA4D9" },
      ],
      [
        { type: "triangle", x: 35, y: 40, size: 50, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "line_h", x: 35, y: 18, size: 50, stroke: "#5BA4D9" },
      ],
      [
        { type: "square", x: 35, y: 40, size: 50, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "line_h", x: 35, y: 18, size: 50, stroke: "#5BA4D9" },
      ],
    ],
    correct: 1
  },
  {
    difficulty: 2,
    instruction: "Který z tvarů je zrcadlově převrácenou verzí referenčního tvaru?",
    reference: [
      { type: "square", x: 22, y: 22, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
      { type: "circle", x: 48, y: 22, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
      { type: "triangle", x: 22, y: 48, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
    ],
    options: [
      [
        { type: "square", x: 48, y: 22, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
        { type: "circle", x: 22, y: 22, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
        { type: "triangle", x: 48, y: 48, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
      ],
      [
        { type: "square", x: 22, y: 48, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
        { type: "circle", x: 48, y: 48, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
        { type: "triangle", x: 22, y: 22, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
      ],
      [
        { type: "circle", x: 22, y: 22, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
        { type: "square", x: 48, y: 22, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
        { type: "triangle", x: 22, y: 48, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
      ],
      [
        { type: "square", x: 22, y: 22, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
        { type: "triangle", x: 48, y: 22, size: 30, stroke: "#5BA4D9", strokeWidth: 2 },
        { type: "circle", x: 22, y: 48, size: 24, stroke: "#5BA4D9", fill: "#5BA4D9" },
      ],
    ],
    correct: 0
  },
  {
    difficulty: 2,
    instruction: "Který z tvarů je otočenou verzí referenčního tvaru o 180°?",
    reference: [
      { type: "triangle", x: 25, y: 20, size: 36, stroke: "#5BA4D9", fill: "#5BA4D933" },
      { type: "square", x: 48, y: 48, size: 34, stroke: "#5BA4D9" },
      { type: "dots2", x: 25, y: 48, size: 40, stroke: "#5BA4D9" },
    ],
    options: [
      [
        { type: "square", x: 22, y: 22, size: 34, stroke: "#5BA4D9" },
        { type: "triangle", x: 45, y: 50, size: 36, stroke: "#5BA4D9", fill: "#5BA4D933", rotation: 180 },
        { type: "dots2", x: 45, y: 22, size: 40, stroke: "#5BA4D9" },
      ],
      [
        { type: "triangle", x: 25, y: 50, size: 36, stroke: "#5BA4D9", fill: "#5BA4D933", rotation: 180 },
        { type: "square", x: 48, y: 22, size: 34, stroke: "#5BA4D9" },
        { type: "dots2", x: 25, y: 22, size: 40, stroke: "#5BA4D9" },
      ],
      [
        { type: "triangle", x: 48, y: 50, size: 36, stroke: "#5BA4D9", fill: "#5BA4D933" },
        { type: "square", x: 22, y: 22, size: 34, stroke: "#5BA4D9" },
        { type: "dots2", x: 48, y: 22, size: 40, stroke: "#5BA4D9" },
      ],
      [
        { type: "square", x: 22, y: 22, size: 34, stroke: "#5BA4D9" },
        { type: "dots3", x: 45, y: 22, size: 40, stroke: "#5BA4D9" },
        { type: "triangle", x: 45, y: 50, size: 36, stroke: "#5BA4D9", fill: "#5BA4D933", rotation: 180 },
      ],
    ],
    correct: 0
  },
  {
    difficulty: 3,
    instruction: "Která složená figura odpovídá otočení referenční figury o 90° doprava?",
    reference: [
      { type: "square", x: 20, y: 20, size: 30, stroke: "#5BA4D9", fill: "#5BA4D9" },
      { type: "circle", x: 45, y: 20, size: 24, stroke: "#5BA4D9" },
      { type: "triangle", x: 20, y: 48, size: 28, stroke: "#5BA4D9" },
      { type: "diamond", x: 45, y: 48, size: 28, stroke: "#5BA4D9", fill: "#5BA4D944" },
    ],
    options: [
      [
        { type: "triangle", x: 20, y: 20, size: 28, stroke: "#5BA4D9" },
        { type: "square", x: 45, y: 20, size: 30, stroke: "#5BA4D9", fill: "#5BA4D9" },
        { type: "diamond", x: 20, y: 48, size: 28, stroke: "#5BA4D9", fill: "#5BA4D944" },
        { type: "circle", x: 45, y: 48, size: 24, stroke: "#5BA4D9" },
      ],
      [
        { type: "circle", x: 20, y: 20, size: 24, stroke: "#5BA4D9" },
        { type: "square", x: 45, y: 20, size: 30, stroke: "#5BA4D9", fill: "#5BA4D9" },
        { type: "diamond", x: 20, y: 48, size: 28, stroke: "#5BA4D9", fill: "#5BA4D944" },
        { type: "triangle", x: 45, y: 48, size: 28, stroke: "#5BA4D9" },
      ],
      [
        { type: "square", x: 20, y: 20, size: 30, stroke: "#5BA4D9", fill: "#5BA4D9" },
        { type: "triangle", x: 45, y: 20, size: 28, stroke: "#5BA4D9" },
        { type: "circle", x: 20, y: 48, size: 24, stroke: "#5BA4D9" },
        { type: "diamond", x: 45, y: 48, size: 28, stroke: "#5BA4D9", fill: "#5BA4D944" },
      ],
      [
        { type: "diamond", x: 20, y: 20, size: 28, stroke: "#5BA4D9", fill: "#5BA4D944" },
        { type: "triangle", x: 45, y: 20, size: 28, stroke: "#5BA4D9" },
        { type: "square", x: 20, y: 48, size: 30, stroke: "#5BA4D9" },
        { type: "circle", x: 45, y: 48, size: 24, stroke: "#5BA4D9" },
      ],
    ],
    correct: 0
  },
];

export const MEMORY_TASKS = [
  { type: "forward_recall", difficulty: 1, sequence: [3, 7, 2], displayMs: 3000, options: [[3, 7, 2], [3, 2, 7], [7, 3, 2], [2, 7, 3]], correct: 0 },
  { type: "forward_recall", difficulty: 2, sequence: [9, 3, 6, 1, 7], displayMs: 5000, options: [[9, 3, 6, 1, 7], [9, 6, 3, 1, 7], [9, 3, 1, 6, 7], [3, 9, 6, 1, 7]], correct: 0 },
  { type: "forward_recall", difficulty: 3, sequence: [6, 2, 9, 4, 7, 1, 5], displayMs: 6000, options: [[6, 2, 9, 4, 7, 1, 5], [6, 9, 2, 4, 7, 1, 5], [6, 2, 4, 9, 7, 1, 5], [6, 2, 9, 7, 4, 1, 5]], correct: 0 },
  { type: "backward_span", difficulty: 2, sequence: [5, 1, 8, 3], displayMs: 4000, correctReverse: [3, 8, 1, 5], correct: 0 },
  { type: "backward_span", difficulty: 3, sequence: [4, 9, 2, 7, 1], displayMs: 5000, correctReverse: [1, 7, 2, 9, 4], correct: 0 },
  { type: "letter_number", difficulty: 2, sequence: ["K", "3", "A", "7"], displayMs: 5000, question: "Seřaď: nejdřív čísla vzestupně, pak písmena abecedně", options: ["3 – 7 – A – K", "A – K – 3 – 7", "3 – A – 7 – K", "7 – 3 – K – A"], correct: 0 },
  { type: "letter_number", difficulty: 3, sequence: ["P", "2", "M", "8", "B", "5"], displayMs: 6000, question: "Seřaď: nejdřív čísla vzestupně, pak písmena abecedně", options: ["2 – 5 – 8 – B – M – P", "B – M – P – 2 – 5 – 8", "2 – 5 – 8 – M – B – P", "2 – 8 – 5 – B – M – P"], correct: 0 },
];

export function generateSpeedItems() {
  const shapes = ["circle", "square", "triangle", "diamond"];
  const items = [];
  for (let i = 0; i < 12; i++) {
    const s1 = shapes[Math.floor(Math.random() * shapes.length)];
    const same = Math.random() > 0.5;
    const s2 = same ? s1 : shapes.filter(x => x !== s1)[Math.floor(Math.random() * 3)];
    const f1 = Math.random() > 0.5;
    const f2 = same ? f1 : !f1;
    items.push({
      left: [{ type: s1, x: S, y: S, size: 50, stroke: "#2A4858", fill: f1 ? "#2A485833" : "none" }],
      right: [{ type: s2, x: S, y: S, size: 50, stroke: "#2A4858", fill: f2 ? "#2A485833" : "none" }],
      same: same && f1 === f2
    });
  }
  return items;
}

export const PRACTICE_TASKS = {
  LOGIC: {
    type: "sequence",
    instruction: "Trénink: Jaký tvar logicky pokračuje?",
    sequence: [
      [{ type: "circle", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "square", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
    ],
    options: [
      [{ type: "square", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "circle", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "triangle", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
      [{ type: "diamond", x: S, y: S, size: 48, stroke: "#2D6A9F" }],
    ],
    correct: 1,
    explanation: "Vzorec se opakuje: kruh, kruh, čtverec → takže další je opět kruh.",
    wrongExplanation: "Správná odpověď je B (kruh). Vzorec se opakuje: kruh, kruh, čtverec — takže další je opět kruh."
  },
  VERBAL: {
    type: "analogy",
    stem: "Den → Noc",
    analogy: "Léto → ???",
    options: ["Jaro", "Zima", "Podzim", "Rok"],
    correct: 1,
    explanation: "Den a noc jsou protiklady, stejně jako léto a zima.",
    wrongExplanation: "Správná odpověď je B (Zima). Den a noc jsou protiklady, stejně jako léto a zima."
  },
  NUMERICAL: {
    type: "sequence",
    sequence: [1, 2, 3, 4],
    options: [5, 6, 7, 8],
    correct: 0,
    hint: "Trénink: Najdi další číslo v řadě.",
    explanation: "Řada se zvyšuje vždy o 1, takže další číslo je 5.",
    wrongExplanation: "Správná odpověď je 5. Řada se zvyšuje vždy o 1 (1, 2, 3, 4, 5)."
  },
  SPATIAL: {
    type: "rotation",
    instruction: "Trénink: Který tvar je otočenou verzí referenčního tvaru?",
    reference: [
      { type: "square", x: 35, y: 35, size: 44, stroke: "#5BA4D9", strokeWidth: 2.5 },
      { type: "circle", x: 20, y: 20, size: 20, stroke: "#5BA4D9", fill: "#5BA4D9" },
    ],
    options: [
      [
        { type: "square", x: 35, y: 35, size: 44, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "circle", x: 50, y: 20, size: 20, stroke: "#5BA4D9", fill: "#5BA4D9" },
      ],
      [
        { type: "square", x: 35, y: 35, size: 44, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "triangle", x: 20, y: 20, size: 20, stroke: "#5BA4D9", fill: "#5BA4D9" },
      ],
      [
        { type: "circle", x: 35, y: 35, size: 44, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "circle", x: 20, y: 20, size: 20, stroke: "#5BA4D9", fill: "#5BA4D9" },
      ],
      [
        { type: "square", x: 35, y: 35, size: 44, stroke: "#5BA4D9", strokeWidth: 2.5 },
        { type: "circle", x: 20, y: 50, size: 20, stroke: "#5BA4D9" },
      ],
    ],
    correct: 0,
    explanation: "Čtverec zůstává na místě a kolečko se přesunulo — tvar byl otočen o 90° doprava.",
    wrongExplanation: "Správná odpověď je A. Čtverec zůstává a plné kolečko se přesouvá při otočení o 90°."
  },
  MEMORY: {
    type: "forward_recall",
    sequence: [3, 7],
    displayMs: 3000,
    options: [[3, 7], [7, 3], [3, 3], [7, 7]],
    correct: 0,
    explanation: "Sekvence byla 3, 7. V ostrém testu budou sekvence delší.",
    wrongExplanation: "Správná odpověď je A (3, 7). V ostrém testu budou sekvence delší."
  },
  SPEED: {
    type: "speed_practice",
    itemCount: 3,
    explanation: "Výborně! Teď začne ostrý test — budeš mít 30 sekund na co nejvíce správných odpovědí."
  }
};

export const SECTIONS = [
  { dim: "LOGIC", title: "Logické uvažování", subtitle: "Rozpoznávání vzorců a pravidel v sekvencích tvarů",
    icon: "◈", instructions: "Uvidíš sekvence nebo mřížky tvarů, které sledují logické pravidlo. Tvým úkolem je identifikovat chybějící prvek.", taskCount: 6 },
  { dim: "VERBAL", title: "Verbální inteligence", subtitle: "Slovní analogie, synonyma a logické závěry",
    icon: "✎", instructions: "Uvidíš slovní analogie, otázky na význam slov a krátké texty s logickými závěry. Vyber nejlepší odpověď.", taskCount: 8 },
  { dim: "NUMERICAL", title: "Numerické uvažování", subtitle: "Číselné sekvence a matematické vzorce",
    icon: "∑", instructions: "Uvidíš řadu čísel sledující určitý vzorec. Najdi číslo, které logicky pokračuje.", taskCount: 6 },
  { dim: "SPATIAL", title: "Prostorová představivost", subtitle: "Mentální rotace a prostorové transformace",
    icon: "⬡", instructions: "Uvidíš referenční tvar a čtyři možnosti. Vyber ten, který vznikne otočením nebo zrcadlením referenčního tvaru.", taskCount: 5 },
  { dim: "MEMORY", title: "Pracovní paměť", subtitle: "Zapamatování a manipulace s informacemi",
    icon: "▣", instructions: "Uvidíš sekvenci číslic nebo znaků. Zapamatuj si je a odpověz — někdy budeš zadávat čísla v opačném pořadí, jindy řadit znaky podle pravidel.", taskCount: 7 },
  { dim: "SPEED", title: "Rychlost zpracování", subtitle: "Porovnávání tvarů pod časovým tlakem",
    icon: "⚡", instructions: "Uvidíš dva tvary vedle sebe. Co nejrychleji rozhodni, zda jsou STEJNÉ nebo JINÉ. Máš 30 sekund na co nejvíce správných odpovědí.", taskCount: 12 },
];
