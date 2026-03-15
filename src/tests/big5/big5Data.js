// Big Five (OCEAN) — referenční test, v2.0

export const TEST_CONFIG = {
  id: "BIG5",
  name: "Big Five",
  fullName: "Big Five Personality Assessment",
  version: "2.0",
  icon: "◉",
  accentColor: "#E07A5F",
  accentColorLight: "#E07A5F22",
  secondaryColor: "#F2CC8F",
  estimatedMinutes: 10,
  questionCount: 40,
  dimensionCount: 5,
  description: "Test mapuje tvou osobnost v 5 základních dimenzích — otevřenost, svědomitost, extraverze, přívětivost a emoční stabilita.",
  tip: "Odpovídej intuitivně — první reakce bývá nejpřesnější. Na konci si stáhneš vizuální report i markdown pro AI."
};

export const DIMENSIONS = {
  O: {
    name: "Otevřenost",
    full: "Otevřenost vůči zkušenosti",
    eng: "Openness",
    color: "#E07A5F",
    colorLight: "#E07A5F22",
    icon: "✦",
    subfacets: ["Fantazie", "Estetika", "Pocity", "Akce", "Ideje", "Hodnoty"],
    lowLabel: "Praktický & konvenční",
    highLabel: "Zvídavý & originální",
    lowDesc: "Preferuješ osvědčené postupy, jsi prakticky zaměřený a upřednostňuješ konkrétní fakta před abstraktními teoriemi. Stabilita a předvídatelnost ti dávají jistotu.",
    highDesc: "Máš bohatý vnitřní svět, aktivně vyhledáváš nové zkušenosti a myšlenky. Jsi kreativní, zvídavý a otevřený nekonvenčním přístupům.",
    midDesc: "Dokážeš balancovat mezi osvědčenými postupy a novými přístupy. Jsi otevřený novinkám, ale ne na úkor stability."
  },
  C: {
    name: "Svědomitost",
    full: "Svědomitost",
    eng: "Conscientiousness",
    color: "#3D405B",
    colorLight: "#3D405B22",
    icon: "◆",
    subfacets: ["Kompetence", "Pořádnost", "Povinnost", "Cílevědomost", "Disciplína", "Rozvaha"],
    lowLabel: "Flexibilní & spontánní",
    highLabel: "Organizovaný & disciplinovaný",
    lowDesc: "Jsi spontánní, flexibilní a preferuješ volnost před strukturou. Příliš rigidní plány tě svazují — funguje ti lépe reagovat na situaci.",
    highDesc: "Jsi systematický, spolehlivý a cílevědomý. Dotahuješ věci do konce, plánuješ dopředu a máš silný smysl pro odpovědnost.",
    midDesc: "Umíš být organizovaný, když je potřeba, ale zachováváš si flexibilitu. Najdeš rovnováhu mezi strukturou a spontaneitou."
  },
  E: {
    name: "Extraverze",
    full: "Extraverze",
    eng: "Extraversion",
    color: "#F2CC8F",
    colorLight: "#F2CC8F22",
    icon: "●",
    subfacets: ["Vřelost", "Společenskost", "Asertivita", "Aktivita", "Vzrušení", "Pozitivní emoce"],
    lowLabel: "Introvertní & reflektivní",
    highLabel: "Extravertní & energický",
    lowDesc: "Čerpáš energii z klidného prostředí a hlubších konverzací 1:1. Nepotřebuješ být středem pozornosti — reflexe a vnitřní svět ti dávají sílu.",
    highDesc: "Jsi energický, společenský a rád se angažuješ. Lidé kolem tě nabíjejí a přirozeně přitahuješ pozornost skupiny.",
    midDesc: "Jsi ambivert — umíš být společenský i reflektivní podle situace. Čerpáš energii jak z lidí, tak z klidu."
  },
  A: {
    name: "Přívětivost",
    full: "Přívětivost",
    eng: "Agreeableness",
    color: "#81B29A",
    colorLight: "#81B29A22",
    icon: "♥",
    subfacets: ["Důvěra", "Upřímnost", "Altruismus", "Ústupnost", "Skromnost", "Soucit"],
    lowLabel: "Nezávislý & přímý",
    highLabel: "Kooperativní & empatický",
    lowDesc: "Jsi přímý, nezávislý a nebojíš se konfrontace, když je potřeba. Ceníš si autenticity víc než harmonie za každou cenu.",
    highDesc: "Jsi empatický, kooperativní a zaměřený na druhé. Přirozeně vytváříš harmonii a důvěru v mezilidských vztazích.",
    midDesc: "Umíš být jak kooperativní, tak asertivní podle kontextu. Máš empatii, ale nebojíš se říct, co si myslíš."
  },
  N: {
    name: "Neuroticismus",
    full: "Neuroticismus (emoční stabilita)",
    eng: "Neuroticism",
    color: "#8E7DBE",
    colorLight: "#8E7DBE22",
    icon: "◎",
    subfacets: ["Úzkost", "Hněvivost", "Depresivita", "Rozpačitost", "Impulzivita", "Zranitelnost"],
    lowLabel: "Klidný & odolný",
    highLabel: "Citlivý & reaktivní",
    lowDesc: "Jsi emocionálně stabilní, klidný pod tlakem a rychle se zotavuješ ze stresu. Emoce tě nezahlcují.",
    highDesc: "Jsi emocionálně citlivý a intenzivně prožíváš. Můžeš být náchylnější ke stresu a přemýšlení, ale to také znamená hlubší prožívání.",
    midDesc: "Máš průměrnou emoční reaktivitu — někdy tě věci zasáhnou víc, jindy jsi klidný. Záleží na kontextu a náročnosti situace."
  }
};

