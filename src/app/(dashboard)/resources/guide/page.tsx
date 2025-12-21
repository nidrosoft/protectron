"use client";

import { useState, useEffect } from "react";
import { Book1, Warning2, Calendar, ShieldTick, Briefcase, Receipt2, ArrowRight, Add } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Tabs, TabList, Tab } from "@/components/application/tabs/tabs";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface GuideTab {
  id: string;
  title: string;
  icon: React.ElementType;
}

const guideTabs: GuideTab[] = [
  { id: "overview", title: "Overview", icon: Book1 },
  { id: "risk-levels", title: "Risk Levels", icon: Warning2 },
  { id: "deadlines", title: "Deadlines", icon: Calendar },
  { id: "high-risk", title: "High-Risk AI", icon: ShieldTick },
  { id: "gpai", title: "GPAI", icon: Briefcase },
  { id: "penalties", title: "Penalties", icon: Receipt2 },
];

const OverviewContent = () => (
  <div className="prose prose-sm max-w-none">
    <h2 className="text-xl font-semibold text-primary">What is the EU AI Act?</h2>
    <p className="text-tertiary leading-relaxed">
      The European Union's Artificial Intelligence Act is the world's first comprehensive legal framework for AI. 
      If your company develops, deploys, or uses AI systems that affect people in Europe, this regulation applies 
      to you — regardless of where your company is based.
    </p>
    
    <h3 className="mt-6 text-lg font-semibold text-primary">Who Must Comply?</h3>
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Providers (Developers)</h4>
        <p className="mt-2 text-sm text-tertiary">
          Companies that develop AI systems or have AI systems developed on their behalf, 
          regardless of whether they place them on the market themselves.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Deployers (Users)</h4>
        <p className="mt-2 text-sm text-tertiary">
          Organizations that use AI systems under their authority, except for personal 
          non-professional activities.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Importers & Distributors</h4>
        <p className="mt-2 text-sm text-tertiary">
          Companies that bring AI systems into the EU market or make them available 
          within the EU.
        </p>
      </div>
    </div>

    <h3 className="mt-6 text-lg font-semibold text-primary">Key Principles</h3>
    <ul className="mt-4 space-y-2 text-tertiary">
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
        <span><strong className="text-primary">Risk-based approach:</strong> Requirements scale with the potential harm of the AI system</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
        <span><strong className="text-primary">Transparency:</strong> Users must know when they're interacting with AI</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
        <span><strong className="text-primary">Human oversight:</strong> High-risk AI must allow for human intervention</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
        <span><strong className="text-primary">Documentation:</strong> Technical documentation and logging are mandatory</span>
      </li>
    </ul>
  </div>
);

const RiskLevelsContent = () => (
  <div className="prose prose-sm max-w-none">
    <h2 className="text-xl font-semibold text-primary">The Four Risk Levels</h2>
    <p className="text-tertiary leading-relaxed">
      The EU AI Act categorizes AI systems into four risk levels, each with different requirements.
    </p>

    <div className="mt-6 space-y-4">
      <div className="rounded-lg border-2 border-error-200 bg-error-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error-100">
            <span className="text-sm font-bold text-error-700">1</span>
          </div>
          <h3 className="text-lg font-semibold text-error-900">Unacceptable Risk (Prohibited)</h3>
        </div>
        <p className="mt-3 text-sm text-error-800">
          These AI systems are banned entirely. Examples include:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-error-700">
          <li>• Social scoring by governments</li>
          <li>• Real-time biometric identification in public spaces (with exceptions)</li>
          <li>• AI that exploits vulnerabilities of specific groups</li>
          <li>• Subliminal manipulation techniques</li>
        </ul>
      </div>

      <div className="rounded-lg border-2 border-warning-200 bg-warning-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning-100">
            <span className="text-sm font-bold text-warning-700">2</span>
          </div>
          <h3 className="text-lg font-semibold text-warning-900">High-Risk</h3>
        </div>
        <p className="mt-3 text-sm text-warning-800">
          Subject to strict requirements before market placement. Examples include:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-warning-700">
          <li>• AI in critical infrastructure (energy, transport, water)</li>
          <li>• Educational and vocational training AI</li>
          <li>• Employment and worker management AI</li>
          <li>• Credit scoring and insurance AI</li>
          <li>• Law enforcement and border control AI</li>
        </ul>
      </div>

      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <span className="text-sm font-bold text-blue-700">3</span>
          </div>
          <h3 className="text-lg font-semibold text-blue-900">Limited Risk</h3>
        </div>
        <p className="mt-3 text-sm text-blue-800">
          Transparency obligations apply. Examples include:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>• Chatbots and virtual assistants</li>
          <li>• Emotion recognition systems</li>
          <li>• Deepfake generators</li>
          <li>• AI-generated content</li>
        </ul>
      </div>

      <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <span className="text-sm font-bold text-gray-700">4</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Minimal Risk</h3>
        </div>
        <p className="mt-3 text-sm text-gray-800">
          No specific requirements, but voluntary codes of conduct are encouraged. Examples include:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          <li>• AI-enabled video games</li>
          <li>• Spam filters</li>
          <li>• Inventory management systems</li>
        </ul>
      </div>
    </div>
  </div>
);

