# LEXGUARD: AI Rights & Contract Intelligence System

LexGuard is an adversarial full-stack AI legal document intelligence platform designed to protect individuals, developers, and small organizations from predatory, restrictive, or unfavorable terms in binding agreements. 

By utilizing **Google Gemini AI** and a custom **Zero-Ops Sandbox**, LexGuard translates complex legalese into human-speak, exposes hidden risk liabilities, simulates real-world scenario consequences, and generates actionable, professional counter-proposal emails to equalize your negotiations in seconds.

👉 **Live Production URL:** **[https://lexguard-130493687294.us-central1.run.app](https://lexguard-130493687294.us-central1.run.app)**

---

## ⚡ Key Platform Features

*   **Aggregated Danger Index**: Visual circular SVG risk gauge scoring (0–100%) and a categorized matrix (Financial, IP Ownership, Restrictive Covenants, Liability, Termination) tracking contract danger levels.
*   **Interactive Clause Analyzer**: Clickable color-coded clause highlights linked to an active **Sliding Cyber Side Drawer** that delivers:
    *   *Plain-English Translation*: Direct translations of complex legalese.
    *   *Hidden Risk Trap*: Clear explanations of the hidden legal trap being set.
    *   *Scenario Implication*: Real-world legal consequences of signing.
    *   *Actionable Counter-Proposal*: Professional alternative wording to propose.
*   **Hypothetical Consequence Simulator**: Interactive sandbox dropdowns letting you test action outcomes (e.g., "What happens if I quit to start a similar agency?", "Can I showcase this on my portfolio?") to see legal consequences in real-time.
*   **Negotiation Copilot**: Dispute dashboards providing step-by-step master checklists of demands alongside copy-pasteable professional email templates to send directly to contracting threads.
*   **Volatile Sandbox Security**: Custom contract text is processed entirely in volatile RAM and is never stored in external databases, guaranteeing confidentiality.

---

## 🛠️ Technology Stack & Architecture

*   **Core Framework**: Next.js App Router (TypeScript, React 19)
*   **Adversarial AI Layer**: Google Gemini API via official `@google/generative-ai` SDK (`gemini-1.5-flash` model), running under JSON MIME schema prompts for structured low-latency operations.
*   **Styling & Micro-animations**: Vanilla CSS (Obsidian dark theme tokens, HSL severity indicators, neon glow borders, and sliding panels).
*   **Containerization**: Optimized standalone multi-stage `Dockerfile` (Node 20 Alpine).
*   **Serverless Infrastructure**: Google Cloud Run (deployed in project `volunteerconnect-496004`, region `us-central1`).

---

## 🚀 Local Development Setup

To run LexGuard locally, follow these simple setup steps:

### 1. Prerequisites & Keys
Obtain a Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/). Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*Note: If no API key is specified, LexGuard incorporates a dynamic mock fallback parser so all visual flows and dynamic presets remain fully interactive and operational.*

### 2. Installation & Execution
Install packages and start the Next.js development server:

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Production Compilation & Docker Build
To test optimized standalone compilations:

```bash
# Verify TypeScript and static generation build
npm run build

# Run production build locally
npm run start
```

To build and run the optimized container using Docker:

```bash
# Build Docker container image
docker build -t lexguard .

# Run Docker container locally
docker run -p 8080:8080 --env GEMINI_API_KEY=your_gemini_api_key lexguard
```

---

## 🌐 Google Cloud Run Deployment

This project is configured for serverless containers. To deploy directly from your local terminal configuration to Google Cloud Run:

```bash
# Login to your Google Cloud SDK
gcloud auth login

# Deploy workspace folder directly to Cloud Run
gcloud run deploy lexguard \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --project volunteerconnect-496004
```

---

## 🔒 Security Promise
*   **Zero Storage**: Uploaded files and texts are never written to disk or stored.
*   **Sandbox Sandbox**: Volatile, browser-to-Gemini direct streaming.
*   **No Legal Advice**: LexGuard is meant for educational contract intelligence and negotiation equalization. Always seek legal counsel for formal advice.
