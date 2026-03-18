export const TEST_CONFIG = {
  id: 'COGNITIVE',
  name: 'Kognitivní styl',
  fullName: 'Kognitivní styl — Jak přemýšlíte a rozhodujete se',
  version: '2.0',
  icon: '🧠',
  accentColor: '#3D405B',
  accentColorLight: '#3D405B22',
  secondaryColor: '#81B29A',
  estimatedMinutes: 12,
  questionCount: 40,
  scaleItemCount: 32,
  scenarioCount: 8,
  dimensionCount: 4,
  reportFilePrefix: 'cognitive',
  scaleDescription: 'Likert 1–7 + situační scénáře (gradované)',
  testType: 'Kognitivní styl a rozhodování',
  description:
    'Zjistěte, jakým způsobem přemýšlíte a rozhodujete se, když máte volnost. Test neměří inteligenci — měří váš preferovaný styl zpracování informací, pozornosti, práce se strukturou a tempa rozhodování.',
  tip: 'Žádný styl není lepší ani horší — každý se hodí pro jiné situace. Odpovídejte podle toho, jak se VĚTŠINOU chováte, ne jak byste se chtěli chovat. Střední pozice na škále neznamená „nevím", ale „kombinuji oba přístupy".',
};

export const SLIDER_LABELS = [
  'Vůbec ne',
  'Spíše ne',
  'Trochu ne',
  'Neutrální',
  'Trochu ano',
  'Spíše ano',
  'Rozhodně ano',
];

