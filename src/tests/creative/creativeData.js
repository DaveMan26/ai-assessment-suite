export const TEST_CONFIG = {
  id: "CREATIVE",
  name: "Kreativita",
  fullName: "Kreativita a inovace",
  version: "2.0",
  icon: "✹",
  accentColor: "#FF6B6B",
  accentColorLight: "#FF6B6B22",
  secondaryColor: "#4ECDC4",
  estimatedMinutes: 14,
  description: "Kombinace kreativních úloh a sebehodnocení. Test obsahuje úlohy na divergentní myšlení (vymýšlení neobvyklých použití předmětů), situační scénáře a otázky o tvém kreativním chování v každodenním životě.",
  tip: "U kreativních úloh piš všechno, co tě napadne — kvantita je důležitější než kvalita. U scénářů a škál odpovídej podle toho, co bys opravdu udělal/a, ne co zní nejlépe."
};

export const DIMENSIONS = {
  FLUENCY: {
    name: "Ideová plynulost",
    full: "Ideová plynulost (množství nápadů)",
    eng: "Fluency",
    color: "#FF6B6B",
    colorLight: "#FF6B6B22",
    icon: "✹",
    lowLabel: "Méně nápadů",
    highLabel: "Mnoho nápadů",
    lowDesc: "Generuješ spíše méně nápadů, ale často promyšlenějších. V kreativní práci se můžeš opírat o kvalitu a hloubku jednotlivých myšlenek.",
    midDesc: "Generuješ přiměřené množství nápadů. Umíš přepínat mezi kvalitou a kvantitou podle situace.",
    highDesc: "Dokážeš rychle generovat velké množství nápadů. Brainstorming a hledání alternativ ti jde přirozeně — to je základ kreativního procesu."
  },
  FLEXIBILITY: {
    name: "Kategoriální flexibilita",
    full: "Kategoriální flexibilita (šíře perspektiv)",
    eng: "Flexibility",
    color: "#4ECDC4",
    colorLight: "#4ECDC422",
    icon: "⌇",
    lowLabel: "Jeden směr",
    highLabel: "Mnoho směrů",
    lowDesc: "Tvoje nápady se často drží jednoho směru nebo kategorie. To může znamenat hlubší ponor do jedné oblasti, ale méně šíře.",
    midDesc: "Střídáš hlubší ponor do jednoho směru s přepínáním mezi různými přístupy. Záleží na situaci a tématu.",
    highDesc: "Umíš se na problém dívat z mnoha stran a přeskakovat mezi kategoriemi nápadů. To ti umožňuje nacházet řešení tam, kde je ostatní nehledají."
  },
  ORIGINALITY: {
    name: "Originalita",
    full: "Originalita a neotřelost nápadů",
    eng: "Originality",
    color: "#FFE66D",
    colorLight: "#FFE66D22",
    icon: "★",
    lowLabel: "Konvenční řešení",
    highLabel: "Neobvyklé nápady",
    lowDesc: "Tvoje nápady jsou spíše praktické a realizovatelné. Dáváš přednost ověřeným řešením — což je v mnoha kontextech cenná vlastnost.",
    midDesc: "Kombinuješ realistické nápady s občasnými originálními záblesky. Dokážeš být neotřelý/á, když je prostor a bezpečné prostředí.",
    highDesc: "Často tě napadají neobvyklé a originální řešení, která se odlišují od běžného očekávání. Dokážeš spojovat vzdálené koncepty."
  },
  APPLICATION: {
    name: "Aplikační kreativita",
    full: "Aplikační kreativita (řešení situací)",
    eng: "Application",
    color: "#FFA07A",
    colorLight: "#FFA07A22",
    icon: "◈",
    lowLabel: "Osvědčené postupy",
    highLabel: "Kreativní řešení",
    lowDesc: "V situacích volíš spíše osvědčené postupy a konvenční řešení. To přináší stabilitu a předvídatelnost, ale může omezovat inovace.",
    midDesc: "Podle kontextu střídáš konvenční i kreativnější přístupy. Kreativitu nasazuješ tam, kde to dává smysl.",
    highDesc: "V reálných situacích aktivně hledáš netradiční řešení, reframuješ problémy a kombinuješ přístupy. Kreativitu umíš přenést z hlavy do praxe."
  },
  INITIATIVE: {
    name: "Kreativní iniciativa",
    full: "Kreativní iniciativa a explorativnost",
    eng: "Initiative",
    color: "#95DAD7",
    colorLight: "#95DAD722",
    icon: "◆",
    lowLabel: "Pasivní konzument",
    highLabel: "Aktivní tvůrce",
    lowDesc: "V každodenním životě spíše konzumuješ hotový obsah a držíš se zavedených rutin. Kreativní experimenty nejsou tvoje přirozené prostředí.",
    midDesc: "Občas experimentuješ a zkoušíš nové věci, ale nepovažuješ to za svou hlavní hnací sílu. Kreativní iniciativa se u tebe projeví, když tě téma zaujme.",
    highDesc: "Aktivně vyhledáváš nové podněty, experimentuješ a realizuješ vlastní projekty. Kreativita je součást tvého každodenního života, ne jen práce."
  }
};

