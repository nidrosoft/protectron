<p align="center">
  <img src="public/assets/images/logo-light.png" alt="Protectron" height="48" />
</p>

<h3 align="center">EU AI Act Compliance Platform</h3>

<p align="center">
  The all-in-one platform to achieve, maintain, and prove EU AI Act compliance.<br />
  Register AI systems. Generate documents. Track requirements. Get certified.
</p>

<p align="center">
  <a href="#quick-comply">Quick Comply</a> &middot;
  <a href="#features">Features</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#getting-started">Getting Started</a> &middot;
  <a href="#project-structure">Project Structure</a> &middot;
  <a href="#api-reference">API Reference</a>
</p>

---

## Overview

Protectron helps organizations comply with the **EU AI Act (Regulation EU 2024/1689)** — the world's first comprehensive AI regulation. Instead of spending months with lawyers and consultants, Protectron automates the compliance process: register your AI systems, answer guided questions, and receive all the documentation you need.

### The Problem

The EU AI Act requires organizations to produce **20+ compliance documents**, conduct risk assessments, implement human oversight procedures, and maintain ongoing monitoring — a process that traditionally takes **3-6 months** and costs **$50,000+** in consulting fees.

### The Solution

Protectron reduces this to **days, not months**. Our AI-powered platform guides you through every requirement, auto-generates professional compliance documents, and provides continuous monitoring to keep you compliant.

---

## Quick Comply

**Quick Comply** is our flagship feature — a chat-based AI assistant that guides users through full EU AI Act compliance in approximately **45 minutes**.

Powered by **Claude Sonnet 4.5** via the Vercel AI SDK, Quick Comply replaces the traditional multi-screen, multi-hour compliance workflow with a single conversational interface.

### How It Works

1. **Start a conversation** — The AI greets you and begins asking about your organization and AI systems
2. **Answer questions** — Respond via text, selection cards, or multi-select options rendered dynamically by the AI
3. **Watch progress** — A real-time sidebar tracks your completion across 7 compliance sections
4. **Get documents** — All required compliance documents are generated automatically from your responses
5. **Receive certification** — Get a verifiable compliance certificate with an embeddable badge

### Key Capabilities

- **11 AI Tools** — Dynamic form rendering (selections, text inputs, multi-select), progress tracking, document generation, AI system creation, subscription checking, and completion handling
- **700+ Line System Prompt** — Deep EU AI Act expertise with section-by-section guidance
- **Session Persistence** — Save and resume anytime; chat history is fully preserved
- **Subscription-Aware** — Behavior adapts based on your plan (free assessment, paid document generation)
- **Mobile Responsive** — Collapsible bottom-sheet progress drawer for mobile devices

---

## Features

### AI System Management

Register and manage all AI systems used in your organization. Track compliance status, risk levels, lifecycle stages, and SDK integration status.

- **System Registration** — Add AI systems with type classification (ML model, LLM app, AI agent, etc.)
- **Risk Classification** — Automatic EU AI Act risk level determination (minimal, limited, high, prohibited)
- **Compliance Progress** — Real-time tracking of requirements completion per system
- **Lifecycle Management** — Track systems through draft, development, testing, production, and retirement stages

### Risk Assessment

Multi-step assessment flow that determines your AI system's risk classification and generates tailored recommendations.

- **8-Step Assessment** — Covers purpose, domain, data types, deployment, compliance readiness, and risk factors
- **Enhanced Risk Calculator** — Weighted scoring algorithm across regulatory, technical, and operational dimensions
- **Results Dashboard** — Visual breakdown of risk scores with actionable next steps
- **Quick Comply CTA** — Seamless transition from assessment results to guided compliance

### Document Generation

Automated generation of all EU AI Act compliance documents with professional formatting.

- **20+ Document Types** — Technical documentation, risk management plans, data governance policies, human oversight procedures, conformity assessments, FRIA, and more
- **AI-Powered Content** — Documents are generated using AI based on your specific system details
- **Multiple Formats** — Export as DOCX or PDF
- **Version History** — Track changes with full version control and restore capabilities
- **Rich Text Editor** — TipTap-based editor for reviewing and customizing generated documents

### Requirements Tracking

Comprehensive tracking of all EU AI Act requirements mapped to your AI systems.

- **Requirement Templates** — Pre-built templates covering Articles 9-27, 43-49, 53, 72-73, and Annexes IV-VIII
- **Progress Tracking** — Mark requirements as not started, in progress, or completed
- **Evidence Linking** — Attach evidence documents to specific requirements
- **Filtering & Search** — Filter by status, risk level, and category

### Compliance Certifications & Badges

Verifiable compliance certificates with embeddable website badges.

- **Certificate Generation** — Auto-generated certificates with unique certificate numbers
- **SVG Badge Generator** — Three badge styles (standard, compact, detailed) for website embedding
- **Public Verification** — Anyone can verify a certificate's authenticity via a public URL
- **Embed Code Generator** — Copy-paste HTML, Markdown, or direct image URLs

