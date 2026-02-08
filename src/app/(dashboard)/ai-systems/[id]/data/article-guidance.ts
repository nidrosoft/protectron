/**
 * EU AI Act Article Descriptions and Guidance
 * Provides helpful context for each article and requirement
 */

export interface ArticleInfo {
  id: string;
  title: string;
  summary: string;
  whatItMeans: string;
  requirements: Record<string, RequirementGuidance>;
}

export interface RequirementGuidance {
  description: string;
  whatToDo: string;
  documentType?: string;
  estimatedTime?: string;
  priority?: "high" | "medium" | "low";
}

export const articleDescriptions: Record<string, ArticleInfo> = {
  "art-9": {
    id: "art-9",
    title: "Risk Management System",
    summary: "Establish and maintain a risk management system throughout the AI system lifecycle.",
    whatItMeans: "You need to identify, analyze, and mitigate risks associated with your AI system. This includes documenting potential harms and implementing safeguards.",
    requirements: {
      "Risk Management System": {
        description: "A documented process for identifying, assessing, and mitigating AI-related risks.",
        whatToDo: "Generate a Risk Management Framework document that outlines your risk identification process, assessment criteria, and mitigation strategies.",
        documentType: "Risk Management Framework",
        estimatedTime: "2-3 hours",
        priority: "high",
      },
      "Risk Identification": {
        description: "Systematic identification of known and foreseeable risks to health, safety, and fundamental rights.",
        whatToDo: "Complete a risk assessment identifying potential harms, their likelihood, and severity. Upload evidence of risk analysis workshops or assessments.",
        documentType: "Risk Assessment Report",
        estimatedTime: "3-4 hours",
        priority: "high",
      },
      "Risk Mitigation Measures": {
        description: "Documented measures to eliminate or reduce identified risks to an acceptable level.",
        whatToDo: "Document the technical and organizational measures you've implemented to address each identified risk. Include testing results that validate mitigation effectiveness.",
        documentType: "Risk Mitigation Plan",
        estimatedTime: "2-3 hours",
        priority: "high",
      },
    },
  },
  "art-10": {
    id: "art-10",
    title: "Data and Data Governance",
    summary: "Ensure training, validation, and testing data meets quality criteria and is properly governed.",
    whatItMeans: "Your AI system's data must be relevant, representative, and free from errors. You need clear processes for data collection, preparation, and bias examination.",
    requirements: {
      "Data Governance Framework": {
        description: "A comprehensive framework for managing data used in training, validation, and testing.",
        whatToDo: "Generate a Data Governance Policy that documents your data sources, quality criteria, and management processes. Use the 'Data Governance' tool above.",
        documentType: "Data Governance Policy",
        estimatedTime: "2-3 hours",
        priority: "high",
      },
      "Training Data Quality": {
        description: "Evidence that training data is relevant, representative, and of sufficient quality.",
        whatToDo: "Document your data quality metrics, validation procedures, and any data preprocessing steps. Upload data quality reports or testing documentation.",
        documentType: "Data Quality Report",
        estimatedTime: "2-4 hours",
        priority: "high",
      },
      "Bias Examination": {
        description: "Analysis of potential biases in data and measures to address them.",
        whatToDo: "Conduct and document a bias assessment. Identify potential sources of bias in your training data and the steps taken to detect and mitigate them.",
        documentType: "Bias Assessment Report",
        estimatedTime: "3-5 hours",
        priority: "high",
      },
      "Data Documentation": {
        description: "Comprehensive documentation of data characteristics, sources, and processing.",
        whatToDo: "Create a data documentation report describing your datasets, their sources, characteristics, and any transformations applied.",
        documentType: "Training Data Documentation",
        estimatedTime: "2-3 hours",
        priority: "medium",
      },
    },
  },
  "art-11": {
    id: "art-11",
    title: "Technical Documentation",
    summary: "Maintain detailed technical documentation demonstrating compliance with EU AI Act requirements.",
    whatItMeans: "You must document your AI system's design, development, capabilities, and limitations in sufficient detail for authorities to assess compliance.",
    requirements: {
      "Technical Documentation": {
        description: "Comprehensive technical documentation covering the AI system's design and development.",
        whatToDo: "Generate a Technical Documentation package that includes system architecture, design decisions, development methodology, and performance specifications.",
        documentType: "Technical Documentation",
        estimatedTime: "4-6 hours",
        priority: "high",
      },
      "System Description": {
        description: "Clear description of the AI system's intended purpose, functionality, and capabilities.",
        whatToDo: "Create a detailed system description including the AI's purpose, how it works, input/output specifications, and known limitations.",
        documentType: "AI System Description",
        estimatedTime: "2-3 hours",
        priority: "high",
      },
      "Development Process": {
        description: "Documentation of the development methodology and quality assurance processes.",
        whatToDo: "Document your development lifecycle, testing procedures, version control practices, and quality assurance measures.",
        documentType: "Development Process Documentation",
        estimatedTime: "2-3 hours",
        priority: "medium",
      },
    },
  },
  "art-12": {
    id: "art-12",
    title: "Record-Keeping & Logging",
    summary: "Ensure automatic logging of events and maintain records for traceability.",
    whatItMeans: "Your AI system must log its operations to enable monitoring, investigation of incidents, and demonstration of compliance.",
    requirements: {
      "Automatic Logging": {
        description: "Technical capability to automatically log AI system events and decisions.",
        whatToDo: "Implement and document your logging system. Show evidence of log storage, retention policies, and how logs can be accessed for audits.",
        documentType: "Logging Policy",
        estimatedTime: "2-3 hours",
        priority: "high",
      },
      "Record-Keeping Procedures": {
        description: "Procedures for maintaining and securing logs and records.",
        whatToDo: "Document your record-keeping procedures including retention periods, access controls, and data integrity measures.",
        documentType: "Record-Keeping Policy",
        estimatedTime: "1-2 hours",
        priority: "medium",
      },
    },
  },
  "art-13": {
    id: "art-13",
    title: "Transparency and Information",
    summary: "Ensure AI systems are transparent and users are provided with adequate information.",
    whatItMeans: "Users must understand they are interacting with AI and be informed about the system's capabilities, limitations, and how it makes decisions.",
    requirements: {
      "Transparency Obligations": {
        description: "Clear disclosure to users that they are interacting with an AI system.",
        whatToDo: "Document how you inform users about AI interaction. Create user-facing disclosures and ensure they are prominently displayed.",
        documentType: "Transparency Documentation",
        estimatedTime: "1-2 hours",
        priority: "high",
      },
      "Instructions for Use": {
        description: "Comprehensive instructions enabling deployers to use the AI system correctly.",
        whatToDo: "Generate Instructions for Use documentation that covers proper operation, known limitations, maintenance requirements, and safety precautions.",
        documentType: "Instructions for Use",
        estimatedTime: "3-4 hours",
        priority: "high",
      },
    },
  },
  "art-14": {
    id: "art-14",
    title: "Human Oversight",
    summary: "Design AI systems to enable effective human oversight during operation.",
    whatItMeans: "Humans must be able to understand, monitor, and intervene in AI system operations. The system should support, not replace, human decision-making for high-stakes decisions.",
    requirements: {
      "Human Oversight Measures": {
        description: "Technical and organizational measures enabling humans to oversee AI operations.",
        whatToDo: "Document your human oversight procedures including how operators can monitor, understand, and intervene in AI decisions. Include override capabilities.",
        documentType: "Human Oversight Procedures",
        estimatedTime: "3-4 hours",
        priority: "high",
      },
      "Intervention Capability": {
        description: "Ability for humans to intervene or override AI decisions when necessary.",
        whatToDo: "Document the technical mechanisms for human intervention, including stop buttons, decision overrides, and escalation procedures.",
        documentType: "Intervention Procedures",
        estimatedTime: "2-3 hours",
        priority: "high",
      },
    },
  },
  "art-15": {
    id: "art-15",
    title: "Accuracy, Robustness & Cybersecurity",
    summary: "Ensure AI systems achieve appropriate levels of accuracy, robustness, and cybersecurity.",
    whatItMeans: "Your AI system must perform reliably, resist errors and attacks, and maintain security throughout its lifecycle.",
    requirements: {
      "Accuracy Requirements": {
        description: "Evidence that the AI system meets declared accuracy levels.",
        whatToDo: "Document and test your AI system's accuracy metrics. Include validation test results, performance benchmarks, and accuracy thresholds.",
        documentType: "Accuracy Test Results",
        estimatedTime: "3-4 hours",
        priority: "high",
      },
      "Robustness": {
        description: "Measures ensuring the AI system performs reliably under various conditions.",
        whatToDo: "Document robustness testing including edge cases, adversarial inputs, and failure modes. Show how the system handles unexpected situations.",
        documentType: "Robustness Assessment",
        estimatedTime: "3-4 hours",
        priority: "high",
      },
      "Cybersecurity": {
        description: "Security measures protecting the AI system from attacks and unauthorized access.",
        whatToDo: "Complete a security assessment documenting vulnerabilities, protections, and incident response procedures.",
        documentType: "Security Assessment",
        estimatedTime: "4-6 hours",
        priority: "high",
      },
    },
  },
  "art-26": {
    id: "art-26",
    title: "Deployer Obligations",
    summary: "Requirements for organizations deploying high-risk AI systems.",
    whatItMeans: "As a deployer, you must ensure proper use of the AI system, maintain human oversight, and report incidents to providers and authorities.",
    requirements: {
      "Deployer Compliance": {
        description: "Evidence that the deployer meets their obligations under the EU AI Act.",
        whatToDo: "Document your compliance measures as a deployer, including staff training, operational procedures, and provider communication channels.",
        documentType: "Deployer Compliance Checklist",
        estimatedTime: "2-3 hours",
        priority: "medium",
      },
      "Monitoring Obligations": {
        description: "Procedures for ongoing monitoring of AI system performance and compliance.",
        whatToDo: "Document your monitoring procedures including what metrics you track, alert thresholds, and review frequency.",
        documentType: "Monitoring Procedures",
        estimatedTime: "2-3 hours",
        priority: "medium",
      },
      "Incident Reporting": {
        description: "Procedures for reporting incidents to providers and authorities.",
        whatToDo: "Establish incident reporting procedures. Document how incidents are detected, escalated, and reported within required timeframes.",
        documentType: "Incident Reporting Procedures",
        estimatedTime: "1-2 hours",
        priority: "medium",
      },
    },
  },
  "art-50": {
    id: "art-50",
    title: "Transparency for Limited Risk AI",
    summary: "Transparency requirements for AI systems that interact with people or generate content.",
    whatItMeans: "Users must be informed when they interact with AI systems like chatbots, and AI-generated content must be labeled as such.",
    requirements: {
      "AI Interaction Disclosure": {
        description: "Clear notification to users that they are interacting with an AI system.",
        whatToDo: "Implement and document how users are informed about AI interaction. Include screenshots or examples of disclosure notices.",
        documentType: "AI Disclosure Notice",
        estimatedTime: "1-2 hours",
        priority: "high",
      },
      "Synthetic Content Marking": {
        description: "Labeling of AI-generated or manipulated content as artificial.",
        whatToDo: "Document how AI-generated content is marked or labeled. Include examples of watermarks, labels, or metadata used.",
        documentType: "Content Marking Policy",
        estimatedTime: "1-2 hours",
        priority: "medium",
      },
    },
  },
};

/**
 * Get guidance for a specific requirement
 */
export function getRequirementGuidance(articleId: string, requirementTitle: string): RequirementGuidance | null {
  const article = articleDescriptions[articleId];
  if (!article) return null;
  return article.requirements[requirementTitle] || null;
}

/**
 * Get article info by ID
 */
export function getArticleInfo(articleId: string): ArticleInfo | null {
  return articleDescriptions[articleId] || null;
}

/**
 * Get priority label and color
 */
export function getPriorityConfig(priority?: string): { label: string; color: string } {
  switch (priority) {
    case "high":
      return { label: "High Priority", color: "text-error-600 bg-error-50" };
    case "medium":
      return { label: "Medium Priority", color: "text-warning-600 bg-warning-50" };
    case "low":
      return { label: "Low Priority", color: "text-gray-600 bg-gray-100" };
    default:
      return { label: "", color: "" };
  }
}