export const ALT_USES_ITEMS = [
  {
    id: "brick",
    label: "Cihla",
    instruction: "Napiš co nejvíce neobvyklých způsobů, jak by se dala použít obyčejná cihla. Jeden nápad na řádek.",
    timeLimit: 60,
    keywordBuckets: {
      construction: { stems: ["stav", "zed", "sten", "komin", "zaklad", "plot", "cest", "dlaz", "schod", "prich"], label: "Stavba" },
      weight: { stems: ["zavaz", "tez", "zatiz", "priti", "prit", "kotv", "udrz"], label: "Závaží/zátěž" },
      weapon: { stems: ["zbran", "hod", "haze", "uder", "rozbij", "sebeobran", "obran"], label: "Zbraň/obrana" },
      art: { stems: ["soch", "umen", "instal", "design", "dekora", "vytvar", "mozaik", "malb", "barv"], label: "Umění/dekorace" },
      tool: { stems: ["nastro", "klad", "pak", "brus", "otvir", "klin", "sevc"], label: "Nástroj" },
      support: { stems: ["podper", "podloz", "podstav", "stojan", "zarazk", "spalic"], label: "Podpěra/zarážka" },
      furniture: { stems: ["sedatk", "stolic", "lavic", "sede", "zidl", "stol"], label: "Nábytek/sezení" },
      container: { stems: ["schra", "box", "uklad", "nadob", "truhl"], label: "Schránka/úložiště" },
      sport: { stems: ["sport", "cvic", "trenin", "cink", "zavaz", "posilova"], label: "Sport/cvičení" },
      music: { stems: ["hudeb", "bubin", "zvuk", "hluk", "bubn", "klepa"], label: "Hudba/zvuk" },
      heating: { stems: ["tep", "ohri", "topeni", "akumul", "hrej"], label: "Teplo/ohřev" },
      game: { stems: ["hra", "hrac", "stavi", "kostk", "domino", "puzzle", "pis", "sach"], label: "Hra/hračka" },
      garden: { stems: ["zahrad", "kvetin", "okras", "ohrad", "zahon", "truhli"], label: "Zahrada" },
      writing: { stems: ["krid", "psani", "kres", "ryt", "znack"], label: "Psaní/kreslení" },
      emergency: { stems: ["nouzov", "zachran", "prezit", "signal", "ukazat"], label: "Nouze/signalizace" }
    }
  },
  {
    id: "bottle",
    label: "Plastová láhev",
    instruction: "Napiš co nejvíce neobvyklých způsobů, jak by se dala použít prázdná plastová láhev. Jeden nápad na řádek.",
    timeLimit: 60,
    keywordBuckets: {
      container: { stems: ["nadob", "schran", "uklad", "skladov", "naplni", "lahv"], label: "Nádoba/úložiště" },
      garden: { stems: ["zahrad", "kvetin", "zalev", "truhli", "sklenk", "rostl", "sazen"], label: "Zahrada/rostliny" },
      craft: { stems: ["vyrob", "kuti", "tvori", "bastl", "remesl", "rucni"], label: "Kutilství/DIY" },
      toy: { stems: ["hrac", "hra", "det", "kuzel", "ragby", "bowling"], label: "Hra/hračka" },
      music: { stems: ["hudeb", "zvuk", "bubin", "chrasti", "marak", "pistal", "pisk"], label: "Hudba/zvuk" },
      art: { stems: ["umen", "soch", "instal", "dekora", "vytvar", "mozaik", "lampi", "sviti"], label: "Umění/dekorace" },
      funnel: { stems: ["trychtyr", "lijac", "nalev", "prelev", "nalevk"], label: "Trychtýř/nalévání" },
      weapon: { stems: ["zbran", "strik", "vodni", "prak", "hod"], label: "Zbraň/stříkačka" },
      sport: { stems: ["sport", "cvic", "cink", "zavaz", "kuzel", "bojk"], label: "Sport/cvičení" },
      science: { stems: ["experiment", "pokus", "ved", "chemie", "fyzik", "filtr", "desti"], label: "Experiment/věda" },
      survival: { stems: ["prezit", "nouzov", "signal", "plava", "zachran", "boje"], label: "Přežití/nouze" },
      insulation: { stems: ["izolac", "tepel", "tep", "ochran", "zatepleni"], label: "Izolace/ochrana" },
      trap: { stems: ["past", "chyt", "lapac", "hmyz", "komar", "vosa"], label: "Past/lapač" },
      telescope: { stems: ["dalekohlad", "trubic", "kukatk", "perisko"], label: "Optika/trubice" },
      organization: { stems: ["organiz", "tridi", "porad", "stojan", "drzak", "penal"], label: "Organizace/držák" }
    }
  }
];

