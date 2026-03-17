export const TEST_CONFIG = {
  id: 'STRENGTHS',
  name: 'Silné stránky',
  fullName: 'STRENGTHS — Silné stránky a talenty',
  version: '2.0',
  icon: '◆',
  accentColor: '#264653',
  accentColorLight: '#26465322',
  secondaryColor: '#2A9D8F',
  estimatedMinutes: 11,
  description:
    'Test mapuje šest oblastí talentů — přirozené vzorce chování, které tě nabíjejí a kde máš potenciál excelovat. Nejde o to, v čem jsi dobrý, ale co tě přirozeně táhne.',
  tip: 'Odpovídej podle toho, co tě skutečně nabíjí a baví, ne podle toho, v čem si myslíš, že bys měl/a být dobrý/á. Neexistují špatné odpovědi — každá dimenze má svou hodnotu.',
  reportFilePrefix: 'strengths',
  scaleItemCount: 30,
  scenarioCount: 9,
  scaleDescription: 'Likert 1-7 + párové volby'
};

export const DIMENSIONS = {
  LEARNER: {
    name: 'Učící se',
    full: 'Učící se — učení jako motor',
    eng: 'Learner',
    color: '#2A9D8F',
    colorLight: '#2A9D8F22',
    icon: '📖',
    lowLabel: 'Praxe a zkušenost',
    highLabel: 'Učení a nové koncepty',
    lowDesc:
      'Učení bereš spíš utilitárně — učíš se, když musíš. Tvou energii čerpáš spíš z praxe a konkrétních zkušeností než z teorie.',
    midDesc:
      'Učení je pro tebe důležité, ale není to tvůj primární motor. Selektivně se vzděláváš v oblastech, které tě zajímají nebo potřebuješ.',
    highDesc:
      'Učení je pro tebe přirozený zdroj energie. Neustále vyhledáváš nové koncepty, dovednosti a perspektivy — i bez vnějšího tlaku.',
    shadowSide:
      'Prokrastinace učením — nikdy se necítíš „dost připravený/á" na akci. Hromadění znalostí bez jejich aplikace.',
    bestWith: 'Iniciátor (přetaví znalosti v akci) nebo Tah na výsledek (dá učení cíl)'
  },
  ACHIEVER: {
    name: 'Tah na výsledek',
    full: 'Tah na výsledek — potřeba dosahovat',
    eng: 'Achiever',
    color: '#E07A5F',
    colorLight: '#E07A5F22',
    icon: '🎯',
    lowLabel: 'Proces a cesta',
    highLabel: 'Cíle a výsledky',
    lowDesc:
      'Výsledky a metriky nejsou tvůj hlavní motor. Víc tě poháněl proces, smysl nebo vztahy než odškrtávání úkolů.',
    midDesc:
      'Výsledky jsou pro tebe důležité, ale nepotřebuješ neustálý pocit pokroku. Umíš si užít i cestu, ne jen cíl.',
    highDesc:
      'Silná potřeba dosahovat a posouvat se. Na konci dne potřebuješ cítit, že jsi něco udělal/a — odškrtnuté úkoly ti dávají energii.',
    shadowSide:
      'Workoholismus — neschopnost odpočívat, neustálý tlak na výkon. Orientace jen na „to-do" na úkor lidí a vztahů.',
    bestWith: 'Propojovatel (přidá lidský rozměr) nebo Učící se (dá hloubku výsledkům)'
  },
  ACTIVATOR: {
    name: 'Iniciátor',
    full: 'Iniciátor — startér nových věcí',
    eng: 'Activator',
    color: '#F2CC8F',
    colorLight: '#F2CC8F22',
    icon: '🚀',
    lowLabel: 'Rozmysl a příprava',
    highLabel: 'Akce a start',
    lowDesc:
      'Před akcí potřebuješ důkladnou přípravu a analýzu. Spíš reaguješ na podněty než aby ses sám/sama pouštěl/a do nových věcí.',
    midDesc:
      'Umíš začít, když je to potřeba, ale nepotřebuješ neustále startovat nové projekty. Balansuješ mezi plánováním a akcí.',
    highDesc:
      'Máš přirozenou energii pro start — nápady rychle převádíš v akci a raději začneš s neúplnými informacemi, než abys čekal/a.',
    shadowSide:
      'Chaos — rozjíždění mnoha věcí bez dotažení. Únava týmu z neustálých nových iniciativ bez stabilizace.',
    bestWith: 'Dotahovač (dokončí to, co Iniciátor rozjede) nebo Zlepšovatel (doladí po startu)'
  },
  IMPLEMENTER: {
    name: 'Dotahovač',
    full: 'Dotahovač — dotahování do konce',
    eng: 'Implementer',
    color: '#264653',
    colorLight: '#26465322',
    icon: '⚙',
    lowLabel: 'Nápady a možnosti',
    highLabel: 'Akce a dokončení',
    lowDesc:
      'Fáze realizace a detailů tě spíš vyčerpává. Baví tě víc vymýšlení a start než dotahování posledních procent.',
    midDesc:
      'Umíš dotahovat, když vidíš smysl a prioritu. Nejlépe funguješ, když je realizace vyvážená s tvorbou nového.',
    highDesc:
      'Máš přirozený tah na dokončení — vracíš se k rozpracovaným věcem a je pro tebe důležité, aby věci byly hotové a funkční.',
    shadowSide:
      'Rigidita — přehnané lpění na plánu, i když se podmínky změnily. Odpor k improvizaci a změnám uprostřed procesu.',
    bestWith: 'Iniciátor (dodá energii pro start) nebo Učící se (přinese nové perspektivy do rutiny)'
  },
  CONNECTOR: {
    name: 'Propojovatel',
    full: 'Propojovatel — budování sítí a příležitostí',
    eng: 'Connector',
    color: '#8E7DBE',
    colorLight: '#8E7DBE22',
    icon: '🔗',
    lowLabel: 'Individuální práce',
    highLabel: 'Práce přes lidi',
    lowDesc:
      'Networking a budování vztahových sítí není tvůj přirozený styl. Pracuješ raději sám/sama nebo v malém, stabilním týmu.',
    midDesc:
      'Vztahy vnímáš jako důležité, ale cíleně síťuješ jen v kontextech, které ti dávají smysl. Nejsi „networking mašina".',
    highDesc:
      'Přirozeně propojuješ lidi, kteří si mohou pomoct. Vztahy a kontakty vnímáš jako hlavní cestu k příležitostem a výsledkům.',
    shadowSide:
      'Povrchní vztahy — síťování bez hlubšího záměru. Přetížení sociálními závazky, neschopnost říct „ne".',
    bestWith:
      'Tah na výsledek (dá vztahům cíl) nebo Dotahovač (promění kontakty v konkrétní výstupy)'
  },
  MAXIMIZER: {
    name: 'Zlepšovatel',
    full: 'Zlepšovatel — z dobrého na výborné',
    eng: 'Maximizer',
    color: '#D4726A',
    colorLight: '#D4726A22',
    icon: '✦',
    lowLabel: 'Dost dobré stačí',
    highLabel: 'Vždy to jde lépe',
    lowDesc:
      'Když věci fungují přijatelně, nemáš potřebu je dál vylepšovat. Tvá energie jde spíš do nových věcí než do ladění existujících.',
    midDesc:
      'Vylepšuješ tam, kde to má smysl, ale nemáš nutkavou potřebu všechno doladit k dokonalosti.',
    highDesc:
      'Přirozeně hledáš, jak věci posunout z funkčních na vynikající. Baví tě ladění detailů a optimalizace existujícího.',
    shadowSide:
      'Perfekcionismus — nikdy nic není dost dobré. Prokrastinace nekonečným laděním detailů místo dokončení a posunu.',
    bestWith:
      'Tah na výsledek (dá deadline pro ladění) nebo Iniciátor (přinese nové impulzy místo nekonečného vylepšování)'
  }
};

