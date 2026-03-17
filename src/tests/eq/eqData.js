export const TEST_CONFIG = {
  id: "EQ",
  name: "Emoční inteligence",
  fullName: "Emoční inteligence (EQ) Assessment",
  version: "2.0",
  icon: "♡",
  accentColor: "#D4726A",
  accentColorLight: "#D4726A22",
  secondaryColor: "#E8A87C",
  estimatedMinutes: 15,
  testType: "EQ / Emoční inteligence (self-assessment, 40 škálových + 10 scénářů, škála 1–7)",
  scaleDescription: "Likertova 1–7 (Vůbec mě nevystihuje → Přesně mě vystihuje) + situační scénáře",
  scaleItemCount: 40,
  scenarioCount: 10,
  overallLabel: "EQ indikátor",
  description: "Test mapuje tvou emoční inteligenci v 5 oblastech — sebeuvědomění, seberegulace, motivace, empatie a sociální dovednosti. Kombinuje sebehodnocení s reakcemi na reálné situace.",
  tip: "Mix dvou typů otázek — u škálových odpovídej intuitivně, u scénářů vyber, co bys reálně udělal/a (ne co je ‚správně')."
};

export const DIMENSIONS = {
  SA: {
    name: "Sebeuvědomění",
    full: "Sebeuvědomění emocí",
    eng: "EmotionalSelfAwareness",
    color: "#D4726A",
    colorLight: "#D4726A22",
    icon: "◉",
    subfacets: ["Rozpoznání signálů", "Emoční slovník", "Vědomí spouštěčů"],
    lowLabel: "Na autopilota",
    highLabel: "Vědomý & reflektivní",
    lowDesc: "Emoce si uvědomuješ spíš zpětně. Vlastní reakce tě občas překvapí a těžko vysvětluješ, proč jsi zareagoval/a určitým způsobem. Pod stresem může narůst emoční zmatek.",
    midDesc: "V klidných situacích si emoce uvědomuješ dobře, ale pod tlakem ti mohou unikat signály. Máš prostor pro systematičtější reflexi.",
    highDesc: "Včas si všímáš svých emočních stavů, dokážeš je pojmenovat a rozumíš jejich spouštěčům. To ti dává náskok v regulaci — víš, s čím pracuješ, dřív než tě to ovládne."
  },
  SR: {
    name: "Seberegulace",
    full: "Seberegulace a zvládání stresu",
    eng: "SelfRegulation",
    color: "#6A8EAE",
    colorLight: "#6A8EAE22",
    icon: "◈",
    subfacets: ["Impulzní kontrola", "Tolerance stresu", "Emoční zotavení"],
    lowLabel: "Reaktivní & impulzivní",
    highLabel: "Stabilní & vyrovnaný",
    lowDesc: "Pod tlakem reaguješ impulzivně a emoce tě mohou ovládnout dřív, než stihneš zvážit důsledky. Zotavování po náročných situacích trvá déle.",
    midDesc: "V běžném stresu zvládáš regulaci solidně, ale extrémní tlak nebo kumulovaná zátěž tě dokáží vykolejit. Cílené strategie (dech, reframing) ti pomáhají.",
    highDesc: "Zachováváš klid i v náročných situacích. Nereaguješ zkratkovitě, umíš si dát pauzu a po emočním náporu se vracíš rychle do funkčního stavu."
  },
  EM: {
    name: "Emoční motivace",
    full: "Emoční motivace a odolnost",
    eng: "EmotionalDrive",
    color: "#E8A838",
    colorLight: "#E8A83822",
    icon: "✧",
    subfacets: ["Optimismus", "Vnitřní motivace", "Perseverance"],
    lowLabel: "Váhavý & skeptický",
    highLabel: "Odolný & poháněný smyslem",
    lowDesc: "Po neúspěchu se ti těžko hledá motivace pokračovat. Můžeš být náchylný k cynismu, rezignaci nebo pocitu, že to nemá cenu. Vnější odměny tě motivují víc než vnitřní smysl.",
    midDesc: "Vnitřní motivaci máš, ale v období kumulovaných překážek může kolísat. Optimismus udržuješ spíš situačně než jako stabilní nastavení.",
    highDesc: "Máš silný vnitřní motor — víš, proč děláš to, co děláš. Po neúspěchu se zvedáš rychle, udržuješ si optimistický nadhled a věříš, že věci mohou dopadnout dobře."
  },
  EP: {
    name: "Empatie",
    full: "Empatie a porozumění druhým",
    eng: "Empathy",
    color: "#7BAE8E",
    colorLight: "#7BAE8E22",
    icon: "♡",
    subfacets: ["Vnímání emocí druhých", "Perspektivní přebírání", "Zdravé hranice"],
    lowLabel: "Věcný & odtažitý",
    highLabel: "Empatický & vnímavý",
    lowDesc: "Signály druhých ti mohou unikat — ne ze zlé vůle, ale protože přirozeně nesoustředíš pozornost na emoční odstíny v komunikaci. Můžeš působit necitlivě, aniž bys to zamýšlel/a.",
    midDesc: "U blízkých lidí čteš emoce dobře, ale u méně známých nebo v rychlém tempu ti mohou signály uniknout. Perspektivní přebírání ti jde lépe v klidném prostředí.",
    highDesc: "Přirozeně vnímáš, co lidé kolem tebe prožívají, i když to neřeknou. Dokážeš se vžít do jejich perspektivy a přizpůsobit komunikaci. Důležité je, že si přitom udržuješ vlastní hranice."
  },
  SS: {
    name: "Sociální dovednosti",
    full: "Sociální dovednosti a vliv",
    eng: "SocialSkills",
    color: "#9B7EC8",
    colorLight: "#9B7EC822",
    icon: "◇",
    subfacets: ["Emoční komunikace", "Řešení konfliktů", "Vedení a inspirace"],
    lowLabel: "Rezervovaný & vyhýbavý",
    highLabel: "Vlivný & konstruktivní",
    lowDesc: "Emocionálně nabité rozhovory ti nejsou přirozené. Můžeš se vyhýbat konfliktům nebo naopak eskalovat, protože ti chybí repertoár strategií pro zvládání mezilidského napětí.",
    midDesc: "V některých typech rozhovorů (1:1, blízké vztahy) jsi efektivní, ale skupinová dynamika nebo konflikty s autoritou ti mohou dělat potíže.",
    highDesc: "Zvládáš náročné rozhovory — zůstáváš věcný a zároveň respektující. Umíš nadchnout lidi, řešit konflikty konstruktivně a mluvit o emocích způsobem, který druhé neodrazuje."
  }
};

