import { useState } from "react";
import { Search, Shield } from "lucide-react";
import { scanUrl } from "../services/api";
import ScanResultCard from "../components/ScanResultCard";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a URL to analyze.");
      return;
    }

    try {
      setLoading(true);
      const data = await scanUrl(url);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to connect to PhishGuard backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>Static URL Heuristic Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Inspect Suspicious Links Safely
        </h1>
        <p className="text-slate-400 mt-3 text-sm sm:text-base">
          Paste any URL below to analyze its structure, domain patterns, and phishing risk indicators without visiting the destination site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., http://192.168.1.50/paypal-login-verify.tk"
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:outline-none rounded-lg pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Scanning..." : "Scan URL"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-400">
          <span>Try examples:</span>
          <button
            type="button"
            onClick={() => setUrl("https://www.github.com")}
            className="text-emerald-400 hover:underline cursor-pointer"
          >
            Safe URL
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setUrl("http://secure-login.paypal-account-update.xyz/verify")}
            className="text-amber-400 hover:underline cursor-pointer"
          >
            Phishing Sample
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/15 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </form>

      <div className="max-w-3xl mx-auto">
        <ScanResultCard result={result} />
      </div>
    </div>
  );
}
