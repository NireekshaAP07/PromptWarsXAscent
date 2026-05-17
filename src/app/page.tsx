"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Upload, FileText, Sparkles, HelpCircle, FileCheck, ArrowRight, AlertTriangle } from "lucide-react";
import { PRESETS } from "@/lib/presets";

export default function Home() {
  const router = useRouter();
  const [contractText, setContractText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Preset Clicks (instant transition)
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
      
      if (!response.ok) {
        throw new Error("Failed to load preset analysis.");
      }
      
      const analysisData = await response.json();
      
      // Store in session storage to pass to dashboard
      sessionStorage.setItem("lexguard_analysis", JSON.stringify(analysisData));
      sessionStorage.setItem("lexguard_contract_text", PRESETS.find(p => p.id === presetId)?.rawText || "");
      
      setLoadingStep("Generating risk report card...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
      
    } catch (error: any) {
      setIsLoading(false);
      setErrorMsg("Error loading analysis: " + error.message);
    }
  };

  // Handle Custom Contract Submission
  const handleSubmitCustom = async () => {
    if (!contractText.trim()) {
      setErrorMsg("Please paste some contract text or upload a document first.");
      return;
    }
    
    setIsLoading(true);
    setLoadingStep("Uploading document to LexGuard API...");
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
      
      setLoadingStep("Compiling adversarial legal warnings...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
      
    } catch (error: any) {
      setIsLoading(false);
      setErrorMsg(error.message || "Failed to contact analysis server.");
    }
  };

  // File Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg("");
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleFileProcess = (file: File) => {
    setErrorMsg("");
    const fileType = file.name.split(".").pop()?.toLowerCase();
    
    if (fileType !== "txt" && fileType !== "docx" && fileType !== "pdf") {
      setErrorMsg("Currently, only plain text (.txt) files are fully supported for drag & drop. Please copy and paste the contents of your PDF/Word document below.");
      return;
    }
    
    if (fileType === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          setContractText(text);
          setErrorMsg("");
        }
      };
      reader.onerror = () => {
        setErrorMsg("Failed to read the file.");
      };
      reader.readAsText(file);
    } else {
      setErrorMsg(`We detected a .${fileType} file. To ensure 100% accuracy and zero parsing issues in our sandbox, please copy all text from your ${fileType.toUpperCase()} file and paste it directly into the input area below!`);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070a13] text-[#f3f4f6] font-sans flex flex-col items-center px-4 overflow-hidden py-10">
      {/* Background ambient flows */}
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      {/* Header Container */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-16 z-10 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] p-2.5 rounded-xl shadow-lg shadow-[rgba(0,242,254,0.2)]">
            <Shield className="w-7 h-7 text-[#070a13]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-[#f3f4f6] to-[#9ca3af] bg-clip-text text-transparent">
              LEX<span className="text-[#00f2fe]">GUARD</span>
            </h1>
            <p className="text-[10px] text-[#00f2fe] tracking-wider uppercase font-semibold">AI Rights Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
          <span>Security: 256-bit AES Local Sandbox</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
        </div>
      </header>

      {/* Main Core Body */}
      <main className="w-full max-w-6xl flex flex-col items-center z-10">
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-[#070a13]/95 backdrop-blur-lg flex flex-col items-center justify-center z-[2000] transition-all duration-300">
            <div className="scanner-overlay"><div className="scanner-line"></div></div>
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <div className="gauge-glow-halo"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#00f2fe] border-r-transparent border-l-transparent border-b-transparent animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-4 border-b-[#8b5cf6] border-t-transparent border-r-transparent border-l-transparent animate-spin duration-1000"></div>
              <Shield className="w-10 h-10 text-[#00f2fe] animate-pulse" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-wide font-display text-white">Analyzing Contract Integrity</h2>
            <p className="mt-2 text-sm text-[#9ca3af] animate-pulse max-w-sm text-center leading-relaxed font-mono bg-[#0d1222]/80 px-4 py-2 border border-[rgba(255,255,255,0.03)] rounded-lg">{loadingStep}</p>
            <p className="mt-3 text-[10px] text-[#00f2fe] uppercase tracking-widest font-bold">Adversarial Legal Agent Flowing...</p>
          </div>
        )}

        {/* Hero Section */}
        <section className="text-center max-w-3xl mb-12 animate-fade-in animate-delay-1 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(0,242,254,0.06)] border border-[rgba(0,242,254,0.15)] text-xs text-[#00f2fe] font-semibold mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Special Edition: Gemini 1.5 Flash Enabled</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display leading-[1.15] mb-6 tracking-tight">
            Know Your Rights <br />
            <span className="bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
              Before You Sign.
            </span>
          </h2>
          <p className="text-[#9ca3af] text-base md:text-lg leading-relaxed max-w-2xl">
            LexGuard acts as your personal AI shield. Paste or upload any employment, freelance, or software agreement to instantly uncover hidden liabilities and secure exact counter-terms.
          </p>
        </section>

        {/* Uploader & Paste Area Card */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 animate-fade-in animate-delay-2">
          
          {/* Paste Contract Terminal (Left 7 Cols) */}
          <div className="lg:col-span-7 glass-card p-6 flex flex-col min-h-[420px]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#00f2fe]" />
                <span className="text-sm font-bold font-display text-white tracking-wide">Contract Core Terminal</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                </span>
              </div>
              <button 
                onClick={() => setContractText("")}
                className="text-[10px] text-[#9ca3af] hover:text-white transition-colors"
              >
                Clear Terminal
              </button>
            </div>
            
            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder="Paste your legal agreement, employee contract, NDA, freelance terms, or privacy policies here..."
              className="flex-1 w-full bg-[#0a0e1b] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 text-xs font-mono leading-relaxed text-[#f3f4f6] focus:outline-none focus:border-[#00f2fe] transition-colors resize-none placeholder:text-[#4b5563]"
            ></textarea>
            
            {errorMsg && (
              <div className="mt-4 p-3.5 bg-red-950/40 border border-red-500/20 rounded-xl flex gap-2.5 items-start">
                <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#ef4444] leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleSubmitCustom}
              disabled={!contractText.trim() || isLoading}
              className="mt-4 glowing-btn w-full py-3 text-sm"
            >
              Analyze Legal Risks <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Drag and Drop Zone & Help Guidelines (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Drag & Drop Card */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 glass-card p-8 border-dashed border-2 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[220px] ${
                isDragging ? "border-[#00f2fe] bg-[rgba(0,242,254,0.04)] shadow-neon" : "border-[rgba(255,255,255,0.1)]"
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".txt"
                className="hidden" 
              />
              <div className="p-4 bg-[#0a0e1b] rounded-full border border-[rgba(255,255,255,0.05)] mb-4 shadow-inner">
                <Upload className="w-6 h-6 text-[#00f2fe] animate-bounce" />
              </div>
              <h3 className="text-sm font-semibold font-display mb-1 text-white">Drag & Drop Document</h3>
              <p className="text-xs text-[#9ca3af] max-w-[200px] mb-2">
                Drop your agreement file here or click to browse files
              </p>
              <span className="text-[9px] text-[#00f2fe] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0a0e1b] border border-[rgba(0,242,254,0.1)]">
                Supports .TXT
              </span>
            </div>

            {/* Sandbox Notice / Security Card */}
            <div className="glass-card p-6 bg-gradient-to-br from-[#0e1626] to-[#070a13]">
              <h3 className="text-xs font-semibold font-display mb-3 text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#10b981]" />
                LexGuard Privacy Promise
              </h3>
              <ul className="text-[11px] text-[#9ca3af] space-y-2.5 list-none">
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] mt-1 shrink-0"></span>
                  <span><strong>Zero Storage</strong>: Uploaded contracts are analyzed instantly in volatile memory and never saved to any database.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] mt-1 shrink-0"></span>
                  <span><strong>Secure Encryption</strong>: Connection to Gemini is protected under industry-standard SSL protocols.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] mt-1 shrink-0"></span>
                  <span><strong>No Legal Advice</strong>: This tool is meant for educational contract intelligence and equalizing negotiations.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Preset Contract Selector Section */}
        <section className="w-full mb-10 animate-fade-in animate-delay-3">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
            <h3 className="text-lg font-bold font-display text-white">Instant Sandbox Demo Presets</h3>
            <span className="text-[9px] text-[#8b5cf6] font-bold px-2 py-0.5 rounded bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.15)] uppercase">
              No API Key Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className="glass-card p-6 cursor-pointer flex flex-col justify-between hover:scale-[1.02] border-[rgba(255,255,255,0.06)] hover:border-[#00f2fe] min-h-[190px] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00f2fe]/5 to-transparent rounded-bl-full group-hover:from-[#00f2fe]/10 transition-all"></div>
                
                <div>
                  <span className="text-[9px] text-[#00f2fe] uppercase font-bold tracking-widest font-display px-2 py-0.5 rounded bg-[#0a0e1b] border border-[rgba(0,242,254,0.05)] inline-block mb-3">
                    {preset.type}
                  </span>
                  <h4 className="text-sm font-semibold font-display text-white mb-2 group-hover:text-[#00f2fe] transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-5 pt-3 border-t border-[rgba(255,255,255,0.04)]">
                  <span className="text-[10px] text-[#9ca3af] flex items-center gap-1 group-hover:text-white transition-colors">
                    View adversarial report <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-xs font-bold font-display text-[#ef4444]">
                    Risk: {preset.analysis.overallRiskScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer bar */}
      <footer className="w-full max-w-6xl mt-auto pt-8 border-t border-[rgba(255,255,255,0.03)] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#4b5563] z-10">
        <p>© 2026 LexGuard Legal Tech. Built for hackathon showcasing. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Shield</a>
          <a href="#" className="hover:text-white transition-colors">Sandbox Terms</a>
          <a href="#" className="hover:text-white transition-colors">Google Gemini API Integration</a>
        </div>
      </footer>
    </div>
  );
}