export const SLIDER_LABELS = [
  "Vůbec mě nevystihuje",
  "Spíše ne",
  "Trochu ne",
  "Neutrální",
  "Trochu ano",
  "Spíše ano",
  "Přesně mě vystihuje"
];

export const SCALE_ITEMS = [
  // === SA — Sebeuvědomění emocí (8 otázek, 2 reverse) ===
  { id: "eq_sa_01", dim: "SA", sub: 0, text: "Když se mi změní nálada, rychle si uvědomím, co přesně cítím.", reverse: false },
  { id: "eq_sa_02", dim: "SA", sub: 0, text: "Všímám si tělesných signálů (napětí, zrychlený tep, sevřený žaludek), které provázejí mé emoce.", reverse: false },
  { id: "eq_sa_03", dim: "SA", sub: 1, text: "Dokážu přesně pojmenovat své emoce — ne jen ‚dobře' nebo ‚špatně', ale konkrétní odstíny.", reverse: false },
  { id: "eq_sa_04", dim: "SA", sub: 1, text: "Když se mě někdo zeptá, jak se cítím, většinou nevím, co odpovědět.", reverse: true },
  { id: "eq_sa_05", dim: "SA", sub: 2, text: "Vím, jaké situace a lidé ve mně typicky vyvolávají konkrétní emoce.", reverse: false },
  { id: "eq_sa_06", dim: "SA", sub: 2, text: "Často mě mé vlastní emoční reakce překvapí — nečekal/a jsem, že zareaguji tak silně.", reverse: true },
  { id: "eq_sa_07", dim: "SA", sub: 0, text: "Během dne si pravidelně všímám, v jakém jsem emočním stavu.", reverse: false },
  { id: "eq_sa_08", dim: "SA", sub: 1, text: "Umím rozlišit, jestli jsem naštvaný/á, zklamaný/á, frustrovaný/á nebo zraněný/á — i když se to na první pohled podobá.", reverse: false },

  // === SR — Seberegulace a zvládání stresu (8 otázek, 3 reverse) ===
  { id: "eq_sr_01", dim: "SR", sub: 0, text: "Když jsem rozrušený/á, dokážu se zastavit a nereagovat hned.", reverse: false },
  { id: "eq_sr_02", dim: "SR", sub: 0, text: "Říkám věci, kterých později lituji, protože jsem reagoval/a v afektu.", reverse: true },
  { id: "eq_sr_03", dim: "SR", sub: 1, text: "I pod velkým tlakem si většinou udržím nadhled a schopnost přemýšlet jasně.", reverse: false },
  { id: "eq_sr_04", dim: "SR", sub: 1, text: "Když se hromadí stresové situace, začínám dělat chyby a ztrácím přehled.", reverse: true },
  { id: "eq_sr_05", dim: "SR", sub: 2, text: "Po nepříjemném zážitku se dokážu relativně rychle vrátit do klidnějšího stavu.", reverse: false },
  { id: "eq_sr_06", dim: "SR", sub: 2, text: "Negativní emoce si ve mně drží místo hodiny nebo i dny po tom, co situace pominula.", reverse: true },
  { id: "eq_sr_07", dim: "SR", sub: 0, text: "Mám osvědčené strategie (dýchání, pauza, procházka), jak se zklidnit, když cítím, že mě emoce přemáhají.", reverse: false },
  { id: "eq_sr_08", dim: "SR", sub: 1, text: "Frustrace a překážky mě dokážou paralyzovat — místo akce zamrznu.", reverse: true },

  // === EM — Emoční motivace a odolnost (8 otázek, 2 reverse) ===
  { id: "eq_em_01", dim: "EM", sub: 0, text: "I po sérii neúspěchů si dokážu udržet víru, že to nakonec zvládnu.", reverse: false },
  { id: "eq_em_02", dim: "EM", sub: 0, text: "Když se věci nedaří, automaticky očekávám, že bude ještě hůř.", reverse: true },
  { id: "eq_em_03", dim: "EM", sub: 1, text: "To, co dělám, mi dává hluboký osobní smysl — nejde jen o peníze nebo uznání.", reverse: false },
  { id: "eq_em_04", dim: "EM", sub: 1, text: "Často nevím, proč vlastně dělám to, co dělám — chybí mi vnitřní kompas.", reverse: true },
  { id: "eq_em_05", dim: "EM", sub: 2, text: "Když narazím na překážku, hledám jiné cesty místo toho, abych to vzdal/a.", reverse: false },
  { id: "eq_em_06", dim: "EM", sub: 2, text: "Jeden větší neúspěch mě dokáže odradit od celého projektu.", reverse: true },
  { id: "eq_em_07", dim: "EM", sub: 0, text: "Obecně věřím, že lidé a situace mají potenciál se zlepšovat.", reverse: false },
  { id: "eq_em_08", dim: "EM", sub: 1, text: "Moje nejlepší výkony přicházejí, když mě téma osobně zajímá, ne když je vysoký vnější tlak.", reverse: false },

  // === EP — Empatie a porozumění druhým (8 otázek, 2 reverse) ===
  { id: "eq_ep_01", dim: "EP", sub: 0, text: "Snadno poznám, kdy se někdo v mém okolí necítí dobře, i když to neřekne přímo.", reverse: false },
  { id: "eq_ep_02", dim: "EP", sub: 0, text: "Často mě překvapí, když zjistím, že někdo blízký prožíval těžké období — vůbec jsem si nevšiml/a.", reverse: true },
  { id: "eq_ep_03", dim: "EP", sub: 1, text: "V konfliktu dokážu popsat situaci i z pohledu druhé strany.", reverse: false },
  { id: "eq_ep_04", dim: "EP", sub: 1, text: "Těžko chápu, proč lidé reagují emocionálně na věci, které mi přijdou logické.", reverse: true },
  { id: "eq_ep_05", dim: "EP", sub: 2, text: "Dokážu být empatický/á, aniž bych přebíral/a emoce druhých jako vlastní.", reverse: false },
  { id: "eq_ep_06", dim: "EP", sub: 2, text: "Emoce lidí kolem mě mě vysávají — po kontaktu s rozrušeným člověkem se sám/sama cítím vyčerpaně.", reverse: true },
  { id: "eq_ep_07", dim: "EP", sub: 0, text: "Vnímám změny v tónu hlasu nebo řeči těla, které ostatním unikají.", reverse: false },
  { id: "eq_ep_08", dim: "EP", sub: 1, text: "Než někoho posoudím, snažím se představit, čím si právě prochází.", reverse: false },

  // === SS — Sociální dovednosti a vliv (8 otázek, 2 reverse) ===
  { id: "eq_ss_01", dim: "SS", sub: 0, text: "Dokážu otevřeně mluvit o svých emocích způsobem, který druhé neodrazuje.", reverse: false },
  { id: "eq_ss_02", dim: "SS", sub: 0, text: "Raději předstírám, že je vše v pořádku, než abych řekl/a, co doopravdy cítím.", reverse: true },
  { id: "eq_ss_03", dim: "SS", sub: 1, text: "V napjatých situacích dokážu uklidnit atmosféru a nasměrovat rozhovor konstruktivně.", reverse: false },
  { id: "eq_ss_04", dim: "SS", sub: 1, text: "Konfrontacím se vyhýbám, i když vím, že by rozhovor mohl situaci zlepšit.", reverse: true },
  { id: "eq_ss_05", dim: "SS", sub: 2, text: "Lidé říkají, že je dokážu nadchnout a motivovat.", reverse: false },
  { id: "eq_ss_06", dim: "SS", sub: 2, text: "Těžko přesvědčuji ostatní o věcech, které mi přijdou důležité.", reverse: true },
  { id: "eq_ss_07", dim: "SS", sub: 0, text: "Dokážu vyjádřit nespokojenost tak, aby druhý slyšel podstatu a necítil útok.", reverse: false },
  { id: "eq_ss_08", dim: "SS", sub: 1, text: "Když vidím dva lidi v konfliktu, přirozeně hledám řešení, které vyhovuje oběma.", reverse: false }
];

