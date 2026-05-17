"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, ArrowLeft, BarChart2, BookOpen, Terminal, 
  CheckSquare, FileText, AlertTriangle, AlertOctagon,
  Copy, Check, Printer, HelpCircle, FileCheck, ArrowRight,
  Eye, Zap, Sparkles
} from "lucide-react";
import { PRESETS } from "@/lib/presets";

export default function Dashboard() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>(null);
  const [contractText, setContractText] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, analyzer, simulator, negotiator
  const [selectedClause, setSelectedClause] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Simulator State
  const [selectedScenario, setSelectedScenario] = useState<any>(null);

  // 1. Load data from sessionStorage with Preset fallback
  useEffect(() => {
    try {
      const storedAnalysis = sessionStorage.getItem("lexguard_analysis");
      const storedText = sessionStorage.getItem("lexguard_contract_text");

      if (storedAnalysis && storedText) {
        const parsed = JSON.parse(storedAnalysis);
        setAnalysis(parsed);
        setContractText(storedText);
        
        // Auto-select first simulation for simulator
        if (parsed.simulations && parsed.simulations.length > 0) {
          setSelectedScenario(parsed.simulations[0]);
        }
      } else {
        // Direct-access fallback: Load the Employment Preset automatically
        const defaultPreset = PRESETS[0];
        setAnalysis(defaultPreset.analysis);
        setContractText(defaultPreset.rawText);
        
        if (defaultPreset.analysis.simulations && defaultPreset.analysis.simulations.length > 0) {
          setSelectedScenario(defaultPreset.analysis.simulations[0]);
        }
      }
    } catch (e) {
      console.error("Error loading session storage", e);
      // Fallback
      const defaultPreset = PRESETS[0];
      setAnalysis(defaultPreset.analysis);
      setContractText(defaultPreset.rawText);
    }
  }, []);

  // Sync selected clause to drawer state
  const handleClauseClick = (clause: any) => {
    setSelectedClause(clause);
    setIsDrawerOpen(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Copy email templates
  const handleCopyTemplate = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Handle PDF/Print Export
  const handlePrint = () => {
    window.print();
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-[#00f2fe] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs text-[#9ca3af] uppercase tracking-widest font-mono">Decryption in progress...</p>
      </div>
    );
  }

  // Calculate SVG stroke offset based on score
  const strokeDashOffset = 339.292 - (339.292 * analysis.overallRiskScore) / 100;

  // Determine color variables based on risk score
  let scoreColorClass = "stroke-[#10b981]"; // Safe
  let scoreTextClass = "text-[#10b981]";
  let scoreBadgeClass = "badge-safe";
  let scoreLabel = "SAFE CONTRACT";

  if (analysis.overallRiskScore >= 80) {
    scoreColorClass = "stroke-[#ef4444]";
    scoreTextClass = "text-[#ef4444]";
    scoreBadgeClass = "badge-critical";
    scoreLabel = "CRITICAL Traps";
  } else if (analysis.overallRiskScore >= 60) {
    scoreColorClass = "stroke-[#f59e0b]";
    scoreTextClass = "text-[#f59e0b]";
    scoreBadgeClass = "badge-high";
    scoreLabel = "HIGH RISK";
  } else if (analysis.overallRiskScore >= 30) {
    scoreColorClass = "stroke-[#8b5cf6]";
    scoreTextClass = "text-[#8b5cf6]";
    scoreBadgeClass = "badge-medium";
    scoreLabel = "MODERATE RISK";
  }

  return (
    <div className="relative min-h-screen bg-[#070a13] text-[#f3f4f6] font-sans flex flex-col lg:flex-row overflow-x-hidden">
      {/* Background ambient flows */}
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      {/* Cyber Sidebar (Fixed Left on desktop, header on mobile) */}
      <aside className="w-full lg:w-72 bg-[#0d1222]/80 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)] flex flex-col p-6 z-40 shrink-0">
        
        {/* Brand/Return area */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[#00f2fe]" />
            <div>
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-[#9ca3af] bg-clip-text text-transparent">
                LEX<span className="text-[#00f2fe]">GUARD</span>
              </h1>
              <p className="text-[9px] text-[#00f2fe] tracking-widest uppercase font-semibold">Decryption Suite</p>
            </div>
          </div>
          <button 
            onClick={() => router.push("/")}
            className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.05)] hover:bg-[#16223b] transition-colors"
            title="Upload New Contract"
          >
            <ArrowLeft className="w-4 h-4 text-[#9ca3af]" />
          </button>
        </div>

        {/* Contract Type Display Card */}
        <div className="bg-[#141c33]/60 border border-[rgba(255,255,255,0.04)] rounded-xl p-4 mb-8">
          <span className="text-[9px] text-[#00f2fe] uppercase tracking-wider font-bold font-display">Target Document</span>
          <h3 className="text-xs font-semibold text-white truncate mt-0.5">{analysis.documentName}</h3>
          <div className="flex gap-2 items-center mt-2.5">
            <span className={`severity-badge ${scoreBadgeClass} py-0.5 px-2 text-[9px]`}>
              Risk: {analysis.overallRiskScore}%
            </span>
            <span className="text-[10px] text-[#9ca3af] uppercase font-mono">
              {analysis.documentType}
            </span>
          </div>
        </div>

        {/* Sidebar Nav Switches */}
        <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 tab-btn-hover ${
              activeTab === "overview" 
                ? "tab-btn-active" 
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Risk Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 tab-btn-hover ${
              activeTab === "analyzer" 
                ? "tab-btn-active" 
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Clause Analyzer</span>
            {analysis.clauses && (
              <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full ${
                activeTab === "analyzer" ? "bg-[#070a13] text-[#00f2fe]" : "bg-[#141c33] text-[#ef4444]"
              }`}>
                {analysis.clauses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 tab-btn-hover ${
              activeTab === "simulator" 
                ? "tab-btn-active" 
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Scenario Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("negotiator")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 tab-btn-hover ${
              activeTab === "negotiator" 
                ? "tab-btn-active" 
                : "text-[#9ca3af] hover:text-white"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Negotiation Copilot</span>
          </button>
        </nav>

        {/* Sidebar Info Footer */}
        <div className="mt-auto hidden lg:flex flex-col gap-3 pt-6 border-t border-[rgba(255,255,255,0.03)]">
          <div className="flex justify-between text-[10px] text-[#4b5563]">
            <span>Platform Status:</span>
            <span className="text-[#10b981] font-semibold">SECURE</span>
          </div>
          <button 
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-[#141c33] border border-[rgba(255,255,255,0.05)] text-[10px] uppercase font-bold py-2 rounded-lg hover:bg-[#16223b] hover:text-[#00f2fe] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Export PDF Summary
          </button>
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 lg:p-10 flex flex-col z-10 overflow-y-auto max-h-screen">
        
        {/* Top Status Bar (Summary, Counts) */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(255,255,255,0.04)] pb-6 mb-8 animate-fade-in">
          <div>
            <h2 className="text-xl font-extrabold font-display text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00f2fe]" />
              LexGuard Intelligence Report
            </h2>
            <p className="text-xs text-[#9ca3af] mt-1 leading-relaxed max-w-xl truncate">
              {analysis.documentName} — Evaluated from your perspective.
            </p>
          </div>
          
          <button
            onClick={handlePrint}
            className="sm:hidden flex items-center gap-2 bg-[#141c33] text-[11px] py-1.5 px-3 rounded-lg border border-[rgba(255,255,255,0.05)] text-white"
          >
            <Printer className="w-3.5 h-3.5" /> Export
          </button>
        </section>

        {/* -------------------- TAB 1: OVERVIEW -------------------- */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Risk Gauge Block (Left 4 Cols) */}
            <div className="lg:col-span-4 glass-card p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-6">Aggregated Danger Index</h3>
              
              <div className="risk-gauge-container">
                <div className="gauge-glow-halo"></div>
                <svg className="risk-gauge-circle w-36 h-36 z-10">
                  <circle className="risk-gauge-bg" cx="72" cy="72" r="54"></circle>
                  <circle 
                    className={`risk-gauge-progress ${scoreColorClass}`} 
                    cx="72" 
                    cy="72" 
                    r="54" 
                    strokeDasharray="339.292"
                    strokeDashoffset={strokeDashOffset}
                  ></circle>
                </svg>
                <div className="risk-gauge-text">
                  <span className={`text-4xl font-extrabold font-display ${scoreTextClass}`}>{analysis.overallRiskScore}%</span>
                  <span className="text-[8px] text-[#9ca3af] font-semibold uppercase tracking-widest mt-0.5">Risk Score</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <span className={`severity-badge ${scoreBadgeClass} px-3.5 py-1 text-[10px]`}>
                  {scoreLabel}
                </span>
                <p className="text-[10px] text-[#9ca3af] mt-3 max-w-[200px] leading-relaxed">
                  Calculated by extracting key liabilities and restrictive bounds.
                </p>
              </div>
            </div>

            {/* AI Executive Summary Block (Right 8 Cols) */}
            <div className="lg:col-span-8 glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertOctagon className="w-5 h-5 text-[#ef4444]" />
                  <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">Executive Adversary Summary</h3>
                </div>
                <p className="text-xs leading-relaxed text-[#9ca3af] bg-[#0a0e1b] border border-[rgba(255,255,255,0.03)] rounded-xl p-4 text-justify font-mono">
                  {analysis.summary}
                </p>
              </div>

              {/* Categorized Risk Grid */}
              <div className="mt-6">
                <h4 className="text-[10px] font-bold font-display text-white uppercase tracking-wider mb-3">Risk Matrix Breakdown</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(analysis.riskBreakdown || {}).map(([category, rating]: [string, any]) => {
                    let badgeClass = "badge-safe";
                    if (rating === "Critical") badgeClass = "badge-critical";
                    else if (rating === "High") badgeClass = "badge-high";
                    else if (rating === "Medium") badgeClass = "badge-medium";
                    else if (rating === "Low") badgeClass = "badge-low";

                    // Friendly formatted key name
                    const nameMapping: Record<string, string> = {
                      financial: "Financial",
                      ipOwnership: "IP Grab",
                      restrictiveCovenants: "Covenants",
                      liability: "Liability",
                      termination: "Termination"
                    };

                    return (
                      <div key={category} className="bg-[#0a0e1b] border border-[rgba(255,255,255,0.04)] rounded-xl p-3 flex flex-col justify-between min-h-[75px]">
                        <span className="text-[10px] text-[#9ca3af] font-semibold leading-none">
                          {nameMapping[category] || category}
                        </span>
                        <span className={`severity-badge ${badgeClass} text-[8px] py-0.5 px-2 mt-2 w-fit leading-none`}>
                          {rating}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick Action Banner */}
            <div className="lg:col-span-12 glass-card p-6 bg-gradient-to-r from-[#141c33] to-[#0d1222] border-[rgba(0,242,254,0.1)] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-4 items-center">
                <div className="bg-[#070a13] p-3 border border-[rgba(255,255,255,0.05)] rounded-xl text-[#00f2fe] shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-display text-white">Next Step: Dissect Specific Trap Clauses</h4>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5 max-w-xl leading-relaxed">
                    We extracted {analysis.clauses?.length || 0} clauses that carry high leverage against you. Click the Clause Analyzer tab to reveal simple plain-English translations and exact counter-proposals.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab("analyzer")}
                className="glowing-btn py-2.5 px-5 text-xs tracking-wider shrink-0"
              >
                Launch Analyzer <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* -------------------- TAB 2: CLAUSE ANALYZER -------------------- */}
        {activeTab === "analyzer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in flex-1">
            
            {/* Left Hand: Contract Document View (7 Cols) */}
            <div className="lg:col-span-7 glass-card p-6 flex flex-col h-[550px]">
              <div className="flex justify-between items-center mb-4 border-b border-[rgba(255,255,255,0.04)] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00f2fe]" />
                  <span className="text-xs font-bold font-display uppercase tracking-wider text-white">Source Agreement Sandbox</span>
                </div>
                <span className="text-[10px] text-[#9ca3af]">Click any highlighted clause block</span>
              </div>

              {/* Scrollable Virtual Document Container */}
              <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 font-mono text-xs text-[#9ca3af] leading-relaxed">
                
                {/* Check if preset text matches standard preset format */}
                {analysis.clauses && analysis.clauses.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-[10px] text-[#4b5563] uppercase border-b border-[rgba(255,255,255,0.02)] pb-1 mb-2">Legal Clauses Extracted:</p>
                    {analysis.clauses.map((clause: any) => {
                      let borderClass = "border-l-4 border-l-[#ef4444] bg-[#ef4444]/[0.02]";
                      if (clause.severity === "Critical") borderClass = "border-l-4 border-l-[#ef4444] bg-[#ef4444]/[0.03] hover:bg-[#ef4444]/[0.06]";
                      else if (clause.severity === "High") borderClass = "border-l-4 border-l-[#f59e0b] bg-[#f59e0b]/[0.02] hover:bg-[#f59e0b]/[0.05]";
                      else if (clause.severity === "Medium") borderClass = "border-l-4 border-l-[#8b5cf6] bg-[#8b5cf6]/[0.02] hover:bg-[#8b5cf6]/[0.05]";
                      else if (clause.severity === "Low") borderClass = "border-l-4 border-l-[#4facfe] bg-[#4facfe]/[0.02] hover:bg-[#4facfe]/[0.05]";

                      let badgeClass = "badge-safe";
                      if (clause.severity === "Critical") badgeClass = "badge-critical";
                      else if (clause.severity === "High") badgeClass = "badge-high";
                      else if (clause.severity === "Medium") badgeClass = "badge-medium";
                      else if (clause.severity === "Low") badgeClass = "badge-low";

                      const isActive = selectedClause?.id === clause.id;
                      const activeGlow = isActive ? "clause-card-active" : "";

                      return (
                        <div
                          key={clause.id}
                          onClick={() => handleClauseClick(clause)}
                          className={`p-4 rounded-r-xl border border-[rgba(255,255,255,0.03)] cursor-pointer transition-all duration-200 ${borderClass} ${activeGlow}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-display font-bold text-white text-xs leading-none">
                              {clause.title}
                            </span>
                            <span className={`severity-badge ${badgeClass} text-[8px] py-0.5 px-2 leading-none`}>
                              {clause.severity}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-[#9ca3af] italic line-clamp-3">
                            "{clause.originalText}"
                          </p>
                          <span className="text-[9px] text-[#00f2fe] uppercase font-bold tracking-wider mt-3 inline-block hover:underline">
                            Click to dissect →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="italic text-center py-20 text-[#4b5563]">No structured clauses were extracted. Please paste or upload a contract containing clear legal language.</p>
                )}

              </div>
            </div>

            {/* Right Hand: Detailed Side Drawer (Or Panel on tab, Drawer on click) (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col">
              {selectedClause ? (
                <div className="glass-card p-6 border-[#00f2fe]/20 shadow-[0_0_15px_rgba(0,242,254,0.05)] h-[550px] flex flex-col justify-between overflow-y-auto">
                  
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-[rgba(255,255,255,0.04)] pb-4 mb-4">
                      <div>
                        <span className="text-[9px] text-[#00f2fe] uppercase tracking-wider font-bold">Clause Dissected</span>
                        <h4 className="text-sm font-bold font-display text-white mt-1">{selectedClause.title}</h4>
                      </div>
                      
                      {/* Severity badge */}
                      {(() => {
                        let badgeClass = "badge-safe";
                        if (selectedClause.severity === "Critical") badgeClass = "badge-critical glow-critical-pulse";
                        else if (selectedClause.severity === "High") badgeClass = "badge-high";
                        else if (selectedClause.severity === "Medium") badgeClass = "badge-medium";
                        else if (selectedClause.severity === "Low") badgeClass = "badge-low";
                        return <span className={`severity-badge ${badgeClass} text-[9px] px-2.5 py-0.5`}>{selectedClause.severity}</span>;
                      })()}
                    </div>

                    {/* Original Source */}
                    <div className="mb-5">
                      <h5 className="text-[10px] text-white font-bold font-display uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#9ca3af]" />
                        Original Legalese
                      </h5>
                      <div className="bg-[#0a0e1b] rounded-lg p-3 text-[10px] font-mono leading-relaxed text-[#9ca3af] border border-[rgba(255,255,255,0.03)] italic">
                        "{selectedClause.originalText}"
                      </div>
                    </div>

                    {/* Plain Translation */}
                    <div className="mb-5">
                      <h5 className="text-[10px] text-[#00f2fe] font-bold font-display uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#00f2fe]" />
                        Plain English Translation
                      </h5>
                      <p className="text-[11px] leading-relaxed text-white">
                        {selectedClause.translation}
                      </p>
                    </div>

                    {/* Hidden Trap */}
                    <div className="mb-5">
                      <h5 className="text-[10px] text-[#ef4444] font-bold font-display uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                        Hidden Risk Trap
                      </h5>
                      <p className="text-[11px] leading-relaxed text-[#9ca3af]">
                        {selectedClause.hiddenTrap}
                      </p>
                    </div>

                    {/* Practical Implication */}
                    <div className="mb-5">
                      <h5 className="text-[10px] text-[#f59e0b] font-bold font-display uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
                        Scenario Implication
                      </h5>
                      <p className="text-[11px] leading-relaxed text-[#9ca3af] border-l-2 border-[#f59e0b] pl-3 italic">
                        {selectedClause.practicalImplication}
                      </p>
                    </div>
                  </div>

                  {/* Actionable Counter Proposal */}
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)]">
                    <h5 className="text-[10px] text-[#10b981] font-bold font-display uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                      Actionable Counter-Proposal
                    </h5>
                    <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-xl p-3.5">
                      <p className="text-[11px] leading-relaxed text-white font-mono">
                        {selectedClause.counterProposal}
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="glass-card p-8 text-center flex flex-col items-center justify-center h-[550px] border-dashed border-2 border-[rgba(255,255,255,0.06)]">
                  <HelpCircle className="w-8 h-8 text-[#9ca3af] mb-4" />
                  <h4 className="text-xs font-bold font-display text-white uppercase tracking-wider mb-2">No Clause Selected</h4>
                  <p className="text-[11px] text-[#9ca3af] max-w-[240px] leading-relaxed">
                    Click on any clause block on the left panel to launch the deep AI adversarial dissection drawer.
                  </p>
                </div>
              )}
            </div>

            {/* Sliding Cyber Drawer for Screen overlays (Mobile drawer fallback) */}
            <div className={`side-drawer ${isDrawerOpen ? "open" : ""}`}>
              {selectedClause && (
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.04)] pb-4">
                    <div>
                      <span className="text-[9px] text-[#00f2fe] uppercase tracking-wider font-bold">Clause Dissected</span>
                      <h4 className="text-sm font-bold font-display text-white mt-1">{selectedClause.title}</h4>
                    </div>
                    <button 
                      onClick={handleCloseDrawer}
                      className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.05)] hover:bg-[#16223b]"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                    <div>
                      <h5 className="text-[10px] text-white font-bold font-display uppercase tracking-widest mb-1">Original Legalese</h5>
                      <p className="bg-[#0a0e1b] rounded-lg p-3 text-[10px] font-mono leading-relaxed text-[#9ca3af] italic border border-[rgba(255,255,255,0.03)]">
                        "{selectedClause.originalText}"
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] text-[#00f2fe] font-bold font-display uppercase tracking-widest mb-1.5">Translation</h5>
                      <p className="text-[11px] leading-relaxed text-white">
                        {selectedClause.translation}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] text-[#ef4444] font-bold font-display uppercase tracking-widest mb-1.5">Hidden Risk</h5>
                      <p className="text-[11px] leading-relaxed text-[#9ca3af]">
                        {selectedClause.hiddenTrap}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] text-[#f59e0b] font-bold font-display uppercase tracking-widest mb-1.5">Scenario Implication</h5>
                      <p className="text-[11px] leading-relaxed text-[#9ca3af] border-l-2 border-[#f59e0b] pl-3 italic">
                        {selectedClause.practicalImplication}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[rgba(255,255,255,0.04)]">
                      <h5 className="text-[10px] text-[#10b981] font-bold font-display uppercase tracking-widest mb-2">Counter Proposal</h5>
                      <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-xl p-3.5">
                        <p className="text-[11px] leading-relaxed text-white font-mono">
                          {selectedClause.counterProposal}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* -------------------- TAB 3: SCENARIO SIMULATOR -------------------- */}
        {activeTab === "simulator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Scenario Selector Block (4 Cols) */}
            <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="w-5 h-5 text-[#8b5cf6]" />
                  <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider">Hypothetical Sandbox</h3>
                </div>
                <p className="text-[11px] text-[#9ca3af] leading-relaxed mb-6">
                  Select a common real-world scenario below to simulate how this specific contract dictates the legal outcome of your actions.
                </p>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold font-display text-white uppercase tracking-wider block">Choose Scenario Action:</label>
                  {analysis.simulations && analysis.simulations.map((sim: any, idx: number) => {
                    const isActive = selectedScenario?.scenario === sim.scenario;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedScenario(sim)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all font-display ${
                          isActive 
                            ? "bg-[#8b5cf6]/10 border-[#8b5cf6] text-[#c084fc] shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                            : "bg-[#0a0e1b] border-[rgba(255,255,255,0.03)] text-[#9ca3af] hover:border-white hover:text-white"
                        }`}
                      >
                        {sim.scenario}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.03)] text-[10px] text-[#4b5563] italic">
                Simulations are based on contract logic matrices.
              </div>
            </div>

            {/* Simulation Report (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {selectedScenario ? (
                <div className="glass-card p-6 flex-1 flex flex-col justify-between min-h-[380px]">
                  
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.04)] pb-4 mb-6">
                      <div>
                        <span className="text-[9px] text-[#8b5cf6] uppercase tracking-wider font-bold">Scenario Consequence Report</span>
                        <h4 className="text-sm font-bold font-display text-white mt-1">"{selectedScenario.scenario}"</h4>
                      </div>
                      
                      {/* Severity badge */}
                      {(() => {
                        let badgeClass = "badge-safe";
                        if (selectedScenario.severity === "Critical") badgeClass = "badge-critical glow-critical-pulse";
                        else if (selectedScenario.severity === "Warning") badgeClass = "badge-high";
                        return <span className={`severity-badge ${badgeClass} text-[9px] px-2.5 py-0.5`}>{selectedScenario.severity}</span>;
                      })()}
                    </div>

                    {/* Result */}
                    <div>
                      <h5 className="text-[10px] text-[#ef4444] font-bold font-display uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <AlertOctagon className="w-4 h-4 text-[#ef4444]" />
                        Simulated Consequence
                      </h5>
                      <div className="bg-[#0a0e1b] rounded-xl p-5 border border-[rgba(255,255,255,0.04)] text-[#f3f4f6] font-mono text-xs leading-relaxed leading-[1.6]">
                        {selectedScenario.outcome}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation banner */}
                  <div className="mt-8 p-4 bg-purple-950/20 border border-purple-500/10 rounded-xl flex gap-3 items-center">
                    <Shield className="w-5 h-5 text-[#c084fc] shrink-0" />
                    <div>
                      <h6 className="text-xs font-bold text-white font-display">LexGuard Security Suggestion</h6>
                      <p className="text-[10px] text-[#9ca3af] mt-0.5 leading-relaxed">
                        To resolve this consequence, head over to the **Negotiation Copilot** tab and copy our customized counter-proposal regarding these restrictive terms.
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="glass-card p-8 text-center flex flex-col items-center justify-center h-full border-dashed border-2">
                  <HelpCircle className="w-8 h-8 text-[#9ca3af] mb-4" />
                  <h4 className="text-xs font-bold font-display text-white">No Scenario Triggered</h4>
                </div>
              )}
            </div>

          </div>
        )}

        {/* -------------------- TAB 4: NEGOTIATION COPILOT -------------------- */}
        {activeTab === "negotiator" && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            <div className="glass-card p-6 bg-gradient-to-r from-[#0d1222] to-[#141c33] border-[rgba(0,242,254,0.05)]">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#10b981]" />
                Equalizer Negotiation Dashboard
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed max-w-2xl">
                Ready to equalize this contract? Below are the key points of dispute extracted by our AI adversarial workflow. Review each suggestion and copy-paste the friendly, professional email templates directly into your negotiations thread.
              </p>
            </div>

            {analysis.negotiationCheatsheet && analysis.negotiationCheatsheet.map((point: any, idx: number) => {
              const isCopied = copiedIndex === idx;
              return (
                <div key={idx} className="glass-card p-6 flex flex-col justify-between">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[rgba(255,255,255,0.04)] pb-4 mb-4">
                    <div>
                      <span className="text-[9px] text-[#10b981] uppercase tracking-wider font-bold">Dispute Point {idx + 1}</span>
                      <h4 className="text-sm font-bold font-display text-white mt-1">{point.point}</h4>
                    </div>
                    
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyTemplate(point.emailTemplate, idx)}
                      className={`glowing-btn py-1.5 px-3 text-[10px] tracking-wider transition-all flex items-center gap-1.5 ${
                        isCopied ? "bg-[#10b981] text-[#070a13]" : ""
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied Template
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Email Template
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Advisory */}
                    <div className="lg:col-span-5">
                      <h5 className="text-[10px] text-white font-bold font-display uppercase tracking-widest mb-2">LexGuard Strategy Recommendation</h5>
                      <p className="text-[11px] leading-relaxed text-[#9ca3af] bg-[#0a0e1b] p-3 rounded-lg border border-[rgba(255,255,255,0.02)]">
                        {point.recommendation}
                      </p>
                    </div>
                    
                    {/* Email Template */}
                    <div className="lg:col-span-7">
                      <h5 className="text-[10px] text-[#00f2fe] font-bold font-display uppercase tracking-widest mb-2">Copy-Pasteable Negotiation Segment</h5>
                      <div className="bg-[#0a0e1b] rounded-lg p-3 text-[10px] font-mono leading-relaxed text-[#9ca3af] border border-[rgba(255,255,255,0.03)] select-all whitespace-pre-wrap">
                        {point.emailTemplate}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