export const SCALE_ITEMS = [
  // === OPENNESS (8 items, 2 reverse) ===
  { id: "big5_o_01", dim: "O", text: "Mám živou představivost a často se nořím do fantazií a myšlenkových experimentů.", sub: 0, reverse: false },
  { id: "big5_o_02", dim: "O", text: "Umělecká díla, hudba nebo příroda mě dokážou hluboce zasáhnout.", sub: 1, reverse: false },
  { id: "big5_o_03", dim: "O", text: "Rád/a zkouším nové přístupy, i když ten starý funguje.", sub: 3, reverse: false },
  { id: "big5_o_04", dim: "O", text: "Přemýšlím o abstraktních konceptech a filozofických otázkách.", sub: 4, reverse: false },
  { id: "big5_o_05", dim: "O", text: "Vyhledávám situace, které jsou pro mě nové a neznámé.", sub: 3, reverse: false },
  { id: "big5_o_06", dim: "O", text: "Raději se držím osvědčených postupů než experimentuji.", sub: 5, reverse: true },
  { id: "big5_o_07", dim: "O", text: "Zajímám se o to, jak věci fungují pod povrchem — systémy, vzorce, souvislosti.", sub: 4, reverse: false },
  { id: "big5_o_08", dim: "O", text: "Jsem otevřený/á přehodnocení svých názorů, když narazím na nové informace.", sub: 5, reverse: false },

  // === CONSCIENTIOUSNESS (8 items, 1 reverse) ===
  { id: "big5_c_01", dim: "C", text: "Mám jasný systém, jak organizuji svůj čas a úkoly.", sub: 1, reverse: false },
  { id: "big5_c_02", dim: "C", text: "Když si něco předsevezmu, dotáhnu to do konce.", sub: 3, reverse: false },
  { id: "big5_c_03", dim: "C", text: "Před rozhodnutím pečlivě zvažuji možné důsledky.", sub: 5, reverse: false },
  { id: "big5_c_04", dim: "C", text: "Moje pracovní prostředí je většinou uspořádané.", sub: 1, reverse: false },
  { id: "big5_c_05", dim: "C", text: "Často odkládám důležité úkoly na poslední chvíli.", sub: 4, reverse: true },
  { id: "big5_c_06", dim: "C", text: "Stanovuji si cíle a systematicky k nim směřuji.", sub: 3, reverse: false },
  { id: "big5_c_07", dim: "C", text: "Detaily a přesnost jsou pro mě důležité.", sub: 0, reverse: false },
  { id: "big5_c_08", dim: "C", text: "Dodržuji sliby a závazky, i když to není snadné.", sub: 2, reverse: false },

  // === EXTRAVERSION (8 items, 2 reverse) ===
  { id: "big5_e_01", dim: "E", text: "Ve větší skupině lidí se cítím nabitý/á energií.", sub: 1, reverse: false },
  { id: "big5_e_02", dim: "E", text: "Rád/a beru iniciativu a vedu konverzaci.", sub: 2, reverse: false },
  { id: "big5_e_03", dim: "E", text: "Preferuji hluboké rozhovory 1:1 před velkými společenskými akcemi.", sub: 1, reverse: true },
  { id: "big5_e_04", dim: "E", text: "Mám rád/a rychlé tempo a hodně aktivity během dne.", sub: 3, reverse: false },
  { id: "big5_e_05", dim: "E", text: "Snadno navazuji kontakty s neznámými lidmi.", sub: 0, reverse: false },
  { id: "big5_e_06", dim: "E", text: "Po dlouhém společenském večeru potřebuji čas sám/sama na dobití.", sub: 4, reverse: true },
  { id: "big5_e_07", dim: "E", text: "Často prožívám silné pozitivní emoce — nadšení, radost, vzrušení.", sub: 5, reverse: false },
  { id: "big5_e_08", dim: "E", text: "V práci mi vyhovuje spolupráce víc než samostatná práce.", sub: 1, reverse: false },

  // === AGREEABLENESS (8 items, 2 reverse) ===
  { id: "big5_a_01", dim: "A", text: "Většině lidí přirozeně důvěřuji, dokud mě nepřesvědčí o opaku.", sub: 0, reverse: false },
  { id: "big5_a_02", dim: "A", text: "Když vidím někoho v nesnázích, automaticky chci pomoct.", sub: 2, reverse: false },
  { id: "big5_a_03", dim: "A", text: "V konfliktu hledám kompromis spíš než prosazuji svou.", sub: 3, reverse: false },
  { id: "big5_a_04", dim: "A", text: "Říkám lidem pravdu přímo, i když to nechtějí slyšet.", sub: 1, reverse: true },
  { id: "big5_a_05", dim: "A", text: "Snažím se vidět situaci z perspektivy druhého člověka.", sub: 5, reverse: false },
  { id: "big5_a_06", dim: "A", text: "Mé vlastní potřeby dávám často na druhé místo za potřeby ostatních.", sub: 4, reverse: false },
  { id: "big5_a_07", dim: "A", text: "Raději spolupracuji, než soutěžím.", sub: 3, reverse: false },
  { id: "big5_a_08", dim: "A", text: "Nemám problém se konfrontovat, pokud je to nutné.", sub: 3, reverse: true },

  // === NEUROTICISM (8 items, 2 reverse) ===
  { id: "big5_n_01", dim: "N", text: "Často se přistihnu, že přemýšlím o věcech, které by se mohly pokazit.", sub: 0, reverse: false },
  { id: "big5_n_02", dim: "N", text: "Malé nepříjemnosti mě dokážou vyvést z rovnováhy na delší dobu.", sub: 1, reverse: false },
  { id: "big5_n_03", dim: "N", text: "Někdy mě zaplaví pocity smutku nebo prázdnoty bez jasné příčiny.", sub: 2, reverse: false },
  { id: "big5_n_04", dim: "N", text: "V sociálních situacích se občas cítím nejistě.", sub: 3, reverse: false },
  { id: "big5_n_05", dim: "N", text: "Pod stresem zůstávám klidný/á a soustředěný/á.", sub: 5, reverse: true },
  { id: "big5_n_06", dim: "N", text: "Mám tendenci reagovat impulzivně, když jsem ve stresu.", sub: 4, reverse: false },
  { id: "big5_n_07", dim: "N", text: "Rychle se zotavuji z náročných situací.", sub: 5, reverse: true },
  { id: "big5_n_08", dim: "N", text: "Stres a tlak negativně ovlivňují kvalitu mého rozhodování.", sub: 5, reverse: false }
];

