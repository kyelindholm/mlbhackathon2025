import './App.css';

import { useState, useMemo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import Papa from 'papaparse';
import { Download } from 'lucide-react';

const FEATURES = [
  'Scores', 'Video Streaming', 'Audio Streaming', 'Live Activities', 'Gameday/Gamecast',
  'Real Time Highlights', 'Special Events', 'Video On Demand', 'Basic Stats', 'Advanced Stats',
  'Player Info (Stats)', 'Standings', 'Game Schedule', 'News', 'Prospect content',
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
    // random example values — replace by ingested data
    Scores: 'Great',
    'Video Streaming': 'Good',
    'Audio Streaming': 'Good',
    'Live Activities': 'Good',
    'Gameday/Gamecast': 'Great',
    'Real Time Highlights': 'Great',
    'Special Events': 'Good',
    'Video On Demand': 'Good',
    'Basic Stats': 'Great',
    'Advanced Stats': 'Good',
    'Player Info (Stats)': 'Great',
    'Standings': 'Great',
    'Game Schedule': 'Great',
    'News': 'Good',
    'Prospect content': 'Good',
    'Favorite Team': 'Great',
    'Follow Players': 'Good',
    'Follow Teams': 'Good',
    'Podcasts': 'Good',
    'Gaming (FTP)': 'Bad',
    'Betting': 'Good',
    'Club Information': 'Good',
    'Game Notifications': 'Great',
    'Social Content': 'Good',
    'Search': 'Good',
    'Vertical Video Explore': 'Good',
    'Fan Content (Community)': 'Good',
    'Japanese Support': 'Bad'
  },
  {
    app: 'ESPN',
    Scores: 'Great',
    'Video Streaming': 'Great',
    'Audio Streaming': 'Good',
    'Live Activities': 'Good',
    'Gameday/Gamecast': 'Bad',
    'Real Time Highlights': 'Good',
    'Special Events': 'Great',
    'Video On Demand': 'Great',
    'Basic Stats': 'Good',
    'Advanced Stats': 'Bad',
    'Player Info (Stats)': 'Good',
    'Standings': 'Great',
    'Game Schedule': 'Great',
    'News': 'Great',
    'Prospect content': 'Bad',
    'Favorite Team': 'Good',
    'Follow Players': 'Bad',
    'Follow Teams': 'Good',
    'Podcasts': 'Great',
    'Gaming (FTP)': 'Good',
    'Betting': 'Great',
    'Club Information': 'Bad',
    'Game Notifications': 'Good',
    'Social Content': 'Great',
    'Search': 'Great',
    'Vertical Video Explore': 'Great',
    'Fan Content (Community)': 'Good',
    'Japanese Support': 'Good'
  },
  // ... add other sample apps as needed
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
  const [selectedApp, setSelectedApp] = useState('MLB');
  const radarData = FEATURES.map(f => ({ feature: f, value: numeric.find(n => n.app === selectedApp)?.[f] ?? 0 }));

  const colorForScore = (s) => {
    switch(s){
      case 2: return '#16a34a'; // green for Great
      case 1: return '#f59e0b'; // amber for Good
      default: return '#ef4444'; // red for Bad
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">MLB App Comparator</h1>
        <div className="flex items-center gap-2">
          <button className="btn" title="Generate next steps">Next Steps</button>
          <button className="btn" onClick={exportSampleCSV}>Download CSV</button>
          <label className="btn">
            Upload CSV
            <input type="file" accept="text/csv" className="hidden" onChange={(e)=>handleCSVUpload(e.target.files[0])} />
          </label>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="font-medium mb-2">Heatmap — Feature: {selectedFeature}</h2>
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

        <aside className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Radar — {selectedApp}</h3>
          <div style={{ width: '100%', height: 360 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData} outerRadius={110}>
                <PolarGrid />
                <PolarAngleAxis dataKey="feature" tick={false} />
                <PolarRadiusAxis angle={30} domain={[0,2]} tickCount={3} />
                <Radar name={selectedApp} dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                <Tooltip formatter={(val)=>LABELS[val]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <label className="block text-sm">Select app</label>
            <select value={selectedApp} onChange={e=>setSelectedApp(e.target.value)} className="border rounded p-2 w-full">
              {data.map(d => <option key={d.app} value={d.app}>{d.app}</option>)}
            </select>
          </div>

        </aside>
      </section>

      <section className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="font-medium mb-2">Full table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="px-2 py-1">App</th>
                {FEATURES.map(f=> <th key={f} className="px-2 py-1">{f}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map(d=> (
                <tr key={d.app} className="border-t">
                  <td className="px-2 py-1 font-medium">{d.app}</td>
                  {FEATURES.map(f=> (
                    <td key={f} className="px-2 py-1">
                      <span className="px-2 py-1 rounded text-xs text-white" style={{background: colorForScore(SCORE_MAP[d[f]] ?? 0)}}>{d[f]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="font-medium mb-2">How to generate the data (scrape reviews and classify)</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Use a Node script to pull reviews from Google Play and the Apple App Store. Recommended packages: <code>google-play-scraper</code> and <code>app-store-scraper</code> or <code>node-applesearch</code>.</li>
          <li>Save reviews as CSV with columns: <code>app, rating, review, date</code>.</li>
          <li>Run a simple keyword classifier (example below) to assign feature-level sentiment: look for keywords per feature and compute per-feature score from review sentiment + rating.</li>
          <li>Normalize to Bad/Good/Great: e.g. score 0.6 Bad, 0.6-1.4 Good,1.4 Great (tune thresholds).</li>
          <li>Upload the generated CSV using the Upload button above to populate this UI.</li>
        </ol>

        <pre className="mt-3 text-sm bg-gray-100 p-3 rounded overflow-x-auto">{`// Example Node script (conceptual)

const gplay = require('google-play-scraper');
const appstore = require('app-store-scraper');
const fs = require('fs');

async function fetchGoogle(appId){
  return await gplay.reviews({ appId, sort: gplay.sort.NEWEST, num: 200 });
}

async function fetchApple(appId){
  return await appstore.reviews({ appId, sort: 'mostRecent', num: 200 });
}

// save reviews as CSV then run a separate analysis script that maps keywords to features

`}</pre>

        <p className="mt-3 text-sm text-gray-600">If you'd like, I can also provide the exact Node scripts to fetch reviews and a small classifier that searches for feature keywords in review text and outputs the CSV used by this app.</p>
      </section>

    </div>
  );
}
