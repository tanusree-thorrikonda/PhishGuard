import React from "react";

const tones = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  slate: "bg-slate-800 text-slate-300 border-slate-700",
};

export default function StatCard({ label, value, icon: Icon, tone = "slate" }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        {Icon && (
          <div className={`p-2 rounded-lg border ${tones[tone]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="text-3xl font-extrabold text-white mt-3">{value}</p>
    </div>
  );
}