import { useState, useMemo, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarRadiusAxis, ResponsiveContainer, Tooltip} from 'recharts';
import {FEATURES, APPS, LABELS, SCORE_MAP, sampleData} from './testData';
import { normalizeData, categorizeFeature, compareWithCompetitors} from "./Utils";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './HomeContent';
import NextSteps from './NextSteps';

export default function App() {
  const [data, setData] = useState(() => {
    // fill missing apps with Bad defaults if not provided
    const base = APPS.map(app => {
      const found = sampleData.find(d => d.app === app);
      if (found) return found;
      const empty = { app };
      FEATURES.forEach(f => empty[f] = 'Bad');
      return empty;
    });
    return base;
  });

  const numeric = useMemo(() => normalizeData(data), [data]);

  function exportSampleCSV() {
    // Header: Feature, all apps, Classification, Fan Expectation, Strategic Action
    const header = ['Feature', ...data.map(d => d.app), 'Classification', 'Fan Expectation', 'Strategic Action'];
    const rows = FEATURES.map(feature => {
      const mlbRow = data.find(d => d.app === 'MLB');
      const mlbScore = mlbRow ? mlbRow[feature] : 'Bad';
      const others = data.filter(d => d.app !== 'MLB').map(d => d[feature]);
      const classification = categorizeFeature(mlbScore, others);
      const fanExpectation = compareWithCompetitors(mlbScore, others);
      let strategicAction = '';
      if (classification === 'Exclusive') {
        if (fanExpectation === 'Exceeds' || fanExpectation === 'Meets') strategicAction = 'Protect & Promote';
        else if (fanExpectation === 'Underperforms') strategicAction = 'Urgent Fix';
      } else if (classification === 'Differentiator') {
        if (fanExpectation === 'Exceeds') strategicAction = 'Double Down';
        else if (fanExpectation === 'Meets') strategicAction = 'Maintain Edge';
        else if (fanExpectation === 'Underperforms') strategicAction = 'Recover Advantage';
      } else if (classification === 'Commodity') {
        if (fanExpectation === 'Exceeds') strategicAction = 'Efficiency Play';
        else if (fanExpectation === 'Meets') strategicAction = 'Stay Even';
        else if (fanExpectation === 'Underperforms') strategicAction = 'Close Gap';
      } else if (classification === 'Untapped' && fanExpectation === 'Underperforms') {
        strategicAction = 'Explore Opportunity';
      }
      return [
        feature,
        ...data.map(d => d[feature]),
        classification,
        fanExpectation,
        strategicAction
      ];
    });
    // Wrap each field in double quotes to handle commas/newlines in feature names
    const csv = [header, ...rows]
      .map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mlb-app-comparator-table.csv';
    a.click();
  }

  // Prepare heatmap data for a selected feature
  const [selectedFeature, setSelectedFeature] = useState('Scores');
  const heatmapData = numeric.map(d => ({ app: d.app, value: d[selectedFeature] }));

  // Prepare radar chart for selected app
  const [selectedApps, setSelectedApps] = useState(sampleData.map(d => d.app));
  const [chartData, setChartData] = useState([]);
  const radarData = FEATURES.map(f => ({ feature: f, value: numeric.find(n => n.app === selectedApps[0])?.[f] ?? 0 }));

  const colorForScore = (s) => {
    switch(s){
      case 2: return '#16a34a'; // green for Great
      case 1: return '#f59e0b'; // amber for Good
      default: return '#ef4444'; // red for Bad
    }
  }

  // Always assign a fixed color to each app based on its index in sampleData
  const colors = ['#2563eb', '#10b981', '#f97316', '#ef4444', '#c426b7ff', '#f6e75cff'];
  const colorForApp = (appName) => {
    const idx = sampleData.findIndex(d => d.app === appName);
    return colors[idx % colors.length];
  };

   useEffect(() => {
    // Start with an array of objects for each feature
    const transformedData = FEATURES.map(feature => ({
      feature: feature,
    }));

    // Add the score for each selected app to the corresponding feature object
    selectedApps.forEach(appName => {
      const appData = sampleData.find(d => d.app === appName);
      if (appData) {
        FEATURES.forEach(feature => {
          transformedData.find(f => f.feature === feature)[appName] = SCORE_MAP[appData[feature]];
        });
      }
    });
    setChartData(transformedData);
  }, [selectedApps]);

    const handleCheckboxChange = (appName) => {
    setSelectedApps(prevSelectedApps => {
      if (prevSelectedApps.includes(appName)) {
        // If the app is already selected, remove it
        return prevSelectedApps.filter(app => app !== appName);
      } else {
        // If it's not selected, add it
        return [...prevSelectedApps, appName];
      }
    });
  };

  return (
    <Router>
      <div className="p-6 max-w-7xl mx-auto">
        <Header exportSampleCSV={exportSampleCSV} />
        <Routes>
          <Route path="/" element={
          <Home
            data={sampleData}
            colorForScore={colorForScore}
            selectedFeature={selectedFeature}
            setSelectedFeature={setSelectedFeature}
            heatmapData={heatmapData}
            selectedApps={selectedApps}
            handleCheckboxChange={handleCheckboxChange}
            colorForApp={colorForApp}
            chartData={chartData}
          />}/>
          <Route path="/next-steps" element={<NextSteps/>} />
        </Routes>


        
      </div>
    </Router>
  );
}
