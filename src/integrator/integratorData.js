import { DIMENSIONS as BIG5_DIMENSIONS } from '../tests/big5/big5Data';
import { DIMS as IQ_DIMS } from '../tests/iq/iqData';
import { DIMENSIONS as EQ_DIMENSIONS } from '../tests/eq/eqData';
import { DIMENSIONS as CREATIVE_DIMENSIONS } from '../tests/creative/creativeData';
import { DIMENSIONS as STRENGTHS_DIMENSIONS } from '../tests/strengths/strengthsData';
import { DIMENSIONS as CAREER_DIMENSIONS } from '../tests/career/careerData';
import { DIMENSIONS as COGNITIVE_DIMENSIONS } from '../tests/cognitive/cognitiveData';

function mapUnipolar(dimObj) {
  const out = {};
  for (const [k, v] of Object.entries(dimObj)) {
    out[k] = {
      name: v.name,
      eng: v.eng || k,
      color: v.color,
    };
  }
  return out;
}

function mapBipolar(dimObj) {
  const out = {};
  for (const [k, v] of Object.entries(dimObj)) {
    out[k] = {
      name: v.name,
      eng: v.eng || k,
      color: v.color,
      poleA: v.poleA?.label || v.poleA?.name,
      poleB: v.poleB?.label || v.poleB?.name,
    };
  }
  return out;
}

/** Curated meta-osy — hodnoty z mapovaných testů (IQ a COGNITIVE zde nejsou) */
export const MASTER_RADAR_AXES = [
  { key: 'personality_openness', label: 'Otevřenost', source: { test: 'BIG5', dim: 'O' } },
  { key: 'personality_conscientiousness', label: 'Svědomitost', source: { test: 'BIG5', dim: 'C' } },
  { key: 'personality_extraversion', label: 'Extraverze', source: { test: 'BIG5', dim: 'E' } },
  { key: 'emotional_awareness', label: 'Emoční inteligence', source: { test: 'EQ', dim: '_AVG' } },
  { key: 'creativity', label: 'Kreativita', source: { test: 'CREATIVE', dim: '_AVG' } },
  { key: 'achievement', label: 'Výkonová orientace', source: { test: 'STRENGTHS', dim: 'ACHIEVER' } },
  { key: 'people_orientation', label: 'Orientace na lidi', source: { test: 'CAREER', dim: 'PEOPLE' } },
  { key: 'growth_drive', label: 'Růstový drive', source: { test: 'CAREER', dim: 'GROWTH' } },
  { key: 'learning', label: 'Učení', source: { test: 'STRENGTHS', dim: 'LEARNER' } },
  { key: 'implementation', label: 'Realizace', source: { test: 'STRENGTHS', dim: 'IMPLEMENTER' } },
];

export const CONSISTENCY_RULES = [
  {
    testA: 'BIG5',
    dimA: 'E',
    testB: 'STRENGTHS',
    dimB: 'CONNECTOR',
    relationship: 'positive',
    label: 'Extraverze vs. Konektivita',
    desc: 'BIG5 Extraverze a Strengths Connector by měly korelovat — obě měří sociální orientaci.',
  },
  {
    testA: 'BIG5',
    dimA: 'C',
    testB: 'STRENGTHS',
    dimB: 'IMPLEMENTER',
    relationship: 'positive',
    label: 'Svědomitost vs. Realizátor',
    desc: 'BIG5 Svědomitost a schopnost dotahovat věci (Implementer) by měly jít spolu.',
  },
  {
    testA: 'BIG5',
    dimA: 'O',
    testB: 'CREATIVE',
    dimB: '_AVG',
    relationship: 'positive',
    label: 'Otevřenost vs. Kreativita',
    desc: 'Otevřenost novým zkušenostem a celková kreativita by měly korelovat.',
  },
  {
    testA: 'EQ',
    dimA: 'SA',
    testB: 'BIG5',
    dimB: 'N',
    relationship: 'inverse',
    label: 'Sebeuvědomění vs. Neuroticismus',
    desc: 'Vysoké emoční sebeuvědomění obvykle koreluje s nižším neuroticismem.',
  },
  {
    testA: 'EQ',
    dimA: 'EP',
    testB: 'CAREER',
    dimB: 'PEOPLE',
    relationship: 'positive',
    label: 'Sociální dovednosti vs. Orientace na lidi',
    desc: 'Silné sociální dovednosti a preference práce s lidmi by měly jít ruku v ruce.',
  },
  {
    testA: 'STRENGTHS',
    dimA: 'LEARNER',
    testB: 'CAREER',
    dimB: 'GROWTH',
    relationship: 'positive',
    label: 'Učení vs. Kariérní růst',
    desc: 'Silný talent pro učení a touha po kariérním růstu by měly korelovat.',
  },
  {
    testA: 'BIG5',
    dimA: 'O',
    testB: 'COGNITIVE',
    dimB: 'APPROACH',
    relationship: 'positive_bipolar_high',
    label: 'Otevřenost vs. Flexibilita přístupu',
    desc: 'Otevřenost novým zkušenostem by měla korelovat s flexibilnějším přístupem.',
  },
  {
    testA: 'STRENGTHS',
    dimA: 'ACHIEVER',
    testB: 'CAREER',
    dimB: 'GROWTH',
    relationship: 'positive',
    label: 'Výsledky vs. Kariérní růst',
    desc: 'Orientace na výsledky a touha po kariérním růstu často jdou spolu.',
  },
];

