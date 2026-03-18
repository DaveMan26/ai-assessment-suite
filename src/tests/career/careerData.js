export const TEST_CONFIG = {
  id: 'CAREER',
  name: 'Kariérní kompas',
  fullName: 'Kariérní kompas — Mapa pracovních preferencí a motivace',
  version: '2.0',
  icon: '🧭',
  accentColor: '#E07A5F',
  accentColorLight: '#E07A5F22',
  secondaryColor: '#81B29A',
  estimatedMinutes: 13,
  questionCount: 52,
  scaleItemCount: 35,
  scenarioCount: 7,
  dimensionCount: 7,
  reportFilePrefix: 'career',
  scaleDescription: 'Likert 1–7 + situační scénáře + forced-choice',
  testType: 'Kariérní preference a motivace',
  description:
    'Zmapujte, jaký typ práce vás přitahuje a co vás v kariéře motivuje. Test rozlišuje mezi tím, CO chcete dělat (práce s lidmi, daty, nápady nebo věcmi) a PROČ to chcete dělat (smysl, růst, svoboda).',
  tip: 'Odpovídejte podle toho, co vás skutečně přitahuje a motivuje — ne podle toho, co by bylo „správné" nebo co děláte v současné práci. Ideální je představit si, že si můžete vybrat cokoliv.'
};

export const SLIDER_LABELS = [
  'Vůbec ne',
  'Spíše ne',
  'Trochu ne',
  'Neutrální',
  'Trochu ano',
  'Spíše ano',
  'Rozhodně ano'
];