### AI Agent Monitoring

Specialized tooling for autonomous AI agent compliance.

- **SDK Integration** — Connect agents via SDK for real-time event logging
- **Human-in-the-Loop Rules** — Configure HITL rules that enforce human oversight
- **Emergency Stop** — One-click emergency shutdown for non-compliant agents
- **Event Logging** — Full audit trail of agent decisions and actions
- **Incident Management** — Track and manage compliance incidents with severity levels

### Evidence Management

Upload and organize evidence documents that support your compliance claims.

- **File Upload** — Upload supporting documents, test results, and audit reports
- **Evidence Linking** — Link evidence to specific requirements and AI systems
- **Organization** — Categorize and search across all compliance evidence

### Reports & Analytics

Generate comprehensive compliance reports and monitor trends.

- **Compliance Reports** — Full compliance status reports with charts and breakdowns
- **PDF Export** — Professional PDF reports for stakeholders and regulators
- **Dashboard Metrics** — Real-time compliance scores, requirement progress, and deadline tracking
- **Activity Feed** — Recent compliance activities across all systems

### Subscription & Billing

Tiered pricing with Stripe integration for seamless payment management.

- **Four Tiers** — Free, Starter, Professional, Enterprise
- **Token-Based Usage** — AI token consumption tracked per organization with monthly resets
- **Stripe Integration** — Checkout sessions, subscription management, invoices, and payment methods
- **Plan Enforcement** — Document generation and feature access gated by subscription tier

### Team & Organization

Multi-tenant architecture with team collaboration features.

- **Team Management** — Invite team members with role-based access
- **Organization Settings** — Company profile, logo, and configuration
- **API Key Management** — Generate and manage API keys for integrations
- **Row-Level Security** — All data isolated per organization with Supabase RLS

### Onboarding & Support

Guided onboarding experience to help users get started quickly.

- **Getting Started Checklist** — Step-by-step walkthrough of key platform features
- **What's Next Recommendations** — Context-aware suggestions based on compliance progress
- **Email Sequences** — Automated onboarding emails (welcome, first win, document power, trial ending)
- **Support Tickets** — In-app support ticket submission
- **Trust Center** — Public-facing compliance trust center pages

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript 5.9 |
| **UI Components** | Untitled UI React, React Aria Components |
| **Styling** | Tailwind CSS v4.1 |
| **Database & Auth** | Supabase (PostgreSQL, Auth, Edge Functions, RLS) |
| **AI** | Vercel AI SDK v6, Anthropic Claude Sonnet 4.5 |
| **Payments** | Stripe (Checkout, Subscriptions, Webhooks) |
| **Email** | Resend with React Email templates |
| **Documents** | docx.js (DOCX generation), jsPDF (PDF generation) |
| **Rich Text** | TipTap editor |
| **Charts** | Recharts |
| **Animations** | Motion (Framer Motion) |
| **Hosting** | Vercel / Netlify |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Supabase project (for database and auth)
- Anthropic API key (for Quick Comply AI)
- Stripe account (for billing, optional for development)

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (for Quick Comply AI)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Stripe (for billing)
STRIPE_SECRET_KEY=sk_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Resend (for emails)
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd protectron

# Install dependencies
npm install

# Run database migrations
# (migrations are in supabase/migrations/ — apply via Supabase CLI or dashboard)

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

```bash
npm run dev       # Start development server with Turbopack
npm run build     # Build for production
npm run start     # Start production server
```

---

## Project Structure

