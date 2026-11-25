import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle, ShieldX, ArrowRight } from "lucide-react";

export default function ScanResultCard({ result }) {
  if (!result) return null;

  const badgeStyle =
    result.status === "High Risk"
      ? "bg-red-500/15 text-red-400 border-red-500/40"
      : result.status === "Suspicious"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/40"
      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/40";

  const scoreColor =
    result.status === "High Risk"
      ? "text-red-400"
      : result.status === "Suspicious"
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Analyzed Target</p>
          <p className="text-lg font-mono text-white break-all mt-1">{result.url}</p>
          <p className="text-sm text-slate-400 mt-1">
            Domain: <span className="text-slate-200 font-medium">{result.domain}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400">Risk Score</p>
            <p className={`text-3xl font-extrabold ${scoreColor}`}>{result.risk_score}/100</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${badgeStyle}`}>
            {result.status}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Detected Phishing Indicators ({result.indicators.length})
        </h3>

        {result.indicators.length === 0 ? (
          <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>No obvious heuristic phishing indicators were triggered for this URL string.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {result.indicators.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  {item.severity === "High" ? (
                    <ShieldX className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-100">{item.rule}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded shrink-0">
                  +{item.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Recommended Action</h3>
        <p className="text-sm text-slate-400 mt-2">
          {result.status === "High Risk"
            ? "Avoid this link and do not enter credentials or personal information."
            : result.status === "Suspicious"
            ? "Verify the sender and destination independently before continuing."
            : "No suspicious heuristic indicators were detected, but still verify unfamiliar links before use."}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
        <span className="text-xs text-slate-500">Scan ID: #{result.scan_id}</span>
        <Link
          to={`/scan/${result.scan_id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          <span>View Detailed Scan Report</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
