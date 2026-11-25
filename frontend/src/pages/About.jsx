import { Shield, Lock, Eye, Cpu } from "lucide-react";

export default function About() {
  const rules = [
    { icon: Lock, title: "Protocol & Port Inspection", desc: "Flags unencrypted HTTP traffic and non-standard ports (:8080, :4444) frequently used by phishing kits." },
    { icon: Eye, title: "Homograph & Typosquatting Detection", desc: "Detects Punycode (xn--) domains, character substitutions (paypa1, g00gle), and unauthorized brand names." },
    { icon: Cpu, title: "Structural & Keyword Heuristics", desc: "Evaluates raw IPv4 hosts, '@' redirection tricks, excessive subdomains, high-risk TLDs, and credential lures." }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-3">
        <Shield className="w-3.5 h-3.5" />
        <span>Detection Methodology & Security Guide</span>
      </div>
      <h1 className="text-3xl font-bold text-white">How PhishGuard Evaluates URLs</h1>
      <p className="text-slate-400 mt-2 text-sm leading-relaxed">
        PhishGuard performs zero-execution static lexical analysis on suspicious links—inspecting URL syntax without ever sending network requests to potentially malicious servers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {rules.map((r, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <r.icon className="w-6 h-6 text-emerald-400 mb-3" />
            <h2 className="font-semibold text-white">{r.title}</h2>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
