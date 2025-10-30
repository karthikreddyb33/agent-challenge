# 🛰️ Solana DeFi Sentinel
AI-Powered Blockchain Risk Detection Agent

Built for Nosana Agents 102 Challenge

An intelligent AI agent that monitors Solana wallets, analyzes token safety, and detects on-chain risks in real-time — powered by Mastra Agents, FastAPI, and Next.js, and deployed on the Nosana decentralized compute network.

## 🚀 Overview

Solana DeFi Sentinel is a next-generation decentralized intelligence system designed to enhance security in the Solana DeFi ecosystem. It continuously monitors wallets, token movements, and liquidity conditions, then uses AI-driven risk evaluation to detect suspicious activity such as rug pulls, liquidity drains, or ownership concentration.

This project demonstrates real-time AI orchestration, MCP tools integration, and live frontend synchronization — fully deployed and containerized for the Nosana network.

## 🧩 Architecture

```
 ┌────────────────────────────┐
 │        Frontend (Next.js) │
 │  Tailwind UI + Wallet Form │
 │      Risk Dashboard +      │
 │     Live Alerts/Charts     │
 └────────────┬───────────────┘
              │ REST / WS
 ┌────────────▼───────────────┐
 │     Backend (FastAPI)      │
 │   Mastra Agent Orchestration│
 │   Coordinator + 3 Subagents │
 │  ├─ Transaction Monitor     │
 │  ├─ Token Forensics         │
 │  └─ Risk Advisor (AI)       │
 └────────────┬───────────────┘
              │ MCP Tools
 ┌────────────▼───────────────┐
 │ Solana Data Fetcher        │
 │ Liquidity Checker          │
 │ Contract Scanner           │
 └────────────┬───────────────┘
              │
       Solana RPC / APIs
```

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 + TailwindCSS + Chart.js |
| **Backend** | FastAPI (Python) + WebSockets |
| **AI Framework** | Mastra Agent + Tool Calling |
| **MCP Tools** | Custom-built: Wallet Fetcher, Liquidity Checker, Contract Scanner |
| **Model Endpoint** | Nosana Hosted LLM (qwen3:8b) |
| **Deployment** | Docker + Nosana Job Network |
| **Language** | Python + TypeScript |

## 🧠 Features

- 🔍 **Wallet Risk Analysis** — Analyze any Solana wallet's tokens, liquidity, and holder patterns.
- ⚡ **Real-Time Alerts** — Detect sudden large transactions or liquidity drains instantly.
- 🧰 **Three Specialist Agents**:
  - Transaction Monitor – Tracks suspicious activity.
  - Token Forensics – Evaluates token metadata, holder concentration, and liquidity.
  - Risk Advisor – Provides AI-generated risk summaries and recommendations.
- 💬 **Explainable AI** — Each risk score includes reasoning & confidence via the explain engine.
- 📊 **Interactive Dashboard** — Visualize token risks, transactions, and trust score dynamically.
- 🌐 **Nosana Ready** — Fully containerized for decentralized compute deployment.

## 🔐 Environment Variables

Create a `.env` file (based on `.env.example`):

```env
OLLAMA_API_URL=https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b
OPENAI_API_KEY=      # optional fallback
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PORT=3000
NODE_ENV=production
```

## 🧰 Local Setup & Run

### 1️⃣ Clone and Install

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/agent-challenge.git
cd agent-challenge
cp .env.example .env
pnpm install
```

### 2️⃣ Start the Application

```bash
pnpm run dev:ui       # Frontend (Next.js)
pnpm run dev:agent    # Backend Agent (FastAPI)
```

### 3️⃣ Open the App

1. Visit: http://localhost:3000
2. Paste any public Solana wallet address and click "Analyze Wallet"
3. Try these demo addresses:
   - [FksffEqnBRixYGR791Qw2MgdU7zNCpHVFYBL4Fa4qVuH](https://solscan.io/address/FksffEqnBRixYGR791Qw2MgdU7zNCpHVFYBL4Fa4qVuH)
   - [Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE](https://solscan.io/address/Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE)
   - [9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2](https://solscan.io/address/9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2)

## 🧪 Simulate Alerts Locally

To simulate a high-risk alert in your backend (for demo):

```bash
python backend/test_connection.py --simulate-alert
```

This triggers a WebSocket broadcast → your dashboard will show a live alert notification.

## 🚀 Deployment

### Docker Build & Run

```bash
# Build the Docker image
docker build -t yourusername/agent-challenge .