export const DIMENSIONS = {
  PROCESSING: {
    name: 'Zpracování',
    full: 'Způsob zpracování informací',
    eng: 'Processing',
    color: '#3D405B',
    colorLight: '#3D405B22',
    icon: '⚙️',
    poleA: {
      name: 'Analytický',
      label: 'Analytický',
      desc: 'Postupujete systematicky — sbíráte fakta, rozebíráte problém na části, hledáte logické souvislosti. Než se rozhodnete, chcete mít co nejvíc dat a jasnou strukturu argumentů.',
      strengths:
        'Důkladnost, objektivita, obhajitelná rozhodnutí, menší vliv emocí na závěry.',
      risks:
        'Analysis paralysis — příliš dlouhé rozhodování, potíže v situacích s neúplnými daty, přehlížení „měkkých" signálů.',
      roles: 'Datová analýza, risk management, controlling, technické kalkulace, plánování, výzkum.',
    },
    poleB: {
      name: 'Intuitivní',
      label: 'Intuitivní',
      desc: 'Spoléháte na zkušenost a vnitřní pocit — rychle zachytíte podstatu situace, i když ji nedokážete vždy logicky zdůvodnit. Rozhodujete se podle celkového dojmu a „gut feeling".',
      strengths:
        'Rychlost, schopnost zachytit neverbální signály, fungování v nejistotě, kreativní vhledy.',
      risks:
        'Náchylnost k biasům, obtížná obhajitelnost rozhodnutí, riziko nedomyšlení důsledků.',
      roles: 'Leadership v nejistotě, strategie, inovace, krizový management, kreativní role.',
    },
    balancedDesc:
      'Flexibilně kombinujete analytický i intuitivní přístup podle situace. U důležitých rozhodnutí si seberete data, ale neváháte se opřít i o zkušenost a pocit, když je třeba jednat rychle.',
  },

  SCOPE: {
    name: 'Záběr',
    full: 'Rozsah pozornosti',
    eng: 'Scope',
    color: '#81B29A',
    colorLight: '#81B29A22',
    icon: '🔍',
    poleA: {
      name: 'Detail',
      label: 'Detailní',
      desc: 'Přirozeně si všímáte konkrétností, nesrovnalostí a detailů, které ostatní přehlédnou. Nejdříve řešíte jednotlivé kroky a fakta, teprve pak skládáte celek.',
      strengths: 'Přesnost, spolehlivost, odhalování chyb, kvalita výstupů.',
      risks:
        'Ztráta přehledu o prioritách, zahlcení, mikromanagement, přehlédnutí strategického kontextu.',
      roles: 'QA/QC, kontrola rozpočtů, technické výkresy, smlouvy, provozní řízení, audit.',
    },
    poleB: {
      name: 'Celkový obraz',
      label: 'Big picture',
      desc: 'Přirozeně vidíte širší souvislosti, vzorce a dlouhodobé dopady. Nejdříve chcete pochopit celý kontext a strategii, detaily řešíte až potom.',
      strengths: 'Strategické myšlení, propojování oblastí, prioritizace, dlouhodobá vize.',
      risks:
        'Podcenění implementačních detailů, velké myšlenky bez dotažení, přehlédnutí praktických překážek.',
      roles: 'Strategie, business development, architektura řešení, produktový management, leadership.',
    },
    balancedDesc:
      'Dokážete přepínat mezi detailem a celkovým obrazem podle potřeby. U nových témat začínáte přehledem, u realizace se nořte do detailů — obojí vám jde přirozeně.',
  },

  APPROACH: {
    name: 'Přístup',
    full: 'Vztah ke struktuře',
    eng: 'Approach',
    color: '#E07A5F',
    colorLight: '#E07A5F22',
    icon: '📐',
    poleA: {
      name: 'Strukturovaný',
      label: 'Strukturovaný',
      desc: 'Preferujete jasný plán, pravidla a předvídatelný průběh. Nejistota a chaos vás stresují — potřebujete vědět, co se bude dít a v jakém pořadí.',
      strengths:
        'Spolehlivé plánování, dodržování procesů, konzistentní výstupy, předvídatelnost.',
      risks:
        'Rigidita, potíže v chaosu a při rychlých změnách, stres při nejistotě, odpor k improvizaci.',
      roles: 'Projektové řízení, compliance, procesní role, standardizace, provoz, plánování výroby.',
    },
    poleB: {
      name: 'Flexibilní',
      label: 'Flexibilní',
      desc: 'Vyhovuje vám volnější rámec a umíte pracovat s neúplnými informacemi. Změny a nejistota vás nestresují — vnímáte je jako přirozenou součást práce.',
      strengths: 'Adaptabilita, improvizace, fungování v chaosu, rychlé přizpůsobení novým podmínkám.',
      risks:
        'Nedodržování postupů, chybějící standardizace, tendence „vymýšlet pokaždé jinak", obtíže s rutinou.',
      roles: 'Inovační projekty, startup, krizové týmy, agile, práce v nejistých podmínkách.',
    },
    balancedDesc:
      'Umíte pracovat jak s jasnou strukturou, tak v méně definovaném prostředí. Strukturu si vytvoříte, když je potřeba, ale nesvírá vás, když podmínky vyžadují flexibilitu.',
  },

  DECISION_SPEED: {
    name: 'Tempo',
    full: 'Tempo rozhodování',
    eng: 'DecisionSpeed',
    color: '#8E7DBE',
    colorLight: '#8E7DBE22',
    icon: '⏱️',
    poleA: {
      name: 'Rozvážný',
      label: 'Rozvážný',
      desc: 'Před rozhodnutím si raději necháte čas na promyšlení. Kvalita rozhodnutí je pro vás důležitější než rychlost — i pod tlakem se snažíte nezkracovat proces.',
      strengths:
        'Promyšlená rozhodnutí, méně chyb, důvěryhodnost u stakeholderů vyžadujících zdůvodnění.',
      risks: 'Propásnuté příležitosti, frustrace okolí, pomalost v operativních situacích.',
      roles: 'Strategická rozhodnutí, investice, právní kroky, bezpečnostní analýza, dlouhodobé plánování.',
    },
    poleB: {
      name: 'Rychlý',
      label: 'Rozhodný',
      desc: 'Rozhodujete se svižně na základě dostupných informací. Raději se rozhodnete „dost dobře a hned" než „perfektně a pozdě" — a případně rozhodnutí později upravíte.',
      strengths: 'Agilita, schopnost jednat pod tlakem, využívání příležitostí, momentum.',
      risks: 'Vyšší chybovost u komplexních rozhodnutí, podkopání důvěry při častých korekcích.',
      roles: 'Operativní řízení, obchod, terénní práce, krizové situace, startup prostředí.',
    },
    balancedDesc:
      'Tempo rozhodování přizpůsobujete situaci — u důležitých věcí si dáte čas, v operativě jednáte rychle. Nemáte výraznou tendenci k žádnému extrému.',
  },
};