export const DIMENSIONS = {
  PEOPLE: {
    name: 'Lidé',
    full: 'Orientace na lidi',
    eng: 'People',
    color: '#E07A5F',
    colorLight: '#E07A5F22',
    icon: '👥',
    lowLabel: 'Preferuje samostatnou práci',
    highLabel: 'Přitahuje práce s lidmi',
    lowDesc:
      'Práce s lidmi vás příliš nepřitahuje. Preferujete samostatnou práci, kde se můžete soustředit bez nutnosti neustálé komunikace a koordinace. Nejste nutně introvertní — prostě vám vyhovuje, když je mezilidská interakce spíše doplňkem, ne jádrem vaší role.',
    midDesc:
      'Práce s lidmi vám nevadí a dokážete v ní být efektivní, ale nepotřebujete ji jako hlavní náplň. Vyhovuje vám mix — část dne v kontaktu s lidmi, část v klidu na vlastních úkolech.',
    highDesc:
      'Mezilidský kontakt je pro vás klíčový zdroj energie a smyslu v práci. Přitahují vás role, kde pomáháte, učíte, vedete nebo koordinujete — práce „od lidí pro lidí". Bez pravidelného kontaktu s druhými byste se cítili izolovaně.',
    roleExamples: 'HR, koučink, vzdělávání, zákaznická péče, vedení týmů, zdravotnictví, sociální služby.',
    environmentExamples: 'Open space s častými schůzkami, klientské centrum, školicí firmy, nezisk.',
    jobCraftingTip:
      'Nabídněte mentoring juniorům, zorganizujte interní knowledge-sharing nebo vezměte na starost onboarding nových kolegů.'
  },
  DATA: {
    name: 'Data',
    full: 'Orientace na data a analýzu',
    eng: 'Data',
    color: '#3D405B',
    colorLight: '#3D405B22',
    icon: '📊',
    lowLabel: 'Práce s daty není prioritou',
    highLabel: 'Přitahuje analytická práce',
    lowDesc:
      'Analytická práce s čísly a daty vás příliš nepřitahuje. Nemáte potřebu vše kvantifikovat a měřit — raději se spoléháte na zkušenost, intuici nebo přímý kontakt se situací. To neznamená, že s daty neumíte — prostě vás to netáhne.',
    midDesc:
      'Práce s daty a informacemi je pro vás užitečný nástroj, ale ne hlavní motivátor. Dokážete analyzovat, když je třeba, ale nevyhledáváte to aktivně jako hlavní náplň.',
    highDesc:
      'Analytická práce vás přitahuje. Baví vás hledat vzorce, měřit, porovnávat a rozhodovat se na základě dat. Přirozeně inklinujete k rolím, kde je důležitá přesnost, strukturovanost a datově podložené rozhodování.',
    roleExamples: 'Business analytik, controlling, BI, data science, výzkum, risk, kvalita.',
    environmentExamples: 'Firmy s silným reportingem, consulting, fintech, výrobní controlling.',
    jobCraftingTip:
      'Zaveďte si pravidelný přehled KPI svého týmu, navrhněte jednoduchý dashboard nebo měřte dopad jedné konkrétní změny.'
  },
  IDEAS: {
    name: 'Nápady',
    full: 'Orientace na nápady a inovace',
    eng: 'Ideas',
    color: '#B45309',
    colorLight: '#B4530922',
    icon: '💡',
    lowLabel: 'Preferuje ověřené postupy',
    highLabel: 'Přitahuje tvorba a inovace',
    lowDesc:
      'Inovování a vymýšlení nového vás příliš netáhne. Preferujete ověřené postupy a jasné zadání před nejistotou brainstormingu a experimentů. To neznamená, že nemáte nápady — prostě není vaší hlavní motivací je produkovat.',
    midDesc:
      'Nové nápady vítáte a dokážete přispět kreativně, ale není to hlavní motor vaší kariérní motivace. Vyhovuje vám kombinace — část inovací, část realizace osvědčeného.',
    highDesc:
      'Tvorba nového je pro vás silný motivátor. Přitahují vás role, kde můžete vymýšlet koncepty, strategie nebo kreativní řešení. Rutina a opakování stejného vás rychle unaví — potřebujete prostor pro nápady a experimentování.',
    roleExamples: 'Produkt, strategie, design, R&D, marketing, inovační týmy, startup.',
    environmentExamples: 'Agilní firmy, design studia, inovační labely, rychle se měnící projekty.',
    jobCraftingTip:
      'Vyhraďte si čas na „inovační pátek", navrhněte pilot malé změny nebo vedení požádejte o prostor pro experiment.'
  },
  THINGS: {
    name: 'Věci',
    full: 'Orientace na věci a technologie',
    eng: 'Things',
    color: '#264653',
    colorLight: '#26465322',
    icon: '🔧',
    lowLabel: 'Netáhne k fyzické/technické práci',
    highLabel: 'Přitahuje práce s věcmi',
    lowDesc:
      'Práce s fyzickými objekty, stroji nebo technologiemi vás příliš nepřitahuje. Spíše inklinujete k abstraktnějšímu nebo mezilidskému typu práce. Kancelář nebo konferenční místnost vám vyhovuje víc než dílna nebo terén.',
    midDesc:
      'Práce s věcmi a technologiemi vám nevadí jako součást širší role, ale není vaším hlavním tahákem. Dokážete ocenit hmatatelný výsledek, ale nevyhledáváte ho cíleně.',
    highDesc:
      'Přitahují vás hmatatelné výsledky — stavby, produkty, stroje, technologie. Máte rádi, když vaše práce vyústí v něco fyzicky viditelného nebo technicky funkčního. Čistě abstraktní kancelářská práce vás dlouhodobě nenaplní.',
    roleExamples: 'Výroba, stavby, údržba, terénní technik, řemesla, hardware, provoz.',
    environmentExamples: 'Výrobní haly, stavby, servis, laboratoře s přístroji, terén.',
    jobCraftingTip:
      'Zapojte se do návštěvy provozu, vezměte si úkol s fyzickým výstupem (prototyp, instalace) nebo shadowing u technika.'
  },
  MEANING: {
    name: 'Smysl',
    full: 'Potřeba smyslu a dopadu',
    eng: 'Meaning',
    color: '#8E7DBE',
    colorLight: '#8E7DBE22',
    icon: '🎯',
    lowLabel: 'Smysl nehledá primárně v práci',
    highLabel: 'Potřebuje smysluplnou práci',
    lowDesc:
      'Hluboký osobní smysl v práci aktivně nevyhledáváte. To neznamená, že je vám jedno, co děláte — ale smysl a naplnění čerpáte spíše z jiných oblastí života. Práce pro vás může být prostředek k jiným cílům, a to je v pořádku.',
    midDesc:
      'Smysluplnost práce je pro vás důležitá, ale dokážete fungovat i v rolích, kde je smysl méně zřejmý, pokud jsou splněny jiné podmínky (růst, odměna, kolektiv). Ideálně hledáte rozumný kompromis.',
    highDesc:
      'Potřebujete cítit, že vaše práce má pozitivní dopad — na lidi, společnost nebo svět. Bez vnímání smyslu vám kariéra přijde prázdná, i kdyby byla finančně lukrativní. Jste ochotni obětovat část komfortu za pocit, že děláte něco důležitého.',
    roleExamples: 'Nezisk, zdravotnictví, vzdělávání, udržitelnost, veřejný sektor, impact role.',
    environmentExamples: 'Organizace s jasnou misí, B Corp, zdravotnická zařízení, školy.',
    jobCraftingTip:
      'Propojte svou práci s konkrétním příběhem uživatele, zapojte se do CSR nebo mentoringu s dopadem na komunitu.'
  },
  GROWTH: {
    name: 'Růst',
    full: 'Potřeba růstu a výzev',
    eng: 'Growth',
    color: '#2A9D8F',
    colorLight: '#2A9D8F22',
    icon: '📈',
    lowLabel: 'Preferuje stabilitu a jistotu',
    highLabel: 'Potřebuje růst a výzvy',
    lowDesc:
      'Kariérní růst a neustálé výzvy nejsou vaší hlavní motivací. Preferujete stabilitu, předvídatelnost a komfort zvládnuté role. To neznamená stagnaci — prostě nemáte potřebu se neustále tlačit do nového a neznámého.',
    midDesc:
      'Růst a rozvoj vítáte, ale v rozumném tempu. Nechcete stagnovat, ale ani se nehoníte za neustálými výzvami. Vyhovuje vám postupný posun s občasným skokem mimo komfortní zónu.',
    highDesc:
      'Neustálé učení a kariérní posun jsou pro vás zásadní. Vyhledáváte náročné úkoly, nové kompetence a příležitosti k růstu. Když se přestanete učit, začnete uvažovat o změně. Nejste spokojení v roli, která nenabízí další stupně.',
    roleExamples: 'Consulting, rotace v management trainee, rychle rostoucí firmy, výzkum, nové technologie.',
    environmentExamples: 'Scale-upy, mezinárodní projekty, firmy s rozpočtem na vzdělávání.',
    jobCraftingTip:
      'Domluvte si stretch úkol, kurz nebo rotaci na jiný tým na 3 měsíce; sledujte si konkrétní dovednost k rozvoji.'
  },
  AUTONOMY: {
    name: 'Autonomie',
    full: 'Potřeba autonomie a svobody',
    eng: 'Autonomy',
    color: '#D4726A',
    colorLight: '#D4726A22',
    icon: '🦅',
    lowLabel: 'Vyhovuje mu vedení a struktura',
    highLabel: 'Potřebuje svobodu rozhodování',
    lowDesc:
      'Jasná struktura a vedení vám vyhovují. Nepotřebujete rozhodovat o směru — raději dostanete jasné zadání a soustředíte se na kvalitní realizaci. Autoritativní řízení vám nevadí, pokud je kompetentní a férové.',
    midDesc:
      'Potřebujete rozumnou míru volnosti, ale oceníte i jasný rámec. Vyhovuje vám, když máte vliv na způsob provedení, ale nemusíte rozhodovat o všem. Umíte fungovat s vedením i samostatně.',
    highDesc:
      'Svoboda rozhodování je pro vás klíčová. Mikromanagement vás demotivuje, potřebujete ovlivňovat nejen JAK, ale i CO a PROČ děláte. Přitahují vás role s vysokou mírou autonomie — freelancing, podnikání, seniorní expertní nebo manažerské pozice.',
    roleExamples: 'Freelance, podnikání, senior expert, produktový vlastník, remote leadership.',
    environmentExamples: 'Firmy s důvěrou k výsledkům, malé týmy, vlastní projekty, hybridní práce.',
    jobCraftingTip:
      'Vyjednejte si jasné „zóny rozhodování" bez schvalování každého kroku; navrhněte vlastní metriky úspěchu.'
  }
};

