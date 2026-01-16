# PRD: Email Onboarding & Engagement System

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Ready for Implementation  
**Author:** Product Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Email Strategy Overview](#3-email-strategy-overview)
4. [Email Sequence Architecture](#4-email-sequence-architecture)
5. [Detailed Email Specifications](#5-detailed-email-specifications)
6. [Behavioral Triggers & Automation](#6-behavioral-triggers--automation)
7. [Technical Requirements](#7-technical-requirements)
8. [Design Guidelines](#8-design-guidelines)
9. [A/B Testing Strategy](#9-ab-testing-strategy)
10. [Implementation Timeline](#10-implementation-timeline)
11. [Appendix: Email Copy Templates](#11-appendix-email-copy-templates)

---

## 1. Executive Summary

### 1.1 Purpose

This PRD defines a comprehensive email onboarding and engagement system for Protectron that guides new users from signup through activation, retention, and conversion. The system draws inspiration from best-in-class SaaS companies like Asana, Notion, Slack, and HubSpot while being tailored to Protectron's unique compliance platform value proposition.

### 1.2 The Opportunity

Currently, users who sign up for Protectron's 14-day free trial may:
- Get lost in the compliance complexity
- Not understand which features to use first
- Fail to reach the "aha moment" of seeing their compliance score
- Abandon before experiencing core value

A strategic email sequence will:
- Reduce time-to-value by 60%+
- Increase trial-to-paid conversion by 30-50%
- Reduce churn during the first 30 days
- Build trust through education (not sales pressure)

### 1.3 Core Philosophy

**Education First, Sales Second**

Most customers don't fully understand EU AI Act compliance. Our emails educate users on:
1. What compliance means for their specific situation
2. How to use Protectron to achieve it
3. Why now is the time to act (urgency without pressure)

---

## 2. Goals & Success Metrics

### 2.1 Primary Goals

| Goal | Description | Target |
|------|-------------|--------|
| **Activation** | Users complete first AI system risk classification | 70% within 7 days |
| **Engagement** | Users generate at least one document | 50% within 14 days |
| **Conversion** | Free trial → Paid subscription | 15% conversion rate |
| **Retention** | Users active at Day 30 | 60% retention |

### 2.2 Email-Specific KPIs

| Metric | Target |
|--------|--------|
| Welcome Email Open Rate | 60%+ |
| Average Sequence Open Rate | 35%+ |
| Click-Through Rate (CTR) | 8%+ |
| Unsubscribe Rate | <1% per email |
| Reply Rate | 3%+ (engagement signal) |

### 2.3 Behavioral Milestones

The email sequence is designed to drive users through these critical milestones:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     USER ACTIVATION FUNNEL                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SIGNUP ──► FIRST LOGIN ──► ADD SYSTEM ──► CLASSIFY ──► DOCUMENT   │
│    │            │              │              │             │       │
│   Day 0       Day 1          Day 2          Day 3        Day 5-7   │
│                                                                     │
│                    ──► TRACK REQS ──► EVIDENCE ──► CONVERT         │
│                           │              │            │             │
│                        Day 7-10       Day 10-12    Day 12-14       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Email Strategy Overview

### 3.1 Two-Track System

We implement a **hybrid approach** combining time-based and behavior-based emails:

**Track A: Time-Based Foundation**
- Sent on a fixed schedule regardless of behavior
- Ensures all users receive core education
- 7 emails over 14 days

**Track B: Behavior-Based Nudges**
- Triggered by specific actions (or inaction)
- Personalized to user's journey stage
- Supplements Track A without duplication

### 3.2 User Segments

| Segment | Definition | Email Approach |
|---------|------------|----------------|
| **New Signup** | Just created account | Full onboarding sequence |
| **Active Explorer** | Logged in 2+ times, no classification | Encourage first action |
| **Activated User** | Completed risk classification | Feature discovery |
| **Power User** | Generated docs + tracked requirements | Conversion focus |
| **At-Risk** | No login in 5+ days | Re-engagement |
| **Developer User** | Visited SDK docs | SDK-focused content |

### 3.3 Email Sequence at a Glance

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        14-DAY EMAIL SEQUENCE                               │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│ DAY 0 ─┬─ Email 1: Welcome + Quick Start                                   │
│        │                                                                   │
│ DAY 1 ─┼─ Email 2: First Win (Classify Your AI System)                     │
│        │                                                                   │
│ DAY 3 ─┼─ Email 3: Feature Spotlight (Document Generation)                 │
│        │                                                                   │
│ DAY 5 ─┼─ Email 4: Social Proof + Case Study                               │
│        │                                                                   │
│ DAY 7 ─┼─ Email 5: Progress Review + SDK Introduction                      │
│        │  └── (Behavioral: If no progress → Re-engagement email)           │
│        │                                                                   │
│ DAY 10 ┼─ Email 6: Certification Badge + Trust Building                    │
│        │                                                                   │
│ DAY 12 ┼─ Email 7: Trial Ending Soon (Value Reminder)                      │
│        │                                                                   │
│ DAY 14 ─┴─ Email 8: Final Day + Conversion CTA                             │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Email Sequence Architecture

### 4.1 Track A: Core Time-Based Sequence

| # | Send Time | Email Name | Primary Goal | CTA |
|---|-----------|------------|--------------|-----|
| 1 | Immediately | Welcome + Quick Start | Orientation & First Login | "Go to Dashboard" |
| 2 | Day 1 | First Win | Risk Classification | "Classify Your First AI System" |
| 3 | Day 3 | Document Power | Document Generation | "Generate Your First Document" |
| 4 | Day 5 | You're Not Alone | Social Proof | "Read Case Study" |
| 5 | Day 7 | Mid-Trial Check-In | Progress Review | "See Your Progress" |
| 6 | Day 10 | Prove Your Compliance | Certification Badge | "Get Your Badge" |
| 7 | Day 12 | 2 Days Left | Urgency + Value | "Upgrade Now" |
| 8 | Day 14 | Final Day | Conversion | "Don't Lose Your Progress" |

### 4.2 Track B: Behavioral Trigger Emails

| Trigger | Condition | Email Sent | Suppression Rules |
|---------|-----------|------------|-------------------|
| **No First Login** | 24h after signup, no login | "Your Dashboard Awaits" | Suppress if logged in |
| **Abandoned Classification** | Started quiz, didn't finish | "Finish Your Assessment" | Suppress if completed |
| **First System Added** | AI system created | "Great Start! Here's Next" | None |
| **Document Generated** | First doc created | "Your Compliance Docs Ready" | None |
| **Re-engagement** | No login in 5 days | "We Miss You" | Suppress if active |
| **SDK Interest** | Visited SDK docs 2+ times | "SDK Quick Start" | Send once |
| **High Engagement** | 5+ logins, 3+ features used | "Unlock Premium Features" | Before Day 10 |

### 4.3 Email Suppression Logic

```
┌────────────────────────────────────────────────────────────────────┐
│                    EMAIL SUPPRESSION RULES                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  IF user received behavioral email today                           │
│    THEN suppress scheduled time-based email for 24h                │
│                                                                    │
│  IF user has already converted (paid)                              │
│    THEN move to "Customer" sequence (not covered in this PRD)      │
│                                                                    │
│  IF user unsubscribed                                              │
│    THEN remove from all marketing emails (transactional only)      │
│                                                                    │
│  MAX emails per week: 3                                            │
│  MIN gap between emails: 24 hours                                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 5. Detailed Email Specifications

### Email 1: Welcome + Quick Start

**Send Time:** Immediately after signup  
**Subject Line Options (A/B Test):**
- A: "Welcome to Protectron, {{first_name}}! Let's get you compliant 🛡️"
- B: "Your EU AI Act compliance journey starts now"
- C: "{{first_name}}, your dashboard is ready"

**Goals:**
1. Confirm signup and build excitement
2. Set expectations for the 14-day trial
3. Drive immediate first login
4. Introduce the 3-step compliance path

**Content Structure:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                      │
│ ─────────────────────────────────────────────────────────────────────────── │
│ Protectron Logo                                                             │
│                                                                             │
│ Welcome to Protectron, {{first_name}}! 🎉                                   │
│                                                                             │
│ ─────────────────────────────────────────────────────────────────────────── │
│ BODY                                                                        │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                             │
│ You're one step closer to EU AI Act compliance.                             │
│                                                                             │
│ Here's what happens next:                                                   │
│                                                                             │
│   1. ASSESS – Classify your AI systems by risk level (10 min)               │
│   2. DOCUMENT – Generate required compliance documentation                  │
│   3. CERTIFY – Track requirements and prove compliance                      │
│                                                                             │
│ Your 14-day free trial includes full access to all features.                │
│ Most teams achieve compliance-ready status within 2 weeks.                  │
│                                                                             │
│                  ┌────────────────────────────┐                             │
│                  │    Go to Your Dashboard    │  ← Primary CTA              │
│                  └────────────────────────────┘                             │
│                                                                             │
│ What's waiting for you:                                                     │
│ • Risk Classification Engine – Know your compliance obligations             │
│ • AI-Powered Document Generation – Stop starting from scratch               │
│ • Requirement Tracking – Never miss a compliance deadline                   │
│                                                                             │
│ ─────────────────────────────────────────────────────────────────────────── │
│ FOOTER                                                                      │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                             │
│ Questions? Just reply to this email – a real human will respond.            │
│                                                                             │
│ – The Protectron Team                                                       │
│                                                                             │
│ P.S. The August 2026 enforcement deadline is approaching.                   │
│ Companies achieving compliance early are winning enterprise deals now.      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Personalization Variables:**
- `{{first_name}}` – User's first name
- `{{company_name}}` – Company name (if provided)
- `{{trial_end_date}}` – Calculated 14 days from signup

---

### Email 2: First Win (Risk Classification)

**Send Time:** Day 1 (24 hours after signup)  
**Subject Line Options:**
- A: "Your first 10 minutes could save months of compliance work"
- B: "Quick question: What AI systems does {{company_name}} use?"
- C: "Know your EU AI Act risk level in 10 minutes"

**Goals:**
1. Drive first meaningful action (risk classification)
2. Make the task feel achievable (10 minutes)
3. Show the value of knowing your risk level

**Content Focus:**
- Emphasize the "10-minute" time investment
- Explain what risk classification reveals
- Include visual of the classification result screen
- Single, clear CTA: "Classify Your First AI System"

**Key Copy Points:**
- "Most companies don't know their EU AI Act obligations"
- "Answer a few questions about your AI system"
- "Instantly know: Risk Level, Applicable Articles, Next Steps"
- "No legal expertise required"

---

### Email 3: Document Generation Power

**Send Time:** Day 3  
**Subject Line Options:**
- A: "Stop writing compliance docs from scratch"
- B: "We just generated 40 pages of documentation in 2 minutes"
- C: "Your Technical Documentation is waiting to be generated"

**Goals:**
1. Introduce AI-powered document generation
2. Show time savings vs. manual approach
3. Drive first document generation

**Content Focus:**
- Before/After comparison (Manual: weeks → Protectron: minutes)
- List of documents Protectron generates
- Screenshot of document generation interface
- CTA: "Generate Your First Document"

**Document Types to Highlight:**
- Technical Documentation (Article 11)
- Risk Management System (Article 9)
- Human Oversight Procedures (Article 14)
- AI Governance Policy

---

### Email 4: Social Proof (Case Study)

**Send Time:** Day 5  
**Subject Line Options:**
- A: "How TalentFlow AI closed €2.1M in enterprise deals"
- B: "Their prospects asked 'Are you EU AI Act compliant?' Here's what happened"
- C: "From stalled deals to signed contracts in 2 weeks"

**Goals:**
1. Build trust through real customer stories
2. Show tangible business outcomes
3. Connect compliance to business value (revenue, deals, trust)

**Content Focus:**
- Brief customer story (TalentFlow or MedAssist case study)
- Specific results: time saved, deals closed, compliance achieved
- Quote from customer
- CTA: "See How They Did It" → Links to full case study

**Key Metrics to Include:**
- "2 weeks to compliance-ready"
- "€2.1M in enterprise deals closed"
- "50+ hours saved on documentation"
- "3 new markets entered"

---

### Email 5: Mid-Trial Progress Review

**Send Time:** Day 7  
**Subject Line Options:**
- A: "Your progress this week + what's next"
- B: "{{first_name}}, here's your compliance snapshot"
- C: "7 days in: How's your compliance journey going?"

**Goals:**
1. Show users what they've accomplished
2. Highlight features they haven't tried yet
3. Introduce SDK for technical users
4. Re-engage users who've gone quiet

**Content Structure:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│ YOUR PROTECTRON PROGRESS                                                    │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                             │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│ │ AI Systems      │  │ Documents       │  │ Requirements    │               │
│ │ Added: {{n}}    │  │ Generated: {{n}}│  │ Tracked: {{n}}  │               │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘               │
│                                                                             │
│ ─────────────────────────────────────────────────────────────────────────── │
│ HAVEN'T TRIED YET (conditional based on activity):                          │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                             │
│ 🔧 SDK Integration – Automatic audit trails for your AI agents               │
│    "pip install protectron" – works with LangChain, CrewAI, AutoGen         │
│                                                                             │
│ 📑 Evidence Management – Upload and organize compliance proof                │
│                                                                             │
│ 🏆 Certification Badge – Show customers you're compliant                     │
│                                                                             │
│                  ┌────────────────────────────┐                             │
│                  │    Continue Your Journey   │                             │
│                  └────────────────────────────┘                             │
│                                                                             │
│ ─────────────────────────────────────────────────────────────────────────── │
│ 7 DAYS LEFT IN YOUR TRIAL                                                   │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Personalization Variables:**
- `{{systems_added}}` – Number of AI systems
- `{{documents_generated}}` – Number of docs created
- `{{requirements_tracked}}` – Number of requirements
- `{{features_not_used}}` – Dynamic list of unused features

---

### Email 6: Certification Badge

**Send Time:** Day 10  
**Subject Line Options:**
- A: "Your compliance badge is almost ready"
- B: "Show customers you're EU AI Act compliant"
- C: "Turn compliance into competitive advantage"

**Goals:**
1. Introduce certification badge feature
2. Position compliance as a sales tool
3. Drive users toward completion

**Content Focus:**
- What the badge looks like (visual)
- How verification works
- Where to display it (website, sales materials)
- Business benefits (trust, shorter sales cycles)
- CTA: "Get Your Compliance Badge"

**Key Messages:**
- "Compliance isn't just about avoiding fines"
- "Enterprise customers ask 'Are you compliant?'"
- "Real-time verification builds instant trust"

---

### Email 7: Trial Ending Soon (2 Days Left)

**Send Time:** Day 12  
**Subject Line Options:**
- A: "2 days left: Don't lose your compliance progress"
- B: "{{first_name}}, your trial ends {{trial_end_date}}"
- C: "Quick decision time: Starter plan is just €99/month"

**Goals:**
1. Create appropriate urgency
2. Remind users of value received
3. Make upgrade decision easy

**Content Focus:**
- Summary of what they've built
- What happens if they don't upgrade (data preserved 30 days)
- Clear pricing comparison
- CTA: "Choose Your Plan"

**Pricing Display:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│ CHOOSE THE RIGHT PLAN FOR YOUR TEAM                                         │
│ ─────────────────────────────────────────────────────────────────────────── │
│                                                                             │
│ ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                      │
│ │   STARTER    │   │   GROWTH     │   │    SCALE     │                      │
│ │              │   │  POPULAR ⭐  │   │              │                      │
│ │   €99/mo     │   │   €299/mo    │   │   €599/mo    │                      │
│ │              │   │              │   │              │                      │
│ │ • 3 AI       │   │ • 10 AI      │   │ • 25 AI      │                      │
│ │   Systems    │   │   Systems    │   │   Systems    │                      │
│ │ • 10K events │   │ • 100K events│   │ • 500K events│                      │
│ │ • Email      │   │ • Priority   │   │ • Dedicated  │                      │
│ │   support    │   │   support    │   │   support    │                      │
│ │              │   │              │   │              │                      │
│ │  [Select]    │   │  [Select]    │   │  [Select]    │                      │
│ └──────────────┘   └──────────────┘   └──────────────┘                      │
│                                                                             │
│ All plans include: Document generation, Requirement tracking,               │
│ Evidence management, Certification badges                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Email 8: Final Day (Last Chance)

**Send Time:** Day 14 (morning)  
**Subject Line Options:**
- A: "Final day: Your compliance work is saved for 30 more days"
- B: "Trial ending today – here's what happens next"
- C: "{{first_name}}, one last thing before your trial ends"

**Goals:**
1. Final conversion push
2. Reassure that data isn't lost
3. Provide easy path to upgrade
4. Offer alternative (book a call)

**Content Focus:**
- Clear statement: "Your trial ends today at midnight"
- Reassurance: "Your data is saved for 30 days"
- What they lose: "Compliance tracking, document generation, badge"
- What they keep: "Your AI systems and progress"
- Two CTAs: "Upgrade Now" and "Talk to Sales"

**Tone:** Helpful and understanding, not pushy

---

## 6. Behavioral Triggers & Automation

### 6.1 No First Login (24h)

**Trigger:** User hasn't logged in 24 hours after signup  
**Subject:** "Your dashboard is waiting, {{first_name}}"

**Content:**
- Acknowledge they're busy
- Reminder of why they signed up
- Quick-start video link (2 minutes)
- "One-click login" button

---

### 6.2 Abandoned Risk Assessment

**Trigger:** Started assessment quiz, abandoned before completion  
**Subject:** "You're 80% done with your risk assessment"

**Content:**
- Show progress (e.g., "4 of 5 questions completed")
- Remind what they'll get (risk level, requirements, roadmap)
- CTA: "Finish Assessment" (deep link to where they left off)

---

### 6.3 First System Added (Celebration)

**Trigger:** User adds their first AI system  
**Subject:** "🎉 First AI system added! Here's what's next"

**Content:**
- Celebrate the milestone
- Show what they unlocked (requirement tracking)
- Next recommended action
- CTA: "View Your Compliance Roadmap"

---

### 6.4 Document Generated (Success)

**Trigger:** User generates first document  
**Subject:** "Your {{document_type}} is ready for review"

**Content:**
- Confirm document was generated
- Tips for reviewing and customizing
- How to export (PDF/DOCX)
- Next document to generate

---

### 6.5 Re-engagement (5+ Days Inactive)

**Trigger:** No login in 5+ days during trial  
**Subject Line Options:**
- A: "We noticed you've been away"
- B: "Your compliance progress is waiting"
- C: "Need help getting started?"

**Content:**
- Empathetic tone
- Offer to help (reply to email)
- Quick win suggestion
- Calendar link to book demo
- CTA: "Get Back on Track"

---

### 6.6 SDK Interest (Developer Focus)

**Trigger:** Visited SDK docs 2+ times  
**Subject:** "Ready to add compliance to your AI agents?"

**Content:**
- Acknowledge developer interest
- Quick start code snippet
- SDK capabilities (LangChain, CrewAI, AutoGen)
- Link to full documentation
- CTA: "View SDK Guide"

---

## 7. Technical Requirements

### 7.1 Email Service Provider

**Recommended:** Resend (already mentioned in PRD docs)  
**Alternative:** SendGrid, Mailchimp, Customer.io

**Required Capabilities:**
- Transactional + marketing email support
- Event-based triggering (webhooks)
- Dynamic content personalization
- A/B testing built-in
- Detailed analytics (opens, clicks, conversions)
- GDPR compliance features

### 7.2 Data Integration

| Data Point | Source | Use Case |
|------------|--------|----------|
| User signup | Supabase Auth | Trigger welcome email |
| AI systems added | Supabase DB | Personalize progress |
| Documents generated | Supabase DB | Trigger celebration |
| Last login date | Supabase Auth | Re-engagement trigger |
| Page visits (SDK docs) | PostHog/Analytics | SDK interest trigger |
| Trial end date | Supabase DB | Urgency emails |

### 7.3 Webhook Events Required

```javascript
// Events to send to email provider
const emailTriggerEvents = [
  'user.signup',              // → Welcome email
  'user.login.first',         // → Suppress "no login" email
  'assessment.started',       // → Track for abandonment
  'assessment.completed',     // → Celebration email
  'system.created',           // → First system email
  'document.generated',       // → Document ready email
  'requirement.completed',    // → Progress milestone
  'subscription.started',     // → Move to customer sequence
  'trial.ending_soon',        // → 2-day warning (cron job)
  'trial.ended',              // → Final email
];
```

### 7.4 Email Template System

```
/emails
├── /layouts
│   ├── base.html           # Base template with header/footer
│   └── transactional.html  # Minimal template for system emails
├── /components
│   ├── header.html
│   ├── footer.html
│   ├── cta-button.html
│   ├── pricing-table.html
│   └── progress-card.html
├── /onboarding
│   ├── 01-welcome.html
│   ├── 02-first-win.html
│   ├── 03-documents.html
│   ├── 04-social-proof.html
│   ├── 05-progress-review.html
│   ├── 06-certification.html
│   ├── 07-trial-ending.html
│   └── 08-final-day.html
└── /behavioral
    ├── no-login.html
    ├── abandoned-assessment.html
    ├── system-added.html
    ├── document-generated.html
    ├── re-engagement.html
    └── sdk-interest.html
```

---

## 8. Design Guidelines

### 8.1 Visual Design

**Brand Colors:**
- Primary: #7C3AED (Protectron Purple)
- Secondary: #10B981 (Success Green)
- Background: #F9FAFB (Light Gray)
- Text: #111827 (Near Black)

**Typography:**
- Headlines: Inter Bold, 24px
- Body: Inter Regular, 16px
- Button: Inter SemiBold, 14px

**Layout:**
- Max width: 600px
- Padding: 32px
- Mobile-responsive
- Single-column layout

### 8.2 Email Design Principles

1. **One CTA per email** – Don't overwhelm with choices
2. **Scannable content** – Use headers, bullets, whitespace
3. **Visual hierarchy** – Most important content first
4. **Mobile-first** – 60%+ open on mobile devices
5. **Consistent branding** – Recognizable header/footer
6. **Text-to-image ratio** – At least 60% text for deliverability

### 8.3 CTA Button Styling

```css
.cta-button {
  background-color: #7C3AED;
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
}

.cta-button:hover {
  background-color: #6D28D9;
}

.cta-secondary {
  background-color: transparent;
  border: 2px solid #7C3AED;
  color: #7C3AED;
}
```

---

## 9. A/B Testing Strategy

### 9.1 Test Priority Order

| Priority | Test Element | Emails | Success Metric |
|----------|--------------|--------|----------------|
| 1 | Subject lines | All | Open rate |
| 2 | CTA button text | 1, 2, 7, 8 | Click rate |
| 3 | Send time | 1, 2 | Open rate |
| 4 | Personalization | 1, 5 | Click rate |
| 5 | Content length | 3, 4 | Click rate |

### 9.2 Testing Framework

**Sample Size:** Minimum 100 recipients per variant  
**Duration:** Run each test for at least 7 days  
**Statistical Significance:** 95% confidence level  
**Winner Selection:** Automatic after threshold reached

### 9.3 Subject Line Variations to Test

**Welcome Email:**
- Emoji vs. No emoji
- Name personalization vs. Company name
- Urgency vs. Benefit-focused

**Trial Ending:**
- Days remaining vs. Date specific
- Positive framing vs. Loss aversion
- Short vs. Long subject

---

## 10. Implementation Timeline

### Phase 1: Foundation (Week 1-2)

- [ ] Set up email provider (Resend) integration
- [ ] Create base email templates
- [ ] Build welcome email (Email 1)
- [ ] Build first win email (Email 2)
- [ ] Implement signup trigger webhook
- [ ] Test email delivery and rendering

### Phase 2: Core Sequence (Week 3-4)

- [ ] Build Emails 3-6
- [ ] Implement Day 7 progress personalization
- [ ] Build trial ending emails (7, 8)
- [ ] Set up cron job for time-based sends
- [ ] Test full 14-day sequence (QA)

### Phase 3: Behavioral Triggers (Week 5-6)

- [ ] Implement all behavioral triggers
- [ ] Build behavioral email templates
- [ ] Set up suppression logic
- [ ] Integration testing
- [ ] Launch to 10% of new signups (pilot)

### Phase 4: Optimization (Ongoing)

- [ ] Review Day 7 metrics
- [ ] Launch A/B tests
- [ ] Iterate based on data
- [ ] Scale to 100% of signups
- [ ] Monthly performance review

---

## 11. Appendix: Email Copy Templates

### Email 1: Welcome (Full Copy)

**Subject:** Welcome to Protectron, {{first_name}}! Let's get you compliant 🛡️

---

Hi {{first_name}},

Welcome to Protectron! You've taken the first step toward EU AI Act compliance.

**Here's what happens next:**

**1. Assess** – Classify your AI systems by risk level (10 min)  
**2. Document** – Generate required compliance documentation  
**3. Certify** – Track requirements and prove compliance

Your 14-day free trial includes full access to all features. Most teams achieve compliance-ready status within 2 weeks.

[Go to Your Dashboard →]

**What's waiting for you:**

• **Risk Classification Engine** – Know your compliance obligations in 10 minutes  
• **AI-Powered Document Generation** – Stop starting from scratch  
• **Requirement Tracking** – Never miss a compliance deadline  
• **Certification Badge** – Show customers you're compliant

Questions? Just reply to this email – a real human will respond.

Best,  
The Protectron Team

P.S. The August 2026 enforcement deadline is approaching. Companies achieving compliance early are winning enterprise deals now.

---

### Email 2: First Win (Full Copy)

**Subject:** Your first 10 minutes could save months of compliance work

---

Hi {{first_name}},

Quick question: Do you know which EU AI Act requirements apply to your AI systems?

Most companies don't. And that uncertainty can stall enterprise deals, delay product launches, and create legal risk.

**Here's the good news:** You can find out in 10 minutes.

Our Risk Classification Engine asks you a few simple questions about your AI system:
- What does it do?
- Who uses it?
- What decisions does it influence?

Then it tells you:
- ✅ Your risk level (Prohibited, High-Risk, Limited, or Minimal)
- ✅ Which EU AI Act articles apply to you
- ✅ Exactly what you need to do next

No legal expertise required. No consultants. Just clarity.

[Classify Your First AI System →]

Once you know your risk level, everything else becomes clear.

Best,  
The Protectron Team

P.S. High-risk AI systems have 113 requirements to track. Low-risk? Much simpler. Find out which camp you're in.

---

### Email 7: Trial Ending (Full Copy)

**Subject:** 2 days left: Don't lose your compliance progress

---

Hi {{first_name}},

Your Protectron trial ends in 2 days ({{trial_end_date}}).

**Here's what you've built so far:**

• {{systems_added}} AI systems classified  
• {{documents_generated}} compliance documents generated  
• {{requirements_tracked}} requirements tracked

That's real progress toward EU AI Act compliance. 

**What happens when your trial ends?**

• Your data stays safe for 30 days
• You can pick up where you left off anytime
• But compliance tracking, document generation, and badges will be paused

**Choose the plan that fits your team:**

| **Starter** | **Growth** | **Scale** |
|-------------|------------|-----------|
| €99/month | €299/month | €599/month |
| 3 AI systems | 10 AI systems | 25 AI systems |
| [Select →] | [Select →] | [Select →] |

All plans include: Full requirement tracking, document generation, evidence management, certification badges, and email support.

[Choose Your Plan →]

Questions? Reply to this email or [book a call with our team →].

Best,  
The Protectron Team

---

## Document Information

**Document Type:** Product Requirements Document (PRD)  
**Status:** Ready for Implementation  
**Owner:** Product Team  
**Related PRDs:** PRD-1 (Landing Page), PRD-2 (Dashboard Flows), PRD-3 (Technical Architecture)

---

*End of Document*