export const SCALE_ITEMS = [
  // =============================================
  // PROCESSING: Analytický (A) ↔ Intuitivní (B)
  // =============================================
  { id: 'cog_proc_01', dim: 'PROCESSING', text: 'Když se rozhoduji, potřebuji mít co nejvíc konkrétních faktů a dat, než udělám závěr.', reverse: true },
  { id: 'cog_proc_02', dim: 'PROCESSING', text: 'Složité situace si raději rozkresluji nebo rozpisuji, abych si v nich udělal/a pořádek.', reverse: true },
  { id: 'cog_proc_03', dim: 'PROCESSING', text: 'Dávám přednost tomu, když mohu krok za krokem logicky vysvětlit, jak jsem dospěl/a ke svému rozhodnutí.', reverse: true },
  { id: 'cog_proc_04', dim: 'PROCESSING', text: 'Než něco odsouhlasím, chci vidět podrobnou analýzu všech variant a jejich důsledků.', reverse: true },
  { id: 'cog_proc_05', dim: 'PROCESSING', text: 'Při důležitých rozhodnutích hodně dávám na svůj vnitřní pocit, i když nemám všechno dokonale spočítané.', reverse: false },
  { id: 'cog_proc_06', dim: 'PROCESSING', text: 'Často vím poměrně rychle, co je správná volba, i když jen těžko vysvětluji proč.', reverse: false },
  { id: 'cog_proc_07', dim: 'PROCESSING', text: 'V běžném životě se spíš řídím zkušeností a celkovým dojmem než detailní analýzou všech možností.', reverse: false },
  { id: 'cog_proc_08', dim: 'PROCESSING', text: 'Důvěřuji své intuici — i v profesních rozhodnutích se často rozhodnu podle pocitu a obvykle to vyjde.', reverse: false },

  // =============================================
  // SCOPE: Detail (A) ↔ Big Picture (B)
  // =============================================
  { id: 'cog_scope_01', dim: 'SCOPE', text: 'Když pracuji na úkolu, všímám si malých nesrovnalostí a detailů, které ostatní často přehlédnou.', reverse: true },
  { id: 'cog_scope_02', dim: 'SCOPE', text: 'Raději si nejdřív vyjasním konkrétní kroky a detaily, než začnu přemýšlet o celkovém kontextu.', reverse: true },
  { id: 'cog_scope_03', dim: 'SCOPE', text: 'Kvalita mé práce stojí na pečlivosti — kontroluji, ověřuji a řeším i zdánlivě drobné věci.', reverse: true },
  { id: 'cog_scope_04', dim: 'SCOPE', text: 'Při čtení dokumentu si hned všimnu překlepů, chybějících dat nebo nekonzistentních čísel.', reverse: true },
  { id: 'cog_scope_05', dim: 'SCOPE', text: 'Při práci mě víc zajímá, jak jednotlivé kroky zapadají do širšího kontextu, než konkrétní detaily.', reverse: false },
  { id: 'cog_scope_06', dim: 'SCOPE', text: 'Mám tendenci rychle vidět širší souvislosti a dlouhodobé dopady, i když někdy přehlédnu drobnosti.', reverse: false },
  { id: 'cog_scope_07', dim: 'SCOPE', text: 'Když řeším problém, nejdřív chci pochopit celkový rámec — detaily si doplním později.', reverse: false },
  { id: 'cog_scope_08', dim: 'SCOPE', text: 'Přirozeně propojuji informace z různých oblastí a hledám v nich vzorce a trendy.', reverse: false },

  // =============================================
  // APPROACH: Strukturovaný (A) ↔ Flexibilní (B)
  // =============================================
  { id: 'cog_appr_01', dim: 'APPROACH', text: 'Cítím se jistěji, když mám pro svou práci jasný plán, strukturu a pravidla.', reverse: true },
  { id: 'cog_appr_02', dim: 'APPROACH', text: 'Nerad/a vstupuji do situací, kde není dopředu jasné, jak budou věci probíhat.', reverse: true },
  { id: 'cog_appr_03', dim: 'APPROACH', text: 'V práci mě uklidňuje, když je vše zorganizované, přehledné a na svém místě.', reverse: true },
  { id: 'cog_appr_04', dim: 'APPROACH', text: 'Nejednoznačné zadání mě frustruje — potřebuji vědět, co přesně se ode mě čeká.', reverse: true },
  { id: 'cog_appr_05', dim: 'APPROACH', text: 'Dokážu se dobře přizpůsobit, když se plány změní na poslední chvíli, a nevadí mi pracovat v určitém chaosu.', reverse: false },
  { id: 'cog_appr_06', dim: 'APPROACH', text: 'Spíš než pevná pravidla mi vyhovuje volnější rámec, ve kterém si přizpůsobím postup podle situace.', reverse: false },
  { id: 'cog_appr_07', dim: 'APPROACH', text: 'Nejistota a neúplné informace mě nestresují — beru je jako přirozenou součást práce.', reverse: false },
  { id: 'cog_appr_08', dim: 'APPROACH', text: 'Rád/a improvizuji a hledám nová řešení za pochodu, místo abych se držel/a předem daného plánu.', reverse: false },

  // =============================================
  // DECISION_SPEED: Rozvážný (A) ↔ Rychlý (B)
  // =============================================
  { id: 'cog_speed_01', dim: 'DECISION_SPEED', text: 'Před důležitým rozhodnutím si raději nechám čas na promyšlení, i když to zpomalí postup.', reverse: true },
  { id: 'cog_speed_02', dim: 'DECISION_SPEED', text: 'I pod časovým tlakem se snažím nezkracovat rozhodovací proces víc, než je nutné.', reverse: true },
  { id: 'cog_speed_03', dim: 'DECISION_SPEED', text: 'Nerad/a se rozhoduji ve spěchu — kvalitní rozhodnutí potřebuje čas.', reverse: true },
  { id: 'cog_speed_04', dim: 'DECISION_SPEED', text: 'Než se definitivně rozhodnu, rád/a si věci „přespím" a vrátím se k nim s čerstvým pohledem.', reverse: true },
  { id: 'cog_speed_05', dim: 'DECISION_SPEED', text: 'Raději se rozhodnu rychle na základě dostupných informací a případně rozhodnutí později upravím.', reverse: false },
  { id: 'cog_speed_06', dim: 'DECISION_SPEED', text: 'Většinou se rozhoduji svižně — příliš dlouhé zvažování mě spíš brzdí, než aby zlepšilo výsledek.', reverse: false },
  { id: 'cog_speed_07', dim: 'DECISION_SPEED', text: 'V práci preferuji „rozhodnout a opravit" před „dlouho analyzovat a pak teprve jednat".', reverse: false },
  { id: 'cog_speed_08', dim: 'DECISION_SPEED', text: 'Když mám na stole rozhodnutí, chci ho vyřešit co nejdřív — odkládání mě frustruje.', reverse: false },
];

