/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect, react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield, ArrowLeft, BarChart2, BookOpen, Terminal,
  CheckSquare, FileText, AlertTriangle, AlertOctagon,
  Copy, Check, Printer, HelpCircle, FileCheck, ArrowRight,
  Eye, Zap, Sparkles, Sun, Moon
} from "lucide-react";
import { PRESETS } from "@/lib/presets";
import AICopilot from "@/components/AICopilot";

export default function Dashboard() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<any>(null);
  const [contractText, setContractText] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClause, setSelectedClause] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from storage or system scheme
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

  useEffect(() => {
    try {
      const storedAnalysis = sessionStorage.getItem("lexguard_analysis");
      const storedText = sessionStorage.getItem("lexguard_contract_text");

      if (storedAnalysis && storedText) {
        const parsed = JSON.parse(storedAnalysis);
        setAnalysis(parsed);
        setContractText(storedText);
        if (parsed.simulations && parsed.simulations.length > 0) {
          setSelectedScenario(parsed.simulations[0]);
        }
      } else {
        const defaultPreset = PRESETS[0];
        setAnalysis(defaultPreset.analysis);
        setContractText(defaultPreset.rawText);
        if (defaultPreset.analysis.simulations && defaultPreset.analysis.simulations.length > 0) {
          setSelectedScenario(defaultPreset.analysis.simulations[0]);
        }
      }
    } catch (e) {
      console.error("Error loading session storage", e);
      const defaultPreset = PRESETS[0];
      setAnalysis(defaultPreset.analysis);
      setContractText(defaultPreset.rawText);
    }
  }, []);

  const handleClauseClick = (clause: any) => {
    setSelectedClause(clause);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleCopyTemplate = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-[13px] text-slate-500 font-medium tracking-wide">Loading intelligence report...</p>
      </div>
    );
  }

  const strokeDashOffset = 339.292 - (339.292 * analysis.overallRiskScore) / 100;

  let scoreColorClass = "stroke-emerald-500";
  let scoreTextClass = "text-emerald-600";
  let scoreBadgeClass = "badge-safe";
  let scoreLabel = "SAFE CONTRACT";

  if (analysis.overallRiskScore >= 80) {
    scoreColorClass = "stroke-red-500";
    scoreTextClass = "text-red-600";
    scoreBadgeClass = "badge-critical";
    scoreLabel = "CRITICAL TRAPS";
  } else if (analysis.overallRiskScore >= 60) {
    scoreColorClass = "stroke-amber-500";
    scoreTextClass = "text-amber-600";
    scoreBadgeClass = "badge-high";
    scoreLabel = "HIGH RISK";
  } else if (analysis.overallRiskScore >= 30) {
    scoreColorClass = "stroke-purple-500";
    scoreTextClass = "text-purple-600";
    scoreBadgeClass = "badge-medium";
    scoreLabel = "MODERATE RISK";
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-700 font-sans flex flex-col lg:flex-row overflow-x-hidden">
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      {/* Trustworthy Sidebar */}
      <aside className="w-full lg:w-96 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col p-5 lg:p-10 z-40 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.015)] lg:h-screen lg:overflow-y-auto">

        <div className="flex items-center justify-center relative mb-6 lg:mb-12">
          <button
            onClick={() => router.push("/")}
            className="absolute left-0 p-2 lg:p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
            title="Return Home"
          >
            <ArrowLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <div className="flex items-center justify-center gap-3 lg:gap-4">
            <div className="bg-blue-600 p-2 lg:p-2.5 rounded-xl shadow-md">
              <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 font-display">
                LexGuard
              </h1>
            </div>
          </div>
        </div>

        {/* Contract Type Display Card */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 lg:p-6 mb-6 lg:mb-12 flex flex-col items-center text-center">
          <span className="text-[11px] lg:text-[12px] text-slate-400 uppercase tracking-widest font-bold font-display">Target Document</span>
          <h3 className="text-[16px] lg:text-[19px] font-bold text-slate-900 mt-2 lg:mt-3 mb-4 lg:mb-6 leading-[1.3]">{analysis.documentName}</h3>
          <div className="flex flex-wrap justify-center gap-2 lg:gap-3 items-center">
            <span className={`severity-badge ${scoreBadgeClass} py-1.5 px-3 lg:px-4 text-[11px] lg:text-[12px]`}>
              Risk: {analysis.overallRiskScore}%
            </span>
            <span className="text-[11px] lg:text-[12px] text-slate-500 uppercase font-mono font-medium bg-white px-3 lg:px-4 py-1.5 rounded-lg border border-slate-200">
              {analysis.documentType}
            </span>
          </div>
        </div>

        {/* Sidebar Nav Switches */}
        <nav className="flex flex-row lg:flex-col gap-2 lg:gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 font-medium relative scroll-smooth" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[13px] lg:text-[15px] tracking-wide transition-all shrink-0 tab-btn-hover ${activeTab === "overview"
                ? "tab-btn-active bg-white shadow-md border border-slate-200 text-blue-700"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
          >
            <BarChart2 className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Risk Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("analyzer")}
            className={`flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[13px] lg:text-[15px] tracking-wide transition-all shrink-0 tab-btn-hover ${activeTab === "analyzer"
                ? "tab-btn-active bg-white shadow-md border border-slate-200 text-blue-700"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
          >
            <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Clause Analyzer</span>
            {analysis.clauses && (
              <span className={`ml-1.5 lg:ml-2 text-[11px] lg:text-[12px] px-2.5 lg:px-3 py-1 rounded-md font-bold ${activeTab === "analyzer" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
                }`}>
                {analysis.clauses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[13px] lg:text-[15px] tracking-wide transition-all shrink-0 tab-btn-hover ${activeTab === "simulator"
                ? "tab-btn-active bg-white shadow-md border border-slate-200 text-blue-700"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
          >
            <Terminal className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Scenario Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("negotiator")}
            className={`flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-[13px] lg:text-[15px] tracking-wide transition-all shrink-0 tab-btn-hover ${activeTab === "negotiator"
                ? "tab-btn-active bg-white shadow-md border border-slate-200 text-blue-700"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
          >
            <CheckSquare className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Negotiator</span>
          </button>
        </nav>

        {/* Sidebar Info Footer */}
        <div className="mt-auto hidden lg:flex flex-col gap-6 pt-10 border-t border-slate-100">
          <div className="flex justify-center text-[13px] text-slate-500 font-medium">
            <span className="flex items-center gap-2">Platform Status: <span className="text-emerald-600 font-bold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> SECURE</span></span>
          </div>
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-[14px] text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
          >
            <Printer className="w-5 h-5" /> Export PDF Summary
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col z-10 lg:overflow-y-auto lg:max-h-screen w-full">

        <section className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-8 mb-10 animate-fade-in w-full gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
              Intelligence Report
            </h2>
            <p className="text-[15px] text-slate-500 mt-2 leading-relaxed max-w-xl font-medium">
              {analysis.documentName} — Evaluated for your protection.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
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

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-white text-[14px] font-bold py-3 px-5 lg:py-3.5 lg:px-6 rounded-2xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Export PDF Summary
            </button>
          </div>
        </section>

        <div className="w-full">
          {/* -------------------- TAB 1: OVERVIEW -------------------- */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 animate-fade-in">

              {/* Risk Gauge Block (Left 4 Cols) */}
              <div className="lg:col-span-4 glass-card p-10 flex flex-col items-center justify-center text-center bg-white border-slate-200">
                <h3 className="text-[13px] font-bold font-display text-slate-400 uppercase tracking-widest mb-8">Aggregated Danger Index</h3>

                <div className="risk-gauge-container mb-2">
                  <svg className="risk-gauge-circle w-48 h-48 z-10">
                    <circle className="risk-gauge-bg" cx="96" cy="96" r="84"></circle>
                    <circle
                      className={`risk-gauge-progress ${scoreColorClass}`}
                      cx="96"
                      cy="96"
                      r="84"
                      strokeDasharray="527.7"
                      strokeDashoffset={527.7 - (527.7 * analysis.overallRiskScore) / 100}
                    ></circle>
                  </svg>
                  <div className="risk-gauge-text">
                    <span className={`text-5xl font-extrabold font-display ${scoreTextClass}`}>{analysis.overallRiskScore}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Risk Score</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center">
                  <span className={`severity-badge ${scoreBadgeClass} px-4 py-1.5 text-[12px]`}>
                    {scoreLabel}
                  </span>
                  <p className="text-[13px] text-slate-500 font-medium mt-4 max-w-[220px] leading-relaxed">
                    Calculated by extracting key liabilities and restrictive bounds.
                  </p>
                </div>
              </div>

              {/* AI Executive Summary Block (Right 8 Cols) */}
              <div className="lg:col-span-8 flex flex-col gap-10">
                <div className="glass-card p-10 flex flex-col justify-between bg-white border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertOctagon className="w-5 h-5 text-red-500" />
                    <h3 className="text-base font-bold font-display text-slate-900">Executive Summary</h3>
                  </div>
                  <p className="text-[15px] leading-loose text-slate-700 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 font-mono">
                    {analysis.summary}
                  </p>
                </div>

                {/* Categorized Risk Grid */}
                <div>
                  <h4 className="text-[13px] font-bold font-display text-slate-900 mb-5">Risk Matrix Breakdown</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {Object.entries(analysis.riskBreakdown || {}).map(([category, rating]: [string, any]) => {
                      let badgeClass = "badge-safe";
                      if (rating === "Critical") badgeClass = "badge-critical";
                      else if (rating === "High") badgeClass = "badge-high";
                      else if (rating === "Medium") badgeClass = "badge-medium";
                      else if (rating === "Low") badgeClass = "badge-low";

                      const nameMapping: Record<string, string> = {
                        financial: "Financial", ipOwnership: "IP Grab",
                        restrictiveCovenants: "Covenants", liability: "Liability", termination: "Termination"
                      };

                      return (
                        <div key={category} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between min-h-[100px] shadow-sm hover:border-blue-200 transition-colors">
                          <span className="text-[12px] text-slate-500 font-medium leading-tight">
                            {nameMapping[category] || category}
                          </span>
                          <span className={`severity-badge ${badgeClass} text-[10px] py-1 px-3 mt-3 w-fit shadow-sm`}>
                            {rating}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quick Action Banner */}
              <div className="lg:col-span-12 glass-card p-8 lg:p-10 bg-blue-50/80 border border-blue-100 flex flex-col sm:flex-row justify-between items-center gap-8">
                <div className="flex gap-6 items-center">
                  <div className="bg-white p-4 border border-blue-100 rounded-2xl text-blue-600 shrink-0 shadow-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-display text-slate-900">Next Step: Dissect Trap Clauses</h4>
                    <p className="text-[14px] text-slate-600 font-medium mt-2 max-w-2xl leading-relaxed">
                      We extracted {analysis.clauses?.length || 0} clauses that carry leverage against you. Click the Clause Analyzer tab to reveal plain-English translations and exact counter-proposals.
                    </p>
                  </div>
                </div>
                <button onClick={() => setActiveTab("analyzer")} className="glowing-btn py-3.5 px-6 text-[14px] shrink-0 rounded-xl">
                  Launch Analyzer <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* -------------------- TAB 2: CLAUSE ANALYZER -------------------- */}
          {activeTab === "analyzer" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 animate-fade-in min-h-[750px] lg:h-[calc(100vh-280px)]">

              <div className="lg:col-span-7 glass-card p-8 lg:p-10 flex flex-col h-full bg-white border-slate-200">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-base font-bold font-display text-slate-900">Source Agreement Sandbox</span>
                  </div>
                  <span className="text-[12px] text-slate-500 font-medium">Click block to inspect</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 flex flex-col gap-6 font-mono text-[13px] text-slate-600 leading-loose">
                  {analysis.clauses && analysis.clauses.length > 0 ? (
                    <div className="space-y-5 pb-6">
                      {analysis.clauses.map((clause: any) => {
                        let borderClass = "border-l-4 border-l-red-500 bg-red-50/50 hover:bg-red-50";
                        if (clause.severity === "Critical") borderClass = "border-l-4 border-l-red-500 bg-red-50/50 hover:bg-red-50";
                        else if (clause.severity === "High") borderClass = "border-l-4 border-l-amber-500 bg-amber-50/50 hover:bg-amber-50";
                        else if (clause.severity === "Medium") borderClass = "border-l-4 border-l-purple-500 bg-purple-50/50 hover:bg-purple-50";
                        else if (clause.severity === "Low") borderClass = "border-l-4 border-l-blue-500 bg-blue-50/50 hover:bg-blue-50";

                        let badgeClass = "badge-safe";
                        if (clause.severity === "Critical") badgeClass = "badge-critical";
                        else if (clause.severity === "High") badgeClass = "badge-high";
                        else if (clause.severity === "Medium") badgeClass = "badge-medium";
                        else if (clause.severity === "Low") badgeClass = "badge-low";

                        const isActive = selectedClause?.id === clause.id;
                        const activeGlow = isActive ? "clause-card-active shadow-md" : "shadow-sm";

                        return (
                          <div key={clause.id} onClick={() => handleClauseClick(clause)} className={`p-6 rounded-r-2xl border border-slate-200 cursor-pointer transition-all duration-300 ${borderClass} ${activeGlow}`}>
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-display font-bold text-slate-900 text-base leading-tight pr-4">
                                {clause.title}
                              </span>
                              <span className={`severity-badge ${badgeClass} text-[11px] py-1 px-3 shadow-sm shrink-0`}>
                                {clause.severity}
                              </span>
                            </div>
                            <p className="text-[13px] leading-relaxed text-slate-700 italic line-clamp-3">
                              "{clause.originalText}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="italic text-center py-20 text-slate-400">No structured clauses extracted.</p>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col h-full">
                {selectedClause ? (
                  <div className="glass-card p-8 lg:p-10 border-slate-200 bg-white shadow-sm flex flex-col justify-between overflow-y-auto h-full">
                    <div>
                      <div className="flex justify-between items-start border-b border-slate-100 pb-5 mb-8">
                        <div>
                          <span className="text-[11px] text-blue-600 font-bold tracking-widest uppercase">Clause Dissected</span>
                          <h4 className="text-lg font-bold font-display text-slate-900 mt-2">{selectedClause.title}</h4>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h5 className="text-[12px] text-slate-400 font-bold font-display uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Original Legalese
                        </h5>
                        <div className="bg-slate-50/80 rounded-xl p-5 text-[13px] font-mono leading-loose text-slate-600 border border-slate-200 italic shadow-inner">
                          "{selectedClause.originalText}"
                        </div>
                      </div>

                      <div className="mb-8">
                        <h5 className="text-[12px] text-blue-600 font-bold font-display uppercase tracking-widest mb-3 flex items-center gap-2">
                          <FileCheck className="w-4 h-4" /> Plain English Translation
                        </h5>
                        <p className="text-[14px] leading-loose text-slate-700 font-medium">
                          {selectedClause.translation}
                        </p>
                      </div>

                      <div className="mb-8">
                        <h5 className="text-[12px] text-red-500 font-bold font-display uppercase tracking-widest mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Hidden Risk Trap
                        </h5>
                        <p className="text-[14px] leading-loose text-slate-700 font-medium">
                          {selectedClause.hiddenTrap}
                        </p>
                      </div>

                      <div className="mb-8">
                        <h5 className="text-[12px] text-amber-600 font-bold font-display uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Scenario Implication
                        </h5>
                        <p className="text-[14px] leading-loose text-slate-700 border-l-4 border-amber-400 pl-5 py-2 italic bg-amber-50/50 rounded-r-xl">
                          {selectedClause.practicalImplication}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-6 border-t border-slate-100">
                      <h5 className="text-[12px] text-emerald-600 font-bold font-display uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Actionable Counter-Proposal
                      </h5>
                      <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-[13px] leading-loose text-emerald-900 font-mono font-medium">
                          {selectedClause.counterProposal}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-10 text-center flex flex-col items-center justify-center h-full border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <HelpCircle className="w-12 h-12 text-slate-300 mb-6" />
                    <h4 className="text-base font-bold font-display text-slate-500">No Clause Selected</h4>
                    <p className="text-[14px] text-slate-400 max-w-[280px] mt-2 leading-relaxed font-medium">
                      Select a clause block from the left panel to launch the dissection drawer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -------------------- TAB 3: SCENARIO SIMULATOR -------------------- */}
          {activeTab === "simulator" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 animate-fade-in">

              <div className="lg:col-span-4 glass-card p-10 flex flex-col justify-between min-h-[400px] bg-white border-slate-200">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Terminal className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-bold font-display text-slate-900">Hypothetical Sandbox</h3>
                  </div>
                  <p className="text-[14px] text-slate-500 leading-relaxed mb-8 font-medium">
                    Select a common real-world scenario below to simulate how this specific contract dictates the legal outcome of your actions.
                  </p>

                  <div className="space-y-4">
                    <label className="text-[11px] font-bold font-display text-slate-400 uppercase tracking-widest block mb-4">Choose Scenario Action:</label>
                    {analysis.simulations && analysis.simulations.map((sim: any, idx: number) => {
                      const isActive = selectedScenario?.scenario === sim.scenario;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedScenario(sim)}
                          className={`w-full text-left p-5 rounded-2xl border text-[14px] leading-relaxed transition-all font-display font-semibold ${isActive
                              ? "bg-purple-50 border-purple-200 text-purple-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:border-purple-200 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                          {sim.scenario}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col h-full">
                {selectedScenario ? (
                  <div className="glass-card p-10 flex flex-col justify-between h-full bg-white border-slate-200">
                    <div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-8">
                        <div>
                          <span className="text-[11px] text-purple-600 uppercase tracking-widest font-bold">Scenario Consequence Report</span>
                          <h4 className="text-xl font-bold font-display text-slate-900 mt-2">"{selectedScenario.scenario}"</h4>
                        </div>
                        {(() => {
                          let badgeClass = "badge-safe";
                          if (selectedScenario.severity === "Critical") badgeClass = "badge-critical";
                          else if (selectedScenario.severity === "Warning") badgeClass = "badge-high";
                          return <span className={`severity-badge ${badgeClass} text-[11px] px-4 py-1.5 shadow-sm`}>{selectedScenario.severity}</span>;
                        })()}
                      </div>

                      <div>
                        <h5 className="text-[12px] text-red-500 font-bold font-display uppercase tracking-widest mb-4 flex items-center gap-2">
                          <AlertOctagon className="w-5 h-5" /> Simulated Legal Consequence
                        </h5>
                        <div className="bg-slate-50/80 rounded-2xl p-8 border border-slate-200 text-slate-700 font-mono text-[14px] leading-loose shadow-inner">
                          {selectedScenario.outcome}
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 p-6 bg-purple-50/80 border border-purple-100 rounded-2xl flex gap-5 items-center shadow-sm">
                      <Shield className="w-8 h-8 text-purple-600 shrink-0" />
                      <div>
                        <h6 className="text-[14px] font-bold text-purple-900 font-display">LexGuard Security Suggestion</h6>
                        <p className="text-[13px] text-purple-800/80 mt-2 leading-relaxed font-medium">
                          To resolve this consequence, head over to the <strong>Negotiation Copilot</strong> tab and copy our customized counter-proposal regarding these restrictive terms.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-10 text-center flex flex-col items-center justify-center h-full border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <HelpCircle className="w-12 h-12 text-slate-300 mb-6" />
                    <h4 className="text-base font-bold font-display text-slate-500">No Scenario Triggered</h4>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* -------------------- TAB 4: NEGOTIATION COPILOT -------------------- */}
          {activeTab === "negotiator" && (
            <div className="grid grid-cols-1 gap-10 animate-fade-in pb-10">
              <div className="glass-card p-8 lg:p-10 bg-white border-slate-200 shadow-sm">
                <h3 className="text-base font-bold font-display text-slate-900 mb-3 flex items-center gap-3">
                  <CheckSquare className="w-6 h-6 text-emerald-600" />
                  Equalizer Negotiation Dashboard
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed max-w-3xl font-medium mt-2">
                  Ready to equalize this contract? Below are the key points of dispute extracted by our AI workflow. Review each suggestion and copy-paste the friendly, professional email templates directly into your negotiations thread.
                </p>
              </div>

              {analysis.negotiationCheatsheet && analysis.negotiationCheatsheet.map((point: any, idx: number) => {
                const isCopied = copiedIndex === idx;
                return (
                  <div key={idx} className="glass-card p-8 lg:p-12 flex flex-col justify-between bg-white border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6 mb-8">
                      <div>
                        <span className="text-[11px] text-emerald-600 uppercase tracking-widest font-bold">Dispute Point {idx + 1}</span>
                        <h4 className="text-lg font-bold font-display text-slate-900 mt-2">{point.point}</h4>
                      </div>

                      <button
                        onClick={() => handleCopyTemplate(point.emailTemplate, idx)}
                        className={`glowing-btn py-3 px-5 text-[13px] rounded-xl tracking-wide transition-all flex items-center gap-2 ${isCopied ? "bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.3)]" : ""
                          }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4" /> Copied Template
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy Email Template
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-5">
                        <h5 className="text-[12px] text-slate-400 font-bold font-display uppercase tracking-widest mb-4">LexGuard Strategy Recommendation</h5>
                        <p className="text-[14px] leading-loose text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-100 font-medium">
                          {point.recommendation}
                        </p>
                      </div>

                      <div className="lg:col-span-7">
                        <h5 className="text-[12px] text-blue-600 font-bold font-display uppercase tracking-widest mb-4">Copy-Pasteable Negotiation Segment</h5>
                        <div className="bg-blue-50/80 rounded-2xl p-8 text-[14px] font-mono leading-loose text-blue-900 border border-blue-100 select-all whitespace-pre-wrap shadow-inner">
                          {point.emailTemplate}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      {/* Contextual AI Assistant Floating Copilot */}
      <AICopilot contractText={contractText} />
    </div>
  );
}
