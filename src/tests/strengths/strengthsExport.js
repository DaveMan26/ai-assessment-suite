import { DIMENSIONS, TEST_CONFIG } from './strengthsData';
import { generateMarkdownReport, generateHTMLReport } from '../../lib/export';

export function getPracticalImplications(rankedStrengths) {
  const top = rankedStrengths
    .filter(s => s.category === 'signature' || s.category === 'supporting')
    .slice(0, 3);
  const topDims = top.map(s => s.dim);

  const sections = [];

  let career = '### Kariéra\n\n';
  const careerMap = {
    LEARNER:
      'role s kontinuálním učením — nové technologie, měnící se projekty, výzkum, konzulting',
    ACHIEVER:
      'role s jasnými cíli a metrikami — projektové řízení, sales, operations',
    ACTIVATOR:
      'role, kde se stále rozjíždí nové věci — startup, business development, inovace',
    IMPLEMENTER:
      'role zaměřené na delivery a realizaci — project management, operations, quality assurance',
    CONNECTOR:
      'role, kde se pracuje přes lidi — business development, stakeholder management, HR, community',
    MAXIMIZER:
      'role, kde je prostor pro kvalitu a detaily — design, editorial, QA, strategie, coaching'
  };
  career += 'Na základě tvých silných stránek ti budou přirozeně sedět:\n';
  topDims.forEach(dim => {
    career += `- **${DIMENSIONS[dim].name}:** ${careerMap[dim]}\n`;
  });
  sections.push(career);

  let team = '### Tým\n\n';
  team += 'V týmu přirozeně zastáváš roli ';
  if (topDims.includes('ACTIVATOR')) {
    team += 'startéra, který rozjíždí nové iniciativy. ';
  }
  if (topDims.includes('IMPLEMENTER')) {
    team += 'dotahovače, na kterého se tým spoléhá při finalizaci. ';
  }
  if (topDims.includes('CONNECTOR')) {
    team += 'propojovače, který buduje mosty mezi lidmi a týmy. ';
  }
  if (topDims.includes('LEARNER')) {
    team += 'znalostního lídra, který přináší nové perspektivy. ';
  }
  if (topDims.includes('ACHIEVER')) {
    team += 'tahače, který udržuje tempo a focus na výsledky. ';
  }
  if (topDims.includes('MAXIMIZER')) {
    team += 'perfekcionisty, který posouvá kvalitu výstupů. ';
  }
  sections.push(team);

  let growth = '### Osobní rozvoj\n\n';
  growth +=
    'Místo opravování slabin se zaměř na **vědomé využívání svých TOP silných stránek**:\n';
  growth +=
    '- Navrhni si den tak, aby se tvoje top síly uplatňovaly co nejčastěji.\n';
  growth +=
    '- U „spících" oblastí (nízké skóre) nejde o slabiny — jen to není tvůj přirozený motor. Můžeš tam fungovat přes naučené kompetence.\n';
  growth +=
    '- Pozor na shadow side — přehnaně používaná silná stránka se může stát slabostí (viz popis u každé dimenze).\n';
  sections.push(growth);

  return sections;
}

export function generateStrengthsStatement(rankedStrengths) {
  const sig = rankedStrengths.filter(s => s.category === 'signature');
  const supp = rankedStrengths.filter(s => s.category === 'supporting');

  if (sig.length === 0) {
    return 'Tvůj profil je relativně vyvážený — nemáš extrémně dominantní silnou stránku, ale spíš široký základ kompetencí.';
  }

  const sigNames = sig.map(s => DIMENSIONS[s.dim].name).join(' a ');

  const descriptions = {
    LEARNER: 'přirozeně tíhneš k učení a hledání nových perspektiv',
    ACHIEVER:
      'máš silný tah na výsledek a potřebu vidět hmatatelný pokrok',
    ACTIVATOR:
      'přirozeně rozjíždíš nové věci a převádíš nápady v akci',
    IMPLEMENTER:
      'spolehlivě dotahuješ věci do konce a dbáš na realizaci',
    CONNECTOR:
      'buduješ vztahy a propojuješ lidi, kteří si mohou pomoct',
    MAXIMIZER:
      'hledáš, jak věci posunout z dobrých na výborné'
  };

  let statement = `Tvoje signaturní silné stránky jsou **${sigNames}**. To znamená, že ${sig
    .map(s => descriptions[s.dim])
    .join(' a ')}.`;

  if (supp.length > 0) {
    statement += ` Tvoje opěrné silné stránky (${supp
      .map(s => DIMENSIONS[s.dim].name)
      .join(', ')}) tyto signaturní síly doplňují.`;
  }

  return statement;
}

export function generateStrengthsMarkdown(scores, rankedStrengths) {
  const personalAvg =
    Object.values(scores).reduce((a, b) => a + b, 0) /
    Object.keys(scores).length;

  const signature = rankedStrengths
    .filter(r => r.category === 'signature')
    .map(r => r.dim);
  const supporting = rankedStrengths
    .filter(r => r.category === 'supporting')
    .map(r => r.dim);

  const implicationsSections = getPracticalImplications(rankedStrengths);
  const practicalMd = implicationsSections.join('\n\n');

  const baseMd = generateMarkdownReport(TEST_CONFIG, DIMENSIONS, scores, practicalMd);

  const extra = {
    signature_strengths: signature,
    supporting_strengths: supporting,
    personal_average: personalAvg
  };

  const jsonBlock = `\n\n<!-- STRENGTHS_EXTRA_JSON_START -->\n${JSON.stringify(
    extra,
    null,
    2
  )}\n<!-- STRENGTHS_EXTRA_JSON_END -->\n`;

  return baseMd + jsonBlock;
}

export function generateStrengthsHTML(scores, rankedStrengths) {
  const implicationsSections = getPracticalImplications(rankedStrengths);
  const practicalHtml = implicationsSections
    .map(sec =>
      sec
        .split('\n')
        .map(line => {
          if (line.startsWith('### ')) {
            return `<h2>${line.replace('### ', '')}</h2>`;
          }
          if (line.startsWith('- ')) {
            return `<li>${line.replace('- ', '')}</li>`;
          }
          return `<p>${line}</p>`;
        })
        .join('')
    )
    .join('');

  return generateHTMLReport(
    TEST_CONFIG,
    DIMENSIONS,
    scores,
    practicalHtml
  );
}

