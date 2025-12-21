"use client";

import { useState } from "react";
import { Add, Minus, SearchNormal1, Book1, Cpu, DocumentText, Card, Code, ShieldTick } from "iconsax-react";
import { Input } from "@/components/base/input/input";
import { Tabs, TabList, Tab, TabPanel } from "@/components/application/tabs/tabs";
import { cx } from "@/utils/cx";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book1,
    description: "Learn the basics of using Protectron",
    items: [
      {
        question: "How do I get started with Protectron?",
        answer: "Start by completing the risk assessment quiz to classify your AI systems. Then add your AI systems to the dashboard, and Protectron will guide you through the compliance requirements based on your risk level.",
      },
      {
        question: "How long does it take to get compliant?",
        answer: "Most companies complete their initial compliance in 2-4 weeks. That's much faster than the 3-6 months consultants typically take, because our platform automates the heavy lifting.",
      },
      {
        question: "Can I use this if I'm not technical?",
        answer: "Absolutely. Our platform is designed for legal, compliance, and business teams, not just engineers. The questionnaire uses plain language, and our AI generates documentation that's easy to review and customize.",
      },
    ],
  },
  {
    id: "ai-systems",
    title: "AI Systems",
    icon: Cpu,
    description: "Managing your AI systems and agents",
    items: [
      {
        question: "How do I know what risk category my AI falls into?",
        answer: "Our free risk assessment quiz walks you through a simple questionnaire about your AI system's purpose, data usage, and deployment context. In about 10 minutes, you'll know exactly which risk category applies.",
      },
      {
        question: "What if my AI system is high-risk?",
        answer: "We guide you through the full high-risk requirements, including conformity assessments and EU database registration. Our platform handles the complexity so you don't have to become a regulatory expert.",
      },
      {
        question: "Do you support AI agents specifically?",
        answer: "Yes! We're built for AI agents. Our SDK captures audit trails automatically, tracking every tool call, decision, and human override. This is essential for Article 12 compliance which requires detailed logging.",
      },
    ],
  },
  {
    id: "documents",
    title: "Documents & Compliance",
    icon: DocumentText,
    description: "Document generation and requirements",
    items: [
      {
        question: "What documents does Protectron generate?",
        answer: "Protectron generates Technical Documentation (Article 11), Risk Assessments (Article 9), Data Governance Policies (Article 10), and Model Cards. All documents are AI-generated based on your system details and can be customized.",
      },
      {
        question: "What is the Protectron Certified badge?",
        answer: "It's a verifiable badge you can embed on your website proving your AI is EU AI Act compliant. After completing requirements and 30 days of SDK logging, you earn the badge. Enterprise customers report 23% higher deal close rates with it.",
      },
      {
        question: "How do I track my compliance progress?",
        answer: "The dashboard shows your overall compliance percentage, pending requirements, and upcoming deadlines. Each AI system has its own progress tracker showing which requirements are complete and which need attention.",
      },
    ],
  },
  {
    id: "sdk",
    title: "SDK Integration",
    icon: Code,
    description: "Integrating the audit trail SDK",
    items: [
      {
        question: "How does the Agent Audit SDK work?",
        answer: "Our SDK integrates with one decorator. It automatically captures tool calls, decision reasoning, and human overrides. All data is stored for 6+ months with PII auto-redaction. Works with LangChain, CrewAI, AutoGen, and custom agents.",
      },
      {
        question: "Which frameworks are supported?",
        answer: "We support LangChain, CrewAI, AutoGen, and custom Python agents. The SDK is designed to be framework-agnostic and can be integrated with any Python-based AI agent.",
      },
      {
        question: "Is my data secure?",
        answer: "Yes. We're SOC 2 compliant and use enterprise-grade encryption. Your compliance data is hosted in EU servers, ensuring full GDPR compliance. EU data residency add-on available for €99/month.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Plans",
    icon: Card,
    description: "Subscription and payment questions",
    items: [
      {
        question: "Why is Protectron cheaper than Credo AI?",
        answer: "Enterprise platforms like Credo AI charge €50,000+ per year because they're built for Fortune 500 companies. We've automated the heavy lifting so startups and SMBs can achieve the same compliance at 1/10th the cost — starting at just €99/month.",
      },
      {
        question: "Can I change my plan later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the end of your billing cycle.",
      },
      {
        question: "Do you offer a free trial?",
        answer: "We offer a free risk assessment to help you understand your compliance requirements. After that, you can choose the plan that best fits your needs. Enterprise customers can request a demo.",
      },
    ],
  },
  {
    id: "compliance",
    title: "EU AI Act Compliance",
    icon: ShieldTick,
    description: "Understanding the regulation",
    items: [
      {
        question: "Do I really need EU AI Act compliance?",
        answer: "If you deploy AI systems that serve EU users or customers, yes. The law is already in effect, with full enforcement by August 2026. Non-compliance can result in fines up to €35 million or 7% of global revenue.",
      },
      {
        question: "Does the EU AI Act apply to US companies?",
        answer: "Yes, if your AI systems are used by people in the EU or affect EU citizens, you must comply regardless of where your company is based. This is similar to how GDPR applies to non-EU companies.",
      },
      {
        question: "What if I use third-party AI (like OpenAI or AWS)?",
        answer: "You're still responsible for compliance as a 'deployer' of AI systems. However, your requirements may be reduced if the provider has already addressed certain obligations. Protectron helps you understand your specific responsibilities.",
      },
    ],
  },
];

const FAQAccordion = ({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div className="border-b border-secondary last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-primary">{item.question}</span>
        <span className="shrink-0 text-tertiary">
          {isOpen ? <Minus size={20} /> : <Add size={20} />}
        </span>
      </button>
      <div
        className={cx(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-sm text-tertiary leading-relaxed">{item.answer}</p>
      </div>
    </div>
  );
};

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (categoryId: string, questionIndex: number) => {
    const key = `${categoryId}-${questionIndex}`;
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Filter categories and items based on search
  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  const displayCategories = selectedCategory
    ? filteredCategories.filter((c) => c.id === selectedCategory)
    : filteredCategories;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-display-xs font-semibold text-primary lg:text-display-sm">
            Help Center
          </h1>
          <p className="mt-1 text-sm text-tertiary lg:text-md">
            Find answers to frequently asked questions and learn how to use Protectron.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={setSearchQuery}
            icon={SearchNormal1}
          />
        </div>
      </div>

      {/* Inline Tabs */}
      <Tabs 
        selectedKey={selectedCategory || "all"} 
        onSelectionChange={(key) => setSelectedCategory(key === "all" ? null : key as string)}
      >
        <TabList 
          type="underline" 
          size="sm" 
          items={[
            { id: "all", label: "All Topics" },
            ...faqCategories.map((c) => ({ id: c.id, label: c.title }))
          ]}
        >
          {(item) => <Tab key={item.id} id={item.id} label={item.label} />}
        </TabList>
      </Tabs>

      {/* FAQ Content */}
      {displayCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-primary">No results found</p>
          <p className="mt-1 text-sm text-tertiary">
            Try adjusting your search or browse all topics.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {displayCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <category.icon size={20} color="currentColor" className="text-brand-600" />
                </div>
                <div>
                  <h2 className="text-md font-semibold text-primary">{category.title}</h2>
                  <p className="text-sm text-tertiary">{category.description}</p>
                </div>
              </div>
              <div>
                {category.items.map((item, index) => (
                  <FAQAccordion
                    key={index}
                    item={item}
                    isOpen={openItems.has(`${category.id}-${index}`)}
                    onToggle={() => toggleItem(category.id, index)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