# Run the container
docker run -p 3000:3000 yourusername/agent-challenge:latest 

# Push to Docker Hub
docker login
docker push yourusername/agent-challenge:latest
```

### Nosana Deployment

1. Set up your Nosana account and install the CLI
2. Configure your project:
   ```bash
   nosana init
   ```
3. Deploy your agent:
   ```bash
   nosana deploy
   ```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by the Nosana Community
- Powered by Mastra Agents
- Special thanks to all contributors

**Your Mission:** Build an intelligent AI agent with a frontend interface and deploy it on Nosana's decentralized network.

### What You'll Build

Create an AI agent that performs real-world tasks using:
- **Mastra framework** for agent orchestration
- **Tool calling** to interact with external services
- **MCP (Model Context Protocol)** for enhanced capabilities
- **Custom frontend** to showcase your agent's functionality

### Agent Ideas & Examples

The possibilities are endless! Here are some ideas to get you started:

- 🤖 **Personal Assistant** - Schedule management, email drafting, task automation
- 📊 **Data Analyst Agent** - Fetch financial data, generate insights, create visualizations
- 🌐 **Web Researcher** - Aggregate information from multiple sources, summarize findings
- 🛠️ **DevOps Helper** - Monitor services, automate deployments, manage infrastructure
- 🎨 **Content Creator** - Generate social media posts, blog outlines, marketing copy
- 🔍 **Smart Search** - Multi-source search with AI-powered result synthesis
- 💬 **Customer Support Bot** - Answer FAQs, ticket routing, knowledge base queries

**Be Creative!** The best agents solve real problems in innovative ways.

## Getting Started Template

This is a starter template for building AI agents using [Mastra](https://mastra.ai) and [CopilotKit](https://copilotkit.ai). It provides a modern Next.js application with integrated AI capabilities and a beautiful UI.

## Getting Started

### Prerequisites & Registration

To participate in the challenge and get Nosana credits/NOS tokens, complete these steps:

1. Register at [SuperTeam](https://earn.superteam.fun/listing/nosana-builders-challenge-agents-102)
2. Register at the [Luma Page](https://luma.com/zkob1iae)
3. Star these repos:
   - [this repo](https://github.com/nosana-ci/agent-challenge)
   - [Nosana CLI](https://github.com/nosana-ci/nosana-cli)
   - [Nosana SDK](https://github.com/nosana-ci/nosana-sdk)
4. Complete [this registration form](https://e86f0b9c.sibforms.com/serve/MUIFALaEjtsXB60SDmm1_DHdt9TOSRCFHOZUSvwK0ANbZDeJH-sBZry2_0YTNi1OjPt_ZNiwr4gGC1DPTji2zdKGJos1QEyVGBzTq_oLalKkeHx3tq2tQtzghyIhYoF4_sFmej1YL1WtnFQyH0y1epowKmDFpDz_EdGKH2cYKTleuTu97viowkIIMqoDgMqTD0uBaZNGwjjsM07T)

### Setup Your Development Environment

#### **Step 1: Fork, Clone and Quickstart**

```bash
# Fork this repo on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/agent-challenge

cd agent-challenge

cp .env.example .env

pnpm i

