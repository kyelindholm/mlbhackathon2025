import { SCORE_MAP } from './testData';
import { GoogleGenAI } from "@google/genai";

async function loadFiles() {
  const promptRes = await fetch('/prompt.txt');
  const prompt = await promptRes.text();

  const instructionsRes = await fetch('/instructions.txt');
  const instructions = await instructionsRes.text();
  return { prompt, instructions };
}

export function normalizeData(dataArray, appFeatures) {
  // produce numeric arrays for charts
  return dataArray.map(item => {
    const normalized = { app: item.app };
    appFeatures.forEach(f => {
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

export async function buildAppData() {
  let data;
  const key = process.env.REACT_APP_GOOGLE_API_KEY;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/1ulKdDP1LUnoaqP1owDV4V2lkYqNbpHp7GK2MeI8Jbq8/values/live_keywords?key=${key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    data = await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }

  // Skip header row
  const rows = data.values.slice(1);

  // Extract distinct apps
  const distinctApps = [...new Set(rows.map(row => row[8]))];

  // Extract distinct features
  const features = rows
    .map(row => row[17] || "")
    .flatMap(cell => cell.split(","))
    .map(word => word.trim())
    .filter(word => word.length > 0);

  const distinctFeatures = [...new Set(features)];

  const appRatings = [];
  const priority = { bad: 1, good: 2, great: 3 };

  distinctApps.forEach(app => {
    const appObj = { app };
    distinctFeatures.forEach(f => appObj[f] = null);
    appObj["Scores"] = null;

    const appRows = rows.filter(row => row[8] === app); // only rows for this app

    appRows.forEach(row => {
      const ratingNum = parseInt(row[1], 10);
      const sentiment = row[2];
      let rowFeatures = (row[17] || "").split(",").map(f => f.trim()).filter(f => f.length > 0);

      if (rowFeatures.length === 0) rowFeatures = ["Scores"];

      let qualitative;
      if (ratingNum <= 2 || sentiment === "negative") qualitative = "Bad";
      else if (ratingNum === 3 || sentiment === "neutral") qualitative = "Good";
      else qualitative = "Great";

      rowFeatures.forEach(feature => {
        const existing = appObj[feature];
        if (!existing || priority[qualitative.toLowerCase()] > priority[existing.toLowerCase()]) {
          appObj[feature] = qualitative;
        }
      });
    });

    appRatings.push(appObj);
  });

  // Filter out app objects that only have 'Scores' set and all other features are null
  const filteredAppRatings = appRatings.filter(appObj => {
    // Get all feature keys (excluding 'app' and 'Scores')
    const featureKeys = Object.keys(appObj).filter(k => k !== 'app' && k !== 'Scores');
    // If at least one feature is not null, keep it
    return featureKeys.some(f => appObj[f] !== null);
  });

  // Replace any remaining null feature values with 'Bad'
  const filledAppRatings = filteredAppRatings.map(appObj => {
    const newObj = { ...appObj };
    Object.keys(newObj).forEach(key => {
      if (key !== 'app' && key !== 'Scores' && newObj[key] === null) {
        newObj[key] = 'Bad';
      }
    });
    return newObj;
  });

  return {'appRatings': filledAppRatings, 
          'appFeatures': distinctFeatures,
          'apps': distinctApps};
}

export async function fetchGeminiResponse(spreadsheetData) {
  let { prompt, instructions } = await loadFiles();
  const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GOOGLE_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt + "\n\n" + JSON.stringify(spreadsheetData),
    config: {
      systemInstruction: instructions
    }
  });
  console.log("Gemini response:", response.text);
  return response.text;
}