export const SCALE_ITEMS = [
  { id: 'car_ppl_01', dim: 'PEOPLE', text: 'Energii mi dodává, když mohu s lidmi mluvit, naslouchat jim nebo je něco učit.', reverse: false },
  { id: 'car_ppl_02', dim: 'PEOPLE', text: 'V práci chci být v přímém kontaktu s lidmi, ne sedět většinu času sám u počítače.', reverse: false },
  { id: 'car_ppl_03', dim: 'PEOPLE', text: 'Naplnění cítím hlavně tehdy, když vidím, že jsem někomu konkrétně pomohl/a nebo ho posunul/a dál.', reverse: false },
  { id: 'car_ppl_04', dim: 'PEOPLE', text: 'Práce, kde celý den jednám s lidmi, by mě časem spíš vyčerpala než nabila.', reverse: true },
  { id: 'car_ppl_05', dim: 'PEOPLE', text: 'Přirozeně tíhnu k rolím, kde koordinuji, vedu nebo propojuji různé lidi a týmy.', reverse: false },
  { id: 'car_dat_01', dim: 'DATA', text: 'Rád/a se nořím do dat, čísel nebo procesů a hledám v nich vzorce a souvislosti.', reverse: false },
  { id: 'car_dat_02', dim: 'DATA', text: 'Baví mě převádět složité informace do přehledných tabulek, reportů nebo vizualizací.', reverse: false },
  { id: 'car_dat_03', dim: 'DATA', text: 'Při rozhodování se nejraději opírám o fakta a čísla, ne o dojmy nebo pocity.', reverse: false },
  { id: 'car_dat_04', dim: 'DATA', text: 'Práce s tabulkami a analýzami mi přijde spíš nudná — raději řeším věci jinak.', reverse: true },
  { id: 'car_dat_05', dim: 'DATA', text: 'Vyhovuje mi práce, kde je důležitá přesnost, systematičnost a pečlivá evidence.', reverse: false },
  { id: 'car_ide_01', dim: 'IDEAS', text: 'Často mě napadají nové nápady, jak by šlo věci dělat jinak nebo lépe.', reverse: false },
  { id: 'car_ide_02', dim: 'IDEAS', text: 'Nejvíc mě baví začátek — vymýšlení konceptů a vizí, ne rutinní provoz.', reverse: false },
  { id: 'car_ide_03', dim: 'IDEAS', text: 'Potřebuji v práci prostor pro kreativitu — ať už v technickém, strategickém, nebo lidském smyslu.', reverse: false },
  { id: 'car_ide_04', dim: 'IDEAS', text: 'Dávám přednost ověřeným postupům a jasným procesům před experimentováním s novými přístupy.', reverse: true },
  { id: 'car_ide_05', dim: 'IDEAS', text: 'Práce mě baví nejvíc, když mohu navrhovat nová řešení, služby nebo produkty.', reverse: false },
  { id: 'car_thi_01', dim: 'THINGS', text: 'Baví mě práce, kde něco fyzicky vzniká — produkt, stavba, zařízení nebo hmatatelný výsledek.', reverse: false },
  { id: 'car_thi_02', dim: 'THINGS', text: 'Jsem spokojený/á, když můžu být blízko technice, strojům nebo materiálům, ne jen u počítače.', reverse: false },
  { id: 'car_thi_03', dim: 'THINGS', text: 'Láká mě práce v terénu nebo ve výrobě víc než čistě kancelářské prostředí.', reverse: false },
  { id: 'car_thi_04', dim: 'THINGS', text: 'Fyzická práce s nástroji nebo stroji mi nic neříká — raději pracuji s informacemi nebo lidmi.', reverse: true },
  { id: 'car_thi_05', dim: 'THINGS', text: 'Když vidím hmatatelný výsledek své práce — postavenou budovu, opravený stroj, fungující linku — cítím největší uspokojení.', reverse: false },
  { id: 'car_mea_01', dim: 'MEANING', text: 'Je pro mě důležité, abych v každodenní práci viděl/a jasný pozitivní dopad na lidi nebo společnost.', reverse: false },
  { id: 'car_mea_02', dim: 'MEANING', text: 'Raději budu dělat práci, která má pro mě osobní smysl, i kdyby to znamenalo o něco nižší odměnu.', reverse: false },
  { id: 'car_mea_03', dim: 'MEANING', text: 'Hlavní smysl svého života hledám spíše mimo práci — v rodině, koníčcích nebo komunitě.', reverse: true },
  { id: 'car_mea_04', dim: 'MEANING', text: 'Dlouhodobě u práce vydržím jen tehdy, když cítím, že je v souladu s mými hlubšími hodnotami.', reverse: false },
  { id: 'car_mea_05', dim: 'MEANING', text: 'Práce je pro mě především prostředek k zajištění financí — smysl v ní hledat nepotřebuji.', reverse: true },
  { id: 'car_gro_01', dim: 'GROWTH', text: 'V práci potřebuji mít pocit, že se učím nové věci a posouvám se kupředu.', reverse: false },
  { id: 'car_gro_02', dim: 'GROWTH', text: 'Rád/a přijímám náročnější úkoly, i když s sebou nesou vyšší riziko chyby.', reverse: false },
  { id: 'car_gro_03', dim: 'GROWTH', text: 'Důležitá je pro mě možnost kariérního posunu nebo rozšiřování odpovědnosti.', reverse: false },
  { id: 'car_gro_04', dim: 'GROWTH', text: 'Vyhovuje mi role, kterou už dobře ovládám — nemusím se neustále učit nové věci.', reverse: true },
  { id: 'car_gro_05', dim: 'GROWTH', text: 'Když se v práci přestanu rozvíjet, začnu vážně uvažovat o změně.', reverse: false },
  { id: 'car_aut_01', dim: 'AUTONOMY', text: 'V práci potřebuji mít značnou volnost v tom, jak si organizuji čas a volím postupy.', reverse: false },
  { id: 'car_aut_02', dim: 'AUTONOMY', text: 'Špatně snáším mikromanagement a příliš detailní kontrolu nad tím, co dělám.', reverse: false },
  { id: 'car_aut_03', dim: 'AUTONOMY', text: 'Vyhovuje mi, když mi nadřízený dá jasné zadání a pravidelně kontroluje postup.', reverse: true },
  { id: 'car_aut_04', dim: 'AUTONOMY', text: 'Lákají mě role, kde mohu ovlivňovat směřování projektů nebo celé firmy, ne jen plnit zadání.', reverse: false },
  { id: 'car_aut_05', dim: 'AUTONOMY', text: 'Cítím se nejlépe, když pracuji v jasném týmovém rámci s přehledným vedením a pravidly.', reverse: true }
];