export const SCALE_ITEMS = [
  // LEARNER
  {
    id: 'str_learn_01',
    dim: 'LEARNER',
    text:
      'Mám upřímnou radost z toho, když objevím nový koncept nebo dovednost, i když to hned nepotřebuji v praxi.',
    reverse: false
  },
  {
    id: 'str_learn_02',
    dim: 'LEARNER',
    text:
      'Často si sám/sama vyhledávám nové informace nebo kurzy, jen proto, že mě to zajímá.',
    reverse: false
  },
  {
    id: 'str_learn_03',
    dim: 'LEARNER',
    text:
      'Učení beru spíš jako nutné zlo — snažím se mu vyhnout, pokud nemusím.',
    reverse: true
  },
  {
    id: 'str_learn_04',
    dim: 'LEARNER',
    text:
      'Když narazím na téma, které neznám, přirozeně mě to přitáhne a chci se o něm dozvědět víc.',
    reverse: false
  },
  {
    id: 'str_learn_05',
    dim: 'LEARNER',
    text:
      'Proces učení se něčeho nového mi dává energii, i když je to zpočátku těžké a pomalé.',
    reverse: false
  },

  // ACHIEVER
  {
    id: 'str_ach_01',
    dim: 'ACHIEVER',
    text:
      'Cítím silné uspokojení, když si na konci dne můžu odškrtnout splněné úkoly.',
    reverse: false
  },
  {
    id: 'str_ach_02',
    dim: 'ACHIEVER',
    text:
      'Když dosáhnu cíle, rychle si stanovím další, místo abych si dlouho odpočíval/a.',
    reverse: false
  },
  {
    id: 'str_ach_03',
    dim: 'ACHIEVER',
    text:
      'Upřímně mi nevadí, když se věci posouvají pomalu a bez jasného dokončení.',
    reverse: true
  },
  {
    id: 'str_ach_04',
    dim: 'ACHIEVER',
    text:
      'Potřebuji vidět hmatatelný výsledek své práce — bez toho ztrácím motivaci.',
    reverse: false
  },
  {
    id: 'str_ach_05',
    dim: 'ACHIEVER',
    text:
      'Jasné metriky a cíle mi pomáhají udržet energii a koncentraci.',
    reverse: false
  },

  // ACTIVATOR
  {
    id: 'str_act_01',
    dim: 'ACTIVATOR',
    text:
      'Raději začnu jednat s neúplnými informacemi, než abych dlouho plánoval/a a analyzoval/a.',
    reverse: false
  },
  {
    id: 'str_act_02',
    dim: 'ACTIVATOR',
    text:
      'Když mám nápad, mám tendenci ho co nejdříve vyzkoušet v praxi.',
    reverse: false
  },
  {
    id: 'str_act_03',
    dim: 'ACTIVATOR',
    text:
      'Často čekám, až jsou všechny podmínky ideální, než se do něčeho pustím.',
    reverse: true
  },
  {
    id: 'str_act_04',
    dim: 'ACTIVATOR',
    text:
      'V týmu bývám ten, kdo řekne „tak pojďme to zkusit" místo dalšího plánování.',
    reverse: false
  },
  {
    id: 'str_act_05',
    dim: 'ACTIVATOR',
    text:
      'Fáze rozjíždění nových věcí je pro mě víc vyčerpávající než nabíjející.',
    reverse: true
  },

  // IMPLEMENTER
  {
    id: 'str_impl_01',
    dim: 'IMPLEMENTER',
    text:
      'Je pro mě důležité dotahovat věci do konce, i když už nejsou nové a vzrušující.',
    reverse: false
  },
  {
    id: 'str_impl_02',
    dim: 'IMPLEMENTER',
    text:
      'Když se projekt blíží do finále, přirozeně přebírám zodpovědnost za to, aby vše bylo dokončeno.',
    reverse: false
  },
  {
    id: 'str_impl_03',
    dim: 'IMPLEMENTER',
    text:
      'Snadno ztrácím zájem v momentě, kdy přecházíme z vymýšlení do realizace a detailů.',
    reverse: true
  },
  {
    id: 'str_impl_04',
    dim: 'IMPLEMENTER',
    text:
      'Dávám přednost jasnému plánu a systematickému postupu před improvizací.',
    reverse: false
  },
  {
    id: 'str_impl_05',
    dim: 'IMPLEMENTER',
    text:
      'Mám dobrý pocit, když vidím, že něco, na čem jsem pracoval/a, funguje a je hotové.',
    reverse: false
  },

  // CONNECTOR
  {
    id: 'str_conn_01',
    dim: 'CONNECTOR',
    text:
      'Rád/a propojím lidi, o kterých si myslím, že si mohou navzájem pomoct.',
    reverse: false
  },
  {
    id: 'str_conn_02',
    dim: 'CONNECTOR',
    text:
      'Vztahy a kontakty vnímám jako jednu z hlavních cest, jak vytvářet příležitosti.',
    reverse: false
  },
  {
    id: 'str_conn_03',
    dim: 'CONNECTOR',
    text:
      'Networking a společenské akce mě spíš vyčerpávají než nabíjejí.',
    reverse: true
  },
  {
    id: 'str_conn_04',
    dim: 'CONNECTOR',
    text:
      'Často mi volají nebo píšou lidé, kteří potřebují kontakt na někoho — protože vědí, že „znám někoho".',
    reverse: false
  },
  {
    id: 'str_conn_05',
    dim: 'CONNECTOR',
    text:
      'Raději pracuji sám/sama a výsledek předám, než abych se koordinoval/a s dalšími lidmi.',
    reverse: true
  },

  // MAXIMIZER
  {
    id: 'str_max_01',
    dim: 'MAXIMIZER',
    text:
      'Když je něco „dost dobré", mám tendenci hledat, jak to ještě vylepšit.',
    reverse: false
  },
  {
    id: 'str_max_02',
    dim: 'MAXIMIZER',
    text:
      'Baví mě ladit detaily a posouvat existující věci z funkčních na vynikající.',
    reverse: false
  },
  {
    id: 'str_max_03',
    dim: 'MAXIMIZER',
    text:
      'Když něco funguje přijatelně, nevidím moc smysl se v tom dále vrtat.',
    reverse: true
  },
  {
    id: 'str_max_04',
    dim: 'MAXIMIZER',
    text:
      'Rád/a se vracím ke svým starším výtvorům a hledám, co by šlo udělat lépe.',
    reverse: false
  },
  {
    id: 'str_max_05',
    dim: 'MAXIMIZER',
    text:
      'Kvalita výstupu je pro mě důležitější než rychlost dokončení.',
    reverse: false
  }
];

