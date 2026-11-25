import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-400">
          <ShieldAlert className="w-6 h-6" />
          <span>PhishGuard</span>
        </Link>
        <div className="flex gap-6 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition">URL Scanner</Link>
          <Link to="/history" className="hover:text-white transition">Scan History</Link>
          <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link to="/about" className="hover:text-white transition">Methodology</Link>
        </div>
      </div>
    </nav>
  );
}