pnpm run dev:ui      # Start UI server (port 3000)
pnpm run dev:agent   # Start Mastra agent server (port 4111)
```

Open <http://localhost:3000> to see your agent in action in the frontend.
Open <http://localhost:4111> to open up the Mastra Agent Playground.

#### **Step 2: Choose Your LLM for Development (Optional)**

Pick one option below to power your agent during development:

##### Option A: Use Shared Nosana LLM Endpoint (Recommended - No Setup!)

We provide a free LLM endpoint hosted on Nosana for development. Edit your `.env`:

```env
# Qwen3:8b - Nosana Endpoint
# Note baseURL for Ollama needs to be appended with `/api`
OLLAMA_API_URL=https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b
```

If it goes down, reach out on [Discord](https://discord.com/channels/236263424676331521/1354391113028337664)

##### Option B: Use Local LLM

Run Ollama locally (requires [Ollama installed](https://ollama.com/download)):

```bash
ollama pull qwen3:0.6b
ollama serve
```

Edit your `.env`:
```env
OLLAMA_API_URL=http://127.0.0.1:11434/api
MODEL_NAME_AT_ENDPOINT=qwen3:0.6b
```

##### Option C: Use OpenAI

Add to your `.env` and uncomment the OpenAI line in `src/mastra/agents/index.ts`:

```env
OPENAI_API_KEY=your-key-here
```

## 🏗️ Implementation Timeline

**Important Dates:**
- Start Challenge: 10 October
- Submission Deadline: 31 October
- Winners Announced: 07 November

### Phase 1: Development

1. **Setup** : Fork repo, install dependencies, choose template
2. **Build** : Implement your tool functions and agent logic
3. **Test** : Validate functionality at http://localhost:3000

### Phase 2: Containerization

1. **Clean up**: Remove unused agents from `src/mastra/index.ts`
2. **Build**: Create Docker container using the provided `Dockerfile`
3. **Test locally**: Verify container works correctly

```bash
# Build your container (using the provided Dockerfile)
docker build -t yourusername/agent-challenge:latest .

# Test locally first
docker run -p 3000:3000 yourusername/agent-challenge:latest 

