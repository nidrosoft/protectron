"use client";

import { useState, useEffect, useRef } from "react";
import {
  DocumentText1,
  ClipboardText,
  Note,
  Document,
  ArrowLeft,
  ArrowRight,
  TickCircle,
  Cpu,
  Magicpen,
} from "iconsax-react";

import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import { generateDocument, getDocumentTypeName, type DocumentData } from "@/lib/document-generator";
import { createClient } from "@/lib/supabase/client";
import { useAISystems } from "@/hooks/use-ai-systems";

// Rotating status messages for document generation (no AI references)
const GENERATION_STEPS = [
  "Gathering your information...",
  "Analyzing system details...",
  "Structuring your document...",
  "Writing comprehensive content...",
  "Applying professional formatting...",
  "Finalizing your document...",
];

type DocumentType = 
  | "technical" 
  | "risk" 
  | "policy" 
  | "model_card"
  // Phase 1 - High Priority
  | "testing_validation"
  | "instructions_for_use"
  | "human_oversight"
  | "security_assessment"
  // Phase 2 - Medium Priority
  | "risk_mitigation_plan"
  | "training_data_doc"
  | "bias_assessment"
  | "ai_system_description"
  | "logging_policy"
  | "deployer_checklist"
  // Phase 3 - Lower Priority
  | "risk_management_policy"
  | "design_development_spec"
  | "audit_trail_samples"
  | "log_retention_doc"
  | "deployer_info_package"
  | "user_notification_templates"
  | "intervention_protocols"
  | "operator_training_records"
  | "accuracy_test_results"
  | "robustness_testing_doc"
  | "incident_reporting_procedures"
  | "monitoring_log"
  | "ai_disclosure_notice"
  | "synthetic_content_policy";

interface DocumentGeneratorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onGenerate?: (data: {
    type: DocumentType;
    systemId: string;
    answers: Record<string, string>;
  }) => void;
  preselectedType?: DocumentType;
  preselectedSystemId?: string;
}

