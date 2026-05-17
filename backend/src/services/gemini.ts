import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

/**
 * High-performance service wrapping Gemini 1.5 Flash
 * Provides structured legal document auditing and adversarial contract risk scanning.
 */
export async function analyzeContract(contractText: string): Promise<any> {
  const apiKey = config.geminiApiKey;

  // Gracefully fall back to dynamic mock analysis if the API key is not present
  if (!apiKey) {
    console.warn("[LexGuard Gemini Service] API key is missing. Falling back to dynamic mock contract parsing.");
    return generateMockAnalysis(contractText);
  }

  // Initialize Gemini Client
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-1.5-flash for low-latency structured JSON responses
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const systemPrompt = `You are LexGuard, an elite AI adversarial legal analyst and rights advocate. 
Your objective is to review the uploaded legal contract or document strictly from the perspective of the weaker/vulnerable party (e.g., the employee in an employment agreement, the freelancer/contractor in a freelance services agreement, or the consumer/user in a software Terms of Service or Privacy Policy).
Identify and dissect potentially harmful, predatory, unfair, broad, ambiguous, or high-risk clauses. Explain their real-world consequences in plain English, and provide actionable counter-proposals that would equalize the agreement.

You must output a strictly valid JSON document matching the following schema structure, with absolutely NO surrounding conversational text, markdowns, or markdown code blocks (except standard JSON format):

{
  "documentName": "Name of the document or contract analysed",
  "documentType": "employment" | "freelance" | "terms" | "nda" | "other",
  "overallRiskScore": 75, // Integer between 0 and 100 reflecting the aggregate severity of danger. 0-29 Safe, 30-59 Moderate, 60-79 High Risk, 80-100 Critical.
  "summary": "A powerful, concise 2-3 sentence overview of the agreement, stating who it favors and its largest red flags.",
  "riskBreakdown": {
    "financial": "Safe" | "Medium" | "High" | "Critical",
    "ipOwnership": "Safe" | "Medium" | "High" | "Critical",
    "restrictiveCovenants": "Safe" | "Medium" | "High" | "Critical",
    "liability": "Safe" | "Medium" | "High" | "Critical",
    "termination": "Safe" | "Medium" | "High" | "Critical"
  },
  "clauses": [
    {
      "id": "unique_clause_id_1",
      "title": "A short, descriptive, scary title for the clause (e.g., 'Lifetime Competitor Block')",
      "severity": "Low" | "Medium" | "High" | "Critical",
      "originalText": "The EXACT sentence or clause paragraph from the contract that is predatory or high risk",
      "translation": "A highly readable, plain-English translation explaining what this legalese actually means in blunt terms",
      "hiddenTrap": "The hidden danger or legal trick within this clause that an amateur would miss",
      "practicalImplication": "A real-world hypothetical situation showing what happens to the user if they violate or trigger this clause",
      "counterProposal": "An exact revision or friendly rewrite of this clause to propose during negotiations to protect their rights"
    }
  ],
  "simulations": [
    {
      "scenario": "A hypothetical user action (e.g., 'What happens if I quit this job to start a side-hustle?')",
      "outcome": "Clear legal outcome based on this contract's clauses, written in simple, warning language.",
      "severity": "Safe" | "Warning" | "Critical"
    }
  ],
  "negotiationCheatsheet": [
    {
      "point": "Short title of the negotiation point",
      "recommendation": "Practical advice on how to ask for the change",
      "emailTemplate": "A copy-pasteable, friendly, professional email paragraph the user can send to the client or company to request this specific revision"
    }
  ]
}

Analyze the following contract text:
"""
${contractText}
"""`;

  const result = await model.generateContent(systemPrompt);
  const responseText = result.response.text();
  
  // Parse and validate standard JSON return compliance
  return JSON.parse(responseText);
}

/**
 * Robust fallback generator if Gemini API key is missing.
 * Analyzes keywords in the uploaded contract and dynamically returns structured, high-fidelity mock risks.
 */
