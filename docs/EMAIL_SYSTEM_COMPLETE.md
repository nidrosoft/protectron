# Protectron Email System - Complete Implementation Guide

> **Status:** Ready for Implementation  
> **Email Provider:** Resend (already integrated)  
> **Last Updated:** January 16, 2026  
> **Version:** 2.0 (Combined from PRD + Technical Plan)

---

## Executive Summary

This document combines the best of both email system plans into a comprehensive implementation guide. It includes:

- **12 time-based emails** over 30 days
- **8 behavioral trigger emails** based on user actions
- **6 lifecycle emails** for ongoing engagement
- **Complete database schema** with pg_cron automation
- **A/B testing strategy** with KPIs
- **Full email copy templates**

---

## Goals & Success Metrics

| Goal | Target |
|------|--------|
| Activation (first AI system) | 70% within 7 days |
| Engagement (first document) | 50% within 14 days |
| Trial → Paid Conversion | 15% |
| Day 30 Retention | 60% |
| Welcome Email Open Rate | 60%+ |
| Average Open Rate | 35%+ |
| Click-Through Rate | 8%+ |
| Unsubscribe Rate | <1% |

---

## Complete Email Sequence

### Track A: Time-Based (12 Emails)

| # | Day | Email | Goal | CTA |
|---|-----|-------|------|-----|
| 1 | 0 | Welcome | First login | "Go to Dashboard" |
| 2 | 1 | First Win | Risk classification | "Classify AI System" |
| 3 | 3 | Document Power | Document generation | "Generate Document" |
| 4 | 5 | Social Proof | Build trust | "Read Case Study" |
| 5 | 7 | Progress Review | Check-in | "See Progress" |
| 6 | 10 | Certification Badge | Feature highlight | "Get Badge" |
| 7 | 12 | Trial Ending | Urgency | "Upgrade Now" |
| 8 | 14 | Final Day | Conversion | "Choose Plan" |
| 9 | 17 | Deadline Awareness | Education | "View Roadmap" |
| 10 | 21 | Risk Deep Dive | Education | "Review Assessment" |
| 11 | 28 | Monthly Summary | Recap | "View Dashboard" |
| 12 | 365 | Anniversary | Retention | "Year in Review" |

### Track B: Behavioral Triggers (8 Types)

| Trigger | Condition | Email |
|---------|-----------|-------|
| No Login | 24h after signup | "Dashboard Awaits" |
| Abandoned Assessment | Started, not finished | "Finish Assessment" |
| First System | AI system created | "Great Start!" |
| Document Generated | First doc | "Doc Ready" |
| Re-engagement | 5+ days inactive | "We Miss You" |
| SDK Interest | SDK docs 2x | "SDK Quick Start" |
| High Engagement | 5+ logins | "Premium Features" |
| Milestone | 25/50/75/100% | "Congratulations!" |

### Track C: Lifecycle (6 Types)

| Email | Trigger | Frequency |
|-------|---------|-----------|
| Weekly Digest | Monday 9 AM | Weekly (opt-in) |
| Re-engagement 7d | No login 7 days | Once |
| Re-engagement 14d | No login 14 days | Once |
| Deadline Urgent | 30 days before | Once |
| Subscription Renewed | Payment success | Per cycle |
| Anniversary | 1 year | Annual |

---

## User Segments

| Segment | Definition | Approach |
|---------|------------|----------|
| New Signup | Just created account | Full sequence |
| Active Explorer | 2+ logins, no action | Encourage action |
| Activated | Completed classification | Feature discovery |
| Power User | Docs + requirements | Conversion focus |
| At-Risk | 5+ days inactive | Re-engagement |
| Developer | SDK docs visited | SDK content |
| Converted | Paid subscription | Customer success |

---

## Suppression Rules

- Max 3 emails per week
- Min 24h gap between emails
- Skip if user completed promoted action
- Suppress time-based if behavioral sent today
- Stop trial sequence on conversion

---

## Database Schema

### email_queue