export const PENDING_TESTS = [
  { id: 'COMM', name: 'Komunikační styl', shortName: 'Komunikace', icon: '◎', color: '#E07A5F' },
  { id: 'LEADER', name: 'Leadership', shortName: 'Leadership', icon: '⬢', color: '#3D405B' },
  { id: 'RESILIENCE', name: 'Odolnost', shortName: 'Odolnost', icon: '◐', color: '#81B29A' },
  { id: 'VALUES', name: 'Hodnoty', shortName: 'Hodnoty', icon: '✧', color: '#F2CC8F' },
  { id: 'META', name: 'Metakognice', shortName: 'Metakognice', icon: '◑', color: '#8E7DBE' },
];

export const TOTAL_TEST_SLOTS = 12;

export const TEST_REGISTRY = {
  BIG5: {
    id: 'BIG5',
    name: 'Big Five osobnost',
    shortName: 'Big Five',
    icon: '◉',
    color: '#E07A5F',
    type: 'unipolar',
    route: '/test/big5',
    dimensions: mapUnipolar(BIG5_DIMENSIONS),
  },
  IQ: {
    id: 'IQ',
    name: 'Kognitivní schopnosti',
    shortName: 'IQ',
    icon: '◈',
    color: '#2D6A9F',
    type: 'performance',
    route: '/test/iq',
    dimensions: mapUnipolar(IQ_DIMS),
  },
  EQ: {
    id: 'EQ',
    name: 'Emoční inteligence',
    shortName: 'EQ',
    icon: '◎',
    color: '#D4726A',
    type: 'unipolar',
    route: '/test/eq',
    dimensions: mapUnipolar(EQ_DIMENSIONS),
  },
  CREATIVE: {
    id: 'CREATIVE',
    name: 'Kreativita a inovace',
    shortName: 'Kreativita',
    icon: '✦',
    color: '#FF6B6B',
    type: 'unipolar',
    route: '/test/creative',
    dimensions: mapUnipolar(CREATIVE_DIMENSIONS),
  },
  STRENGTHS: {
    id: 'STRENGTHS',
    name: 'Silné stránky',
    shortName: 'Strengths',
    icon: '◆',
    color: '#264653',
    type: 'unipolar',
    route: '/test/strengths',
    dimensions: mapUnipolar(STRENGTHS_DIMENSIONS),
  },
  CAREER: {
    id: 'CAREER',
    name: 'Kariérní preference',
    shortName: 'Kariéra',
    icon: '◇',
    color: '#E07A5F',
    type: 'unipolar',
    route: '/test/career',
    dimensions: mapUnipolar(CAREER_DIMENSIONS),
  },
  COGNITIVE: {
    id: 'COGNITIVE',
    name: 'Kognitivní styl',
    shortName: 'Kognitivní styl',
    icon: '◬',
    color: '#3D405B',
    type: 'bipolar',
    route: '/test/cognitive',
    dimensions: mapBipolar(COGNITIVE_DIMENSIONS),
  },
};