export function generateMockAnalysis(text: string): any {
  const lowercase = text.toLowerCase();
  let type = "other";
  let docName = "Custom Agreement";
  let score = 55;
  let summary = "This agreement contains standard legal templates but carries potential liabilities due to general risk and liability structures.";

  if (lowercase.includes("non-compete") || lowercase.includes("employment") || lowercase.includes("employer") || lowercase.includes("employee")) {
    type = "employment";
    docName = "Custom Employment Contract";
    score = 75;
    summary = "This custom employment agreement contains potential restrictive covenants, including non-compete clauses, and highly favorable intellectual property transfers for the employer.";
  } else if (lowercase.includes("freelance") || lowercase.includes("contractor") || lowercase.includes("client") || lowercase.includes("invoice")) {
    type = "freelance";
    docName = "Custom Freelance / Vendor Agreement";
    score = 68;
    summary = "This freelance services contract carries critical payment risks and immediate intellectual property transfer language before payment confirmation is verified.";
  } else if (lowercase.includes("terms") || lowercase.includes("privacy") || lowercase.includes("cookie") || lowercase.includes("platform")) {
    type = "terms";
    docName = "Custom Terms of Service & Privacy Policy";
    score = 80;
    summary = "This platform agreement features highly intensive user data collection parameters and reserves the unilateral right to amend service fees and terms without direct warning.";
  } else if (lowercase.includes("disclosure") || lowercase.includes("nda") || lowercase.includes("confidential")) {
    type = "nda";
    docName = "Custom Non-Disclosure Agreement";
    score = 45;
    summary = "This NDA features typical mutual confidentiality conditions, though it includes an unusually long protection term for trade secrets and a unilateral definition of information.";
  }

  const clauses: any[] = [];
  const simulations: any[] = [];
  const cheatsheet: any[] = [];

  // Match 1: Non-compete / Restriction
  if (lowercase.includes("compete") || type === "employment") {
    clauses.push({
      id: "mock_c1",
      title: "Restrictive Non-Compete Block",
      severity: "High",
      originalText: text.match(/[^.]*(compete|restrict|geographic)[^.]*\./gi)?.[0] || "Employee shall not engage in any competing operations during the term of active engagement and thereafter...",
      translation: "You are legally blocked from working for any competitor or launching your own similar agency after separation.",
      hiddenTrap: "The post-separation restriction period may prevent you from finding gainful employment in your exact professional field.",
      practicalImplication: "If you quit or are fired, you cannot take a similar job in your industry for a substantial length of time.",
      counterProposal: "Request to remove the post-employment non-compete, or limit it to 3 months and strict direct competitors only."
    });
    simulations.push({
      scenario: "Taking a job at another firm in the same industry",
      outcome: "You will likely trigger the restrictive non-compete covenant, which could lead to legal notices sent to your new employer.",
      severity: "Critical"
    });
    cheatsheet.push({
      point: "Minimize Non-Compete Duration",
      recommendation: "Request that any non-compete be capped at a maximum of 3 to 6 months and restricted to direct competitors only.",
      emailTemplate: "Regarding the non-compete covenant, I'd like to ask if we can reduce the post-employment term to 6 months, and limit it strictly to direct competitors. This helps me ensure career flexibility while protecting your core interests."
    });
  }

  // Match 2: Intellectual Property
  if (lowercase.includes("intellectual") || lowercase.includes("invention") || lowercase.includes("property") || type === "employment" || type === "freelance") {
    clauses.push({
      id: "mock_c2",
      title: "Broad Intellectual Property Grab",
      severity: "Critical",
      originalText: text.match(/[^.]*(intellectual|invention|assign|own)[^.]*\./gi)?.[0] || "All developments, intellectual properties, and designs shall belong exclusively to the company...",
      translation: "Anything you design or code—potentially even on your personal time—becomes the sole property of the company immediately.",
      hiddenTrap: "Broad assignment definitions do not clearly distinguish between work created during standard hours and personal side-projects created on weekends.",
      practicalImplication: "If you build a personal app on your own computer on a Saturday, the company could claim ownership of the code.",
      counterProposal: "Replace with standard wording that restricts ownership transfers strictly to developments created on work time, using work tools, and related to company business."
    });
    simulations.push({
      scenario: "Developing a side project on weekends",
      outcome: "The broad IP assignment clause might allow the company to assert full legal ownership over your independent weekend software.",
      severity: "Critical"
    });
    cheatsheet.push({
      point: "Limit Intellectual Property Assignment",
      recommendation: "Ensure a clause is added to protect personal hobby projects made in your free time using your own equipment.",
      emailTemplate: "Regarding the Intellectual Property section, I want to clarify that only inventions and materials created during standard work hours or directly for the company's business are assigned. I would appreciate adding: 'Inventions created outside standard working hours and unrelated to the Employer's business remain the sole property of the Employee.'"
    });
  }

  // Match 3: General Liability / Indemnity
  clauses.push({
    id: "mock_c3",
    title: "Uncapped General Liability Exposure",
    severity: "High",
    originalText: text.match(/[^.]*(indemnity|liable|damages|liability)[^.]*\./gi)?.[0] || "Contractor agrees to indemnify and hold Client harmless against all claims, liabilities, and damages...",
    translation: "If something goes wrong or a legal dispute arises, you must pay for all legal defense bills and losses out of your own pocket.",
    hiddenTrap: "Signing an uncapped indemnity clause creates massive legal vulnerability, subjecting you to potentially ruinous legal costs.",
    practicalImplication: "If a third party files an intellectual property or service lawsuit against the platform, you could be billed for all their expensive legal fees.",
    counterProposal: "Incorporate a standard cap on liability equal to the total amount paid under this specific agreement, and exclude consequential damages."
  });

  if (simulations.length === 0) {
    simulations.push({
      scenario: "A dispute arises over the quality of services",
      outcome: "You could face legal proceedings under Delaware law, with no limit on the damages you might be required to pay.",
      severity: "Warning"
    });
  }

  if (cheatsheet.length === 0) {
    cheatsheet.push({
      point: "Capping Legal Liability",
      recommendation: "Ask for a mutual cap on liability equal to the contract's total value to avoid catastrophic financial exposure.",
      emailTemplate: "Regarding the Indemnity and Liability clause, I would like to request that my total legal liability under this agreement be capped at the fees paid under this contract. This helps us establish a balanced business relationship."
    });
  }

  return {
    documentName: docName,
    documentType: type,
    overallRiskScore: score,
    summary: summary,
    riskBreakdown: {
      financial: score > 70 ? "High" : "Medium",
      ipOwnership: score > 75 ? "Critical" : "High",
      restrictiveCovenants: score > 75 ? "Critical" : "Medium",
      liability: "High",
      termination: "Medium"
    },
    clauses: clauses,
    simulations: simulations,
    negotiationCheatsheet: cheatsheet
  };
}