const documentTypes = [
  {
    id: "technical" as const,
    name: "Technical Documentation",
    description: "Comprehensive technical documentation required for high-risk AI systems under Article 11 of the EU AI Act. This document covers system architecture, data processing, algorithms, and performance metrics. Essential for demonstrating compliance to regulators and auditors.",
    icon: DocumentText1,
    color: "brand",
    bgColor: "bg-brand-100",
    textColor: "text-brand-600",
  },
  {
    id: "risk" as const,
    name: "Risk Assessment Report",
    description: "A detailed analysis identifying and evaluating potential risks associated with your AI system. Covers foreseeable misuse, bias risks, and safety concerns with proposed mitigation strategies. Required for high-risk systems and recommended for all AI deployments.",
    icon: ClipboardText,
    color: "warning",
    bgColor: "bg-warning-100",
    textColor: "text-warning-600",
  },
  {
    id: "policy" as const,
    name: "Data Governance Policy",
    description: "Documents your organization's approach to data quality, collection, and bias mitigation. Outlines procedures for ensuring training data is representative, accurate, and ethically sourced. Critical for demonstrating responsible AI development practices.",
    icon: Note,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    id: "model_card" as const,
    name: "Model Card",
    description: "A transparency document that describes your AI model's intended use, capabilities, and limitations. Includes performance benchmarks, ethical considerations, and deployment recommendations. Helps users understand what the model can and cannot do.",
    icon: Document,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  // Phase 1 - High Priority Documents
  {
    id: "testing_validation" as const,
    name: "Testing & Validation Report",
    description: "Documents your AI system's testing methodology, validation procedures, and results. Required under Article 11 to demonstrate the system performs as intended and meets accuracy requirements.",
    icon: ClipboardText,
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    id: "instructions_for_use" as const,
    name: "Instructions for Use",
    description: "Clear guidance for deployers on how to use your AI system safely and effectively. Required under Article 13 to ensure transparency and proper human oversight.",
    icon: DocumentText1,
    color: "cyan",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-600",
  },
  {
    id: "human_oversight" as const,
    name: "Human Oversight Procedures",
    description: "Defines how humans monitor, intervene, and override AI decisions. Required under Article 14 to ensure effective human control over high-risk AI systems.",
    icon: Document,
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
  {
    id: "security_assessment" as const,
    name: "Security Assessment Report",
    description: "Evaluates cybersecurity threats, vulnerabilities, and protective measures for your AI system. Required under Article 15 to ensure appropriate security levels.",
    icon: ClipboardText,
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
  // Phase 2 - Medium Priority Documents
  {
    id: "risk_mitigation_plan" as const,
    name: "Risk Mitigation Plan",
    description: "Specific action plan detailing how identified risks will be addressed and reduced. Supports Article 9 risk management requirements.",
    icon: ClipboardText,
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
  },
  {
    id: "training_data_doc" as const,
    name: "Training Data Documentation",
    description: "Documents data sources, collection methods, preprocessing, and labeling procedures used to train your AI model. Required under Article 10.",
    icon: Note,
    color: "teal",
    bgColor: "bg-teal-100",
    textColor: "text-teal-600",
  },
  {
    id: "bias_assessment" as const,
    name: "Bias Assessment Report",
    description: "Analyzes potential biases in your AI system's training data and outputs. Required under Article 10 to ensure fairness and non-discrimination.",
    icon: ClipboardText,
    color: "pink",
    bgColor: "bg-pink-100",
    textColor: "text-pink-600",
  },
  {
    id: "ai_system_description" as const,
    name: "AI System Description",
    description: "General description of your AI system including its purpose, functionality, and operational context. Core component of Article 11 technical documentation.",
    icon: DocumentText1,
    color: "violet",
    bgColor: "bg-violet-100",
    textColor: "text-violet-600",
  },
  {
    id: "logging_policy" as const,
    name: "Logging Policy",
    description: "Defines what events are automatically recorded, how logs are stored, and retention periods. Required under Article 12 for traceability.",
    icon: Note,
    color: "slate",
    bgColor: "bg-slate-100",
    textColor: "text-slate-600",
  },
  {
    id: "deployer_checklist" as const,
    name: "Deployer Compliance Checklist",
    description: "Checklist for organizations deploying your AI system to ensure they meet Article 26 deployer obligations.",
    icon: ClipboardText,
    color: "emerald",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
  // Phase 3 - Lower Priority Documents
  {
    id: "risk_management_policy" as const,
    name: "Risk Management Policy",
    description: "Overall framework for identifying, analyzing, and managing risks throughout the AI system lifecycle. Supports Article 9 requirements.",
    icon: Note,
    color: "amber",
    bgColor: "bg-amber-100",
    textColor: "text-amber-600",
  },
  {
    id: "design_development_spec" as const,
    name: "Design & Development Specification",
    description: "Technical specifications covering system architecture, algorithms, and design decisions. Part of Article 11 technical documentation.",
    icon: DocumentText1,
    color: "sky",
    bgColor: "bg-sky-100",
    textColor: "text-sky-600",
  },
  {
    id: "audit_trail_samples" as const,
    name: "Audit Trail Samples",
    description: "Example logs demonstrating your system's traceability capabilities. Supports Article 12 record-keeping requirements.",
    icon: Document,
    color: "stone",
    bgColor: "bg-stone-100",
    textColor: "text-stone-600",
  },
  {
    id: "log_retention_doc" as const,
    name: "Log Retention Documentation",
    description: "Documents log retention periods and secure deletion procedures. Part of Article 12 compliance.",
    icon: Note,
    color: "zinc",
    bgColor: "bg-zinc-100",
    textColor: "text-zinc-600",
  },
  {
    id: "deployer_info_package" as const,
    name: "Deployer Information Package",
    description: "Comprehensive information package for deployers including system characteristics, limitations, and support contacts. Required under Article 13.",
    icon: Document,
    color: "lime",
    bgColor: "bg-lime-100",
    textColor: "text-lime-600",
  },
  {
    id: "user_notification_templates" as const,
    name: "User Notification Templates",
    description: "Templates for informing end users about AI system interactions. Supports Article 13 transparency requirements.",
    icon: DocumentText1,
    color: "fuchsia",
    bgColor: "bg-fuchsia-100",
    textColor: "text-fuchsia-600",
  },
  {
    id: "intervention_protocols" as const,
    name: "Intervention Protocols",
    description: "Step-by-step procedures for human operators to intervene in or override AI system decisions. Part of Article 14 compliance.",
    icon: ClipboardText,
    color: "rose",
    bgColor: "bg-rose-100",
    textColor: "text-rose-600",
  },
  {
    id: "operator_training_records" as const,
    name: "Operator Training Records",
    description: "Documentation of training provided to human operators overseeing the AI system. Supports Article 14 requirements.",
    icon: Note,
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
  {
    id: "accuracy_test_results" as const,
    name: "Accuracy Test Results",
    description: "Detailed performance accuracy metrics and test results for your AI system. Required under Article 15.",
    icon: ClipboardText,
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    id: "robustness_testing_doc" as const,
    name: "Robustness Testing Documentation",
    description: "Documents testing for error handling, edge cases, and system resilience. Part of Article 15 requirements.",
    icon: Document,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    id: "incident_reporting_procedures" as const,
    name: "Incident Reporting Procedures",
    description: "Procedures for reporting serious incidents to providers and authorities. Required under Article 26 for deployers.",
    icon: ClipboardText,
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
  {
    id: "monitoring_log" as const,
    name: "Monitoring Log Template",
    description: "Template for ongoing monitoring records of AI system operation. Supports Article 26 deployer obligations.",
    icon: Note,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    id: "ai_disclosure_notice" as const,
    name: "AI Disclosure Notice",
    description: "Notice template informing users they are interacting with an AI system. Required under Article 50 for limited-risk systems.",
    icon: DocumentText1,
    color: "cyan",
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-600",
  },
  {
    id: "synthetic_content_policy" as const,
    name: "Synthetic Content Policy",
    description: "Policy for marking and disclosing AI-generated content. Required under Article 50 for systems generating synthetic media.",
    icon: Note,
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
];


// Questions per document type
const questionsByType: Record<DocumentType, { id: string; label: string; placeholder: string }[]> = {
  technical: [
    { id: "purpose", label: "Describe the AI system's intended purpose", placeholder: "This AI system is designed to..." },
    { id: "data", label: "What data does the system process?", placeholder: "The system processes..." },
    { id: "decisions", label: "How are outputs used in decision-making?", placeholder: "The outputs are used to..." },
    { id: "users", label: "Who are the intended users of this system?", placeholder: "The intended users are..." },
  ],
  risk: [
    { id: "risks", label: "What are the known risks of this AI system?", placeholder: "The known risks include..." },
    { id: "mitigation", label: "What risk mitigation measures are in place?", placeholder: "We have implemented..." },
    { id: "monitoring", label: "How do you monitor for new risks?", placeholder: "We monitor risks by..." },
  ],
  policy: [
    { id: "data_sources", label: "What are your data sources?", placeholder: "Our data comes from..." },
    { id: "quality", label: "How do you ensure data quality?", placeholder: "We ensure quality by..." },
    { id: "bias", label: "What bias mitigation measures are in place?", placeholder: "We mitigate bias by..." },
  ],
  model_card: [
    { id: "capabilities", label: "What are the model's capabilities?", placeholder: "The model can..." },
    { id: "limitations", label: "What are the model's limitations?", placeholder: "The model cannot..." },
    { id: "performance", label: "How does the model perform?", placeholder: "The model achieves..." },
  ],
  // Phase 1 - High Priority
  testing_validation: [
    { id: "test_methodology", label: "Describe your testing methodology", placeholder: "We test the system by..." },
    { id: "test_data", label: "What test data do you use?", placeholder: "Our test datasets include..." },
    { id: "metrics", label: "What metrics do you measure?", placeholder: "We measure accuracy, precision..." },
    { id: "results", label: "What are the key test results?", placeholder: "The system achieved..." },
  ],
  instructions_for_use: [
    { id: "setup", label: "How should deployers set up the system?", placeholder: "To set up the system..." },
    { id: "operation", label: "How should the system be operated?", placeholder: "During normal operation..." },
    { id: "limitations", label: "What limitations should users be aware of?", placeholder: "Users should know that..." },
    { id: "support", label: "How can users get support?", placeholder: "For support, users can..." },
  ],
  human_oversight: [
    { id: "oversight_roles", label: "Who is responsible for oversight?", placeholder: "The following roles are responsible..." },
    { id: "monitoring", label: "How do humans monitor the system?", placeholder: "Humans monitor by..." },
    { id: "intervention", label: "When and how can humans intervene?", placeholder: "Humans can intervene when..." },
    { id: "override", label: "How can decisions be overridden?", placeholder: "Decisions can be overridden by..." },
  ],
  security_assessment: [
    { id: "threats", label: "What security threats have been identified?", placeholder: "Identified threats include..." },
    { id: "vulnerabilities", label: "What vulnerabilities exist?", placeholder: "Known vulnerabilities are..." },
    { id: "controls", label: "What security controls are in place?", placeholder: "We have implemented..." },
    { id: "incident_response", label: "How do you respond to security incidents?", placeholder: "In case of an incident..." },
  ],
  // Phase 2 - Medium Priority
  risk_mitigation_plan: [
    { id: "identified_risks", label: "What risks have been identified?", placeholder: "The identified risks are..." },
    { id: "mitigation_actions", label: "What specific actions will mitigate each risk?", placeholder: "For each risk, we will..." },
    { id: "timeline", label: "What is the timeline for implementation?", placeholder: "Mitigations will be implemented by..." },
    { id: "responsibility", label: "Who is responsible for each mitigation?", placeholder: "Responsibilities are assigned to..." },
  ],
  training_data_doc: [
    { id: "sources", label: "Where does your training data come from?", placeholder: "Training data is sourced from..." },
    { id: "collection", label: "How is data collected and processed?", placeholder: "Data is collected by..." },
    { id: "labeling", label: "How is data labeled?", placeholder: "Data labeling is done by..." },
    { id: "quality_checks", label: "What quality checks are performed?", placeholder: "We check data quality by..." },
  ],
  bias_assessment: [
    { id: "bias_types", label: "What types of bias have you assessed?", placeholder: "We assessed for..." },
    { id: "detection_methods", label: "How do you detect bias?", placeholder: "Bias is detected through..." },
    { id: "findings", label: "What bias issues were found?", placeholder: "Our assessment found..." },
    { id: "remediation", label: "How are bias issues addressed?", placeholder: "We address bias by..." },
  ],
  ai_system_description: [
    { id: "overview", label: "Provide a high-level overview of the system", placeholder: "This AI system is..." },
    { id: "functionality", label: "What are the main functions?", placeholder: "The main functions include..." },
    { id: "architecture", label: "Describe the system architecture", placeholder: "The system consists of..." },
    { id: "integration", label: "How does it integrate with other systems?", placeholder: "The system integrates with..." },
  ],
  logging_policy: [
    { id: "events_logged", label: "What events are logged?", placeholder: "We log the following events..." },
    { id: "storage", label: "How are logs stored?", placeholder: "Logs are stored in..." },
    { id: "retention", label: "How long are logs retained?", placeholder: "Logs are retained for..." },
    { id: "access", label: "Who can access the logs?", placeholder: "Log access is restricted to..." },
  ],
  deployer_checklist: [
    { id: "prerequisites", label: "What prerequisites must deployers meet?", placeholder: "Before deployment, ensure..." },
    { id: "compliance_items", label: "What compliance items must be verified?", placeholder: "Deployers must verify..." },
    { id: "ongoing_obligations", label: "What ongoing obligations exist?", placeholder: "Deployers must continuously..." },
    { id: "reporting", label: "What must be reported and when?", placeholder: "Deployers must report..." },
  ],
  // Phase 3 - Lower Priority
  risk_management_policy: [
    { id: "framework", label: "Describe your risk management framework", placeholder: "Our framework includes..." },
    { id: "identification", label: "How are risks identified?", placeholder: "Risks are identified through..." },
    { id: "assessment", label: "How are risks assessed?", placeholder: "Risks are assessed by..." },
    { id: "review", label: "How often is the policy reviewed?", placeholder: "The policy is reviewed..." },
  ],
  design_development_spec: [
    { id: "design_principles", label: "What design principles were followed?", placeholder: "The system was designed with..." },
    { id: "architecture_details", label: "Describe the technical architecture", placeholder: "The architecture consists of..." },
    { id: "algorithms", label: "What algorithms are used?", placeholder: "The system uses..." },
    { id: "development_process", label: "Describe the development process", placeholder: "Development followed..." },
  ],
  audit_trail_samples: [
    { id: "sample_events", label: "What types of events are shown in samples?", placeholder: "Sample logs show..." },
    { id: "format", label: "What is the log format?", placeholder: "Logs are formatted as..." },
    { id: "traceability", label: "How do logs enable traceability?", placeholder: "Traceability is achieved by..." },
  ],
  log_retention_doc: [
    { id: "retention_periods", label: "What are the retention periods?", placeholder: "Different log types are retained for..." },
    { id: "deletion_procedures", label: "How are logs securely deleted?", placeholder: "Logs are deleted by..." },
    { id: "legal_requirements", label: "What legal requirements apply?", placeholder: "We comply with..." },
  ],
  deployer_info_package: [
    { id: "system_info", label: "What system information is provided?", placeholder: "Deployers receive information about..." },
    { id: "contact_info", label: "What support contacts are provided?", placeholder: "Support is available at..." },
    { id: "updates", label: "How are deployers notified of updates?", placeholder: "Updates are communicated via..." },
  ],
  user_notification_templates: [
    { id: "ai_interaction", label: "How do you notify users of AI interaction?", placeholder: "Users are informed that..." },
    { id: "data_usage", label: "How is data usage communicated?", placeholder: "Users are told their data..." },
    { id: "opt_out", label: "What opt-out options exist?", placeholder: "Users can opt out by..." },
  ],
  intervention_protocols: [
    { id: "triggers", label: "What triggers human intervention?", placeholder: "Intervention is triggered when..." },
    { id: "procedures", label: "What are the intervention procedures?", placeholder: "When intervening, operators should..." },
    { id: "escalation", label: "What is the escalation path?", placeholder: "Issues are escalated to..." },
  ],
  operator_training_records: [
    { id: "training_content", label: "What training is provided?", placeholder: "Operators are trained on..." },
    { id: "certification", label: "What certifications are required?", placeholder: "Operators must be certified in..." },
    { id: "refresher", label: "How often is refresher training required?", placeholder: "Refresher training occurs..." },
  ],
  accuracy_test_results: [
    { id: "test_conditions", label: "Under what conditions were tests performed?", placeholder: "Tests were conducted under..." },
    { id: "accuracy_metrics", label: "What accuracy metrics were measured?", placeholder: "We measured..." },
    { id: "results_summary", label: "Summarize the accuracy results", placeholder: "The system achieved..." },
  ],
  robustness_testing_doc: [
    { id: "test_scenarios", label: "What scenarios were tested?", placeholder: "We tested scenarios including..." },
    { id: "edge_cases", label: "What edge cases were evaluated?", placeholder: "Edge cases included..." },
    { id: "failure_modes", label: "What failure modes were identified?", placeholder: "Identified failure modes include..." },
  ],
  incident_reporting_procedures: [
    { id: "incident_types", label: "What types of incidents must be reported?", placeholder: "Reportable incidents include..." },
    { id: "reporting_process", label: "What is the reporting process?", placeholder: "To report an incident..." },
    { id: "timelines", label: "What are the reporting timelines?", placeholder: "Incidents must be reported within..." },
  ],
  monitoring_log: [
    { id: "monitoring_frequency", label: "How often is monitoring performed?", placeholder: "Monitoring occurs..." },
    { id: "metrics_tracked", label: "What metrics are tracked?", placeholder: "We track..." },
    { id: "anomaly_detection", label: "How are anomalies detected?", placeholder: "Anomalies are detected by..." },
  ],
  ai_disclosure_notice: [
    { id: "disclosure_text", label: "What disclosure text is shown to users?", placeholder: "Users are shown..." },
    { id: "placement", label: "Where is the disclosure displayed?", placeholder: "The disclosure appears..." },
    { id: "timing", label: "When is the disclosure shown?", placeholder: "The disclosure is shown..." },
  ],
  synthetic_content_policy: [
    { id: "content_types", label: "What types of synthetic content are generated?", placeholder: "The system generates..." },
    { id: "marking_method", label: "How is synthetic content marked?", placeholder: "Content is marked by..." },
    { id: "user_awareness", label: "How are users made aware?", placeholder: "Users are informed that..." },
  ],
};

export const DocumentGeneratorModal = ({
  isOpen,
  onOpenChange,
  onGenerate,
  preselectedType,
  preselectedSystemId,
}: DocumentGeneratorModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(preselectedType || null);
  const [selectedSystem, setSelectedSystem] = useState<string>(preselectedSystemId || "");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const [generationStepIndex, setGenerationStepIndex] = useState(0);
  const [generatedSections, setGeneratedSections] = useState<{ title: string; content: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const generationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate through generation steps every 4 seconds while generating
  useEffect(() => {
    if (isGenerating) {
      setGenerationStepIndex(0);
      generationIntervalRef.current = setInterval(() => {
        setGenerationStepIndex((prev) => {
          // Cycle through steps, staying on the last one if we've gone through all
          if (prev < GENERATION_STEPS.length - 1) {
            return prev + 1;
          }
          return prev; // Stay on last step
        });
      }, 4000); // 4 seconds per step
    } else {
      if (generationIntervalRef.current) {
        clearInterval(generationIntervalRef.current);
        generationIntervalRef.current = null;
      }
      setGenerationStepIndex(0);
    }

    return () => {
      if (generationIntervalRef.current) {
        clearInterval(generationIntervalRef.current);
      }
    };
  }, [isGenerating]);
  
  // Fetch real AI systems
  const { systems, isLoading: isLoadingSystems } = useAISystems();
  const aiSystemOptions: SelectItemType[] = systems.map(s => ({ id: s.id, label: s.name }));
  
  const supabase = createClient();

  const handleClose = () => {
    setStep(1);
    setSelectedType(preselectedType || null);
    setSelectedSystem(preselectedSystemId || "");
    setAnswers({});
    setIsGenerating(false);
    setIsGenerated(false);
    setGenerationProgress("");
    setGeneratedSections([]);
    setError(null);
    onOpenChange(false);
  };

  const handleNext = async () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2 && selectedType) {
      setIsGenerating(true);
      setError(null);
      setGenerationProgress("Preparing document generation...");
      
      try {
        // Get the selected system details
        const selectedSystemData = systems.find(s => s.id === selectedSystem);
        const systemName = selectedSystemData?.name || "AI System";
        
        // Get auth token for Edge Function
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("Not authenticated");
        }
        
        setGenerationProgress("AI is generating comprehensive content...");
        
        // Call the AI document generation Edge Function
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-document`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              documentType: selectedType,
              systemInfo: {
                name: systemName,
                description: selectedSystemData?.description,
                riskLevel: selectedSystemData?.risk_level,
                provider: selectedSystemData?.provider,
                modelName: selectedSystemData?.model_name,
                systemType: selectedSystemData?.system_type,
              },
              answers,
            }),
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate document");
        }
        
        const result = await response.json();
        
        if (!result.success || !result.content?.sections) {
          throw new Error("Invalid response from AI");
        }
        
        // Store the generated sections for preview
        setGeneratedSections(result.content.sections);
        
        setGenerationProgress("Creating formatted document...");
        
        // Build document data with AI-generated content
        const documentData: DocumentData = {
          type: selectedType,
          metadata: {
            title: getDocumentTypeName(selectedType),
            subtitle: `For ${systemName}`,
            version: "1.0",
            confidential: true,
          },
          aiSystem: {
            id: selectedSystem,
            name: systemName,
            description: selectedSystemData?.description,
            riskLevel: selectedSystemData?.risk_level,
          },
          answers: {
            ...answers,
            // Merge AI-generated content into answers for the document generator
            _aiGenerated: JSON.stringify(result.content.sections),
          },
        } as DocumentData;
        
        // Generate and download the formatted document
        await generateDocument(documentData, { format: "docx", download: true });
        
        setIsGenerating(false);
        setIsGenerated(true);
        setStep(3);
      } catch (err) {
        console.error("Error generating document:", err);
        setError(err instanceof Error ? err.message : "Failed to generate document");
        setIsGenerating(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setIsGenerated(false);
      setStep(2);
    }
  };

  const handleSave = async () => {
    if (selectedType && selectedSystem) {
      try {
        // Convert generated sections to HTML content for the editor
        const htmlContent = generatedSections.map(section => 
          `<h2>${section.title}</h2><p>${section.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
        ).join('');
        
        // Get the system name
        const selectedSystemData = systems.find(s => s.id === selectedSystem);
        const systemName = selectedSystemData?.name || "AI System";
        
        // Create document in database with content
        const response = await fetch('/api/v1/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${getDocumentTypeName(selectedType)} - ${new Date().toLocaleDateString()}`,
            document_type: selectedType,
            ai_system_id: selectedSystem,
            generation_prompt: answers,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create document');
        }
        
        const { data: newDoc } = await response.json();
        
        // Now update the document with the generated content
        const updateResponse = await fetch(`/api/v1/documents/${newDoc.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: htmlContent,
          }),
        });
        
        if (!updateResponse.ok) {
          console.error('Failed to save document content');
        }
        
        onGenerate?.({
          type: selectedType,
          systemId: selectedSystem,
          answers,
        });
      } catch (error) {
        console.error('Error saving document:', error);
      }
    }
    handleClose();
  };

  const currentQuestions = selectedType ? questionsByType[selectedType] : [];
  const selectedTypeConfig = documentTypes.find((t) => t.id === selectedType);

  const canProceedStep1 = selectedType !== null;
  const canProceedStep2 = selectedSystem !== "" && currentQuestions.every((q) => answers[q.id]?.trim());

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-5xl">
              <CloseButton
                onClick={handleClose}
                theme="light"
                size="lg"
                className="absolute top-4 right-4 z-20"
              />

              {/* Header */}
              <div className="border-b border-secondary px-6 py-5">
                <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                  Generate Document
                </AriaHeading>
                <p className="mt-1 text-sm text-tertiary">
                  Step {step} of 3: {step === 1 ? "Select Document Type" : step === 2 ? "Provide Details" : "Review & Save"}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-4 flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={cx(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        s <= step ? "bg-brand-500" : "bg-quaternary"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="min-h-[400px] max-h-[70vh] overflow-y-auto px-8 py-8">
                {/* Step 1: Select Document Type */}
                {step === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {documentTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={cx(
                            "flex flex-col items-start rounded-xl p-6 text-left transition-all ring-1 ring-inset min-h-[180px]",
                            isSelected
                              ? "bg-brand-50 ring-2 ring-brand-500"
                              : "bg-primary ring-secondary hover:bg-secondary_subtle"
                          )}
                        >
                          <div className={cx("flex h-12 w-12 items-center justify-center rounded-lg", type.bgColor)}>
                            <Icon size={24} className={type.textColor} color="currentColor" variant="Bold" />
                          </div>
                          <h4 className="mt-4 text-md font-semibold text-primary">{type.name}</h4>
                          <p className="mt-2 text-sm text-tertiary leading-relaxed">{type.description}</p>
                          {isSelected && (
                            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-600">
                              <TickCircle size={16} color="currentColor" variant="Bold" />
                              Selected
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Step 2: Provide Details */}
                {step === 2 && selectedType && (
                  <div className="flex flex-col gap-6">
                    {/* AI System Selection */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-primary">
                        Select AI System <span className="text-error-500">*</span>
                      </label>
                      <Select
                        selectedKey={selectedSystem}
                        onSelectionChange={(key) => key && setSelectedSystem(String(key))}
                        items={aiSystemOptions}
                        size="md"
                        placeholder="Choose an AI system..."
                        placeholderIcon={Cpu}
                      >
                        {(item) => (
                          <Select.Item key={item.id} id={item.id} textValue={item.label}>
                            {item.label}
                          </Select.Item>
                        )}
                      </Select>
                    </div>

                    {/* Dynamic Questions */}
                    {currentQuestions.map((question) => (
                      <div key={question.id}>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          {question.label} <span className="text-error-500">*</span>
                        </label>
                        <textarea
                          value={answers[question.id] || ""}
                          onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                          placeholder={question.placeholder}
                          rows={3}
                          className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 3: Review & Save */}
                {step === 3 && isGenerated && selectedTypeConfig && (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 rounded-lg bg-success-50 p-4">
                      <TickCircle size={24} className="text-success-600" color="currentColor" variant="Bold" />
                      <div>
                        <p className="text-sm font-semibold text-success-700">Document generated successfully!</p>
                        <p className="text-sm text-success-600">Your {selectedTypeConfig.name.toLowerCase()} is ready to review.</p>
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div className="rounded-xl border border-secondary bg-secondary_subtle p-6">
                      <div className="flex items-start gap-4">
                        <div className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg", selectedTypeConfig.bgColor)}>
                          <selectedTypeConfig.icon size={24} className={selectedTypeConfig.textColor} color="currentColor" variant="Bold" />
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-primary">{selectedTypeConfig.name}</h4>
                          <p className="mt-1 text-sm text-tertiary">
                            {aiSystemOptions.find((s) => s.id === selectedSystem)?.label}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-lg bg-primary p-4 ring-1 ring-secondary ring-inset max-h-64 overflow-y-auto">
                        <h5 className="text-sm font-semibold text-primary uppercase tracking-wide">
                          {selectedTypeConfig.name}
                        </h5>
                        <div className="mt-4 space-y-4 text-sm text-secondary">
                          {generatedSections.slice(0, 3).map((section, index) => (
                            <div key={index}>
                              <p className="font-medium text-primary">{section.title}</p>
                              <p className="mt-1 text-tertiary line-clamp-3">
                                {section.content.substring(0, 200)}...
                              </p>
                            </div>
                          ))}
                          {generatedSections.length > 3 && (
                            <p className="text-xs text-quaternary italic">
                              [+{generatedSections.length - 3} more sections in the downloaded document]
                            </p>
                          )}
                        </div>
                      </div>

                      <Button size="sm" color="secondary" className="mt-4">
                        Edit in Full Editor
                      </Button>
                    </div>

                    {/* Document name */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-primary">Document Name</label>
                      <input
                        type="text"
                        defaultValue={`${selectedType}_${selectedSystem.replace("system-", "")}_${new Date().toISOString().split("T")[0]}.pdf`}
                        className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                )}

                {/* Generating State */}
                {step === 2 && isGenerating && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                      <Magicpen size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-600" color="currentColor" variant="Bold" />
                    </div>
                    <p className="mt-6 text-md font-semibold text-primary">We are working on your document...</p>
                    <p className="mt-2 text-sm text-tertiary transition-opacity duration-300">
                      {GENERATION_STEPS[generationStepIndex]}
                    </p>
                    <p className="mt-4 text-xs text-quaternary">This typically takes 15-30 seconds</p>
                  </div>
                )}

                {/* Error State */}
                {error && !isGenerating && (
                  <div className="rounded-lg bg-error-50 p-4 mb-4">
                    <p className="text-sm font-medium text-error-700">Generation failed</p>
                    <p className="text-sm text-error-600 mt-1">{error}</p>
                    <Button size="sm" color="secondary" className="mt-3" onClick={() => setError(null)}>
                      Try Again
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-secondary px-6 py-4">
                <div>
                  {step > 1 && !isGenerating && (
                    <Button
                      size="md"
                      color="secondary"
                      iconLeading={ArrowLeft}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button size="md" color="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  {step === 1 && (
                    <Button
                      size="md"
                      iconTrailing={ArrowRight}
                      onClick={handleNext}
                      isDisabled={!canProceedStep1}
                    >
                      Next: Provide Details
                    </Button>
                  )}
                  {step === 2 && !isGenerating && (
                    <Button
                      size="md"
                      onClick={handleNext}
                      isDisabled={!canProceedStep2}
                    >
                      Generate Document
                    </Button>
                  )}
                  {step === 3 && (
                    <div className="flex gap-3">
                      <Button size="md" color="secondary" onClick={() => { setIsGenerated(false); handleNext(); }}>
                        Regenerate
                      </Button>
                      <Button size="md" onClick={handleSave}>
                        Save to Documents
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};
