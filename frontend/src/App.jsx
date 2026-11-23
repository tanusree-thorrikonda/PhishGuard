import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ScanReport from "./pages/ScanReport";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan/:id" element={<ScanReport />} />
            <Route path="/history" element={<div className="text-slate-400">Scan History (Day 15)</div>} />
            <Route path="/dashboard" element={<div className="text-slate-400">Analytics Dashboard (Days 16–17)</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