/**
 * Chat with the Gemini AI Copilot contextually based on the contract
 */
export async function chatWithCopilot(
  query: string, 
  contractText: string | null, 
  history: Array<{ sender: "user" | "bot"; text: string }>
): Promise<string> {
  const apiKey = config.geminiApiKey;

  if (!apiKey) {
    console.warn("[LexGuard Gemini Service] API key is missing. Falling back to mock chat replies.");
    return generateMockChatReply(query, contractText);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const historyPrompt = history.map(h => `${h.sender === "user" ? "User" : "LexGuard"}: ${h.text}`).join("\n");

    const prompt = `You are LexGuard, an elite AI legal advocate assistant. Your job is to help the user understand legal contracts, clarify their doubts, translate legalese, help them negotiate, and explain how the LexGuard website works and how to navigate it.

ABOUT LEXGUARD:
LexGuard is an adversarial legal intelligence SaaS platform that levels the playing field for contractors, freelancers, employees, and consumers against predatory contracts.

LEXGUARD WEBSITE FEATURES & NAVIGATION INSTRUCTIONS:
1. Landing Page:
   - Paste Contract / Upload: Paste raw contract text or drop a file directly in the main container, then click "Analyze Contract" to compile an active audit report.
   - Preset Document Templates: Choose one of the quick presets (e.g., Employment Contract, Freelance Agreement, Platform Terms of Service, Mutual NDA) at the bottom to test out immediate sandbox evaluations.
2. Dashboard Page:
   - Active Tab - Overview (Clause Analyzer): Located on the top left tab. Renders a comprehensive list of document clauses categorized and color-coded by severity (Critical, High, Medium, Low).
   - Sidebar Drawer: Click any clause block inside the Clause Analyzer to slide out the inspection drawer. It exposes the "Hidden Risk Trap", a "Scenario Implication" (plain English hypothetical outcome), and the exact "Actionable Counter-Proposal" for negotiations.
   - Active Tab - Scenario Simulator: Allows running and inspecting interactive simulations (e.g. "What happens if I quit to start a side-hustle?"). Shows warning, safe, and critical outcome blocks based on the contract text.
   - Active Tab - Negotiation Cheatsheet: Generates a tailored list of dispute points, including professional advice and copy-pasteable email templates the user can send to clients or companies.
   - Overall Risk Score: A beautiful glowing dynamic gauge at the top that grades the contract risk from Safe (0-29), Moderate (30-59), High Risk (60-79), to Critical (80-100).
   - Theme Toggle (Light/Dark Mode): Clicking the Sun/Moon icon in the upper-right corner toggles between a clean, professional Light Mode and a deep, neon slate Space Dark Mode.
   - Print Report: Click the "Print Report" button at the top header of the Dashboard to export/print a beautifully formatted physical copy or PDF audit.
   - Navigating Back: Click the "Analyze Another Contract" back arrow in the upper-left corner of the dashboard to return to the landing page.

${contractText ? `
Here is the context of the legal contract the user has currently uploaded or is viewing:
"""
${contractText.substring(0, 8000)}
"""
` : "The user has not uploaded any contract yet. Act as a general AI Legal Copilot."}

Here is the conversation history:
${historyPrompt}

User's new question: "${query}"

Guidelines:
1. Provide a clear, professional, and friendly answer. 
2. Be direct, avoid unnecessary generic legal disclaimers (though you may state that this is for educational/negotiation assistance and not formal legal advice, keep it brief).
3. If they ask about the uploaded contract, reference actual details from the contract text provided above.
4. If they ask about the LexGuard website, its features, how it works, or how to navigate it, reference the "LEXGUARD WEBSITE FEATURES & NAVIGATION INSTRUCTIONS" above to give exact, friendly steps on what buttons to click or which tabs to open!
5. Keep your formatting clean, using bullet points and bold text where helpful.

Response:`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("[LexGuard Gemini Service] Chat error:", error);
    return `I apologize, but I encountered an error while processing your request: ${error.message}`;
  }
}

