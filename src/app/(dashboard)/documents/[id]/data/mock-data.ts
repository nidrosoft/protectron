import { DocumentText1, ClipboardText, Note, Document } from "iconsax-react";

// Mock document data
export const mockDocuments: Record<string, {
  id: string;
  name: string;
  type: "technical" | "risk" | "policy" | "model_card";
  systemId: string;
  systemName: string;
  status: "draft" | "final";
  generatedAt: string;
  updatedAt: string;
  content: string;
}> = {
  "doc-01": {
    id: "doc-01",
    name: "Technical Documentation - Customer Support Chatbot",
    type: "technical",
    systemId: "system-01",
    systemName: "Customer Support Chatbot",
    status: "final",
    generatedAt: "Dec 10, 2025",
    updatedAt: "Dec 12, 2025",
    content: `
      <h1>Technical Documentation</h1>
      <h2>Customer Support Chatbot</h2>
      
      <h3>1. General Description</h3>
      <h4>1.1 Intended Purpose</h4>
      <p>This AI system is designed to provide automated customer support through natural language conversations. The system analyzes customer inquiries and provides relevant responses based on the company's knowledge base, FAQs, and product documentation.</p>
      
      <h4>1.2 Intended Users</h4>
      <ul>
        <li>Customer service representatives</li>
        <li>End customers seeking support</li>
        <li>Support team supervisors</li>
      </ul>
      
      <h4>1.3 Deployment Context</h4>
      <p>The chatbot is deployed on the company's website and mobile application, accessible 24/7 to customers worldwide. It operates as a first-line support tool, escalating complex issues to human agents when necessary.</p>
      
      <h3>2. Technical Specifications</h3>
      <h4>2.1 System Architecture</h4>
      <p>The system utilizes a transformer-based large language model (LLM) fine-tuned on customer support conversations. Key components include:</p>
      <ul>
        <li><strong>Natural Language Understanding (NLU):</strong> Processes and interprets customer queries</li>
        <li><strong>Intent Classification:</strong> Categorizes queries into predefined support categories</li>
        <li><strong>Response Generation:</strong> Produces contextually appropriate responses</li>
        <li><strong>Knowledge Retrieval:</strong> Fetches relevant information from the knowledge base</li>
      </ul>
      
      <h4>2.2 Data Processing</h4>
      <p>The system processes the following data types:</p>
      <ul>
        <li>Customer text inputs (queries, follow-up questions)</li>
        <li>Conversation history within a session</li>
        <li>Product and service documentation</li>
        <li>Historical support tickets (anonymized)</li>
      </ul>
      
      <h3>3. Performance Metrics</h3>
      <p>The system is evaluated on the following key performance indicators:</p>
      <ul>
        <li><strong>Response Accuracy:</strong> 94% of responses rated as helpful by customers</li>
        <li><strong>First Contact Resolution:</strong> 78% of queries resolved without human escalation</li>
        <li><strong>Average Response Time:</strong> 1.2 seconds</li>
        <li><strong>Customer Satisfaction Score:</strong> 4.5/5.0</li>
      </ul>
      
      <h3>4. Human Oversight</h3>
      <p>Human oversight is maintained through:</p>
      <ul>
        <li>Real-time monitoring dashboard for support supervisors</li>
        <li>Automatic escalation triggers for sensitive topics</li>
        <li>Weekly review of flagged conversations</li>
        <li>Monthly performance audits by the AI governance team</li>
      </ul>
      
      <h3>5. Compliance Statement</h3>
      <p>This AI system has been classified as <strong>Limited Risk</strong> under the EU AI Act. As such, it complies with transparency requirements by clearly identifying itself as an AI system to users at the start of each conversation.</p>
    `,
  },
  "doc-02": {
    id: "doc-02",
    name: "Risk Assessment - Automated Hiring Screener",
    type: "risk",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    status: "draft",
    generatedAt: "Dec 8, 2025",
    updatedAt: "Dec 11, 2025",
    content: `
      <h1>Risk Assessment Report</h1>
      <h2>Automated Hiring Screener</h2>
      
      <h3>1. Executive Summary</h3>
      <p>This risk assessment evaluates the Automated Hiring Screener AI system, which is classified as <strong>High-Risk</strong> under the EU AI Act due to its use in employment decisions. The assessment identifies key risks and proposes mitigation strategies to ensure compliance and ethical operation.</p>
      
      <h3>2. System Overview</h3>
      <p>The Automated Hiring Screener analyzes job applications to identify qualified candidates based on resume content, skills matching, and job requirements. It provides ranking scores to assist human recruiters in the initial screening process.</p>
      
      <h3>3. Identified Risks</h3>
      
      <h4>3.1 Bias and Discrimination Risk</h4>
      <p><strong>Risk Level: High</strong></p>
      <p>The system may perpetuate historical biases present in training data, potentially discriminating against protected groups based on gender, age, ethnicity, or disability status.</p>
      <p><strong>Mitigation:</strong> Regular bias audits, diverse training data, fairness constraints in the model, and human review of all final decisions.</p>
      
      <h4>3.2 Transparency Risk</h4>
      <p><strong>Risk Level: Medium</strong></p>
      <p>Candidates may not understand why they were rejected, leading to lack of transparency in the hiring process.</p>
      <p><strong>Mitigation:</strong> Provide explanations for screening decisions, maintain audit logs, and offer appeal mechanisms.</p>
      
      <h4>3.3 Data Quality Risk</h4>
      <p><strong>Risk Level: Medium</strong></p>
      <p>Poor quality or incomplete resume data may lead to inaccurate assessments.</p>
      <p><strong>Mitigation:</strong> Data validation checks, multiple data sources, and human verification of edge cases.</p>
      
      <h3>4. Compliance Requirements</h3>
      <ul>
        <li>Conformity assessment before deployment</li>
        <li>Registration in EU database for high-risk AI systems</li>
        <li>Comprehensive technical documentation</li>
        <li>Quality management system implementation</li>
        <li>Post-market monitoring plan</li>
      </ul>
      
      <h3>5. Recommendations</h3>
      <p>Based on this assessment, we recommend:</p>
      <ol>
        <li>Conducting quarterly bias audits with third-party validators</li>
        <li>Implementing explainable AI features for decision transparency</li>
        <li>Establishing a human-in-the-loop process for all final hiring decisions</li>
        <li>Creating a candidate appeal process for automated rejections</li>
      </ol>
    `,
  },
};

export const documentTypeConfig = {
  technical: { label: "Technical Doc", color: "brand" as const, icon: DocumentText1, bgColor: "bg-brand-100", textColor: "text-brand-600" },
  risk: { label: "Risk Assessment", color: "warning" as const, icon: ClipboardText, bgColor: "bg-warning-100", textColor: "text-warning-600" },
  policy: { label: "Policy", color: "purple" as const, icon: Note, bgColor: "bg-purple-100", textColor: "text-purple-600" },
  model_card: { label: "Model Card", color: "blue" as const, icon: Document, bgColor: "bg-blue-100", textColor: "text-blue-600" },
};

export const statusConfig = {
  draft: { label: "Draft", color: "warning" as const },
  final: { label: "Final", color: "success" as const },
};
