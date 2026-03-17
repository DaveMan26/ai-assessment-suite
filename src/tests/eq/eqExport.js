export function getPracticalImplications(scores) {
  let text = "### Leadership a vliv\n\n";
  text += scores.SS > 60
    ? "- Sociální dovednosti jsou tvoje silná stránka — dokážeš lidi motivovat a vést náročné rozhovory\n"
    : "- Rozvoj sociálních dovedností ti otevře cestu k přirozenějšímu vedení. Zkus začít facilitací menších skupinových diskusí\n";
  text += scores.EM > 60
    ? "- Silná vnitřní motivace ti pomáhá udržet směr i v obtížných obdobích\n"
    : "- Jasný osobní ‚proč' ti dodá odolnost, když vedení přinese neočekávané překážky\n";

  text += "\n### Týmová spolupráce\n\n";
  text += scores.EP > 60
    ? "- Vysoká empatie ti umožňuje budovat důvěru a psychologické bezpečí v týmu\n"
    : "- Vědomé naslouchání a ověřování porozumění výrazně zlepší tvoje týmové vztahy\n";
  text += scores.SS > 60
    ? "- Tvoje schopnost řešit konflikty konstruktivně je klíčový přínos pro tým\n"
    : "- Trénink asertivní komunikace a mediačních technik ti pomůže v týmových konfliktech\n";

  text += "\n### Zvládání stresu\n\n";
  text += scores.SR > 60
    ? "- Dobrá seberegulace ti umožňuje fungovat efektivně i pod tlakem\n"
    : "- Investice do regulačních strategií (dech, pauza, fyzická aktivita) se vyplatí v náročných obdobích\n";
  text += scores.EM > 60
    ? "- Vnitřní odolnost a optimismus fungují jako přirozený buffer proti vyhoření\n"
    : "- Propojení každodenní práce s osobním smyslem zvyšuje odolnost vůči stresu\n";

  text += "\n### Osobní vztahy\n\n";
  text += scores.SA > 60
    ? "- Vysoké sebeuvědomění ti dává základ pro autentické a otevřené vztahy\n"
    : "- Pravidelnější reflexe vlastních emocí ti pomůže lépe komunikovat potřeby v blízkých vztazích\n";
  text += scores.EP > 60
    ? "- Empatie s respektovanými hranicemi — ideální kombinace pro zdravé vztahy\n"
    : "- Technika ‚nejdřív poslouchej, pak reaguj' může posílit kvalitu tvých blízkých vztahů\n";

  return text;
}

export function getPracticalImplicationsHTML(scores) {
  let html = '<p style="margin-bottom:12px;"><strong>Leadership a vliv:</strong> ';
  html += scores.SS > 60
    ? 'Sociální dovednosti jsou tvoje silná stránka — dokážeš lidi motivovat a vést náročné rozhovory. '
    : 'Rozvoj sociálních dovedností ti otevře cestu k přirozenějšímu vedení. Zkus začít facilitací menších skupinových diskusí. ';
  html += scores.EM > 60
    ? 'Silná vnitřní motivace ti pomáhá udržet směr i v obtížných obdobích.'
    : "Jasný osobní \u201Eproč\u201C ti dodá odolnost, když vedení přinese neočekávané překážky.";
  html += '</p>';

  html += '<p style="margin-bottom:12px;"><strong>Týmová spolupráce:</strong> ';
  html += scores.EP > 60
    ? 'Vysoká empatie ti umožňuje budovat důvěru a psychologické bezpečí v týmu. '
    : 'Vědomé naslouchání a ověřování porozumění výrazně zlepší tvoje týmové vztahy. ';
  html += scores.SS > 60
    ? 'Tvoje schopnost řešit konflikty konstruktivně je klíčový přínos pro tým.'
    : 'Trénink asertivní komunikace a mediačních technik ti pomůže v týmových konfliktech.';
  html += '</p>';

  html += '<p style="margin-bottom:12px;"><strong>Zvládání stresu:</strong> ';
  html += scores.SR > 60
    ? 'Dobrá seberegulace ti umožňuje fungovat efektivně i pod tlakem. '
    : 'Investice do regulačních strategií (dech, pauza, fyzická aktivita) se vyplatí v náročných obdobích. ';
  html += scores.EM > 60
    ? 'Vnitřní odolnost a optimismus fungují jako přirozený buffer proti vyhoření.'
    : 'Propojení každodenní práce s osobním smyslem zvyšuje odolnost vůči stresu.';
  html += '</p>';

  html += '<p><strong>Osobní vztahy:</strong> ';
  html += scores.SA > 60
    ? 'Vysoké sebeuvědomění ti dává základ pro autentické a otevřené vztahy. '
    : 'Pravidelnější reflexe vlastních emocí ti pomůže lépe komunikovat potřeby v blízkých vztazích. ';
  html += scores.EP > 60
    ? 'Empatie s respektovanými hranicemi — ideální kombinace pro zdravé vztahy.'
    : "Technika \u201Enejdřív poslouchej, pak reaguj\u201C může posílit kvalitu tvých blízkých vztahů.";
  html += '</p>';

  return html;
}