# Push to Docker Hub
docker login
docker push yourusername/agent-challenge:latest
```

### Phase 3: Deployment to Nosana
1. **Deploy your complete stack**: The provided `Dockerfile` will deploy:
   - Your Mastra agent
   - Your frontend interface
   - An LLM to power your agent (all in one container!)
2. **Verify**: Test your deployed agent on Nosana network
3. **Capture proof**: Screenshot or get deployment URL for submission

### Phase 4: Video Demo

Record a 1-3 minute video demonstrating:
- Your agent **running on Nosana** (show the deployed version!)
- Key features and functionality
- The frontend interface in action
- Real-world use case demonstration
- Upload to YouTube, Loom, or similar platform

### Phase 5: Documentation

Update this README with:
- Agent description and purpose
- What tools/APIs your agent uses
- Setup instructions
- Environment variables required
- Example usage and screenshots

## ✅ Minimum Requirements

Your submission **must** include:

- [ ] **Agent with Tool Calling** - At least one custom tool/function
- [ ] **Frontend Interface** - Working UI to interact with your agent
- [ ] **Deployed on Nosana** - Complete stack running on Nosana network
- [ ] **Docker Container** - Published to Docker Hub
- [ ] **Video Demo** - 1-3 minute demonstration
- [ ] **Updated README** - Clear documentation in your forked repo
- [ ] **Social Media Post** - Share on X/BlueSky/LinkedIn with #NosanaAgentChallenge

## Submission Process

1. **Complete all requirements** listed above
2. **Commit all of your changes to the `main` branch of your forked repository**
   - All your code changes
   - Updated README
   - Link to your Docker container
   - Link to your video demo
   - Nosana deployment proof
3. **Social Media Post** (Required): Share your submission on X (Twitter), BlueSky, or LinkedIn
   - Tag @nosana_ai
   - Include a brief description of your agent
   - Add hashtag #NosanaAgentChallenge
4. **Finalize your submission on the [SuperTeam page](https://earn.superteam.fun/listing/nosana-builders-challenge-agents-102)**
   - Add your forked GitHub repository link
   - Add a link to your social media post
   - Submissions that do not meet all requirements will not be considered

## 🚀 Deploying to Nosana


### Using Nosana Dashboard
1. Open [Nosana Dashboard](https://dashboard.nosana.com/deploy)
2. Click `Expand` to open the job definition editor
3. Edit `nos_job_def/nosana_mastra.json` with your Docker image:
   ```json
   {
     "image": "yourusername/agent-challenge:latest"
   }
   ```
4. Copy and paste the edited job definition
5. Select a GPU
6. Click `Deploy`

### Using Nosana CLI (Alternative)
```bash
npm install -g @nosana/cli
nosana job post --file ./nos_job_def/nosana_mastra.json --market nvidia-3090 --timeout 30
```

## 🏆 Judging Criteria

Submissions evaluated on 4 key areas (25% each):

### 1. Innovation 🎨
- Originality of agent concept
- Creative use of AI capabilities
- Unique problem-solving approach

### 2. Technical Implementation 💻
- Code quality and organization
- Proper use of Mastra framework
- Efficient tool implementation
- Error handling and robustness

### 3. Nosana Integration ⚡
- Successful deployment on Nosana
- Resource efficiency
- Stability and performance
- Proper containerization

### 4. Real-World Impact 🌍
- Practical use cases
- Potential for adoption
- Clear value proposition
- Demonstration quality

## 🎁 Prizes

**Top 10 submissions will be rewarded:**
- 🥇 1st Place: $1,000 USDC
- 🥈 2nd Place: $750 USDC
- 🥉 3rd Place: $450 USDC
- 🏅 4th Place: $200 USDC
- 🏅 5th-10th Place: $100 USDC each

## 📚 Learning Resources

For more information, check out the following resources:

- [Nosana Documentation](https://docs.nosana.io)
- [Mastra Documentation](https://mastra.ai/en/docs) - Learn more about Mastra and its features
- [CopilotKit Documentation](https://docs.copilotkit.ai) - Explore CopilotKit's capabilities
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Docker Documentation](https://docs.docker.com)
- [Nosana CLI](https://github.com/nosana-ci/nosana-cli)
- [Mastra Agents Overview](https://mastra.ai/en/docs/agents/overview)
- [Build an AI Stock Agent Guide](https://mastra.ai/en/guides/guide/stock-agent)
- [Mastra Tool Calling Documentation](https://mastra.ai/en/docs/agents/tools)

## 🆘 Support & Community

### Get Help
- **Discord**: Join [Nosana Discord](https://nosana.com/discord) 
- **Dedicated Channel**: [Builders Challenge Dev Chat](https://discord.com/channels/236263424676331521/1354391113028337664)
- **Twitter**: Follow [@nosana_ai](https://x.com/nosana_ai) for live updates

## 🎉 Ready to Build?

1. **Fork** this repository
2. **Build** your AI agent
3. **Deploy** to Nosana
4. **Present** your creation

Good luck, builders! We can't wait to see the innovative AI agents you create for the Nosana ecosystem.

**Happy Building!** 🚀

## Stay in the Loop

Want access to exclusive builder perks, early challenges, and Nosana credits?
Subscribe to our newsletter and never miss an update.

👉 [ Join the Nosana Builders Newsletter ](https://e86f0b9c.sibforms.com/serve/MUIFALaEjtsXB60SDmm1_DHdt9TOSRCFHOZUSvwK0ANbZDeJH-sBZry2_0YTNi1OjPt_ZNiwr4gGC1DPTji2zdKGJos1QEyVGBzTq_oLalKkeHx3tq2tQtzghyIhYoF4_sFmej1YL1WtnFQyH0y1epowKmDFpDz_EdGKH2cYKTleuTu97viowkIIMqoDgMqTD0uBaZNGwjjsM07T)

Be the first to know about:
- 🧠 Upcoming Builders Challenges
- 💸 New reward opportunities
- ⚙ Product updates and feature drops
- 🎁 Early-bird credits and partner perks

Join the Nosana builder community today — and build the future of decentralized AI.


