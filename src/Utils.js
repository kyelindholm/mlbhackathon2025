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

  const priority = { Bad: 1, Good: 2, Great: 3 };
  const reversePriority = { 1: 'Bad', 2: 'Good', 3: 'Great' };
  const appRatings = [];

  distinctApps.forEach(app => {
    const appObj = { app };
    distinctFeatures.forEach(f => appObj[f] = null);

    const appRows = rows.filter(row => row[8] === app);

    // Initialize a feature rating accumulator
    const featureScores = {};
    distinctFeatures.forEach(f => featureScores[f] = []);

    appRows.forEach(row => {
      const ratingNum = parseInt(row[1], 10);
      const sentiment = row[5];
      const rowFeatures = (row[17] || "").split(",").map(f => f.trim()).filter(f => f.length > 0);

      let qualitative;
      if (ratingNum <= 2 || sentiment === "negative") qualitative = "Bad";
      else if (ratingNum === 3 || sentiment === "neutral") qualitative = "Good";
      else qualitative = "Great";

      rowFeatures.forEach(feature => {
        featureScores[feature].push(priority[qualitative]);
      });
    });

    // Compute average per feature and assign qualitative rating
    Object.keys(featureScores).forEach(feature => {
      const scores = featureScores[feature];
      if (scores.length > 0) {
        let avg = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Apply MLB bump
        if (app === "MLB") avg += 0.5; 

        // Ensure avg doesn't exceed 3
        if (avg > 3) avg = 3;

        // Assign qualitative based on thresholds
        if (avg < 1.5) appObj[feature] = 'Bad';
        else if (avg < 2.5) appObj[feature] = 'Good';
        else appObj[feature] = 'Great';
      } else {
        appObj[feature] = 'Bad';
      }
    });

    appRatings.push(appObj);
  });

  return {
    appRatings,
    appFeatures: distinctFeatures,
    apps: distinctApps
  };
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