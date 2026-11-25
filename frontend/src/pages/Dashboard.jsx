import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ShieldCheck, AlertTriangle, ShieldX, Activity } from "lucide-react";
import { getScanStats, getScanHistory } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    getScanStats().then(setStats);
    getScanHistory().then((d) => setRecent((d.scans || []).slice(0, 8).reverse()));
  }, []);

  if (!stats) return <div className="text-slate-400 text-sm">Loading threat analytics...</div>;

  const pieData = [
    { name: "Low Risk", value: stats.low_risk, color: "#10b981" },
    { name: "Suspicious", value: stats.suspicious, color: "#f59e0b" },
    { name: "High Risk", value: stats.high_risk, color: "#ef4444" }
  ];

  const barData = recent.map((s) => ({ name: `#${s.scan_id}`, score: s.risk_score }));
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Threat Analytics Dashboard</h1>
      <p className="text-slate-400 text-sm mt-1">Real-time summary of analyzed URLs and risk distribution.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs"><span>Total Scans</span><Activity className="w-4 h-4 text-emerald-400" /></div>
          <p className="text-3xl font-extrabold text-white mt-2">{stats.total_scans}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs"><span>Low Risk</span><ShieldCheck className="w-4 h-4 text-emerald-400" /></div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">{stats.low_risk}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs"><span>Suspicious</span><AlertTriangle className="w-4 h-4 text-amber-400" /></div>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">{stats.suspicious}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs"><span>High Risk (Avg: {stats.average_risk_score})</span><ShieldX className="w-4 h-4 text-red-400" /></div>
          <p className="text-3xl font-extrabold text-red-400 mt-2">{stats.high_risk}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase mb-4">Risk Classification Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                  {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase mb-4">Recent Scan Risk Scores</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