export const SCENARIOS = [
  {
    id: 'car_sc_01',
    text: 'V nové firmě vám nabídnou možnost vybrat si hlavní náplň práce na příští rok. Co by vám bylo nejbližší?',
    options: [
      { label: 'Vést menší tým lidí a pomáhat jim růst — mentoring, 1:1, rozvoj.', scores: { PEOPLE: 0.9, GROWTH: 0.2 } },
      { label: 'Připravovat analýzy a reporty, aby se vedení mohlo lépe rozhodovat.', scores: { DATA: 0.9 } },
      { label: 'Pracovat na technicky náročném projektu v terénu — realizace, stavba, implementace.', scores: { THINGS: 0.9 } },
      { label: 'Vymýšlet nové služby nebo produkty, které firma ještě nenabízí.', scores: { IDEAS: 0.9, AUTONOMY: 0.2 } }
    ]
  },
  {
    id: 'car_sc_02',
    text: 'Máte za úkol zlepšit výkonnost oddělení. K čemu byste se přirozeně přiklonil/a jako k prvnímu kroku?',
    options: [
      { label: 'Strávit čas s lidmi v týmu — pochopit jejich potřeby, motivaci a problémy.', scores: { PEOPLE: 0.9 } },
      { label: 'Nasbírat data o výkonnosti, chybovosti a průběhu procesů a vše důkladně zanalyzovat.', scores: { DATA: 0.9 } },
      { label: 'Fyzicky projít pracoviště, stroje nebo projekty a hledat konkrétní technická zlepšení.', scores: { THINGS: 0.8, DATA: 0.2 } },
      { label: 'Vymyslet úplně nový koncept fungování oddělení, který by věci dělal zásadně jinak.', scores: { IDEAS: 0.9, AUTONOMY: 0.2 } }
    ]
  },
  {
    id: 'car_sc_03',
    text: 'Úkol zní: „Přijď s návrhem, jak by naše firma mohla fungovat o 30 % efektivněji." Jak byste k tomu přistoupil/a?',
    options: [
      { label: 'Začal/a bych sbírat a vizualizovat data, abych pochopil/a aktuální stav — pak teprve navrhoval/a.', scores: { DATA: 0.8, IDEAS: 0.2 } },
      { label: 'Svolal/a bych klíčové lidi a vedl/a kreativní workshop — nápady vznikají nejlépe v dialogu.', scores: { IDEAS: 0.7, PEOPLE: 0.4 } },
      { label: 'Šel/šla bych do provozu a hledal/a konkrétní procesní a technická zlepšení na místě.', scores: { THINGS: 0.9 } },
      { label: 'Sám/sama bych si v klidu promyslel/a několik strategických scénářů a pak je představil/a.', scores: { IDEAS: 0.8, AUTONOMY: 0.3 } }
    ]
  },
  {
    id: 'car_sc_04',
    text: 'Máte možnost vybrat si nový projekt, který povedete. Který vás táhne nejvíc?',
    options: [
      { label: 'Školení a rozvojový program pro zaměstnance — workshops, e-learning, koučink.', scores: { PEOPLE: 0.8, MEANING: 0.3 } },
      { label: 'Detailní analýza výkonnosti strojů a návrh KPI dashboardu pro management.', scores: { DATA: 0.9 } },
      { label: 'Realizace technicky náročného projektu v terénu — nová linka, stavba, instalace.', scores: { THINGS: 0.9, GROWTH: 0.2 } },
      { label: 'Navržení zcela nové služby nebo produktu, který firma zatím nenabízí.', scores: { IDEAS: 0.9 } }
    ]
  },
  {
    id: 'car_sc_05',
    text: 'Máte dvě pracovní nabídky. Která je vám bližší?',
    options: [
      { label: 'Firma se silnou společenskou misí (zdravotnictví, vzdělávání, udržitelnost), plat lehce pod trhem.', scores: { MEANING: 0.9, PEOPLE: 0.2 } },
      { label: 'Komerčně úspěšná firma bez výrazné mise, plat nad trhem, rychlý kariérní postup.', scores: { GROWTH: 0.8 } },
      { label: 'Technologický startup s inovativním produktem — mise se teprve definuje, ale technologie je fascinující.', scores: { IDEAS: 0.6, THINGS: 0.3, AUTONOMY: 0.2 } },
      { label: 'Stabilní firma, kde máte velkou volnost v tom, jak si organizujete práci a na čem pracujete.', scores: { AUTONOMY: 0.9 } }
    ]
  },
  {
    id: 'car_sc_06',
    text: 'Zvažujete dvě varianty pozice ve stejné firmě. Co vás přitahuje víc?',
    options: [
      { label: 'Stabilní role s jasně definovanou náplní, předvídatelným průběhem dne a jistotou.', scores: { MEANING: 0.2 } },
      { label: 'Dynamická role v rychle se měnícím týmu — velký prostor pro učení, ale i nejistota a tlak.', scores: { GROWTH: 0.9 } },
      { label: 'Hluboce specializovaná odborná role — stát se jedničkou v jedné konkrétní oblasti.', scores: { DATA: 0.4, THINGS: 0.3 } },
      { label: 'Projektová role s možností zkoušet různá témata napříč firmou — pestrá, ale bez hloubky.', scores: { GROWTH: 0.6, IDEAS: 0.4 } }
    ]
  },
  {
    id: 'car_sc_07',
    text: 'Váš nadřízený vám nabízí čtyři různé způsoby spolupráce. Který vám sedí nejlíp?',
    options: [
      { label: 'Jasně definované úkoly a postupy, pravidelné check-iny — víte přesně, co se od vás čeká.', scores: { DATA: 0.2 } },
      { label: 'Volné zadání „cílový stav" s minimem kontroly — cesta je na vás, ale i odpovědnost za výsledek.', scores: { AUTONOMY: 0.9, GROWTH: 0.2 } },
      { label: 'Spolupráce v těsném týmu, kde se o většině věcí rozhoduje společně — sdílená odpovědnost.', scores: { PEOPLE: 0.7, MEANING: 0.2 } },
      { label: 'Role interního experta — radíte ostatním, ale finální rozhodnutí dělají manažeři.', scores: { DATA: 0.4, AUTONOMY: 0.3 } }
    ]
  }
];

