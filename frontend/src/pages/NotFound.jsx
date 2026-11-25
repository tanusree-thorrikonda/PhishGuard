import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-extrabold text-emerald-400">404</h1>
      <p className="text-slate-300 mt-3">The requested PhishGuard page does not exist.</p>
      <Link to="/" className="inline-block mt-6 bg-emerald-500 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm">
        Return to URL Scanner
      </Link>
    </div>
  );
}