/**
 * Robust mock replier if Gemini key is missing
 */
export function generateMockChatReply(query: string, contractText: string | null): string {
  const q = query.toLowerCase();
  
  if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
    return "Hello! I am your LexGuard Legal Copilot. " + (contractText ? "I've analyzed your contract and am ready to answer any questions you have about it! What would you like to clarify?" : "I'm ready to help you understand legal agreements, NDAs, freelance terms, or general contract queries. How can I assist you today?");
  }

  if (q.includes("website") || q.includes("lexguard") || q.includes("does this do") || q.includes("what is this") || q.includes("about this") || q.includes("how to use") || q.includes("purpose")) {
    return "**LexGuard** is an adversarial legal intelligence platform designed to protect your rights! It audits legal contracts (like employment terms, freelance vendor agreements, NDAs, and platform ToS) strictly from the perspective of the weaker/vulnerable party to flag predatory clauses.\n\n**How to use LexGuard:**\n1. Go to the **Landing Page**, paste your contract text, or select one of our pre-configured templates (like the Employment Agreement).\n2. Click **Analyze Contract** to generate your audit.\n3. Explore the **Dashboard** tabs: **Overview** (to inspect clauses in detail), **Scenario Simulator** (to run hypotheticals), and **Negotiation Cheatsheet** (to copy negotiation email templates!).";
  }
  
  if (q.includes("navigate") || q.includes("tab") || q.includes("find") || q.includes("where is") || q.includes("how do i") || q.includes("how to navigate")) {
    return "Here is a quick navigation guide for the **LexGuard Dashboard**:\n\n* 🔍 **Clause Inspector**: Go to the **Overview** tab, and click on any colored clause card (Critical, High, Medium, Low). An interactive side drawer will open, revealing the **Hidden Trap**, **Scenario Implication**, and **Actionable Counter-Proposal**.\n* 🎮 **Simulations**: Switch to the **Scenario Simulator** tab to run hypothetical scenario outcomes (like starting side-hustles or quitting notice periods).\n* ✉️ **Negotiation Emails**: Switch to the **Negotiation Cheatsheet** tab to copy tailored draft emails for revising high-risk terms.\n* 🌓 **Dark Mode Toggle**: Click the Sun/Moon icon in the top header to instantly toggle between Light Mode and deep slate Space Dark Mode.\n* 🖨️ **Print/PDF**: Click **Print Report** in the top header to save or print physical copies of your AI contract audit!";
  }
  
  if (q.includes("upload") || q.includes("analyze") || q.includes("custom") || q.includes("file")) {
    return "To audit your own custom contract:\n1. Click the back arrow **'Analyze Another Contract'** at the top-left to go to the **Landing Page**.\n2. Paste your contract text directly into the main text area, or drag and drop a contract file.\n3. Click **Analyze Contract** to trigger a real-time Gemini adversarial contract evaluation!";
  }

  if (q.includes("dark mode") || q.includes("light mode") || q.includes("theme") || q.includes("yellow") || q.includes("black")) {
    return "You can instantly toggle between Light Mode and our premium Space Dark Mode by clicking the **Sun / Moon icon** in the top right corner of the dashboard or landing page header. This will adjust all cards, severe clause colors, and glowing charts to match your visual comfort perfectly!";
  }
  
  if (q.includes("non-compete") || q.includes("compete")) {
    return "Non-compete clauses are restrictive covenants that block you from working for competitors after leaving. In your current document, you have a high-risk non-compete clause. I recommend negotiating to limit the restriction to a maximum of 3 months and confining it strictly to direct competitors.";
  }
  
  if (q.includes("ip") || q.includes("intellectual") || q.includes("property") || q.includes("own") || q.includes("creative")) {
    return "Intellectual property ownership determines who owns the work you create. Under broad contracts, companies often claim ownership of everything you develop—even on your weekends! To protect your side projects, you should request a clause clarifying that only inventions created on work hours and directly related to the employer's business are assigned.";
  }
  
  if (q.includes("liability") || q.includes("indemnity") || q.includes("sue") || q.includes("damage")) {
    return "Liability exposure defines your financial risk if things go wrong. If you sign an uncapped general indemnity, you could be billed for massive legal costs. We strongly recommend adding a standard cap on liability equal to the total amount paid under the agreement.";
  }
  
  if (q.includes("terminate") || q.includes("quit") || q.includes("fire")) {
    return "Termination clauses dictate how either party can end the agreement. You should check if the notice periods are balanced (e.g. 15 or 30 days for both parties) and verify if there are any immediate 'for cause' termination triggers that seem unfairly heavily weighted against you.";
  }
  
  return "That's a great question! Based on my legal sandbox engine, that aspect is critical for balanced relationships. You should ideally request a clear boundary limit, specify clear timeframes, and make sure any obligations are strictly mutual. Is there any specific section of the contract you'd like me to explain?";
}
