import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Globe, Lock, Calendar, Hash } from "lucide-react";
import { getScanById } from "../services/api";
import ScanResultCard from "../components/ScanResultCard";

export default function ScanReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await getScanById(id);
        setReport(data);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load scan report.");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [id]);

  if (loading) {
    return <div className="text-slate-400 text-center py-12">Loading detailed scan report...</div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-500/15 border border-red-500/40 text-red-300 p-4 rounded-lg">{error}</div>
        <Link to="/" className="inline-flex items-center gap-2 text-emerald-400 mt-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Scanner
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Scanner
      </Link>

      <h1 className="text-2xl font-bold text-white">Detailed Security Scan Report</h1>
      <p className="text-slate-400 text-sm mt-1">Full structural breakdown and heuristic rule evaluation.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
          <Hash className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400">Report ID</p>
            <p className="font-mono text-white">#{report.scan_id}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
          <Globe className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400">Extracted Domain</p>
            <p className="font-mono text-white">{report.domain}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400">Protocol & Path</p>
            <p className="font-mono text-white">{report.scheme.toUpperCase()} • {report.path}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400">Scanned Timestamp (UTC)</p>
            <p className="font-mono text-white text-sm">{report.scanned_at}</p>
          </div>
        </div>
      </div>

      <ScanResultCard result={report} />
    </div>
  );
}