function fcOption(label, dim) {
  return { label, text: label, dim };
}

export const FORCED_CHOICE_PAIRS = [
  { id: 'car_fc_01', optionA: fcOption('Práce, kde je jádrem komunikace s lidmi — koordinace, vedení, pomáhání.', 'PEOPLE'), optionB: fcOption('Práce, kde je jádrem analýza informací — data, čísla, systémy.', 'DATA') },
  { id: 'car_fc_02', optionA: fcOption('Práce, kde vymýšlím nové věci — koncepty, strategie, inovace.', 'IDEAS'), optionB: fcOption('Práce, kde něco fyzicky vzniká — stavby, produkty, technologie.', 'THINGS') },
  { id: 'car_fc_03', optionA: fcOption('Být v centru dění mezi lidmi — jednání, vyjednávání, týmová práce.', 'PEOPLE'), optionB: fcOption('Mít prostor pro hluboké soustředění na nové myšlenky a koncepty.', 'IDEAS') },
  { id: 'car_fc_04', optionA: fcOption('Pracovat s přesnými daty, čísly a fakty — jasná měřítka úspěchu.', 'DATA'), optionB: fcOption('Pracovat rukama nebo s technologiemi — vidět hmatatelný výsledek.', 'THINGS') },
  { id: 'car_fc_05', optionA: fcOption('Práce, kde jasně vidím, že pomáhám lidem nebo přispívám k něčemu důležitému.', 'MEANING'), optionB: fcOption('Práce, kde se neustále učím nové věci a posouvám se na vyšší úroveň.', 'GROWTH') },
  { id: 'car_fc_06', optionA: fcOption('Práce s hlubokým osobním smyslem — vědět, PROČ to dělám.', 'MEANING'), optionB: fcOption('Práce s velkou volností — sám si řídit, JAK a KDY pracuji.', 'AUTONOMY') },
  { id: 'car_fc_07', optionA: fcOption('Neustálé výzvy a příležitosti k růstu, i za cenu vyššího tlaku.', 'GROWTH'), optionB: fcOption('Vysoká míra svobody a nezávislosti, i za cenu menšího kariérního posunu.', 'AUTONOMY') },
  { id: 'car_fc_08', optionA: fcOption('Práce zaměřená na lidi — pomáhat, učit, vést, propojovat.', 'PEOPLE'), optionB: fcOption('Práce zaměřená na smysl — vědět, že to, co dělám, má pozitivní dopad.', 'MEANING') },
  { id: 'car_fc_09', optionA: fcOption('Práce, kde řeším náročné projekty a sbírám nové zkušenosti.', 'GROWTH'), optionB: fcOption('Práce, kde vytvářím hmatatelné věci — stavím, vyrábím, implementuji.', 'THINGS') },
  { id: 'car_fc_10', optionA: fcOption('Práce, kde mohu navrhovat nové přístupy a experimentovat.', 'IDEAS'), optionB: fcOption('Práce, kde rozhoduji o směřování — velký vliv, velká odpovědnost.', 'AUTONOMY') }
];

export const TOTAL_ITEMS = 42 + FORCED_CHOICE_PAIRS.length;
