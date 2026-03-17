import { calculateScaleScores, calculateScenarioScores } from '../../lib/scoring';
import { DIMENSIONS } from './creativeData';

/**
 * Analyzuje odpovědi z Alternate Uses úlohy.
 * Vrací: { fluency, flexibility, originality, meta }
 * Vše normalizováno na 0-100.
 */
export function analyzeAltUses(responses, altUsesItems) {
  let totalFluency = 0;
  let totalFlexibility = 0;
  let totalOriginality = 0;
  const allMeta = { totalIdeas: 0, totalBuckets: 0, items: [] };

  responses.forEach(resp => {
    if (!resp || !resp.text) return;
    const config = altUsesItems.find(i => i.id === resp.itemId);
    if (!config) return;

    const lines = resp.text.split("\n").map(l => l.trim()).filter(Boolean);
    const uniqueLines = [...new Set(lines.map(l => l.toLowerCase()))];
    const ideaCount = uniqueLines.length;

    const processedLines = uniqueLines.map(line => {
      let processed = line.toLowerCase();
      processed = processed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return processed.split(/[\s,;.!?()]+/).filter(Boolean);
    });

    const matchedBuckets = new Set();
    const lineBuckets = [];

    processedLines.forEach(tokens => {
      let bestBucket = null;
      let bestScore = 0;

      Object.entries(config.keywordBuckets).forEach(([bucketKey, bucketDef]) => {
        const stems = bucketDef.stems;
        let matchCount = 0;
        tokens.forEach(token => {
          stems.forEach(stem => {
            if (token.includes(stem) || stem.includes(token)) {
              matchCount++;
            }
          });
        });
        if (matchCount > bestScore) {
          bestScore = matchCount;
          bestBucket = bucketKey;
        }
      });

      if (bestBucket && bestScore > 0) {
        matchedBuckets.add(bestBucket);
      }
      lineBuckets.push(bestBucket);
    });

    const bucketCount = matchedBuckets.size;

    const fluency = clamp((ideaCount / 12) * 100, 0, 100);
    const flexibility = clamp((bucketCount / 7) * 100, 0, 100);

    const penaltyWeights = [1.0, 0.7, 0.4, 0.2, 0.1];
    let origSum = 0;
    let origCount = 0;
    const bucketSeenCount = {};

    lineBuckets.forEach((bucket, idx) => {
      const lineTokenCount = processedLines[idx]?.length || 0;
      let score = 1;

      if (bucket && !(bucket in bucketSeenCount)) {
        score += 2;
        bucketSeenCount[bucket] = 0;
      }

      if (bucket) {
        const seenIdx = bucketSeenCount[bucket];
        score *= penaltyWeights[Math.min(seenIdx, penaltyWeights.length - 1)];
        bucketSeenCount[bucket] = (bucketSeenCount[bucket] || 0) + 1;
      }

      if (lineTokenCount > 5) score += 0.5;
      if (lineTokenCount > 8) score += 0.5;

      origSum += score;
      origCount++;
    });

    const avgOrig = origCount > 0 ? origSum / origCount : 0;
    const originality = clamp((avgOrig / 3.5) * 100, 0, 100);

    totalFluency += fluency;
    totalFlexibility += flexibility;
    totalOriginality += originality;
    allMeta.totalIdeas += ideaCount;
    allMeta.totalBuckets += bucketCount;
    allMeta.items.push({ itemId: resp.itemId, ideas: ideaCount, buckets: bucketCount });
  });

  const count = responses.filter(r => r && r.text).length || 1;
  return {
    fluency: totalFluency / count,
    flexibility: totalFlexibility / count,
    originality: totalOriginality / count,
    meta: allMeta
  };
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/**
 * Vypočítá finální skóre ze všech tří zdrojů.
 * scaleAnswers: objekt { itemId: hodnota 1-7 }
 * scenarioAnswers: pole nebo objekt — pro každý scénář index zvolené option (0..3)
 * orderedScaleItems: pole scale položek v pořadí, v jakém byly zobrazeny (z interleaved items)
 */
export function calculateCreativeScores(altUsesResult, scaleAnswers, scenarioAnswers, orderedScaleItems, scenarios) {
  const scaleVals = orderedScaleItems.map(q => scaleAnswers[q.id] ?? 4);
  const likertScores = calculateScaleScores(scaleVals, orderedScaleItems, DIMENSIONS);

  const scenarioSelected = Array.isArray(scenarioAnswers)
    ? scenarioAnswers
    : scenarios.map((_, i) => scenarioAnswers[i] ?? null);
  const scenarioScores = calculateScenarioScores(scenarioSelected, scenarios);

  const scores = {};

  scores.FLUENCY = altUsesResult.fluency;
  scores.FLEXIBILITY = altUsesResult.flexibility;
  scores.ORIGINALITY = (altUsesResult.originality * 0.4) + ((likertScores.ORIGINALITY ?? 50) * 0.3) + ((scenarioScores.ORIGINALITY ?? 50) * 0.3);
  scores.APPLICATION = (likertScores.APPLICATION ?? 50) * 0.6 + (scenarioScores.APPLICATION ?? 50) * 0.4;
  scores.INITIATIVE = (likertScores.INITIATIVE ?? 50) * 0.8 + (scenarioScores.INITIATIVE ?? 50) * 0.2;

  Object.keys(scores).forEach(k => {
    scores[k] = Math.max(0, Math.min(100, Math.round(scores[k])));
  });

  return scores;
}
