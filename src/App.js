import './App.css';

import { useState, useMemo, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import Papa from 'papaparse';
import { Download } from 'lucide-react';

const FEATURES = [
  'Scores', 'Video Streaming', 'Audio Streaming', 'Live Activities', 'Gameday/Gamecast',
  'Real Time Highlights', 'Special Events\n(HRD, ASG, Postseason)', 'Video On Demand', 'Basic Stats', 'Advanced Stats',
  'Player Info (Stats)', 'Standings', 'Schedule', 'News', 'Prospect Content',
  'Favorite Team', 'Follow Players', 'Follow Teams', 'Podcasts', 'Gaming (FTP)', 'Betting',
  'Club Information', 'Game Notifications', 'Social Content', 'Search', 'Vertical Video Explore',
  'Fan Content (Community)', 'Japanese Support'
];

const APPS = [
  'MLB', 'ESPN', 'theScore', 'Real Sports', 'The Athletic', 'Apple Sports'
];

// map Bad/Good/Great -> numeric score };
const LABELS = ['Bad','Good','Great'];
const SCORE_MAP = { Bad: 0, Good: 1, Great: 2 };


const sampleData = [
  {
    app: 'MLB',
    Scores: 'Great',
    'Video Streaming': 'Great',
    'Audio Streaming': 'Great',
    'Live Activities': 'Good',
    'Gameday/Gamecast': 'Great',
    'Real Time Highlights': 'Great',
    'Special Events\n(HRD, ASG, Postseason)': 'Great',
    'Video On Demand': 'Great',
    'Basic Stats': 'Great',
    'Advanced Stats': 'Great',
    'Player Info (Stats)': 'Great',
    'Standings': 'Great',
    'Schedule': 'Great',
    'News': 'Good',
    'Prospect Content': 'Great',
    'Favorite Team': 'Great',
    'Follow Players': 'Great',
    'Follow Teams': 'Good',
    'Podcasts': 'Bad',
    'Gaming (FTP)': 'Good',
    'Betting': 'Bad',
    'Club Information': 'Great',
    'Game Notifications': 'Good',
    'Player Notifications': 'Good',
    'News Notifications': 'Great',
    'Social Content': 'Bad',
    'Search': 'Bad',
    'Vertical Video Explore': 'Bad',
    'Fan Content (Community)': 'Bad',
    'Japanese Support': 'Bad'
  },
  {
    app: 'ESPN',
    Scores: 'Great',
    'Video Streaming': 'Bad',
    'Audio Streaming': 'Bad',
    'Live Activities': 'Great',
    'Gameday/Gamecast': 'Good',
    'Real Time Highlights': 'Bad',
    'Special Events\n(HRD, ASG, Postseason)': 'Good',
    'Video On Demand': 'Good',
    'Basic Stats': 'Great',
    'Advanced Stats': 'Bad',
    'Player Info (Stats)': 'Great',
    'Standings': 'Great',
    'Schedule': 'Great',
    'News': 'Good',
    'Prospect Content': 'Bad',
    'Favorite Team': 'Great',
    'Follow Players': 'Good',
    'Follow Teams': 'Good',
    'Podcasts': 'Good',
    'Gaming (FTP)': 'Bad',
    'Betting': 'Great',
    'Club Information': 'Good',
    'Game Notifications': 'Good',
    'Player Notifications': 'Bad',
    'News Notifications': 'Great',
    'Social Content': 'Bad',
    'Search': 'Good',
    'Vertical Video Explore': 'Good',
    'Fan Content (Community)': 'Bad',
    'Japanese Support': 'Good'
  },
  {
    app: 'theScore',
    Scores: 'Great',
    'Video Streaming': 'Bad',
    'Audio Streaming': 'Bad',
    'Live Activities': 'Good',
    'Gameday/Gamecast': 'Good',
    'Real Time Highlights': 'Bad',
    'Special Events\n(HRD, ASG, Postseason)': 'Good',
    'Video On Demand': 'Good',
    'Basic Stats': 'Good',
    'Advanced Stats': 'Bad',
    'Player Info (Stats)': 'Great',
    'Standings': 'Great',
    'Schedule': 'Great',
    'News': 'Good',
    'Prospect Content': 'Bad',
    'Favorite Team': 'Great',
    'Follow Players': 'Great',
    'Follow Teams': 'Great',
    'Podcasts': 'Bad',
    'Gaming (FTP)': 'Bad',
    'Betting': 'Good',
    'Club Information': 'Good',
    'Game Notifications': 'Great',
    'Player Notifications': 'Great',
    'News Notifications': 'Great',
    'Social Content': 'Good',
    'Search': 'Good',
    'Vertical Video Explore': 'Bad',
    'Fan Content (Community)': 'Good',
    'Japanese Support': 'Good'
  },
  {
    app: 'Real Sports',
    Scores: 'Great',
    'Video Streaming': 'Bad',
    'Audio Streaming': 'Bad',
    'Live Activities': 'Bad',
    'Gameday/Gamecast': 'Good',
    'Real Time Highlights': 'Bad',
    'Special Events\n(HRD, ASG, Postseason)': 'Bad',
    'Video On Demand': 'Good',
    'Basic Stats': 'Good',
    'Advanced Stats': 'Bad',
    'Player Info (Stats)': 'Great',
    'Standings': 'Good',
    'Schedule': 'Great',
    'News': 'Bad',
    'Prospect Content': 'Bad',
    'Favorite Team': 'Good',
    'Follow Players': 'Good',
    'Follow Teams': 'Good',
    'Podcasts': 'Bad',
    'Gaming (FTP)': 'Good',
    'Betting': 'Bad',
    'Club Information': 'Good',
    'Game Notifications': 'Great',
    'Player Notifications': 'Great',
    'News Notifications': 'Bad',
    'Social Content': 'Good',
    'Search': 'Good',
    'Vertical Video Explore': 'Good',
    'Fan Content (Community)': 'Good',
    'Japanese Support': 'Good'
  },
  {
    app: 'The Athletic',
    Scores: 'Great',
    'Video Streaming': 'Bad',
    'Audio Streaming': 'Bad',
    'Live Activities': 'Bad',
    'Gameday/Gamecast': 'Good',
    'Real Time Highlights': 'Bad',
    'Special Events\n(HRD, ASG, Postseason)': 'Bad',
    'Video On Demand': 'Bad',
    'Basic Stats': 'Bad',
    'Advanced Stats': 'Bad',
    'Player Info (Stats)': 'Good',
    'Standings': 'Great',
    'Schedule': 'Great',
    'News': 'Great',
    'Prospect Content': 'Bad',
    'Favorite Team': 'Great',
    'Follow Players': 'Bad',
    'Follow Teams': 'Bad',
    'Podcasts': 'Great',
    'Gaming (FTP)': 'Bad',
    'Betting': 'Good',
    'Club Information': 'Great',
    'Game Notifications': 'Good',
    'Player Notifications': 'Bad',
    'News Notifications': 'Great',
    'Social Content': 'Bad',
    'Search': 'Good',
    'Vertical Video Explore': 'Bad',
    'Fan Content (Community)': 'Bad',
    'Japanese Support': 'Bad'
  },
  {
    app: 'Apple Sports',
    Scores: 'Great',
    'Video Streaming': 'Bad',
    'Audio Streaming': 'Bad',
    'Live Activities': 'Great',
    'Gameday/Gamecast': 'Bad',
    'Real Time Highlights': 'Bad',
    'Special Events\n(HRD, ASG, Postseason)': 'Bad',
    'Video On Demand': 'Bad',
    'Basic Stats': 'Bad',
    'Advanced Stats': 'Bad',
    'Player Info (Stats)': 'Bad',
    'Standings': 'Good',
    'Schedule': 'Bad',
    'News': 'Bad',
    'Prospect Content': 'Bad',
    'Favorite Team': 'Great',
    'Follow Players': 'Bad',
    'Follow Teams': 'Bad',
    'Podcasts': 'Bad',
    'Gaming (FTP)': 'Bad',
    'Betting': 'Bad',
    'Club Information': 'Bad',
    'Game Notifications': 'Bad',
    'Player Notifications': 'Bad',
    'News Notifications': 'Bad',
    'Social Content': 'Bad',
    'Search': 'Bad',
    'Vertical Video Explore': 'Bad',
    'Fan Content (Community)': 'Bad',
    'Japanese Support': 'Bad'
  }
];

function normalizeData(dataArray) {
  // produce numeric arrays for charts
  return dataArray.map(item => {
    const normalized = { app: item.app };
    FEATURES.forEach(f => {
      normalized[f] = SCORE_MAP[item[f]] ?? 0;
    });
    return normalized;
  });
}

function categorizeFeature(mlb, others) {
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

function compareWithCompetitors(mlb, others) {
  const mlbScore = SCORE_MAP[mlb] ?? 0;
  const compScores = others.map((o) => SCORE_MAP[o] ?? 0);

  const maxComp = Math.max(...compScores);

  if (mlbScore < maxComp) return "Underperforms";
  if (mlbScore === maxComp) return "Meets";
  if (mlbScore > maxComp) return "Exceeds";

  return "";
};

export default function MLBComparator() {
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

  function handleCSVUpload(file) {
    Papa.parse(file, {
      header: true,
      complete: (res) => {
        const rows = res.data.filter(r => r.app);
        // assume CSV columns: app, feature1, feature2, ... with Bad/Good/Great text
        setData(rows.map(r => {
          const out = { app: r.app };
          FEATURES.forEach(f => out[f] = r[f] ?? 'Bad');
          return out;
        }));
      }
    });
  }

  function exportSampleCSV() {
    const header = ['app', ...FEATURES];
    const rows = data.map(d => header.map(h => d[h] ?? (h === 'app' ? d.app : 'Bad')));
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mlb-app-comparator-sample.csv';
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
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Compass</h1>
        <div className="flex items-center gap-3">
          {/* Primary action button */}
          <button
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition"
            title="Generate next steps"
          >
            Next Steps
          </button>

          {/* Secondary action button */}
          <button
            className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1 transition"
            onClick={exportSampleCSV}
          >
            Download CSV
          </button>

          {/* File upload styled as button */}
          <label className="relative px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 cursor-pointer transition">
            Upload CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleCSVUpload(e.target.files[0])}
            />
  </label>
</div>
      </header>


      <section className="mt-6 bg-white p-4 my-4 rounded-lg shadow">
        <h2 className="font-medium mb-2">Full Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-2 py-1">Feature</th>
                {data.map(d => (
                  <th key={d.app} className="px-2 py-1">{d.app}</th>
                ))}
                <th className="px-2 py-1">Classification</th>
                <th className="px-2 py-1">Fan Expectation</th>
                <th className="px-2 py-1">Strategic Action</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(feature => {
                // Find MLB and others' scores for this feature
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
                return (
                  <tr key={feature} className="border-t">
                    <td className="px-2 py-1 font-medium">{feature}</td>
                    {data.map(d => (
                      <td key={d.app} className="px-2 py-1">
                        <span className="px-2 py-1 rounded text-xs text-white" style={{background: colorForScore(SCORE_MAP[d[feature]] ?? 0)}}>{d[feature]}</span>
                      </td>
                    ))}
                    <td className={
                      "px-2 py-1 " +
                      (classification === 'Exclusive' ? 'text-yellow-500 font-semibold ' : '') +
                      (classification === 'Differentiator' ? 'text-green-600 font-semibold ' : '') +
                      (classification === 'Untapped' ? 'text-gray-400 ' : '')
                    }>
                      {classification}
                    </td>
                    <td className={
                      "px-2 py-1 " +
                      (fanExpectation === 'Meets' ? 'text-green-400 font-semibold ' : '') +
                      (fanExpectation === 'Exceeds' ? 'text-green-700 font-semibold ' : '') +
                      (fanExpectation === 'Underperforms' ? 'text-red-500 font-semibold ' : '')
                    }>
                      {fanExpectation}
                    </td>
                    <td className="px-2 py-1">{strategicAction}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="font-medium mb-2">Feature: {selectedFeature}</h2>
          <div className="flex gap-4 items-center mb-4">
            <select value={selectedFeature} onChange={e=>setSelectedFeature(e.target.value)} className="border rounded p-2">
              {FEATURES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div className="flex gap-2 items-center">
              <span className="text-sm mr-2">Legend:</span>
              <div className="px-2 py-1 rounded text-white text-xs" style={{background:'#ef4444'}}>Bad</div>
              <div className="px-2 py-1 rounded text-white text-xs" style={{background:'#f59e0b'}}>Good</div>
              <div className="px-2 py-1 rounded text-white text-xs" style={{background:'#16a34a'}}>Great</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {heatmapData.map(h => (
              <div key={h.app} className="p-3 rounded border flex items-center justify-between">
                <div>{h.app}</div>
                <div className="px-3 py-1 rounded text-white text-sm" style={{background: colorForScore(h.value)}}>{LABELS[h.value] ?? 'Bad'}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="mt-6 bg-white p-6 rounded-lg shadow">
        <aside className="w-full max-w-7xl mx-auto">
          <h3 className="font-medium mb-4 text-lg">Radar Chart</h3>
          <div style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer>
              <RadarChart data={chartData} outerRadius={175}>
                <PolarGrid stroke="#e5e7eb" />
                {/* <PolarAngleAxis dataKey="feature" stroke="#374151" tick={false} /> */}
                <PolarRadiusAxis domain={[0, 2]} tickCount={3} />
                {/* Map over the selected apps to render a Radar component for each one */}
                {selectedApps.map((appName) => (
                  <Radar
                    key={appName}
                    name={appName}
                    dataKey={appName} // The dataKey now corresponds to the app's name
                    stroke={colorForApp(appName)}
                    fill={colorForApp(appName)}
                    fillOpacity={0.3}
                  />
                ))}
                <Tooltip
                  labelFormatter={(index) => FEATURES[index]}
                  formatter={(value) => LABELS[value] ?? value}
                  itemSorter={(item) => {
                    switch (item) {
                      case 'MLB': return 0;
                    }
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Apps:</label>
            {/* Chunk sampleData into columns of 3 */}
            <div className="flex gap-4">
              {Array.from({ length: Math.ceil(sampleData.length / 3) }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-2">
                  {sampleData.slice(colIdx * 3, colIdx * 3 + 3).map((d) => {
                    const color = selectedApps.includes(d.app) ? colorForApp(d.app) : '#d1d5db';
                    return (
                      <label key={d.app} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedApps.includes(d.app)}
                          onChange={() => handleCheckboxChange(d.app)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span style={{ display: 'inline-block', width: 16, height: 16, background: color, borderRadius: 3, marginRight: 6 }}></span>
                        <span className="text-gray-700">{d.app}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
