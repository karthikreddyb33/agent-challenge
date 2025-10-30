Solana DeFi Sentinel

AI-Powered Blockchain Risk Detection Agent
Built for Nosana Agents 102 Challenge

🚀 Overview

Solana DeFi Sentinel is an intelligent AI agent that continuously monitors Solana wallets to detect risks like rug pulls, liquidity drains, and suspicious token behavior.
Powered by Mastra Agents, FastAPI, and Next.js, it performs real-time on-chain analysis with explainable AI — fully containerized and deployable on the Nosana decentralized compute network.

:

🧩 Architecture Flow (Step-by-Step)

🎨 Frontend (Next.js + Tailwind CSS)

Displays wallet input form and “Analyze Wallet” button.

Renders dashboard with:

Trust Score gauge

Risk Level indicator

Token risk table

Transaction activity chart

Communicates with backend via REST API and WebSocket.

⚙️ Backend (FastAPI + Mastra Framework)

Coordinates all AI agents and data processing.

Core components:

Transaction Monitor → Tracks on-chain activity.

Token Forensics → Analyzes token authenticity and liquidity.

Risk Advisor (AI) → Aggregates scores and explains risk level.

Handles REST endpoints like /api/analyze_wallet and /api/explain.

🧠 Mastra MCP Tools

Specialized blockchain intelligence modules:

Solana Data Fetcher → Pulls wallet transactions and token info.

Liquidity Checker → Checks token liquidity and volume stability.

Contract Scanner → Verifies smart contracts and detects scams.

🌐 Solana RPC / External APIs

Provides blockchain data (transactions, token metadata, prices).

Can use public or private RPC endpoints.

Acts as the data backbone for MCP tools and AI analysis.

🪄 AI Inference & Risk Analysis

Combines fetched data + model reasoning to produce:

Trust Score (0–100)

Risk Category (Low / Medium / High)

Summary explanation and recommendations.

📊 Response Handling

Backend returns analyzed JSON response to frontend.

Frontend updates dashboard visuals dynamically.

🚨 Real-Time Monitoring (Optional)

WebSocket channel streams live risk alerts for suspicious activity.

⚙️ Tech Stack
Layer	Technology
Frontend	Next.js 15, TailwindCSS, Chart.js
Backend	FastAPI (Python) + WebSockets
AI Framework	Mastra Agent + Tool Calling
MCP Tools	Wallet Fetcher, Liquidity Checker, Contract Scanner
Model	Nosana Hosted LLM (qwen3:8b)
Deployment	Docker + Nosana Job Network
Languages	Python + TypeScript
🧠 Key Features

🔍 Wallet Risk Analysis — Analyze any Solana wallet’s tokens, liquidity, and holder concentration

⚡ Real-Time Alerts — Detect sudden large transactions or liquidity drains instantly

🧰 Three Specialist Agents

Transaction Monitor: Tracks unusual movements

Token Forensics: Analyzes token metadata & liquidity

Risk Advisor: AI-generated risk score & recommendation

💬 Explainable AI: Each score comes with reasoning & confidence

📊 Interactive Dashboard: Visualized risk reports, alerts, and charts

🌐 Nosana Ready: Fully containerized & deployable

🛡️ Low-Cost Security Insight: Uses only public Solana RPCs — no wallet key required

🔐 Environment Variables

Create .env (based on .env.example):

OLLAMA_API_URL=https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PORT=3000
NODE_ENV=production

🧰 Local Setup
# 1️⃣ Clone and Install
git clone https://github.com/karthikreddyb33/agent-challenge.git
cd agent-challenge
cp .env.example .env
pnpm install

# 2️⃣ Run Frontend & Backend
pnpm run dev:ui        # Start UI server (http://localhost:3000)
pnpm run dev:agent     # Start Mastra Agent (http://localhost:4111)

🔍 Test It

Visit http://localhost:3000
,
enter a wallet address and click “Analyze Wallet”

Try demo addresses:

FksffEqnBRixYGR791Qw2MgdU7zNCpHVFYBL4Fa4qVuH
Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE
9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2

🧪 Simulate High-Risk Alerts

Trigger demo alerts locally:

python test_api.py --simulate-alert