export const SCENARIOS = [
  {
    id: "sc_budget",
    text: "Tvému týmu výrazně zkrátili rozpočet na rozjetý projekt. Musíte se rozhodnout, jak dál.",
    options: [
      { label: "Striktně osekat rozsah a soustředit se na to nejnutnější.", scores: { APPLICATION: 0.25 } },
      { label: "Hledat alternativní zdroje — barterové dohody, partnerství, sponzoring.", scores: { APPLICATION: 0.65, INITIATIVE: 0.3 } },
      { label: "Přetvořit projekt tak, aby přinesl hodnotu i za méně peněz — hledat chytré zkratky a nové formáty.", scores: { APPLICATION: 0.85, ORIGINALITY: 0.3 } },
      { label: "Zastavit projekt a navrhnout úplně nový koncept, který funguje v rámci nového rozpočtu.", scores: { APPLICATION: 0.5, INITIATIVE: 0.4 } }
    ]
  },
  {
    id: "sc_stuck",
    text: "Pracuješ na problému, který se ti nedaří vyřešit běžnými postupy. Tým je frustrovaný a tlačí na rychlé řešení.",
    options: [
      { label: "Požádám o víc času a budu systematicky procházet všechny známé přístupy.", scores: { APPLICATION: 0.3 } },
      { label: "Zkusím se na problém podívat z úplně jiného úhlu — zeptám se, jestli řešíme správnou otázku.", scores: { APPLICATION: 0.85, ORIGINALITY: 0.4 } },
      { label: "Navrhnu rychlý experiment — zkusíme jedno neověřené řešení a uvidíme, co se stane.", scores: { APPLICATION: 0.7, INITIATIVE: 0.5 } },
      { label: "Přizveme někoho zvenčí, kdo na to bude mít jiný pohled.", scores: { APPLICATION: 0.55, INITIATIVE: 0.2 } }
    ]
  },
  {
    id: "sc_routine",
    text: "V práci máš zavedený proces, který funguje, ale je pomalý a nikdo ho nemá rád. Oficiálně není na změnu čas.",
    options: [
      { label: "Nechám to být — funguje to, změna by přinesla zbytečný chaos.", scores: { APPLICATION: 0.15 } },
      { label: "Navrhnu šéfovi formální revizi procesu s analýzou úspor.", scores: { APPLICATION: 0.4, INITIATIVE: 0.2 } },
      { label: "Sám/sama si zkusím upravit svou část procesu a výsledky ukážu jako příklad.", scores: { APPLICATION: 0.7, INITIATIVE: 0.7 } },
      { label: "Uspořádám neformální brainstorming s kolegy a společně vymyslíme lepší alternativu.", scores: { APPLICATION: 0.8, INITIATIVE: 0.5 } }
    ]
  },
  {
    id: "sc_gift",
    text: "Blíží se narozeniny blízkého člověka. Chceš dárek, který bude opravdu osobní a překvapivý, ale máš omezený rozpočet.",
    options: [
      { label: "Koupím kvalitní verzi něčeho, co vím, že potřebuje.", scores: { APPLICATION: 0.3 } },
      { label: "Vyrobím něco ručně — spojím to s naším společným zážitkem nebo vtipem.", scores: { APPLICATION: 0.75, ORIGINALITY: 0.4, INITIATIVE: 0.3 } },
      { label: "Připravím zážitek nebo sérii malých překvapení rozloženou v čase.", scores: { APPLICATION: 0.8, ORIGINALITY: 0.5 } },
      { label: "Zeptám se přímo, co by si přál/a, a podle toho koupím.", scores: { APPLICATION: 0.2 } }
    ]
  },
  {
    id: "sc_boring_meeting",
    text: "Pravidelná porada v práci je neproduktivní — lidé se nudí, opakují se stejné body a nic se nerozhodne.",
    options: [
      { label: "Navrhnu změnu formátu — kratší, s jasnou agendou a časovými limity.", scores: { APPLICATION: 0.5, INITIATIVE: 0.3 } },
      { label: "Přinesu úplně nový formát — stand-up, walk & talk, nebo vizuální brainstorming.", scores: { APPLICATION: 0.85, ORIGINALITY: 0.4, INITIATIVE: 0.5 } },
      { label: "Nic neříkám — není to moje zodpovědnost měnit porady.", scores: { APPLICATION: 0.1 } },
      { label: "Zkusím změnit aspoň svůj příspěvek — místo reportu přinesu jednu otevřenou otázku k diskuzi.", scores: { APPLICATION: 0.6, INITIATIVE: 0.4 } }
    ]
  }
];