export const SCENARIOS = [
  // === SA scénáře (2) ===
  {
    id: "eq_sc_sa_01",
    text: "Po celodenním meetingu cítíš podráždění, ale nevíš přesně proč. Kolega se tě ptá, jestli je všechno OK.",
    options: [
      { text: "Řeknu ‚jasně, v pohodě' a jdu dál pracovat.", scores: { SA: 0, SR: 1, EM: 0, EP: 0, SS: 0 } },
      { text: "Zastavím se, zkusím pojmenovat, co vlastně cítím, a odpovím upřímně — třeba ‚asi mě frustruje, že jsme nic nevyřešili'.", scores: { SA: 3, SR: 1, EM: 0, EP: 0, SS: 2 } },
      { text: "Řeknu, že jsem unavený/á z meetingů, a rychle změním téma.", scores: { SA: 1, SR: 0, EM: 0, EP: 0, SS: 1 } },
      { text: "Všimnu si, že jsem podrážděný/á, ale radši si to zpracuji sám/sama než to rozebírám s kolegou.", scores: { SA: 2, SR: 2, EM: 0, EP: 0, SS: 0 } }
    ]
  },
  {
    id: "eq_sc_sa_02",
    text: "Během prezentace si všimneš, že máš sevřený žaludek a zrychlený tep. Prezentace přitom objektivně jde dobře — dostáváš pozitivní reakce.",
    options: [
      { text: "Ignoruji tělesné signály — jde to dobře, tak to asi nic neznamená.", scores: { SA: 0, SR: 0, EM: 1, EP: 0, SS: 0 } },
      { text: "Uvědomím si, že pravděpodobně cítím úzkost z hodnocení — i když reakce jsou pozitivní, stres z expozice zůstává.", scores: { SA: 3, SR: 1, EM: 0, EP: 0, SS: 0 } },
      { text: "Řeknu si, že jsem nervózní, a snažím se to potlačit, abych mohl/a pokračovat.", scores: { SA: 1, SR: 2, EM: 1, EP: 0, SS: 0 } },
      { text: "Zastavím se na moment, nadechnu se a přijmu, že nervozita je normální součást prezentování.", scores: { SA: 2, SR: 3, EM: 1, EP: 0, SS: 0 } }
    ]
  },

  // === SR scénáře (2) ===
  {
    id: "eq_sc_sr_01",
    text: "Na poradě někdo veřejně zpochybní tvůj návrh způsobem, který ti přijde neférový. Cítíš, jak ti stoupá hněv.",
    options: [
      { text: "Okamžitě reaguji a vysvětlím, proč se mýlí — nechci, aby jeho verze zůstala viset ve vzduchu.", scores: { SA: 1, SR: 0, EM: 1, EP: 0, SS: 1 } },
      { text: "Zhluboka se nadechnu, počkám pár sekund a pak klidně požádám o konkrétní námitky.", scores: { SA: 1, SR: 3, EM: 0, EP: 1, SS: 2 } },
      { text: "Neřeknu nic na poradě, ale po ní zajdu za dotyčným a řeknu mu, jak to na mě působilo.", scores: { SA: 1, SR: 2, EM: 0, EP: 1, SS: 1 } },
      { text: "Spolknu to a řeším to sám/sama — nemá smysl se hádat na poradě.", scores: { SA: 0, SR: 1, EM: 0, EP: 0, SS: 0 } }
    ]
  },
  {
    id: "eq_sc_sr_02",
    text: "Máš za sebou extrémně náročný týden — několik deadlinů najednou, neshody v týmu, osobní starosti. Je pátek večer.",
    options: [
      { text: "Sednu si, vědomě si pojmenuji, co všechno mi leze na nervy, a naplánuji si víkend tak, abych si odpočinul/a.", scores: { SA: 2, SR: 3, EM: 1, EP: 0, SS: 0 } },
      { text: "Jdu si zaběhat / cvičit — fyzická aktivita mi pomáhá zbavit se nahromaděného napětí.", scores: { SA: 0, SR: 2, EM: 1, EP: 0, SS: 0 } },
      { text: "Pustím Netflix a snažím se na všechno zapomenout.", scores: { SA: 0, SR: 1, EM: 0, EP: 0, SS: 0 } },
      { text: "Zavolám kamarádovi a vyventiluji, co mě trápí.", scores: { SA: 1, SR: 1, EM: 0, EP: 0, SS: 2 } }
    ]
  },

  // === EM scénáře (2) ===
  {
    id: "eq_sc_em_01",
    text: "Tvůj projekt, na kterém jsi pracoval/a 3 měsíce, byl zamítnut vedením. Důvody ti přijdou částečně nefér.",
    options: [
      { text: "Jasně, tak to vzdám. Nemá smysl investovat energii do věcí, které stejně někdo sestřelí.", scores: { SA: 0, SR: 1, EM: 0, EP: 0, SS: 0 } },
      { text: "Bolí to, ale zkusím pochopit jejich perspektivu a zjistit, jestli existuje cesta, jak projekt upravit a předložit znovu.", scores: { SA: 1, SR: 1, EM: 3, EP: 2, SS: 1 } },
      { text: "Naštve mě to, ale řeknu si, že moje práce měla hodnotu bez ohledu na jejich rozhodnutí.", scores: { SA: 1, SR: 2, EM: 2, EP: 0, SS: 0 } },
      { text: "Hned začnu pracovat na novém projektu — potřebuji se rychle zaměstnat něčím jiným.", scores: { SA: 0, SR: 1, EM: 1, EP: 0, SS: 0 } }
    ]
  },
  {
    id: "eq_sc_em_02",
    text: "Uvízl/a jsi v práci, která tě nebaví, ale platí dobře. Kamarád ti říká o zajímavé příležitosti, která ale znamená finanční nejistotu.",
    options: [
      { text: "Zůstanu — peníze a jistota jsou důležitější než nadšení.", scores: { SA: 0, SR: 1, EM: 0, EP: 0, SS: 0 } },
      { text: "Prozkoumám tu příležitost detailně — když mě to oslovuje, stojí za to alespoň zvážit riziko.", scores: { SA: 1, SR: 0, EM: 3, EP: 0, SS: 0 } },
      { text: "Přemýšlím, co vlastně chci — možná je čas vrátit se k tomu, co mi dává smysl.", scores: { SA: 2, SR: 0, EM: 2, EP: 0, SS: 0 } },
      { text: "Zeptám se lidí kolem sebe, co by udělali na mém místě.", scores: { SA: 0, SR: 0, EM: 0, EP: 1, SS: 1 } }
    ]
  },

  // === EP scénáře (2) ===
  {
    id: "eq_sc_ep_01",
    text: "Kolega v týmu je poslední dobou uzavřený a podává slabší výkon. Na přímý dotaz řekne, že je ‚v pohodě'.",
    options: [
      { text: "Beru to za slovo — řekl, že je v pohodě, tak asi je.", scores: { SA: 0, SR: 1, EM: 0, EP: 0, SS: 0 } },
      { text: "Nenutím ho mluvit, ale dám najevo, že jsem k dispozici — třeba pozvu na kafe a nechám prostor, aby se otevřel.", scores: { SA: 0, SR: 1, EM: 0, EP: 3, SS: 2 } },
      { text: "Řeknu mu přímo: ‚Vidím, že něco není OK. Nemusíš mi říkat co, ale chci, abys věděl, že to vidím.'", scores: { SA: 0, SR: 0, EM: 0, EP: 2, SS: 3 } },
      { text: "Řeším to s jeho nadřízeným — výkon klesá a potřebujeme to adresovat.", scores: { SA: 0, SR: 1, EM: 0, EP: 0, SS: 1 } }
    ]
  },
  {
    id: "eq_sc_ep_02",
    text: "Přítelkyně/partner ti sdílí frustraci z práce. Ty vidíš, kde udělal/a chybu, a víš, jak ji opravit.",
    options: [
      { text: "Hned nabídnu řešení — vždyť to je jasné, a čím dřív to opraví, tím líp.", scores: { SA: 0, SR: 0, EM: 0, EP: 0, SS: 1 } },
      { text: "Nejdřív poslouchám a validuji, že to musí být frustrující. Řešení nabídnu, jen pokud o něj stojí.", scores: { SA: 1, SR: 1, EM: 0, EP: 3, SS: 2 } },
      { text: "Říkám ‚to bude dobrý' a snažím se ho/ji rozveselit.", scores: { SA: 0, SR: 0, EM: 1, EP: 1, SS: 0 } },
      { text: "Sdílím vlastní podobnou zkušenost, aby věděl/a, že v tom není sám/sama.", scores: { SA: 0, SR: 0, EM: 0, EP: 2, SS: 1 } }
    ]
  },

  // === SS scénáře (2) ===
  {
    id: "eq_sc_ss_01",
    text: "Dva členové tvého týmu mají otevřený spor, který blokuje projekt. Oba přišli za tebou — každý s jinou verzí příběhu.",
    options: [
      { text: "Svolám společný meeting, kde oba shrnou svou perspektivu. Moderuji diskusi k řešení, ne k obviňování.", scores: { SA: 0, SR: 1, EM: 0, EP: 2, SS: 3 } },
      { text: "Rozhodnu sám/sama, co je nejlepší pro projekt — nemám čas řešit mezilidské spory.", scores: { SA: 0, SR: 1, EM: 1, EP: 0, SS: 0 } },
      { text: "Promluvím s každým zvlášť, pokusím se pochopit obě strany a najít kompromis, který představím oběma.", scores: { SA: 0, SR: 0, EM: 0, EP: 3, SS: 2 } },
      { text: "Řeknu jim, ať si to vyřeší mezi sebou — jsou dospělí.", scores: { SA: 0, SR: 0, EM: 1, EP: 0, SS: 0 } }
    ]
  },
  {
    id: "eq_sc_ss_02",
    text: "Musíš dát negativní zpětnou vazbu kolegovi, se kterým máš dobrý vztah. Víš, že to bude bolet.",
    options: [
      { text: "Odkládám to, dokud to nejde — nebo doufám, že si to uvědomí sám/sama.", scores: { SA: 0, SR: 0, EM: 0, EP: 1, SS: 0 } },
      { text: "Řeknu to přímo a bez okolků — čím rychleji, tím lépe.", scores: { SA: 0, SR: 1, EM: 1, EP: 0, SS: 1 } },
      { text: "Připravím si rozhovor: začnu tím, co funguje, pak konkrétní téma ke zlepšení, a zakončím podporou.", scores: { SA: 1, SR: 1, EM: 0, EP: 2, SS: 3 } },
      { text: "Naznačím to lehce a doufám, že pochopí — nechci poškodit náš vztah.", scores: { SA: 0, SR: 0, EM: 0, EP: 2, SS: 1 } }
    ]
  }
];