export const FORCED_CHOICE_PAIRS = [
  {
    id: 'fc_01',
    optionA: {
      dim: 'LEARNER',
      text:
        'Nejvíc mě nabíjí, když se naučím něco nového, co mi otevírá nové perspektivy.'
    },
    optionB: {
      dim: 'ACHIEVER',
      text:
        'Nejvíc mě nabíjí pocit, že jsem za den udělal/a hodně konkrétní práce.'
    }
  },
  {
    id: 'fc_02',
    optionA: {
      dim: 'ACTIVATOR',
      text:
        'Moje energie je největší na startu — když se rozjíždí něco nového.'
    },
    optionB: {
      dim: 'IMPLEMENTER',
      text:
        'Moje energie je největší ve finále — když se věci dotahují do konce.'
    }
  },
  {
    id: 'fc_03',
    optionA: {
      dim: 'CONNECTOR',
      text:
        'Nejlepších výsledků dosahuji, když pracuji přes lidi a vztahy.'
    },
    optionB: {
      dim: 'MAXIMIZER',
      text:
        'Nejlepších výsledků dosahuji, když mám prostor vyladit kvalitu do detailu.'
    }
  },
  {
    id: 'fc_04',
    optionA: {
      dim: 'LEARNER',
      text:
        'Raději strávím den studiem a přemýšlením o nových přístupech.'
    },
    optionB: {
      dim: 'ACTIVATOR',
      text:
        'Raději strávím den zkoušením věcí v praxi — i kdyby ne všechno vyšlo.'
    }
  },
  {
    id: 'fc_05',
    optionA: {
      dim: 'ACHIEVER',
      text:
        'Motivuje mě vidět jasný pokrok a měřitelné výsledky.'
    },
    optionB: {
      dim: 'CONNECTOR',
      text:
        'Motivuje mě pocit, že jsem někomu pomohl/a nebo propojil/a správné lidi.'
    }
  },
  {
    id: 'fc_06',
    optionA: {
      dim: 'ACTIVATOR',
      text:
        'Preferuji rozjíždět nové projekty a iniciativy.'
    },
    optionB: {
      dim: 'MAXIMIZER',
      text:
        'Preferuji vzít existující věc a doladit ji k dokonalosti.'
    }
  },
  {
    id: 'fc_07',
    optionA: {
      dim: 'IMPLEMENTER',
      text:
        'Mám dobrý pocit, když je plán jasný a já ho mohu systematicky realizovat.'
    },
    optionB: {
      dim: 'CONNECTOR',
      text:
        'Mám dobrý pocit, když se mi podaří vybudovat vztah nebo propojení, které přinese hodnotu.'
    }
  },
  {
    id: 'fc_08',
    optionA: {
      dim: 'LEARNER',
      text:
        'Když mě něco zaujme, ponořím se do toho a chci pochopit, jak to funguje do hloubky.'
    },
    optionB: {
      dim: 'IMPLEMENTER',
      text:
        'Když mě něco zaujme, hledám způsob, jak to převést do praxe a dotáhnout.'
    }
  },
  {
    id: 'fc_09',
    optionA: {
      dim: 'ACHIEVER',
      text:
        'Nejvíc mi sedí prostředí s jasnými cíli, deadliny a hodnocením výkonu.'
    },
    optionB: {
      dim: 'MAXIMIZER',
      text:
        'Nejvíc mi sedí prostředí, kde je prostor věci dělat pořádně a nespěchat za kvantitou.'
    }
  }
];

export const SLIDER_LABELS = [
  'Vůbec nesouhlasím',
  'Nesouhlasím',
  'Spíše nesouhlasím',
  'Neutrální',
  'Spíše souhlasím',
  'Souhlasím',
  'Zcela souhlasím'
];