export const SLIDER_LABELS = [
  "Vůbec ne",
  "Spíše ne",
  "Trochu ne",
  "Neutrální",
  "Trochu ano",
  "Spíše ano",
  "Rozhodně ano"
];

export function generateImplications(scores) {
  return {
    work: [
      scores.O > 60
        ? "Vyhovuje ti prostředí, které podporuje inovaci a experimentování."
        : "Preferuješ jasnou strukturu a osvědčené postupy.",
      scores.C > 60
        ? "Potřebuješ jasné cíle a systém."
        : "Flexibilní prostředí bez přílišné rigidity ti sedí lépe.",
      scores.E > 55
        ? "Týmová spolupráce tě energizuje."
        : "Oceníš prostor pro soustředěnou samostatnou práci."
    ],
    relationships: [
      scores.A > 60
        ? "Jsi přirozeně empatický a kooperativní."
        : "Jsi přímý a nebojíš se konstruktivní konfrontace.",
      scores.N < 40
        ? "Pod tlakem zůstáváš klidný — výhoda ve stresových situacích."
        : scores.N > 60
          ? "Hluboké prožívání ti dává emoční inteligenci, ale vyžaduje aktivní práci se stresem."
          : "Emocionálně jsi vyvážený s přiměřenou citlivostí."
    ],
    growth: (lowest) =>
      `Zaměř se na ${scores[lowest] < 40 ? `posílení oblasti "${DIMENSIONS[lowest].name}" — ` : ""}vyrovnání profilu tam, kde je to pro tvé cíle relevantní. Nízké skóre není slabina — může být tvým stylem.`
  };
}