```sql
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  payload JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  resend_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### user_onboarding_state

```sql
CREATE TABLE user_onboarding_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  signup_date TIMESTAMPTZ NOT NULL,
  trial_ends_at TIMESTAMPTZ,
  emails_sent TEXT[] DEFAULT '{}',
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  first_ai_system_at TIMESTAMPTZ,
  first_document_at TIMESTAMPTZ,
  compliance_percentage INTEGER DEFAULT 0,
  user_segment TEXT DEFAULT 'new_signup',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ
);
```

---

## Implementation Timeline

### Week 1-2: Foundation
- [ ] Create database tables
- [ ] Enable pg_cron
- [ ] Build base email layout
- [ ] Build welcome email
- [ ] Build first win email
- [ ] Implement signup trigger

### Week 3-4: Core Sequence
- [ ] Build emails 3-8
- [ ] Implement progress personalization
- [ ] Set up cron jobs
- [ ] Test full 14-day sequence

### Week 5-6: Behavioral Triggers
- [ ] Implement all triggers
- [ ] Build behavioral templates
- [ ] Set up suppression logic
- [ ] Launch pilot (10%)

### Week 7+: Optimization
- [ ] Review metrics
- [ ] Launch A/B tests
- [ ] Scale to 100%
- [ ] Monthly reviews

---

## A/B Testing

### Priority Tests

1. **Subject lines** - All emails, measure open rate
2. **CTA text** - Emails 1,2,7,8, measure clicks
3. **Send time** - Emails 1,2, measure opens
4. **Personalization** - Emails 1,5, measure clicks

### Test Parameters
- Min 100 recipients per variant
- Run 7+ days
- 95% confidence level
- Auto-select winner

---

## Email Copy: Welcome (Day 0)

**Subject:** Welcome to Protectron, {{first_name}}! Let's get you compliant 🛡️

Hi {{first_name}},

Welcome to Protectron! You've taken the first step toward EU AI Act compliance.

**Here's what happens next:**

1. **ASSESS** – Classify your AI systems by risk level (10 min)
2. **DOCUMENT** – Generate required compliance documentation
3. **CERTIFY** – Track requirements and prove compliance

Your 14-day free trial includes full access to all features.

[Go to Your Dashboard →]

**What's waiting for you:**
- Risk Classification Engine
- AI-Powered Document Generation
- Requirement Tracking
- Certification Badge

Questions? Just reply – a real human will respond.

– The Protectron Team

P.S. The August 2026 deadline is approaching. Companies achieving compliance early are winning enterprise deals now.

---

## Email Copy: Trial Ending (Day 12)

**Subject:** 2 days left: Don't lose your compliance progress

Hi {{first_name}},

Your Protectron trial ends in 2 days ({{trial_end_date}}).

**Here's what you've built:**
- {{systems_added}} AI systems classified
- {{documents_generated}} documents generated
- {{requirements_tracked}} requirements tracked

**What happens when your trial ends?**
- Your data stays safe for 30 days
- You can pick up where you left off
- But compliance tracking will be paused

**Choose your plan:**

| Starter | Growth | Scale |
|---------|--------|-------|
| €99/mo | €299/mo | €599/mo |
| 3 AI systems | 10 AI systems | 25 AI systems |

[Choose Your Plan →]

Questions? Reply or [book a call →].

– The Protectron Team

---

## Technical Notes

- Email provider: **Resend** (already integrated)
- Edge Function: `supabase/functions/send-email/`
- Templates: React Email components
- Scheduling: pg_cron extension
- Tracking: Resend webhooks → email_events table

---

## Files to Create

```
src/lib/resend/templates/
├── layouts/base-layout.tsx
├── onboarding/
│   ├── welcome.tsx
│   ├── first-win.tsx
│   ├── document-power.tsx
│   ├── social-proof.tsx
│   ├── progress-review.tsx
│   ├── certification-badge.tsx
│   ├── trial-ending.tsx
│   └── final-day.tsx
├── behavioral/
│   ├── no-login.tsx
│   ├── abandoned-assessment.tsx
│   ├── first-system.tsx
│   ├── document-generated.tsx
│   ├── re-engagement.tsx
│   └── milestone.tsx
└── lifecycle/
    ├── weekly-digest.tsx
    └── anniversary.tsx

supabase/migrations/
└── YYYYMMDD_email_system.sql
```

---

## Next Steps

1. Review and approve this plan
2. Create database migration
3. Build email templates (start with welcome + first-win)
4. Deploy Edge Function updates
5. Test with pilot users
6. Monitor and optimize

---

*See PRD-Email-Onboarding-System.md for detailed email copy and design specs.*