export const DEVELOPMENT_TIPS = {
  SA: [
    "Zkus ‚emoční check-in' 3× denně — zastav se a pojmenuj, co právě cítíš (ne jen dobře/špatně).",
    "Veď týdenní emoční deník: situace → emoce → tělesný signál → reakce. Po měsíci hledej vzorce."
  ],
  SR: [
    "Při příštím silném impulzu zkus pravidlo 90 sekund — počkej, než automatická emoční vlna opadne, než zareaguješ.",
    "Najdi svou ‚emergency regulační strategii' (box breathing, procházka, studená voda) a nacvič ji v klidném stavu."
  ],
  EM: [
    "Napiš si 3 důvody, proč děláš to, co děláš — a přečti si je vždy, když přijde pochybnost.",
    "Po každém neúspěchu si zapiš: co jsem se naučil/a a co udělám jinak. Reframing z ‚prohry' na ‚data'."
  ],
  EP: [
    "V příštím rozhovoru zkus techniku ‚reflektivního poslechu' — zopakuj vlastními slovy, co druhý říká, než odpovíš.",
    "Před rychlým soudem si polož otázku: ‚Co by muselo být pravda, aby jejich reakce dávala smysl?'"
  ],
  SS: [
    "Příště, když budeš mít negativní feedback, zkus ‚sendvič naruby' — začni tím, co chceš říct, pak proč, pak jak můžeš pomoct.",
    "Vyber si jeden ‚obtížný rozhovor', který odkládáš, a naplánuj ho na tento týden. Připrav si první větu."
  ]
};