```
protectron/
├── public/                          # Static assets
├── src/
│   ├── app/
│   │   ├── (assessment)/            # Risk assessment flow
│   │   │   └── assessment/
│   │   │       ├── components/      # Assessment step components
│   │   │       ├── data/            # Assessment options & config
│   │   │       ├── results/         # Results page & risk calculator
│   │   │       └── page.tsx
│   │   ├── (auth)/                  # Authentication pages
│   │   ├── (dashboard)/             # Main app dashboard
│   │   │   ├── ai-systems/          # AI system management
│   │   │   ├── certifications/      # Compliance certifications
│   │   │   ├── dashboard/           # Dashboard overview
│   │   │   ├── documents/           # Document management
│   │   │   ├── evidence/            # Evidence management
│   │   │   ├── incidents/           # Incident tracking
│   │   │   ├── quick-comply/        # Quick Comply chat interface
│   │   │   │   ├── components/      # Chat UI components
│   │   │   │   │   └── tools/       # AI tool UI cards
│   │   │   │   └── hooks/           # useQuickComply hook
│   │   │   ├── reports/             # Compliance reports
│   │   │   ├── requirements/        # Requirements tracking
│   │   │   ├── resources/           # Help, guides, support
│   │   │   └── settings/            # App settings & billing
│   │   ├── (public)/                # Public-facing pages
│   │   ├── api/                     # API routes
│   │   │   ├── badges/              # SVG badge generator
│   │   │   ├── documents/           # Document generation
│   │   │   ├── quick-comply/        # Quick Comply endpoints
│   │   │   └── v1/                  # Versioned REST API
│   │   │       ├── agents/          # Agent management API
│   │   │       ├── ai-systems/      # AI systems API
│   │   │       ├── billing/         # Stripe billing API
│   │   │       ├── certificates/    # Certificate API
│   │   │       ├── documents/       # Documents API
│   │   │       ├── evidence/        # Evidence API
│   │   │       ├── incidents/       # Incidents API
│   │   │       ├── organization/    # Organization API
│   │   │       ├── reports/         # Reports API
│   │   │       ├── requirements/    # Requirements API
│   │   │       ├── support/         # Support API
│   │   │       └── team/            # Team management API
│   │   └── verify/                  # Certificate verification
│   ├── components/
│   │   ├── application/             # App-specific components
│   │   └── base/                    # Untitled UI base components
│   ├── contexts/                    # React contexts
│   ├── hooks/                       # Custom React hooks (20+)
│   ├── lib/
│   │   ├── ai/                      # AI prompt templates
│   │   ├── document-generator/      # DOCX/PDF generation engine
│   │   ├── notifications/           # Notification system
│   │   ├── quick-comply/            # Quick Comply types & constants
│   │   ├── resend/                  # Email templates & sending
│   │   ├── security/                # Rate limiting & validation
│   │   ├── stripe/                  # Stripe integration
│   │   ├── subscription/            # Subscription management
│   │   ├── supabase/                # Supabase client & types
│   │   └── walkthrough/             # Onboarding walkthrough
│   ├── providers/                   # Theme & router providers
│   └── utils/                       # Utility functions
├── supabase/
│   ├── functions/                   # Edge Functions
│   │   └── generate-document/       # Document generation function
│   └── migrations/                  # Database migrations
└── package.json
```

---

## API Reference

### Quick Comply

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quick-comply` | Stream AI chat responses with tool calls |
| GET | `/api/quick-comply/history` | Load saved chat history for a session |
| POST | `/api/quick-comply/history` | Save chat history for session resume |
| POST | `/api/quick-comply/analytics` | Log Quick Comply analytics events |

### AI Systems

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/ai-systems` | List all AI systems |
| POST | `/api/v1/ai-systems` | Create a new AI system |
| GET | `/api/v1/ai-systems/:id` | Get AI system details |
| PUT | `/api/v1/ai-systems/:id` | Update an AI system |
| DELETE | `/api/v1/ai-systems/:id` | Delete an AI system |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/documents` | List all documents |
| POST | `/api/v1/documents` | Create a new document |
| GET | `/api/v1/documents/:id` | Get document details |
| GET | `/api/v1/documents/:id/download` | Download document (DOCX) |
| GET | `/api/v1/documents/:id/pdf` | Download document (PDF) |
| POST | `/api/documents/generate` | Generate document via AI |

### Badges & Certificates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/badges/:certId` | Generate SVG compliance badge |
| GET | `/api/v1/certificates/:certId/verify` | Verify certificate authenticity |

### Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/billing/plans` | List subscription plans |
| POST | `/api/v1/billing/checkout` | Create Stripe checkout session |
| GET | `/api/v1/billing/subscription` | Get current subscription |
| POST | `/api/v1/billing/webhook` | Stripe webhook handler |

---

## Database

Protectron uses **Supabase (PostgreSQL)** with Row-Level Security enabled on all tables. Key tables include:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles linked to auth |
| `organizations` | Multi-tenant organizations with subscription tracking |
| `ai_systems` | Registered AI systems |
| `requirements` | Compliance requirements per system |
| `requirement_templates` | EU AI Act requirement templates |
| `documents` | Generated compliance documents |
| `document_versions` | Document version history |
| `evidence` | Uploaded evidence files |
| `incidents` | Compliance incidents |
| `quick_comply_sessions` | Quick Comply chat sessions with form data and history |
| `compliance_certifications` | Issued compliance certificates |
| `document_generation_log` | Document generation audit trail |

Migrations are located in `supabase/migrations/` and should be applied in order.

---

## Security

- **Authentication** — Supabase Auth with email/password and OAuth
- **Row-Level Security** — All database tables enforce RLS policies per organization
- **Server-Side AI** — System prompts and AI logic run entirely server-side; never exposed to the client
- **API Key Management** — Secure API key generation and rotation
- **Rate Limiting** — Rate limiting on sensitive endpoints
- **Input Validation** — Zod schema validation on all API inputs

---

## License

This project is proprietary software. All rights reserved.

The UI component library (Untitled UI React) is licensed under MIT for open-source components. [See Untitled UI license](https://www.untitledui.com/license) for PRO components.
