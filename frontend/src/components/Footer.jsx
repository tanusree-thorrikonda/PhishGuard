import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-6 px-6 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>PhishGuard – Static URL Threat Analysis Platform</p>
        <p className="text-slate-500">
          Disclaimer: Risk scores are heuristic indicators, not guaranteed safety. HTTPS alone does not prove legitimacy.
        </p>
      </div>
    </footer>
  );
}
