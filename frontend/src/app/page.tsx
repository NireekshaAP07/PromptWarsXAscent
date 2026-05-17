/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Upload, FileText, Sparkles, ArrowRight, AlertTriangle, BookOpen, Sun, Moon } from "lucide-react";
import { PRESETS } from "@/lib/presets";
import AICopilot from "@/components/AICopilot";

export default function Home() {
  const router = useRouter();
  const [contractText, setContractText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load and apply initial client theme preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      console.error("Theme setup error", e);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handlePresetSelect = async (presetId: string) => {
    setIsLoading(true);
    setLoadingStep("Extracting clauses from preset...");
    setErrorMsg("");
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId })
      });
      
      if (!response.ok) throw new Error("Failed to load preset analysis.");
      
      const analysisData = await response.json();
      sessionStorage.setItem("lexguard_analysis", JSON.stringify(analysisData));
      sessionStorage.setItem("lexguard_contract_text", PRESETS.find(p => p.id === presetId)?.rawText || "");
      
      setLoadingStep("Generating risk report card...");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMsg("Error loading analysis: " + error.message);
    }
  };

  const handleSubmitCustom = async () => {
    if (!contractText.trim()) {
      setErrorMsg("Please paste some contract text or upload a document first.");
      return;
    }
    
    setIsLoading(true);
    setLoadingStep("Uploading document to LexGuard Security Sandbox...");
    setErrorMsg("");
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: contractText })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze contract text.");
      }
      
      const analysisData = await response.json();
      sessionStorage.setItem("lexguard_analysis", JSON.stringify(analysisData));
      sessionStorage.setItem("lexguard_contract_text", contractText);
      
      setLoadingStep("Compiling plain-English legal translations...");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMsg(error.message || "Failed to contact analysis server.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg("");
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };
  const handleFileProcess = (file: File) => {
    setErrorMsg("");
    const fileType = file.name.split(".").pop()?.toLowerCase();
    
    if (fileType !== "txt" && fileType !== "docx" && fileType !== "pdf") {
      setErrorMsg("Currently, only plain text (.txt) files are fully supported. Please copy and paste the contents of your PDF/Word document below.");
      return;
    }
    
    if (fileType === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) { setContractText(text); setErrorMsg(""); }
      };
      reader.onerror = () => setErrorMsg("Failed to read the file.");
      reader.readAsText(file);
    } else {
      setErrorMsg(`Please copy all text from your ${fileType.toUpperCase()} file and paste it directly into the input area below!`);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-600 font-sans flex flex-col items-center px-8 lg:px-12 py-16 lg:py-24 overflow-hidden">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      {/* Trustworthy Header */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-24 z-10 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              LexGuard
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all duration-300 relative group overflow-hidden active:scale-95 cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-3 bg-white/60 px-4 py-2 rounded-full border border-slate-200 shadow-sm text-[13px] text-slate-500 font-medium">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Local Sandbox Encryption Active</span>
          </div>
        </div>
      </header>

      {/* Main Core Body */}
      <main className="w-full max-w-7xl flex flex-col items-center z-10">
        
        {isLoading && (
          <div className="fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-[2000] transition-all duration-300">
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-slate-100"></div>
              <div className="absolute inset-0 rounded-full border-2 border-t-blue-600 border-r-transparent border-l-transparent border-b-transparent animate-spin"></div>
              <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight font-display text-slate-900">Analyzing Document</h2>
            <p className="mt-4 text-base text-slate-500 max-w-sm text-center leading-relaxed font-medium">{loadingStep}</p>
          </div>
        )}

        {/* Hero Section */}
        <section className="text-center w-full flex flex-col items-center mb-28 animate-fade-in animate-delay-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-100/50 text-[13px] text-blue-700 font-medium mb-8">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Adversarial Legal Analysis Engine</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-[72px] font-extrabold font-display leading-[1.1] mb-8 tracking-tight text-slate-900">
            Understand your contracts <br className="hidden md:block" />
            <span className="text-blue-600">before you sign.</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl leading-loose max-w-xl font-medium">
            LexGuard acts as your personal legal copilot. Paste any agreement to uncover hidden liabilities and secure friendly counter-proposals instantly.
          </p>
        </section>

        {/* Uploader & Paste Area Card */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-32 animate-fade-in animate-delay-2">
          
          {/* Paste Contract Terminal (Left 7 Cols) */}
          <div className="lg:col-span-7 glass-card p-8 lg:p-10 flex flex-col min-h-[480px] bg-white border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-base font-bold font-display text-slate-900 tracking-wide">Contract Text Editor</span>
              </div>
              <button 
                onClick={() => setContractText("")}
                className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors font-medium"
              >
                Clear text
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[13px] text-slate-500 font-medium mr-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Quick Demo:
              </span>
              {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white hover:shadow-md hover:-translate-y-0.5 text-[12px] font-bold transition-all duration-300 border border-blue-100"
                >
                  {preset.type}
                </button>
              ))}
            </div>
            
            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder="Paste your legal agreement, employee contract, NDA, freelance terms, or privacy policies here..."
              className="flex-1 w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-[14px] font-mono leading-loose text-slate-700 focus:outline-none focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all resize-none placeholder:text-slate-400"
            ></textarea>
            
            {errorMsg && (
              <div className="mt-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-[13px] text-red-600 leading-relaxed font-medium">{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleSubmitCustom}
              disabled={!contractText.trim() || isLoading}
              className="mt-8 glowing-btn w-full py-4 text-base font-medium rounded-2xl"
            >
              Analyze Document <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Drag and Drop Zone & Help Guidelines (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            
            {/* Friendly Drag & Drop Card */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 rounded-3xl border-dashed border-2 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[260px] p-10 ${
                isDragging ? "border-blue-400 bg-blue-50/50" : "border-slate-200 bg-white/50 hover:border-blue-200 hover:bg-slate-50/50"
              }`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt" className="hidden" />
              <div className="p-4 bg-blue-50 rounded-2xl mb-6 text-blue-600">
                <Upload className={`w-7 h-7 ${isDragging ? 'animate-bounce' : ''}`} />
              </div>
              <h3 className="text-base font-bold font-display mb-2 text-slate-900">Upload Document</h3>
              <p className="text-[14px] text-slate-500 max-w-[220px] mb-4 font-medium leading-relaxed">
                Drop your agreement file here or click to browse
              </p>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                Supports .TXT files
              </span>
            </div>

            {/* Trust Assurance Card */}
            <div className="glass-card p-8 bg-slate-50/80 border-slate-100">
              <h3 className="text-base font-bold font-display mb-5 text-slate-900 flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                Trust Promise
              </h3>
              <ul className="text-[13px] text-slate-500 space-y-4 list-none font-medium leading-relaxed">
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                  <span><strong>Zero Storage</strong>: Contracts are analyzed in volatile memory and never saved.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                  <span><strong>Encrypted</strong>: Connections are protected under industry-standard SSL.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Preset Contract Selector Section */}
        <section className="w-full mb-24 lg:mb-32 animate-fade-in animate-delay-3">
          <div className="flex items-center gap-3 mb-16">
            <BookOpen className="w-5 h-5 text-slate-400" />
            <h3 className="text-2xl font-bold font-display text-slate-900 tracking-tight">Demo Presets</h3>
            <span className="text-[11px] text-slate-400 font-medium bg-slate-100 px-3 py-1.5 rounded-full ml-3">
              No login required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {PRESETS.map((preset, index) => (
              <div
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className="relative p-8 lg:p-10 cursor-pointer flex flex-col justify-between min-h-[300px] group overflow-hidden rounded-[24px] bg-white border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.08)] hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Numbered Indicator */}
                <span className="absolute top-8 right-8 text-sm font-bold text-slate-100 font-display group-hover:text-blue-50 transition-colors duration-300 pointer-events-none select-none">
                  0{index + 1}
                </span>

                <div className="relative z-10 flex-1 flex flex-col w-full">
                  {/* TOP: Category label & Title */}
                  <div className="mb-6 w-full pr-4">
                    <span className="block w-full text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-4 transition-colors duration-300 group-hover:text-blue-500 break-words">
                      {preset.type}
                    </span>
                    <h4 className="text-[19px] w-full font-bold font-display text-slate-900 leading-[1.3] group-hover:text-blue-700 transition-colors duration-300 break-words">
                      {preset.name}
                    </h4>
                  </div>
                  
                  {/* MIDDLE: Description with breathing room */}
                  <p className="text-[14px] w-full text-slate-500 leading-relaxed font-medium line-clamp-3 mb-8 break-words">
                    {preset.description}
                  </p>
                </div>

                {/* BOTTOM: Action link */}
                <div className="relative z-10 flex justify-between items-center pt-6 border-t border-slate-100/60 group-hover:border-blue-100/60 transition-colors duration-300 mt-auto">
                  <span className="text-[13px] font-bold flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors duration-300">
                    Run AI Analysis
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer bar */}
      <footer className="w-full max-w-7xl mt-32 lg:mt-48 pt-12 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6 text-[13px] text-slate-400 font-medium z-10">
        <p>© 2026 LexGuard Legal Tech.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Shield</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
        </div>
      </footer>

      {/* AI Legal Assistant Floating Copilot */}
      <AICopilot />
    </div>
  );
}
