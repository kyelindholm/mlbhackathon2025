import {FEATURES, APPS, LABELS, SCORE_MAP, sampleData} from './testData';
import { Radar, RadarChart, PolarGrid, PolarRadiusAxis, ResponsiveContainer, Tooltip} from 'recharts';
import {categorizeFeature, compareWithCompetitors} from "./Utils";

export default function Home ({ data, colorForScore, selectedFeature, setSelectedFeature, heatmapData, selectedApps, handleCheckboxChange, colorForApp, chartData }) {
    return (
        <div>
            <section className="mt-6 bg-white p-4 my-4 rounded-lg shadow">
            <h2 className="font-medium mb-2">Full Table</h2>
            <div className="overflow-x-auto" style={{minWidth: '1100px'}}>
                <table className="min-w-full text-left" style={{minWidth: '1100px'}}>
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
                        if (fanExpectation === 'Exceeds' || fanExpectation === 'Meets') strategicAction = '✅ Protect & Promote';
                        else if (fanExpectation === 'Underperforms') strategicAction = '🔴 Urgent Fix';
                    } else if (classification === 'Differentiator') {
                        if (fanExpectation === 'Exceeds') strategicAction = '🚀 Double Down';
                        else if (fanExpectation === 'Meets') strategicAction = '🟢 Maintain Edge';
                        else if (fanExpectation === 'Underperforms') strategicAction = '🟠 Recover Advantage';
                    } else if (classification === 'Commodity') {
                        if (fanExpectation === 'Exceeds') strategicAction = '⚪ Efficiency Play';
                        else if (fanExpectation === 'Meets') strategicAction = '⚪ Stay Even';
                        else if (fanExpectation === 'Underperforms') strategicAction = '🟠 Close Gap';
                    } else if (classification === 'Untapped' && fanExpectation === 'Underperforms') {
                        strategicAction = '🔵 Explore Opportunity';
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
                        <td className="px-2 py-1 whitespace-nowrap">{strategicAction}</td>
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
    )
}