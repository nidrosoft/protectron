# Protectron Email System Plan

> **Status:** Planning Phase  
> **Email Provider:** Resend (already integrated)  
> **Last Updated:** January 16, 2026

---

## Table of Contents

1. [Current Infrastructure](#current-infrastructure)
2. [Email Sequence Overview](#email-sequence-overview)
3. [Phase 1: Welcome & Activation](#phase-1-welcome--activation-days-0-7)
4. [Phase 2: Education & Engagement](#phase-2-education--engagement-days-8-30)
5. [Phase 3: Retention & Re-engagement](#phase-3-retention--re-engagement-ongoing)
6. [Phase 4: Lifecycle Emails](#phase-4-lifecycle-emails)
7. [Technical Implementation](#technical-implementation)
8. [Database Schema](#database-schema)
9. [Email Templates](#email-templates)
10. [Implementation Checklist](#implementation-checklist)

---

## Current Infrastructure

### What's Already in Place

| Component | Status | Location |
|-----------|--------|----------|
| **Resend SDK** | ✅ Installed | `src/lib/resend/` |
| **Edge Function** | ✅ Deployed | `supabase/functions/send-email/` |
| **Email Templates** | ✅ Partial | Team invite template exists |
| **Notification Preferences** | ✅ Working | Users can opt-out per category |

### Existing Email Types (Transactional)

The `send-email` Edge Function already supports:

- `team-invite` - Invitation to join organization
- `team-member-joined` - Notification when member joins
- `team-member-removed` - Notification when member is removed
- `team-role-changed` - Role change notification
- `document-generated` - Document generation complete
- `compliance-update` - Compliance status changes
- `deadline-reminder` - Upcoming deadline alerts
- `incident-created` - New incident reported
- `incident-resolved` - Incident resolution
- `security-alert` - Security notifications
- `billing-payment-success` - Payment confirmation
- `billing-payment-failed` - Payment failure alert

---

## Email Sequence Overview

```
User Signs Up
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                 PHASE 1: ACTIVATION (Days 0-7)              │
├─────────────────────────────────────────────────────────────┤
│  Day 0: Welcome Email                                       │
│  Day 1: Getting Started Guide                               │
│  Day 3: First Milestone Nudge (if no AI system added)       │
│  Day 5: Feature Spotlight - Document Generator              │
│  Day 7: Progress Check-in                                   │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│              PHASE 2: EDUCATION (Days 8-30)                 │
├─────────────────────────────────────────────────────────────┤
│  Day 10: EU AI Act Deadline Awareness                       │
│  Day 14: Case Study / Social Proof                          │
│  Day 21: Feature Spotlight - Risk Assessment                │
│  Day 28: First Month Summary                                │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│              PHASE 3: RETENTION (Ongoing)                   │
├─────────────────────────────────────────────────────────────┤
│  Weekly: Progress Digest (opt-in)                           │
│  Trigger: Inactive 7 days → Re-engagement                   │
│  Trigger: Inactive 14 days → What's New                     │
│  Trigger: Milestone achieved → Celebration                  │
│  Trigger: 30 days before deadline → Urgent Alert            │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│              PHASE 4: LIFECYCLE (Events)                    │
├─────────────────────────────────────────────────────────────┤
│  Trial ending (3 days before)                               │
│  Subscription renewed                                       │
│  Account anniversary                                        │
│  New team member onboarding                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Welcome & Activation (Days 0-7)

### Email 1: Welcome Email (Day 0 - Immediate)

**Trigger:** User completes signup  
**Subject:** Welcome to Protectron! Let's get you compliant 🛡️  
**Goal:** Make user feel welcomed, set expectations, single clear CTA

**Content Structure:**
```
- Warm, personal greeting
- Brief intro to what Protectron does
- The EU AI Act deadline reminder (Aug 2, 2026)
- What they can achieve with Protectron
- Single CTA: "Complete Your Profile" or "Start Assessment"
- Quick links: Documentation, Support
```

**Personalization:**
- User's first name
- Organization name (if provided)

---

### Email 2: Getting Started Guide (Day 1)

**Trigger:** 24 hours after signup  
**Subject:** Your 3-step path to EU AI Act compliance  
**Goal:** Drive first meaningful action (add AI system or complete assessment)

**Content Structure:**
```
Step 1: Complete the AI Assessment (5 min)
        → Understand your risk level and requirements

Step 2: Add Your First AI System (2 min)
        → Start tracking compliance for your AI

Step 3: Generate Your First Document (5 min)
        → AI creates compliance docs in minutes, not weeks

CTA: "Start Your Assessment"
```

**Conditional Logic:**
- If assessment completed → Skip to "Add AI System"
- If AI system added → Skip to "Generate Document"

---

### Email 3: First Milestone Nudge (Day 3)

**Trigger:** 72 hours after signup AND no AI system added  
**Subject:** Quick question about your AI systems  
**Goal:** Re-engage users who haven't taken action

**Content Structure:**
```
- Acknowledge they're busy
- Remind them of the value (compliance in minutes)
- Show what others have achieved
- Offer help: "Need guidance? Here's a quick video"
- CTA: "Add Your First AI System"
```

**Skip Condition:** User has already added an AI system

---

### Email 4: Feature Spotlight - Document Generator (Day 5)

**Trigger:** 5 days after signup  
**Subject:** Generate compliance documents in 5 minutes (not 5 weeks)  
**Goal:** Highlight key differentiator, drive document generation

**Content Structure:**
```
- Pain point: Manual documentation takes weeks
- Solution: AI-powered document generator
- What you get:
  • Technical Documentation (Article 11)
  • Risk Assessment Reports (Article 9)
  • Data Governance Policies (Article 10)
  • Model Cards
  • + 20 more document types
- Social proof: "Companies save 40+ hours per AI system"
- CTA: "Generate Your First Document"
```

---

### Email 5: Progress Check-in (Day 7)

**Trigger:** 7 days after signup  
**Subject:** Your first week with Protectron  
**Goal:** Personalized progress update, next steps

**Content Structure (Dynamic):**

**If Active User:**
```
- Celebrate progress: "You've added X AI systems!"
- Show compliance score
- Next recommended action
- CTA: "Continue Your Progress"
```

**If Inactive User:**
```
- Gentle nudge: "We noticed you haven't started yet"
- Remind of deadline (X days until Aug 2, 2026)
- Offer 1-on-1 demo
- CTA: "Book a Quick Demo" or "Get Started Now"
```

---

## Phase 2: Education & Engagement (Days 8-30)

### Email 6: EU AI Act Deadline Awareness (Day 10)

**Trigger:** 10 days after signup  
**Subject:** ⚠️ August 2, 2026: What you need to know  
**Goal:** Create urgency, educate on requirements

**Content Structure:**
```
- Deadline countdown: "X days remaining"
- What happens if not compliant:
  • Fines up to €35M or 7% of global revenue
  • Market access restrictions
  • Reputational damage
- Risk levels explained:
  • High-Risk: Full compliance required by Aug 2, 2026
  • Limited-Risk: Transparency obligations
  • Minimal-Risk: Voluntary best practices
- Your status: "You have X high-risk systems"
- CTA: "View Your Compliance Roadmap"
```

---

### Email 7: Case Study / Social Proof (Day 14)

**Trigger:** 14 days after signup  
**Subject:** How [Company] achieved EU AI Act compliance in 2 weeks  
**Goal:** Build trust through social proof

**Content Structure:**
```
- Customer story (anonymized if needed)
- Challenge they faced
- How Protectron helped
- Results: Time saved, compliance achieved
- Quote/testimonial
- CTA: "See How It Works"
```

---

### Email 8: Feature Spotlight - Risk Assessment (Day 21)

**Trigger:** 21 days after signup  
**Subject:** Understanding your AI risk level (and why it matters)  
**Goal:** Educate on risk classification

**Content Structure:**
```
- What is risk classification?
- The 4 risk levels:
  • Unacceptable (banned)
  • High-Risk (strict requirements)
  • Limited-Risk (transparency)
  • Minimal-Risk (voluntary)
- How Protectron determines your risk level
- Your systems breakdown (if applicable)
- CTA: "Review Your Risk Assessment"
```

---

### Email 9: First Month Summary (Day 28)

**Trigger:** 28 days after signup  
**Subject:** Your first month with Protectron 📊  
**Goal:** Recap progress, set goals for next month

**Content Structure:**
```
- Month in review:
  • AI systems added: X
  • Documents generated: X
  • Requirements completed: X
  • Compliance progress: X%
- Achievements unlocked
- Recommended next steps
- What's coming: New features preview
- CTA: "View Full Dashboard"
```

---

## Phase 3: Retention & Re-engagement (Ongoing)

### Weekly Progress Digest

**Trigger:** Every Monday at 9 AM (user's timezone)  
**Subject:** Your weekly compliance update  
**Opt-in:** Yes (default: enabled for active users)

**Content Structure:**
```
- Overall compliance score
- Progress this week:
  • Requirements completed
  • Documents generated
  • Team activity
- Pending actions (top 3)
- Deadline countdown
- CTA: "View Dashboard"
```

---

### Re-engagement: Inactive 7 Days

**Trigger:** No login for 7 days  
**Subject:** We miss you! Here's what's waiting  
**Goal:** Bring user back

**Content Structure:**
```
- Gentle, non-pushy tone
- Pending items waiting for them
- Deadline reminder
- New features they might have missed
- CTA: "Jump Back In"
```

---

### Re-engagement: Inactive 14 Days

**Trigger:** No login for 14 days  
**Subject:** What's new in Protectron (you'll want to see this)  
**Goal:** Re-engage with value

**Content Structure:**
```
- New features and improvements
- Industry news (EU AI Act updates)
- Offer help: "Need assistance?"
- CTA: "See What's New"
```

---

### Milestone Celebration

**Trigger:** User achieves milestone (first document, 50% compliance, full compliance)  
**Subject:** 🎉 Congratulations! You've achieved [Milestone]  
**Goal:** Positive reinforcement

**Milestones:**
- First AI system added
- First document generated
- First requirement completed
- 25% compliance
- 50% compliance
- 75% compliance
- 100% compliance (full compliance achieved!)

---

### Urgent Deadline Alert

**Trigger:** 30 days before EU AI Act deadline for high-risk systems  
**Subject:** ⚠️ 30 days until EU AI Act deadline - Action required  
**Goal:** Create urgency for final push

**Content Structure:**
```
- Countdown: 30 days remaining
- Your high-risk systems status
- What's still needed
- Consequences of non-compliance
- CTA: "Complete Your Compliance"
```

---

## Phase 4: Lifecycle Emails

### Trial Ending (3 Days Before)

**Trigger:** 3 days before trial expires  
**Subject:** Your Protectron trial ends in 3 days  
**Goal:** Convert to paid

**Content Structure:**
```
- Trial summary: What they've accomplished
- What they'll lose access to
- Pricing reminder
- Special offer (if applicable)
- CTA: "Upgrade Now"
```

---

### Subscription Renewed

**Trigger:** Successful subscription renewal  
**Subject:** Thanks for staying with Protectron! 💜  
**Goal:** Retention, appreciation

**Content Structure:**
```
- Thank you message
- What's new this month
- Upcoming features
- Support resources
```

---

### Account Anniversary

**Trigger:** 1 year since signup  
**Subject:** Happy 1 year with Protectron! 🎂  
**Goal:** Celebrate, show value delivered

**Content Structure:**
```
- Year in review stats
- Achievements
- Thank you
- What's coming next year
```

---

### New Team Member Onboarding

**Trigger:** New team member joins organization  
**Subject:** Welcome to [Organization] on Protectron!  
**Goal:** Onboard team members quickly

**Content Structure:**
```
- Welcome to the team
- What Protectron does
- Their role and permissions
- Quick start guide
- CTA: "Explore the Dashboard"
```

---

## Technical Implementation

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Email System Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Supabase   │    │  Edge Func   │    │    Resend    │  │
│  │   Database   │───▶│  send-email  │───▶│     API      │  │
│  │  (triggers)  │    │              │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │   pg_cron    │    │  Email Queue │                       │
│  │  (scheduled) │───▶│    Table     │                       │
│  └──────────────┘    └──────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Components Needed

1. **Email Queue Table** - Store scheduled emails
2. **User Onboarding State** - Track email sequence progress
3. **pg_cron Extension** - Schedule email jobs
4. **React Email Templates** - Beautiful, responsive emails
5. **Edge Function Updates** - New email types

---

## Database Schema

### Table: `email_queue`

```sql
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, sent, cancelled, failed
  payload JSONB,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_queue_scheduled ON email_queue(scheduled_for) 
  WHERE status = 'pending';
CREATE INDEX idx_email_queue_user ON email_queue(user_id);
```

### Table: `user_onboarding_state`

```sql
CREATE TABLE user_onboarding_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  signup_date TIMESTAMPTZ NOT NULL,
  emails_sent JSONB DEFAULT '[]', -- Array of sent email types
  last_email_sent_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  first_ai_system_at TIMESTAMPTZ,
  first_document_at TIMESTAMPTZ,
  first_requirement_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `email_templates` (Optional - for admin editing)

```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  html_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Email Templates

### File Structure

```
src/lib/resend/templates/
├── base-layout.tsx          # Shared email wrapper
├── welcome.tsx              # Day 0: Welcome
├── getting-started.tsx      # Day 1: Getting Started
├── milestone-nudge.tsx      # Day 3: First Milestone
├── feature-document.tsx     # Day 5: Document Generator
├── progress-checkin.tsx     # Day 7: Progress Check-in
├── deadline-awareness.tsx   # Day 10: EU AI Act Deadline
├── case-study.tsx           # Day 14: Social Proof
├── feature-risk.tsx         # Day 21: Risk Assessment
├── monthly-summary.tsx      # Day 28: First Month
├── weekly-digest.tsx        # Weekly: Progress Digest
├── reengagement.tsx         # Inactive user emails
├── milestone-celebration.tsx # Achievement emails
├── trial-ending.tsx         # Trial conversion
└── team-member-welcome.tsx  # New team member
```

### Base Layout Component

```tsx
// src/lib/resend/templates/base-layout.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface BaseLayoutProps {
  previewText: string;
  children: React.ReactNode;
  recipientEmail: string;
}

export function BaseLayout({ previewText, children, recipientEmail }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src="https://protectron.ai/assets/images/logo-light.png"
              width="140"
              alt="Protectron"
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Protectron Inc. • San Diego, California
            </Text>
            <Text style={footerLinks}>
              <Link href="https://protectron.ai" style={link}>Website</Link>
              {" • "}
              <Link href="https://protectron.ai/docs" style={link}>Documentation</Link>
              {" • "}
              <Link href="https://protectron.ai/support" style={link}>Support</Link>
            </Text>
            <Text style={footerEmail}>
              Sent to {recipientEmail}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Create `email_queue` table
- [ ] Create `user_onboarding_state` table
- [ ] Set up pg_cron extension
- [ ] Create base email layout component
- [ ] Update Edge Function with new email types

### Phase 2: Welcome Sequence (Week 2)

- [ ] Welcome Email template
- [ ] Getting Started Guide template
- [ ] First Milestone Nudge template
- [ ] Feature Spotlight: Document Generator template
- [ ] Progress Check-in template
- [ ] Trigger: Schedule emails on user signup

### Phase 3: Education Sequence (Week 3)

- [ ] EU AI Act Deadline Awareness template
- [ ] Case Study template
- [ ] Feature Spotlight: Risk Assessment template
- [ ] First Month Summary template

### Phase 4: Retention & Lifecycle (Week 4)

- [ ] Weekly Digest template
- [ ] Re-engagement templates (7-day, 14-day)
- [ ] Milestone Celebration template
- [ ] Urgent Deadline Alert template
- [ ] Trial Ending template
- [ ] Set up pg_cron jobs for scheduled sends

### Phase 5: Testing & Launch

- [ ] Test all email templates (Resend preview)
- [ ] Test email triggers
- [ ] Test unsubscribe flow
- [ ] Monitor deliverability
- [ ] A/B test subject lines

---

## Email Type Constants

Add to Edge Function:

```typescript
type OnboardingEmailType =
  // Phase 1: Activation
  | "welcome"
  | "getting-started"
  | "milestone-nudge"
  | "feature-document-generator"
  | "progress-checkin"
  // Phase 2: Education
  | "deadline-awareness"
  | "case-study"
  | "feature-risk-assessment"
  | "monthly-summary"
  // Phase 3: Retention
  | "weekly-digest"
  | "reengagement-7day"
  | "reengagement-14day"
  | "milestone-celebration"
  | "deadline-urgent"
  // Phase 4: Lifecycle
  | "trial-ending"
  | "subscription-renewed"
  | "account-anniversary"
  | "team-member-welcome";
```

---

## Notes

- All emails should respect user notification preferences
- Include unsubscribe link in every email (required by law)
- Track open rates and click rates via Resend
- A/B test subject lines for key emails
- Consider timezone for send times
- Mobile-responsive design is critical

---

## Resources

- [Resend Documentation](https://resend.com/docs)
- [React Email](https://react.email)
- [EU AI Act Official Text](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [pg_cron Documentation](https://github.com/citusdata/pg_cron)

---

*This document will be updated as we implement the email system.*
