import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Search, ExternalLink } from "lucide-react";
import { getScanHistory } from "../services/api";

export default function History() {
  const [scans, setScans] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScanHistory()
      .then((data) => setScans(data.scans || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = scans.filter((s) => {
    const matchesQuery = s.url.toLowerCase().includes(query.toLowerCase()) || s.domain.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const exportFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleExportCSV = () => {
    const rows = [["ID", "URL", "Domain", "Risk Score", "Status", "Scanned At (UTC)"]];
    filtered.forEach((s) => rows.push([s.scan_id, `"${s.url}"`, s.domain, s.risk_score, s.status, s.scanned_at]));
    exportFile(rows.map((r) => r.join(",")).join("\n"), "phishguard-history.csv", "text/csv");
  };

  const handleExportJSON = () => {
    exportFile(JSON.stringify(filtered, null, 2), "phishguard-history.json", "application/json");
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Scan History & Audit Log</h1>
          <p className="text-slate-400 text-sm">Filter past URL evaluations or export threat reports.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleExportJSON} className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer">
            <Download className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by URL or domain..." className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200">
          <option value="ALL">All Risk Levels</option>
          <option value="Low Risk">Low Risk</option>
          <option value="Suspicious">Suspicious</option>
          <option value="High Risk">High Risk</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading scan history...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">No matching scan records found.</div>
      ) : (
        <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Target URL</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((s) => (
                <tr key={s.scan_id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono text-slate-400">#{s.scan_id}</td>
                  <td className="py-3 px-4 font-mono text-slate-200 max-w-md truncate">{s.url}</td>
                  <td className="py-3 px-4 font-bold">{s.risk_score}/100</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.status === "High Risk" ? "bg-red-500/15 text-red-400" : s.status === "Suspicious" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/scan/${s.scan_id}`} className="inline-flex items-center gap-1 text-emerald-400 hover:underline text-xs">
                      View <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
