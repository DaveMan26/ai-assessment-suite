import { DIMENSIONS, SCALE_ITEMS, FORCED_CHOICE_PAIRS } from './strengthsData';
import { calculateScaleScores } from '../../lib/scoring';

export function calculateForcedChoiceScores(fcAnswers, pairs = FORCED_CHOICE_PAIRS) {
  const chosen = {};
  const total = {};

  Object.keys(DIMENSIONS).forEach(dim => {
    chosen[dim] = 0;
    total[dim] = 0;
  });

  pairs.forEach(pair => {
    const { optionA, optionB } = pair;
    total[optionA.dim] += 1;
    total[optionB.dim] += 1;

    const answer = fcAnswers?.[pair.id];
    if (answer === 'A') {
      chosen[optionA.dim] += 1;
    } else if (answer === 'B') {
      chosen[optionB.dim] += 1;
    }
  });

  const scores = {};
  Object.keys(DIMENSIONS).forEach(dim => {
    scores[dim] = total[dim] > 0 ? (chosen[dim] / total[dim]) * 100 : 50;
  });
  return scores;
}

export function calculateStrengthsScores(likertAnswers, fcAnswers) {
  const orderedScaleItems = SCALE_ITEMS.slice();
  const scaleVals = orderedScaleItems.map(item => {
    const raw = likertAnswers?.[item.id];
    return raw != null ? raw : 4;
  });

  const likertScores = calculateScaleScores(scaleVals, orderedScaleItems, DIMENSIONS);
  const fcScores = calculateForcedChoiceScores(fcAnswers, FORCED_CHOICE_PAIRS);

  const merged = {};
  Object.keys(DIMENSIONS).forEach(dim => {
    const l = likertScores[dim] ?? 0;
    const f = fcScores[dim] ?? 0;
    merged[dim] = Math.round(l * 0.8 + f * 0.2);
  });
  return merged;
}

export function identifySignatureStrengths(scores) {
  const dims = Object.keys(scores);
  if (dims.length === 0) return [];

  const personalAvg =
    dims.reduce((sum, d) => sum + (scores[d] ?? 0), 0) / dims.length;

  const ranked = dims
    .map(dim => ({
      dim,
      score: scores[dim] ?? 0,
      deviation: (scores[dim] ?? 0) - personalAvg
    }))
    .sort((a, b) => b.score - a.score);

  return ranked.map((item, index) => {
    let category;
    if (index < 2 && item.deviation >= 3) {
      category = 'signature';
    } else if (index < 4 && item.deviation >= 0) {
      category = 'supporting';
    } else if (item.deviation >= -3) {
      category = 'neutral';
    } else {
      category = 'dormant';
    }

    return {
      ...item,
      rank: index + 1,
      category
    };
  });
}