export const SCENARIOS = [
  // PROCESSING
  {
    id: 'cog_sc_proc_01',
    dim: 'PROCESSING',
    text: 'Máte investovat čas týmu do nové interní aplikace. Termín není těsný, ale zdroje jsou omezené. Jak se rozhodnete?',
    options: [
      {
        text: 'Vyžádám si maximum dat — odhad přínosů, rizik, nákladů — připravím tabulku variant a rozhodnu se až na jejich základě.',
        score: 0,
      },
      {
        text: 'Udělám rámcovou analýzu hlavních variant, ale finální rozhodnutí ovlivní i můj celkový dojem z diskuse s týmem.',
        score: 0.33,
      },
      {
        text: 'Mám už poměrně silný pocit, která varianta je nejlepší, ale pro jistotu si ověřím pár klíčových čísel.',
        score: 0.67,
      },
      {
        text: 'Důvěřuji svému odhadu — rozhodnu se relativně rychle podle celkového pocitu, abychom zbytečně neztráceli čas analýzou.',
        score: 1.0,
      },
    ],
  },
  {
    id: 'cog_sc_proc_02',
    dim: 'PROCESSING',
    text: 'Vybíráte nového dodavatele služeb. Máte tři nabídky, které se liší cenou, kvalitou i vztahem. Jak postupujete?',
    options: [
      { text: 'Nastavím jasná kritéria a váhy, systematicky porovnám nabídky v tabulce a rozhodnu podle výsledku.', score: 0 },
      { text: 'Porovnám hlavní parametry, ale přihlédnu i k tomu, jaký mám z dodavatelů celkový dojem.', score: 0.33 },
      { text: 'Podívám se na čísla, ale primárně se rozhoduji podle toho, jak mi „sedí" lidé z dodavatelské firmy.', score: 0.67 },
      { text: 'Rozhoduji se hlavně podle dojmu z jednání a důvěry k lidem — čísla si ověřím jen rámcově.', score: 1.0 },
    ],
  },

  // SCOPE
  {
    id: 'cog_sc_scope_01',
    dim: 'SCOPE',
    text: 'Navrhujete nový interní proces schvalování zakázek. Kde začínáte?',
    options: [
      {
        text: 'Soustředím se na konkrétní kroky, formuláře a detaily, aby proces fungoval v praxi — strategický kontext řeším až potom.',
        score: 0,
      },
      {
        text: 'Začnu u praktických kroků, ale průběžně kontroluji, jestli to odpovídá celkovému směřování firmy.',
        score: 0.33,
      },
      { text: 'Nejdřív načrtnu celkový rámec — jak to zapadá do strategie a spolupráce oddělení — a pak detaily.', score: 0.67 },
      { text: 'Hlavně mě zajímá dopad na celkový chod firmy a dlouhodobé cíle — detaily implementace deleguju nebo řeším až nakonec.', score: 1.0 },
    ],
  },
  {
    id: 'cog_sc_scope_02',
    dim: 'SCOPE',
    text: 'Dostanete na stůl 30stránkovou analýzu projektu. Jak ji čtete?',
    options: [
      { text: 'Čtu pozorně od začátku do konce — všímám si detailů, čísel a případných nesrovnalostí.', score: 0 },
      { text: 'Projdu celý dokument, ale detailně se zastavím jen u sekcí, kde cítím riziko.', score: 0.33 },
      { text: 'Přečtu shrnutí a klíčové závěry — do detailů se nořím, jen pokud mě něco zarazí.', score: 0.67 },
      { text: 'Hledám hlavní poselství a strategický kontext — detaily nechám na specialistech.', score: 1.0 },
    ],
  },

  // APPROACH
  {
    id: 'cog_sc_appr_01',
    dim: 'APPROACH',
    text: 'Dostáváte nový typ projektu, s jakým firma zatím málo zkušeností. Jak začnete?',
    options: [
      { text: 'Nejdřív nastavím jasný proces, role, milníky a pravidla — i kdybychom je později museli upravit.', score: 0 },
      { text: 'Připravím základní rámec a plán, ale počítám s tím, že ho budeme průběžně měnit.', score: 0.33 },
      { text: 'Začnu pracovat s tím, co vím, a postupně si cestu a pravidla ladím podle toho, co se ukáže.', score: 0.67 },
      { text: 'Rovnou se pustím do práce — strukturu a procesy vytvářím za pochodu, jak získávám zkušenosti.', score: 1.0 },
    ],
  },
  {
    id: 'cog_sc_appr_02',
    dim: 'APPROACH',
    text: 'Uprostřed projektu se zásadně změní zadání od klienta. Jak reagujete?',
    options: [
      { text: 'Zastavím práci, aktualizuji plán, přerozdělím úkoly a až pak pokračujeme — potřebuji mít jasno.', score: 0 },
      { text: 'Rychle upravím hlavní milníky, ale nebudu předělávat celý plán — přizpůsobím se průběžně.', score: 0.33 },
      { text: 'Změnu beru jako příležitost — rychle se přeorientuji a hledám, co z toho můžeme vytěžit.', score: 0.67 },
      { text: 'Změny jsou normální — prostě se přizpůsobím za pochodu, bez formálního přeplánování.', score: 1.0 },
    ],
  },

  // DECISION_SPEED
  {
    id: 'cog_sc_speed_01',
    dim: 'DECISION_SPEED',
    text: 'V terénu se objeví problém (porucha, nečekaná překážka), který ohrožuje termín. Co uděláte?',
    options: [
      { text: 'Nejdřív si udělám co nejúplnější obrázek o příčinách a variantách řešení, i za cenu pár hodin zpoždění.', score: 0 },
      { text: 'Krátce zanalyzuji hlavní varianty — nechci se rozhodnout naslepo, ale ani příliš zdržovat.', score: 0.33 },
      { text: 'Rychle vyberu jedno z rozumných řešení a začnu jednat — detaily doladíme za pochodu.', score: 0.67 },
      { text: 'Okamžitě se rozhodnu pro první dostupné řešení — čas je teď důležitější než optimálnost.', score: 1.0 },
    ],
  },
  {
    id: 'cog_sc_speed_02',
    dim: 'DECISION_SPEED',
    text: 'Máte na stole nabídku spolupráce, která vypadá zajímavě, ale partner chce odpověď do 48 hodin. Jak postupujete?',
    options: [
      { text: 'Požádám o prodloužení lhůty — potřebuji čas na důkladné zvážení všech aspektů.', score: 0 },
      { text: 'Projdu si klíčové body a poradím se s jedním kolegou — 48 hodin mi na základní rozvahu stačí.', score: 0.33 },
      { text: 'Důvěřuji svému úsudku — během dne si udělám představu a odpovím.', score: 0.67 },
      { text: 'Nabídka mi dává smysl — odpovím kladně ještě dnes a případné detaily dořeším později.', score: 1.0 },
    ],
  },
];

export const TOTAL_ITEMS = SCALE_ITEMS.length + SCENARIOS.length;