export const SCALE_ITEMS = [
  { id: "cr_orig_01", dim: "ORIGINALITY", text: "Když řeším problém, často mě napadnou řešení, která jsou hodně odlišná od toho, co navrhnou ostatní.", reverse: false },
  { id: "cr_orig_02", dim: "ORIGINALITY", text: "Rád/a spojuji myšlenky z úplně nesouvisejících oblastí — výsledky mě překvapují.", reverse: false },
  { id: "cr_orig_03", dim: "ORIGINALITY", text: "Moje nápady jsou většinou variací na to, co už existuje, než skutečně nová řešení.", reverse: true },
  { id: "cr_orig_04", dim: "ORIGINALITY", text: "Lidé kolem mě občas komentují, že moje nápady jsou neotřelé nebo nečekané.", reverse: false },
  { id: "cr_appl_01", dim: "APPLICATION", text: "V problematických situacích automaticky hledám nekonvenční řešení, i když existuje standardní postup.", reverse: false },
  { id: "cr_appl_02", dim: "APPLICATION", text: "Před rozhodnutím si zvyknu vymyslet aspoň 2-3 alternativy, i když první řešení vypadá dobře.", reverse: false },
  { id: "cr_appl_03", dim: "APPLICATION", text: "Umím přeformulovat problém tak, že se otevřou úplně nové možnosti řešení.", reverse: false },
  { id: "cr_appl_04", dim: "APPLICATION", text: "V praxi raději volím ověřené a předvídatelné postupy, i když bych mohl/a zkusit něco nového.", reverse: true },
  { id: "cr_appl_05", dim: "APPLICATION", text: "Když narazím na překážku, beru ji spíš jako výzvu k nalezení kreativní cesty kolem.", reverse: false },
  { id: "cr_appl_06", dim: "APPLICATION", text: "Umím improvizovat a reagovat kreativně, i když věci nejdou podle plánu.", reverse: false },
  { id: "cr_appl_07", dim: "APPLICATION", text: "Když mě někdo poprosí o radu s problémem, obvykle nabídnu i nečekané perspektivy.", reverse: false },
  { id: "cr_appl_08", dim: "APPLICATION", text: "Kreativita je pro mě spíš abstraktní pojem — v každodenních situacích ji příliš nevyužívám.", reverse: true },
  { id: "cr_init_01", dim: "INITIATIVE", text: "Často si zkouším dělat věci po svém, i když existuje zavedený postup.", reverse: false },
  { id: "cr_init_02", dim: "INITIATIVE", text: "Rád/a experimentuji s novými aktivitami, i když si nejsem jistý/á výsledkem.", reverse: false },
  { id: "cr_init_03", dim: "INITIATIVE", text: "Když mě napadne nápad na projekt, většinou ho aspoň v nějaké podobě zkusím zrealizovat.", reverse: false },
  { id: "cr_init_04", dim: "INITIATIVE", text: "Většinou se spokojím s tím, jak věci jsou, a neměním je, pokud to není nutné.", reverse: true },
  { id: "cr_init_05", dim: "INITIATIVE", text: "Aktivně vyhledávám nové podněty — výstavy, kurzy, přednášky, setkání mimo svůj obor.", reverse: false },
  { id: "cr_init_06", dim: "INITIATIVE", text: "Mám tendenci zkoušet nové přístupy i v rutinních činnostech — jiná cesta, jiný postup, jiný nástroj.", reverse: false },
  { id: "cr_init_07", dim: "INITIATIVE", text: "Nemám potřebu vymýšlet vlastní projekty — stačí mi práce a povinnosti, které mám.", reverse: true },
  { id: "cr_init_08", dim: "INITIATIVE", text: "Raději se držím toho, co znám, než abych riskoval/a s něčím novým a nepředvídatelným.", reverse: true }
];

export const SLIDER_LABELS = [
  "Vůbec nesouhlasím",
  "Nesouhlasím",
  "Spíše nesouhlasím",
  "Neutrální",
  "Spíše souhlasím",
  "Souhlasím",
  "Zcela souhlasím"
];
