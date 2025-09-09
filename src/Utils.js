import {FEATURES, APPS, LABELS, SCORE_MAP, sampleData} from './testData';

export function normalizeData(dataArray) {
  // produce numeric arrays for charts
  return dataArray.map(item => {
    const normalized = { app: item.app };
    FEATURES.forEach(f => {
      normalized[f] = SCORE_MAP[item[f]] ?? 0;
    });
    return normalized;
  });
}

export function categorizeFeature(mlb, others) {
  const mlbScore = SCORE_MAP[mlb] ?? 0;
  const compScores = others.map((o) => SCORE_MAP[o] ?? 0);

  const compGoodGreat = compScores.filter((s) => s >= 1).length;
  const totalGoodGreat = compGoodGreat + (mlbScore >= 1 ? 1 : 0);

  if (mlb === "Bad" && totalGoodGreat <= 2) return "Untapped";
  if ((mlb === "Good" || mlb === "Great") && compGoodGreat === 0) return "Exclusive";
  if (mlb === "Great" && compScores.every((s) => s < 2)) return "Differentiator";
  if (totalGoodGreat > 1) return "Commodity";

  return "";
};

export function compareWithCompetitors(mlb, others) {
  const mlbScore = SCORE_MAP[mlb] ?? 0;
  const compScores = others.map((o) => SCORE_MAP[o] ?? 0);

  const maxComp = Math.max(...compScores);

  if (mlbScore < maxComp) return "Underperforms";
  if (mlbScore === maxComp) return "Meets";
  if (mlbScore > maxComp) return "Exceeds";

  return "";
};