const DeadlinesContent = () => (
  <div className="prose prose-sm max-w-none">
    <h2 className="text-xl font-semibold text-primary">Key Compliance Deadlines</h2>
    <p className="text-tertiary leading-relaxed">
      The EU AI Act entered into force on August 1, 2024. Here are the critical dates you need to know.
    </p>

    <div className="mt-6 relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-200" />
      
      <div className="space-y-6">
        <div className="relative pl-10">
          <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-success-500 ring-4 ring-success-100" />
          <div className="rounded-lg border border-secondary p-4">
            <p className="text-xs font-medium text-success-600">COMPLETED</p>
            <h4 className="mt-1 font-semibold text-primary">August 1, 2024</h4>
            <p className="mt-1 text-sm text-tertiary">EU AI Act enters into force</p>
          </div>
        </div>

        <div className="relative pl-10">
          <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-warning-500 ring-4 ring-warning-100" />
          <div className="rounded-lg border border-secondary p-4">
            <p className="text-xs font-medium text-warning-600">UPCOMING</p>
            <h4 className="mt-1 font-semibold text-primary">February 2, 2025</h4>
            <p className="mt-1 text-sm text-tertiary">Prohibited AI practices ban takes effect</p>
          </div>
        </div>

        <div className="relative pl-10">
          <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-brand-500 ring-4 ring-brand-100" />
          <div className="rounded-lg border border-secondary p-4">
            <p className="text-xs font-medium text-brand-600">IMPORTANT</p>
            <h4 className="mt-1 font-semibold text-primary">August 2, 2025</h4>
            <p className="mt-1 text-sm text-tertiary">GPAI model requirements apply; Governance structures established</p>
          </div>
        </div>

        <div className="relative pl-10">
          <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-error-500 ring-4 ring-error-100" />
          <div className="rounded-lg border-2 border-error-200 bg-error-50 p-4">
            <p className="text-xs font-medium text-error-600">CRITICAL DEADLINE</p>
            <h4 className="mt-1 font-semibold text-error-900">August 2, 2026</h4>
            <p className="mt-1 text-sm text-error-800">Full enforcement for high-risk AI systems</p>
          </div>
        </div>

        <div className="relative pl-10">
          <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-gray-400 ring-4 ring-gray-100" />
          <div className="rounded-lg border border-secondary p-4">
            <h4 className="font-semibold text-primary">August 2, 2027</h4>
            <p className="mt-1 text-sm text-tertiary">High-risk AI in Annex I (regulated products) must comply</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HighRiskContent = () => (
  <div className="prose prose-sm max-w-none">
    <h2 className="text-xl font-semibold text-primary">High-Risk AI Requirements</h2>
    <p className="text-tertiary leading-relaxed">
      High-risk AI systems must meet comprehensive requirements before being placed on the market.
    </p>

    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Risk Management System</h4>
        <p className="mt-2 text-sm text-tertiary">
          Establish and maintain a risk management system throughout the AI system's lifecycle.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Data Governance</h4>
        <p className="mt-2 text-sm text-tertiary">
          Training, validation, and testing data must meet quality criteria and be properly documented.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Technical Documentation</h4>
        <p className="mt-2 text-sm text-tertiary">
          Comprehensive documentation demonstrating compliance before market placement.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Record-Keeping</h4>
        <p className="mt-2 text-sm text-tertiary">
          Automatic logging of events for traceability throughout the system's lifecycle.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Transparency</h4>
        <p className="mt-2 text-sm text-tertiary">
          Clear instructions for use and information about the AI system's capabilities and limitations.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Human Oversight</h4>
        <p className="mt-2 text-sm text-tertiary">
          Design for effective human oversight, including ability to intervene or stop the system.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Accuracy & Robustness</h4>
        <p className="mt-2 text-sm text-tertiary">
          Appropriate levels of accuracy, robustness, and cybersecurity throughout lifecycle.
        </p>
      </div>
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="font-medium text-primary">Conformity Assessment</h4>
        <p className="mt-2 text-sm text-tertiary">
          Undergo conformity assessment and register in the EU database before market placement.
        </p>
      </div>
    </div>
  </div>
);

const GPAIContent = () => (
  <div className="prose prose-sm max-w-none">
    <h2 className="text-xl font-semibold text-primary">General-Purpose AI (GPAI) Requirements</h2>
    <p className="text-tertiary leading-relaxed">
      GPAI models like GPT-4, Claude, and Gemini have specific obligations under the EU AI Act.
    </p>

    <h3 className="mt-6 text-lg font-semibold text-primary">For All GPAI Models</h3>
    <ul className="mt-4 space-y-2 text-tertiary">
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
        <span>Maintain technical documentation</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
        <span>Provide information to downstream providers</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
        <span>Comply with copyright law</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
        <span>Publish training data summaries</span>
      </li>
    </ul>

    <h3 className="mt-6 text-lg font-semibold text-primary">For GPAI with Systemic Risk</h3>
    <p className="mt-2 text-sm text-tertiary">
      Models trained with more than 10^25 FLOPs are presumed to have systemic risk and must also:
    </p>
    <ul className="mt-4 space-y-2 text-tertiary">
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-error-500" />
        <span>Perform model evaluations and adversarial testing</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-error-500" />
        <span>Assess and mitigate systemic risks</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-error-500" />
        <span>Track and report serious incidents</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-error-500" />
        <span>Ensure adequate cybersecurity protection</span>
      </li>
    </ul>
  </div>
);

const PenaltiesContent = () => (
  <div className="prose prose-sm max-w-none">
    <h2 className="text-xl font-semibold text-primary">Penalties for Non-Compliance</h2>
    <p className="text-tertiary leading-relaxed">
      The EU AI Act imposes significant fines for non-compliance, similar to GDPR.
    </p>

    <div className="mt-6 space-y-4">
      <div className="rounded-lg border-2 border-error-200 bg-error-50 p-5">
        <h3 className="text-2xl font-bold text-error-900">€35 million</h3>
        <p className="text-sm text-error-700">or 7% of global annual turnover</p>
        <p className="mt-2 text-sm text-error-800">
          For violations related to prohibited AI practices
        </p>
      </div>

      <div className="rounded-lg border-2 border-warning-200 bg-warning-50 p-5">
        <h3 className="text-2xl font-bold text-warning-900">€15 million</h3>
        <p className="text-sm text-warning-700">or 3% of global annual turnover</p>
        <p className="mt-2 text-sm text-warning-800">
          For violations of high-risk AI requirements
        </p>
      </div>

      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-5">
        <h3 className="text-2xl font-bold text-blue-900">€7.5 million</h3>
        <p className="text-sm text-blue-700">or 1% of global annual turnover</p>
        <p className="mt-2 text-sm text-blue-800">
          For providing incorrect information to authorities
        </p>
      </div>
    </div>

    <div className="mt-6 rounded-lg border border-secondary bg-secondary_subtle p-4">
      <h4 className="font-medium text-primary">SME Considerations</h4>
      <p className="mt-2 text-sm text-tertiary">
        For SMEs and startups, fines are capped at the lower of the percentage or absolute amount, 
        providing some protection for smaller companies.
      </p>
    </div>
  </div>
);

const tabContent: Record<string, React.ReactNode> = {
  overview: <OverviewContent />,
  "risk-levels": <RiskLevelsContent />,
  deadlines: <DeadlinesContent />,
  "high-risk": <HighRiskContent />,
  gpai: <GPAIContent />,
  penalties: <PenaltiesContent />,
};

export default function EUAIActGuidePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hasAISystems, setHasAISystems] = useState<boolean | null>(null);
  const supabase = createClient();

  // Check if user has any AI systems
  useEffect(() => {
    const checkAISystems = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (!profile?.organization_id) return;

      const { count } = await supabase
        .from("ai_systems")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", profile.organization_id);

      setHasAISystems((count ?? 0) > 0);
    };
    checkAISystems();
  }, [supabase]);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary lg:text-display-sm">
            EU AI Act Guide
          </h1>
          <p className="mt-1 text-sm text-tertiary lg:text-md">
            Comprehensive guide to understanding and complying with the EU AI Act.
          </p>
        </div>
        {hasAISystems === false ? (
          <Link href="/ai-systems/new">
            <Button
              size="md"
              color="primary"
              iconLeading={(props) => <Add size={20} {...props} />}
            >
              Add AI System
            </Button>
          </Link>
        ) : (
          <Link href="/ai-systems">
            <Button
              size="md"
              color="primary"
              iconTrailing={(props) => <ArrowRight size={20} {...props} />}
            >
              View AI Systems
            </Button>
          </Link>
        )}
      </div>

      {/* Inline Tabs */}
      <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
        <TabList 
          type="underline" 
          size="sm" 
          items={guideTabs.map((t) => ({ id: t.id, label: t.title }))}
        >
          {(item) => <Tab key={item.id} id={item.id} label={item.label} />}
        </TabList>
      </Tabs>

      {/* Content */}
      <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset lg:p-8">
        {tabContent[activeTab]}
      </div>

      {/* CTA */}
      <div className="rounded-xl bg-brand-50 p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brand-900">Ready to get compliant?</h3>
            <p className="mt-1 text-sm text-brand-700">
              Start your free risk assessment and get a personalized compliance roadmap.
            </p>
          </div>
          {hasAISystems === false ? (
            <Link href="/ai-systems/new">
              <Button size="md" color="primary" iconLeading={(props) => <Add size={20} {...props} />}>
                Add AI System
              </Button>
            </Link>
          ) : (
            <Link href="/ai-systems">
              <Button size="md" color="primary">
                View AI Systems
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
