import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Document type system prompts
const DOCUMENT_PROMPTS: Record<string, string> = {
  technical: `You are an expert EU AI Act compliance consultant specializing in technical documentation for AI systems.

Your task is to generate a comprehensive Technical Documentation document that meets Article 11 requirements of the EU AI Act.

## Document Structure
Generate content for each of the following sections. Be thorough, professional, and specific based on the provided information.

### Required Sections:
1. **Executive Summary** - Brief overview of the AI system and its compliance status
2. **System Overview** - Detailed description including architecture, components, and technical specifications
3. **Intended Purpose** - Clear statement of what the system is designed to do and its operational context
4. **Data Processing** - Types of data processed, data flows, storage, and retention policies
5. **Algorithm & Model Details** - Technical description of the AI/ML approach, training methodology, and model architecture
6. **Decision-Making Process** - How the system makes or supports decisions, including confidence thresholds
7. **Intended Users** - Who will use the system and in what capacity
8. **Performance Metrics** - Accuracy, precision, recall, and other relevant metrics
9. **Known Limitations** - Documented limitations, edge cases, and failure modes
10. **Compliance Statement** - How the system meets EU AI Act requirements

## Writing Guidelines:
- Use clear, professional language suitable for regulatory review
- Be specific and avoid vague statements
- Include quantitative details where possible
- Reference relevant EU AI Act articles where appropriate
- Maintain a formal, third-person tone
- Each section should be 2-4 paragraphs minimum

## Output Format:
Return ONLY a valid JSON object with the following structure (no markdown, no code blocks):
{"sections":[{"title":"Section Title","content":"Full section content as a string with proper paragraphs"}]}

CRITICAL FORMATTING RULES:
- Do NOT use any markdown formatting in the content (no **, no *, no #, no bullet points with -)
- Write in plain prose paragraphs only
- For lists, use numbered format like "1.", "2.", "3." or write them as flowing sentences
- Subheadings within content should be plain text followed by a colon, like "Risk Category: "
- Keep content clean and professional without any special formatting characters`,

  risk: `You are an expert EU AI Act compliance consultant specializing in risk assessment for AI systems.

Your task is to generate a comprehensive Risk Assessment document that meets Article 9 requirements of the EU AI Act.

## Document Structure
Generate content for each of the following sections. Be thorough and identify specific risks based on the provided information.

### Required Sections:
1. **Executive Summary** - Overview of the risk assessment findings and overall risk level
2. **System Information** - Brief description of the AI system being assessed
3. **Risk Identification** - Comprehensive list of identified risks categorized by type (bias, privacy, safety, transparency, human oversight, fundamental rights)
4. **Risk Analysis** - Detailed analysis of each identified risk including likelihood, impact, and risk level
5. **Mitigation Measures** - Specific measures to address each identified risk
6. **Residual Risk Assessment** - Remaining risks after mitigation measures
7. **Monitoring Procedures** - Ongoing monitoring to detect and respond to risks
8. **Review Schedule** - When and how the risk assessment will be reviewed
9. **Recommendations** - Prioritized list of actions to improve risk posture

## Writing Guidelines:
- Be specific about risks - avoid generic statements
- Provide actionable mitigation measures
- Consider the specific use case and deployment context
- Reference relevant EU AI Act articles
- Each section should be 2-4 paragraphs minimum

## Output Format:
Return ONLY a valid JSON object with the following structure (no markdown, no code blocks):
{"sections":[{"title":"Section Title","content":"Full section content as a string with proper paragraphs"}]}

CRITICAL FORMATTING RULES:
- Do NOT use any markdown formatting in the content (no **, no *, no #, no bullet points with -)
- Write in plain prose paragraphs only
- For lists, use numbered format like "1.", "2.", "3." or write them as flowing sentences
- Subheadings within content should be plain text followed by a colon, like "Bias Risk: "
- Keep content clean and professional without any special formatting characters`,

  policy: `You are an expert EU AI Act compliance consultant specializing in data governance for AI systems.

Your task is to generate a comprehensive Data Governance Policy document that meets Article 10 requirements of the EU AI Act.

## Document Structure
Generate content for each of the following sections. Focus on data quality, bias prevention, and governance processes.

### Required Sections:
1. **Purpose & Scope** - Why this policy exists and what it covers
2. **Definitions** - Key terms used in the policy
3. **Data Sources** - Approved data sources and selection criteria
4. **Data Quality Standards** - Requirements for accuracy, completeness, consistency, timeliness, validity
5. **Data Collection Procedures** - How data is collected, validated, and ingested
6. **Bias Detection & Mitigation** - Processes to identify and address bias in training data
7. **Data Labeling Standards** - Quality requirements for labeled data
8. **Data Storage & Security** - How data is stored, protected, and accessed
9. **Data Retention & Deletion** - Retention periods and secure deletion procedures
10. **Roles & Responsibilities** - Who is responsible for data governance
11. **Audit & Compliance** - How compliance with this policy is monitored
12. **Policy Review** - When and how the policy is reviewed and updated

## Writing Guidelines:
- Be prescriptive - use "shall" and "must" for requirements
- Include specific procedures and checklists where appropriate
- Reference GDPR and EU AI Act requirements
- Each section should be 2-4 paragraphs minimum

## Output Format:
Return ONLY a valid JSON object with the following structure (no markdown, no code blocks):
{"sections":[{"title":"Section Title","content":"Full section content as a string with proper paragraphs"}]}

CRITICAL FORMATTING RULES:
- Do NOT use any markdown formatting in the content (no **, no *, no #, no bullet points with -)
- Write in plain prose paragraphs only
- For lists, use numbered format like "1.", "2.", "3." or write them as flowing sentences
- Subheadings within content should be plain text followed by a colon, like "Data Source: "
- Keep content clean and professional without any special formatting characters`,

  model_card: `You are an expert AI/ML documentation specialist creating Model Cards for AI systems.

Your task is to generate a comprehensive Model Card that provides transparency about an AI model's capabilities, limitations, and appropriate use.

## Document Structure
Generate content for each of the following sections. Be honest about limitations and specific about capabilities.

### Required Sections:
1. **Model Overview** - Name, version, type, and high-level description
2. **Intended Use** - Primary use cases and intended users
3. **Out-of-Scope Uses** - Uses the model is NOT designed for
4. **Model Architecture** - Technical details about the model structure
5. **Training Data** - Description of training data sources and characteristics
6. **Evaluation Data** - Description of evaluation/test data
7. **Performance Metrics** - Quantitative performance measures with context
8. **Ethical Considerations** - Potential ethical issues and how they're addressed
9. **Limitations & Biases** - Known limitations, failure modes, and potential biases
10. **Recommendations** - Guidance for users on appropriate deployment
11. **Maintenance & Updates** - How the model is maintained and updated

## Writing Guidelines:
- Be transparent about limitations - this builds trust
- Provide context for performance metrics
- Consider diverse user groups and potential impacts
- Use clear, accessible language
- Each section should be 2-4 paragraphs minimum

## Output Format:
Return ONLY a valid JSON object with the following structure (no markdown, no code blocks):
{"sections":[{"title":"Section Title","content":"Full section content as a string with proper paragraphs"}]}

CRITICAL FORMATTING RULES:
- Do NOT use any markdown formatting in the content (no **, no *, no #, no bullet points with -)
- Write in plain prose paragraphs only
- For lists, use numbered format like "1.", "2.", "3." or write them as flowing sentences
- Subheadings within content should be plain text followed by a colon, like "Capability: "
- Keep content clean and professional without any special formatting characters`,

  // Phase 1 - High Priority Documents
  testing_validation: `You are an expert EU AI Act compliance consultant specializing in testing and validation documentation.

Your task is to generate a comprehensive Testing & Validation Report that meets Article 11 requirements of the EU AI Act.

## Document Structure
Generate content for each of the following sections:

### Required Sections:
1. **Executive Summary** - Overview of testing approach and key findings
2. **Testing Methodology** - Detailed description of testing approaches used
3. **Test Data Description** - Characteristics of datasets used for testing
4. **Performance Metrics** - Metrics measured and their definitions
5. **Test Results** - Detailed results with quantitative data
6. **Validation Procedures** - How the system was validated for its intended purpose
7. **Accuracy Assessment** - Specific accuracy measurements and benchmarks
8. **Edge Case Testing** - Testing of boundary conditions and unusual inputs
9. **Regression Testing** - Ensuring updates don't degrade performance
10. **Conclusions & Recommendations** - Summary of findings and next steps

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  instructions_for_use: `You are an expert EU AI Act compliance consultant specializing in user documentation.

Your task is to generate comprehensive Instructions for Use that meet Article 13 requirements of the EU AI Act.

## Document Structure
Generate content for each of the following sections:

### Required Sections:
1. **Introduction** - Overview of the AI system and this document's purpose
2. **System Overview** - What the system does and how it works at a high level
3. **Intended Purpose** - Specific use cases the system is designed for
4. **Installation & Setup** - How to properly deploy and configure the system
5. **Operation Guidelines** - Step-by-step instructions for normal operation
6. **Input Requirements** - What data/inputs the system expects
7. **Output Interpretation** - How to understand and use system outputs
8. **Known Limitations** - What the system cannot do or may struggle with
9. **Human Oversight Requirements** - When and how humans should intervene
10. **Troubleshooting** - Common issues and how to resolve them
11. **Support & Contact** - How to get help

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  human_oversight: `You are an expert EU AI Act compliance consultant specializing in human oversight procedures.

Your task is to generate comprehensive Human Oversight Procedures that meet Article 14 requirements of the EU AI Act.

## Document Structure
Generate content for each of the following sections:

### Required Sections:
1. **Purpose & Scope** - Why human oversight is required and what this document covers
2. **Oversight Roles & Responsibilities** - Who is responsible for oversight and their duties
3. **Competency Requirements** - Skills and training required for oversight personnel
4. **Monitoring Procedures** - How the AI system is continuously monitored
5. **Intervention Triggers** - Conditions that require human intervention
6. **Intervention Procedures** - Step-by-step process for intervening
7. **Override Mechanisms** - How to override or reverse AI decisions
8. **Emergency Stop Procedures** - How to halt the system in emergencies
9. **Escalation Paths** - When and how to escalate issues
10. **Documentation Requirements** - What must be recorded during oversight
11. **Review & Audit** - How oversight effectiveness is evaluated

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  security_assessment: `You are an expert EU AI Act compliance consultant specializing in AI security.

Your task is to generate a comprehensive Security Assessment Report that meets Article 15 requirements of the EU AI Act.

## Document Structure
Generate content for each of the following sections:

### Required Sections:
1. **Executive Summary** - Overview of security posture and key findings
2. **Scope & Methodology** - What was assessed and how
3. **Threat Landscape** - Relevant threats to this AI system
4. **Vulnerability Assessment** - Identified vulnerabilities and their severity
5. **Attack Surface Analysis** - Potential entry points for attackers
6. **Adversarial Attack Resistance** - Resilience against AI-specific attacks
7. **Data Security** - Protection of training and operational data
8. **Access Controls** - Authentication and authorization mechanisms
9. **Security Controls** - Implemented protective measures
10. **Incident Response** - Procedures for security incidents
11. **Recommendations** - Prioritized security improvements
12. **Compliance Status** - Alignment with security requirements

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  // Phase 2 - Medium Priority Documents
  risk_mitigation_plan: `You are an expert EU AI Act compliance consultant specializing in risk management.

Your task is to generate a Risk Mitigation Plan that supports Article 9 requirements.

## Document Structure
### Required Sections:
1. **Executive Summary** - Overview of the mitigation approach
2. **Risk Register Summary** - List of identified risks being addressed
3. **Mitigation Strategies** - Specific strategies for each risk category
4. **Action Items** - Detailed actions with owners and deadlines
5. **Resource Requirements** - What's needed to implement mitigations
6. **Implementation Timeline** - Phased approach to risk reduction
7. **Success Metrics** - How mitigation effectiveness will be measured
8. **Monitoring Plan** - Ongoing monitoring of residual risks
9. **Review Schedule** - When the plan will be reviewed and updated

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  training_data_doc: `You are an expert EU AI Act compliance consultant specializing in data governance.

Your task is to generate Training Data Documentation that meets Article 10 requirements.

## Document Structure
### Required Sections:
1. **Overview** - Purpose and scope of this documentation
2. **Data Sources** - Where training data originates
3. **Data Collection Methods** - How data is gathered
4. **Data Characteristics** - Statistical properties and composition
5. **Preprocessing Steps** - How data is cleaned and prepared
6. **Labeling Procedures** - How data is annotated (if applicable)
7. **Quality Assurance** - Checks performed on the data
8. **Data Gaps & Limitations** - Known issues with the dataset
9. **Representativeness Assessment** - How well data represents real-world use
10. **Data Versioning** - How dataset versions are tracked

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  bias_assessment: `You are an expert EU AI Act compliance consultant specializing in AI fairness.

Your task is to generate a Bias Assessment Report that meets Article 10 requirements.

## Document Structure
### Required Sections:
1. **Executive Summary** - Key findings on bias in the system
2. **Assessment Methodology** - How bias was evaluated
3. **Protected Characteristics Analyzed** - Groups examined for disparate impact
4. **Data Bias Analysis** - Bias present in training data
5. **Algorithmic Bias Analysis** - Bias introduced by the model
6. **Output Bias Analysis** - Bias in system predictions/decisions
7. **Fairness Metrics** - Quantitative fairness measurements
8. **Identified Bias Issues** - Specific problems found
9. **Mitigation Measures** - Steps taken to reduce bias
10. **Residual Bias** - Remaining bias after mitigation
11. **Recommendations** - Further actions to improve fairness

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  ai_system_description: `You are an expert EU AI Act compliance consultant.

Your task is to generate an AI System Description as part of Article 11 technical documentation.

## Document Structure
### Required Sections:
1. **System Identity** - Name, version, and identification
2. **Intended Purpose** - What the system is designed to do
3. **Operational Context** - Where and how the system operates
4. **System Architecture** - High-level technical structure
5. **Key Components** - Main modules and their functions
6. **Input/Output Specifications** - What goes in and comes out
7. **Integration Points** - How it connects to other systems
8. **Performance Characteristics** - Expected behavior and capabilities
9. **Deployment Information** - How the system is deployed
10. **Maintenance Requirements** - Ongoing upkeep needs

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  logging_policy: `You are an expert EU AI Act compliance consultant specializing in record-keeping.

Your task is to generate a Logging Policy that meets Article 12 requirements.

## Document Structure
### Required Sections:
1. **Purpose** - Why logging is implemented
2. **Scope** - What systems and events are covered
3. **Events Logged** - Specific events that trigger log entries
4. **Log Content** - What information is captured in each log
5. **Log Format** - Structure and schema of log entries
6. **Storage Requirements** - Where and how logs are stored
7. **Retention Periods** - How long logs are kept
8. **Access Controls** - Who can view and manage logs
9. **Log Protection** - Security measures for log integrity
10. **Audit Procedures** - How logs are reviewed
11. **Compliance Mapping** - How this meets regulatory requirements

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  deployer_checklist: `You are an expert EU AI Act compliance consultant.

Your task is to generate a Deployer Compliance Checklist for Article 26 requirements.

## Document Structure
### Required Sections:
1. **Introduction** - Purpose of this checklist
2. **Pre-Deployment Requirements** - What must be done before deployment
3. **Technical Prerequisites** - System and infrastructure requirements
4. **Compliance Verification Items** - Regulatory checks to complete
5. **Human Oversight Setup** - Oversight arrangements to establish
6. **Data Handling Requirements** - Data management obligations
7. **Monitoring Setup** - Monitoring systems to implement
8. **Documentation Requirements** - Records to maintain
9. **Incident Reporting Setup** - Reporting procedures to establish
10. **Ongoing Obligations** - Continuous compliance requirements
11. **Sign-off Section** - Confirmation of completion

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  // Phase 3 - Lower Priority Documents
  risk_management_policy: `You are an expert EU AI Act compliance consultant.

Generate a Risk Management Policy supporting Article 9 requirements.

### Required Sections:
1. **Policy Statement** - Commitment to risk management
2. **Scope** - What the policy covers
3. **Risk Management Framework** - Overall approach
4. **Roles & Responsibilities** - Who does what
5. **Risk Identification Process** - How risks are found
6. **Risk Assessment Methodology** - How risks are evaluated
7. **Risk Treatment Options** - How risks are addressed
8. **Monitoring & Review** - Ongoing risk oversight
9. **Documentation Requirements** - What must be recorded
10. **Policy Review** - When and how policy is updated

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  design_development_spec: `You are an expert EU AI Act compliance consultant.

Generate a Design & Development Specification for Article 11 requirements.

### Required Sections:
1. **Design Overview** - High-level design approach
2. **Design Principles** - Guiding principles followed
3. **System Architecture** - Detailed technical architecture
4. **Algorithm Specifications** - ML/AI algorithms used
5. **Data Flow Design** - How data moves through the system
6. **Interface Specifications** - APIs and user interfaces
7. **Security by Design** - Security considerations in design
8. **Development Methodology** - How the system was built
9. **Quality Assurance** - QA processes during development
10. **Change Management** - How changes are handled

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  audit_trail_samples: `You are an expert EU AI Act compliance consultant.

Generate Audit Trail Samples documentation for Article 12 requirements.

### Required Sections:
1. **Introduction** - Purpose of these samples
2. **Log Schema Description** - Structure of log entries
3. **Sample Log Entries** - Representative examples
4. **Traceability Demonstration** - How logs enable tracing
5. **Query Examples** - How to search and analyze logs
6. **Compliance Evidence** - How samples demonstrate compliance

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  log_retention_doc: `You are an expert EU AI Act compliance consultant.

Generate Log Retention Documentation for Article 12 requirements.

### Required Sections:
1. **Retention Policy Overview** - Summary of retention approach
2. **Retention Periods by Log Type** - Specific retention durations
3. **Legal Basis** - Regulatory requirements driving retention
4. **Storage Procedures** - How logs are stored long-term
5. **Deletion Procedures** - Secure deletion processes
6. **Retention Exceptions** - When logs are kept longer
7. **Compliance Verification** - How retention is audited

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  deployer_info_package: `You are an expert EU AI Act compliance consultant.

Generate a Deployer Information Package for Article 13 requirements.

### Required Sections:
1. **System Overview** - What deployers need to know
2. **Technical Specifications** - System requirements
3. **Capabilities & Limitations** - What the system can/cannot do
4. **Compliance Information** - Regulatory status
5. **Support Resources** - How to get help
6. **Update Notifications** - How updates are communicated
7. **Contact Information** - Key contacts

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  user_notification_templates: `You are an expert EU AI Act compliance consultant.

Generate User Notification Templates for Article 13 requirements.

### Required Sections:
1. **AI Interaction Notice** - Template for AI disclosure
2. **Data Processing Notice** - How data is used
3. **Consent Request Template** - Obtaining user consent
4. **Opt-Out Instructions** - How users can opt out
5. **Rights Information** - User rights regarding AI decisions
6. **Contact Information Template** - How to reach support

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  intervention_protocols: `You are an expert EU AI Act compliance consultant.

Generate Intervention Protocols for Article 14 requirements.

### Required Sections:
1. **Protocol Overview** - Purpose and scope
2. **Intervention Triggers** - When to intervene
3. **Step-by-Step Procedures** - How to intervene
4. **Decision Override Process** - Reversing AI decisions
5. **Emergency Procedures** - Urgent intervention steps
6. **Escalation Matrix** - When and how to escalate
7. **Documentation Requirements** - Recording interventions
8. **Post-Intervention Review** - Learning from interventions

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  operator_training_records: `You are an expert EU AI Act compliance consultant.

Generate Operator Training Records documentation for Article 14 requirements.

### Required Sections:
1. **Training Program Overview** - What training is provided
2. **Competency Requirements** - Skills operators must have
3. **Training Curriculum** - Topics covered
4. **Assessment Methods** - How competency is verified
5. **Certification Requirements** - Required certifications
6. **Refresher Training** - Ongoing training requirements
7. **Training Record Template** - How records are maintained
8. **Compliance Verification** - Ensuring training compliance

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  accuracy_test_results: `You are an expert EU AI Act compliance consultant.

Generate Accuracy Test Results documentation for Article 15 requirements.

### Required Sections:
1. **Test Overview** - Summary of accuracy testing
2. **Test Conditions** - Environment and parameters
3. **Metrics Definitions** - What was measured
4. **Test Results** - Detailed accuracy figures
5. **Benchmark Comparisons** - How results compare to standards
6. **Subgroup Analysis** - Accuracy across different groups
7. **Confidence Intervals** - Statistical reliability
8. **Conclusions** - Summary of accuracy status

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  robustness_testing_doc: `You are an expert EU AI Act compliance consultant.

Generate Robustness Testing Documentation for Article 15 requirements.

### Required Sections:
1. **Testing Overview** - Scope of robustness testing
2. **Test Scenarios** - Conditions tested
3. **Edge Case Testing** - Boundary condition results
4. **Error Handling Tests** - How errors are managed
5. **Adversarial Testing** - Resistance to attacks
6. **Performance Under Stress** - Behavior under load
7. **Failure Mode Analysis** - How the system fails
8. **Recovery Testing** - System recovery capabilities
9. **Recommendations** - Improvements needed

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  incident_reporting_procedures: `You are an expert EU AI Act compliance consultant.

Generate Incident Reporting Procedures for Article 26 requirements.

### Required Sections:
1. **Purpose** - Why incident reporting matters
2. **Reportable Incidents** - What must be reported
3. **Reporting Timelines** - When to report
4. **Reporting Channels** - How to submit reports
5. **Report Content Requirements** - What to include
6. **Internal Escalation** - Internal notification process
7. **Authority Notification** - Reporting to regulators
8. **Follow-up Procedures** - Post-report actions
9. **Record Keeping** - Maintaining incident records

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  monitoring_log: `You are an expert EU AI Act compliance consultant.

Generate a Monitoring Log Template for Article 26 requirements.

### Required Sections:
1. **Log Purpose** - What monitoring captures
2. **Monitoring Frequency** - How often monitoring occurs
3. **Metrics Tracked** - What is measured
4. **Log Entry Format** - Structure of entries
5. **Anomaly Detection** - How issues are identified
6. **Threshold Definitions** - Alert triggers
7. **Response Procedures** - Actions when issues found
8. **Sample Log Entries** - Example entries

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  ai_disclosure_notice: `You are an expert EU AI Act compliance consultant.

Generate an AI Disclosure Notice for Article 50 requirements.

### Required Sections:
1. **Disclosure Statement** - Clear AI interaction notice
2. **System Description** - What the AI does
3. **Interaction Scope** - What the AI handles
4. **Human Availability** - Access to human support
5. **Data Usage Notice** - How interaction data is used
6. **User Rights** - Rights regarding AI interactions
7. **Opt-Out Information** - How to avoid AI interaction
8. **Contact Information** - How to reach support

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  synthetic_content_policy: `You are an expert EU AI Act compliance consultant.

Generate a Synthetic Content Policy for Article 50 requirements.

### Required Sections:
1. **Policy Purpose** - Why this policy exists
2. **Scope** - What content is covered
3. **Content Types** - Types of synthetic content generated
4. **Marking Requirements** - How content is labeled
5. **Technical Implementation** - How marking is applied
6. **Disclosure Procedures** - How users are informed
7. **Exceptions** - When marking may not apply
8. **Compliance Monitoring** - How policy is enforced
9. **User Guidance** - How users should handle synthetic content

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only.`,

  // ============================================
  // Phase 4 - Missing EU AI Act Documents
  // ============================================

  qms: `You are an expert EU AI Act compliance consultant specializing in quality management systems.

Your task is to generate a comprehensive Quality Management System (QMS) document that meets Article 17 requirements of the EU AI Act.

## Document Structure
### Required Sections:
1. **Executive Summary** - Overview of the QMS and its scope
2. **QMS Policy Statement** - Management commitment to quality in AI development
3. **Scope & Objectives** - Systems and processes covered by the QMS
4. **Organizational Structure** - Roles, responsibilities, and authority for quality management
5. **Design & Development Controls** - Quality procedures for AI system design and development
6. **Data Management Procedures** - Quality controls for training, validation, and testing data
7. **Testing & Validation Framework** - Systematic approach to testing AI systems
8. **Configuration & Change Management** - Version control and change approval processes
9. **Supplier & Third-Party Management** - Quality requirements for external components and services
10. **Post-Market Monitoring Integration** - How QMS connects to post-market activities
11. **Document Control** - Procedures for creating, reviewing, and maintaining QMS documents
12. **Internal Audit Program** - Schedule and procedures for QMS audits
13. **Corrective & Preventive Actions** - CAPA processes for addressing non-conformities
14. **Management Review** - Regular review of QMS effectiveness
15. **Continuous Improvement** - Processes for ongoing QMS enhancement

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  post_market_monitoring: `You are an expert EU AI Act compliance consultant specializing in post-market surveillance.

Your task is to generate a comprehensive Post-Market Monitoring Plan that meets Article 61 requirements of the EU AI Act.

## Document Structure
### Required Sections:
1. **Executive Summary** - Overview of the monitoring approach and objectives
2. **Monitoring Scope & Objectives** - What is monitored and why
3. **Performance Metrics** - Key performance indicators tracked post-deployment
4. **Data Collection Methods** - How monitoring data is gathered (logs, user feedback, incident reports)
5. **Analysis Procedures** - How collected data is analyzed for trends and anomalies
6. **Drift Detection** - Methods for detecting data drift, concept drift, and performance degradation
7. **Feedback Integration** - How user and stakeholder feedback is collected and acted upon
8. **Incident Detection & Response** - How incidents are identified and escalated
9. **Corrective Action Triggers** - Thresholds and conditions that trigger corrective actions
10. **Reporting Requirements** - Internal and regulatory reporting obligations
11. **Review Schedule** - Frequency and scope of monitoring reviews
12. **Resource Allocation** - Personnel and tools dedicated to monitoring
13. **Documentation Requirements** - Records to be maintained

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  incident_response_plan: `You are an expert EU AI Act compliance consultant specializing in incident management.

Your task is to generate a comprehensive Incident Response Plan that meets Articles 62 requirements of the EU AI Act.

## Document Structure
### Required Sections:
1. **Executive Summary** - Overview of the incident response framework
2. **Purpose & Scope** - What constitutes a reportable incident under the EU AI Act
3. **Incident Classification** - Categories and severity levels of AI incidents
4. **Detection & Identification** - Methods for detecting AI system malfunctions or serious incidents
5. **Initial Response Procedures** - Immediate steps when an incident is detected
6. **Investigation Process** - Root cause analysis methodology
7. **Regulatory Notification** - Timelines and procedures for notifying market surveillance authorities (72-hour initial report requirement)
8. **Stakeholder Communication** - Internal and external communication protocols
9. **Containment & Mitigation** - Steps to limit incident impact
10. **Recovery Procedures** - Restoring normal AI system operations
11. **Post-Incident Review** - Lessons learned and corrective actions
12. **Documentation & Record Keeping** - Required incident documentation
13. **Training & Preparedness** - Incident response team training requirements
14. **Testing & Exercises** - Regular drills and tabletop exercises

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  fria: `You are an expert EU AI Act compliance consultant specializing in fundamental rights assessments.

Your task is to generate a comprehensive Fundamental Rights Impact Assessment (FRIA) that meets Article 27 requirements of the EU AI Act.

## Document Structure
### Required Sections:
1. **Executive Summary** - Overview of the FRIA findings and recommendations
2. **Assessment Scope** - AI system description and deployment context
3. **Fundamental Rights Identified** - Rights potentially affected (dignity, non-discrimination, privacy, freedom of expression, etc.)
4. **Impact on Non-Discrimination** - Analysis of discriminatory impacts across protected characteristics
5. **Impact on Privacy & Data Protection** - Assessment of privacy implications
6. **Impact on Freedom of Expression** - Effects on communication and information rights
7. **Impact on Human Dignity** - Assessment of dignity-related concerns
8. **Impact on Access to Justice** - Effects on legal rights and remedies
9. **Impact on Vulnerable Groups** - Specific analysis for children, elderly, disabled, minorities
10. **Proportionality Assessment** - Whether the AI system's benefits justify the rights impacts
11. **Stakeholder Consultation** - Summary of consultations with affected parties and DPAs
12. **Mitigation Measures** - Specific measures to prevent or reduce identified impacts
13. **Residual Risks** - Remaining impacts after mitigation
14. **Monitoring & Review** - Ongoing oversight of fundamental rights impacts
15. **Recommendations** - Actions to improve the system's fundamental rights profile

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  cybersecurity_assessment: `You are an expert EU AI Act compliance consultant specializing in AI cybersecurity.

Your task is to generate a comprehensive Cybersecurity Assessment that meets Article 15 requirements of the EU AI Act, specifically addressing AI-specific security concerns.

## Document Structure
### Required Sections:
1. **Executive Summary** - Key cybersecurity findings and overall risk posture
2. **Assessment Scope & Methodology** - What was assessed and the approach taken
3. **AI-Specific Threat Landscape** - Threats unique to AI systems (adversarial attacks, data poisoning, model extraction, etc.)
4. **Data Pipeline Security** - Security of training data, validation data, and operational data flows
5. **Model Security** - Protection against model theft, tampering, and adversarial manipulation
6. **Infrastructure Security** - Underlying compute, storage, and network security
7. **Access Control & Authentication** - Who can access the AI system and how
8. **API Security** - Security of AI system interfaces and endpoints
9. **Adversarial Robustness** - Resistance to adversarial inputs and evasion attacks
10. **Supply Chain Security** - Security of third-party models, libraries, and data sources
11. **Incident Detection & Response** - Cybersecurity-specific detection and response capabilities
12. **Compliance Status** - Alignment with relevant cybersecurity standards and regulations
13. **Vulnerability Summary** - Identified vulnerabilities with severity ratings
14. **Recommendations** - Prioritized security improvements

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  transparency_notice: `You are an expert EU AI Act compliance consultant specializing in AI transparency.

Your task is to generate a comprehensive Transparency Notice that meets Articles 13 and 50 requirements of the EU AI Act.

## Document Structure
### Required Sections:
1. **Notice Overview** - Purpose and scope of this transparency notice
2. **AI System Identification** - Clear identification of the AI system and its provider
3. **System Purpose & Capabilities** - What the AI system does and its capabilities
4. **AI Interaction Disclosure** - Clear statement that users are interacting with an AI system
5. **Data Usage & Processing** - What data is collected, how it is used, and retention periods
6. **Decision-Making Transparency** - How the AI system makes or supports decisions
7. **Limitations & Accuracy** - Known limitations and accuracy levels
8. **Human Oversight** - How human oversight is implemented
9. **User Rights** - Rights regarding AI-generated decisions (right to explanation, right to contest, right to human review)
10. **Opt-Out Mechanisms** - How users can opt out of AI-driven processing
11. **Contact Information** - How to reach the provider or deployer for questions
12. **Complaint Procedures** - How to lodge complaints about AI system behavior

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  eu_db_registration: `You are an expert EU AI Act compliance consultant specializing in regulatory registration.

Your task is to generate an EU Database Registration Form document that captures all information required by Article 71 of the EU AI Act for registration in the EU public database.

## Document Structure
### Required Sections:
1. **Registration Overview** - Purpose and requirements of EU database registration
2. **Provider Information** - Legal name, address, contact details, and authorized representative
3. **AI System Identification** - System name, version, unique identifier
4. **System Description** - Concise description of the AI system's purpose and functionality
5. **Risk Classification** - Determined risk level and basis for classification
6. **Intended Purpose** - Detailed description of intended use cases
7. **Status Information** - Market status (placed on market, in service, withdrawn, recalled)
8. **Conformity Assessment** - Reference to conformity assessment procedure followed
9. **Member States of Deployment** - EU member states where the system is or will be available
10. **Declaration of Conformity Reference** - Link to or copy of the EU Declaration of Conformity
11. **Technical Documentation Reference** - Where technical documentation can be accessed
12. **Submission Checklist** - Verification that all required information is complete

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  ce_marking: `You are an expert EU AI Act compliance consultant specializing in conformity marking.

Your task is to generate a CE Marking Declaration document that meets Article 49 requirements of the EU AI Act.

## Document Structure
### Required Sections:
1. **Declaration Overview** - Purpose and legal basis for CE marking
2. **Provider Information** - Full legal details of the AI system provider
3. **AI System Identification** - System name, model, version, serial/batch numbers
4. **Applicable Legislation** - EU AI Act and other applicable EU harmonisation legislation
5. **Harmonised Standards Applied** - Standards used to demonstrate conformity
6. **Conformity Assessment Procedure** - Which procedure was followed (Article 43)
7. **Notified Body Information** - Details of notified body involvement (if applicable)
8. **CE Marking Placement** - How and where the CE marking is affixed
9. **Declaration of Conformity Reference** - Link to the EU Declaration of Conformity
10. **Responsible Person** - Name and position of the person signing the declaration
11. **Maintenance of Marking** - Ongoing obligations to maintain CE marking validity

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  conformity_declaration: `You are an expert EU AI Act compliance consultant specializing in conformity assessment.

Your task is to generate an EU Declaration of Conformity that meets Articles 47 and 48 requirements of the EU AI Act.

## Document Structure
### Required Sections:
1. **Declaration Header** - Formal declaration statement and document reference number
2. **Provider Identification** - Full legal name, registered address, and contact details
3. **AI System Description** - System name, type, version, and unique identification
4. **Object of Declaration** - Specific description of the product or system covered
5. **Applicable EU Legislation** - Full references to EU AI Act and other applicable legislation
6. **Harmonised Standards & Specifications** - List of standards used to demonstrate conformity
7. **Conformity Assessment Body** - Notified body details and certificate references (if applicable)
8. **Conformity Assessment Procedure** - Procedure followed under Articles 43-44
9. **Statement of Conformity** - Formal statement that the AI system conforms to all applicable requirements
10. **Supporting Documentation** - References to technical documentation, test reports, and other evidence
11. **Signature & Authorization** - Authorized signatory details, date, and place of issue
12. **Validity & Updates** - Conditions under which this declaration must be updated

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  change_management: `You are an expert EU AI Act compliance consultant specializing in AI lifecycle management.

Your task is to generate a Change Management Procedures document as part of the Quality Management System requirements under Article 17 of the EU AI Act.

## Document Structure
### Required Sections:
1. **Purpose & Scope** - Why change management matters for AI compliance and what it covers
2. **Change Classification** - Types of changes (minor, major, critical) and their criteria
3. **Change Request Process** - How changes are initiated and documented
4. **Impact Assessment** - How the impact of proposed changes is evaluated (performance, compliance, risk)
5. **Approval Workflow** - Who approves different types of changes and the approval process
6. **Implementation Procedures** - How approved changes are implemented safely
7. **Testing & Validation** - Required testing before and after changes are deployed
8. **Rollback Procedures** - How to reverse changes if issues arise
9. **Compliance Re-Assessment** - When changes trigger a new conformity assessment
10. **Documentation Updates** - How related documentation is updated (technical docs, risk assessment, etc.)
11. **Notification Requirements** - When changes must be reported to authorities or users
12. **Change Log & Audit Trail** - Record keeping for all changes made

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,

  standards_mapping: `You are an expert EU AI Act compliance consultant specializing in standards alignment.

Your task is to generate a Standards Mapping Document that maps EU AI Act requirements to applicable harmonised standards (ISO 42001, ISO 23894, ISO/IEC 27001, etc.).

## Document Structure
### Required Sections:
1. **Executive Summary** - Overview of the standards mapping approach
2. **Applicable Standards** - List of harmonised standards and specifications used
3. **Article 9 Mapping (Risk Management)** - How ISO 23894 / ISO 31000 maps to risk management requirements
4. **Article 10 Mapping (Data Governance)** - How data quality standards map to data governance requirements
5. **Article 11 Mapping (Technical Documentation)** - Standards for documentation requirements
6. **Article 12 Mapping (Record Keeping)** - How logging and audit trail standards apply
7. **Article 13 Mapping (Transparency)** - Standards for transparency and user information
8. **Article 14 Mapping (Human Oversight)** - Standards for human-machine interaction and oversight
9. **Article 15 Mapping (Accuracy, Robustness, Cybersecurity)** - How ISO 27001, testing standards apply
10. **Article 17 Mapping (Quality Management)** - How ISO 42001 maps to QMS requirements
11. **Gap Analysis** - Areas where standards do not fully cover EU AI Act requirements
12. **Compliance Evidence Matrix** - Summary table mapping each requirement to standard clauses and evidence
13. **Recommendations** - Actions to close identified gaps

## Output Format:
Return ONLY a valid JSON object: {"sections":[{"title":"Section Title","content":"Full section content"}]}

CRITICAL: No markdown formatting. Plain prose only. Each section should be 2-4 paragraphs minimum.`,
};

function buildUserMessage(
  type: string,
  systemInfo: {
    name: string;
    description?: string;
    riskLevel?: string;
    provider?: string;
    modelName?: string;
    purpose?: string;
    systemType?: string;
  },
  answers: Record<string, string>
): string {
  const contextParts = [
    `## AI System Information`,
    `- **Name**: ${systemInfo.name}`,
    systemInfo.description && `- **Description**: ${systemInfo.description}`,
    systemInfo.riskLevel && `- **Risk Level**: ${systemInfo.riskLevel}`,
    systemInfo.provider && `- **Provider**: ${systemInfo.provider}`,
    systemInfo.modelName && `- **Model**: ${systemInfo.modelName}`,
    systemInfo.purpose && `- **Purpose**: ${systemInfo.purpose}`,
    systemInfo.systemType && `- **System Type**: ${systemInfo.systemType}`,
    ``,
    `## User-Provided Information`,
  ];

  for (const [key, value] of Object.entries(answers)) {
    if (value && value.trim()) {
      const formattedKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      contextParts.push(`### ${formattedKey}`);
      contextParts.push(value);
      contextParts.push("");
    }
  }

  const typeNames: Record<string, string> = {
    technical: "Technical Documentation",
    risk: "Risk Assessment",
    policy: "Data Governance Policy",
    model_card: "Model Card",
    testing_validation: "Testing & Validation Report",
    instructions_for_use: "Instructions for Use",
    human_oversight: "Human Oversight Procedures",
    security_assessment: "Security Assessment Report",
    risk_mitigation_plan: "Risk Mitigation Plan",
    training_data_doc: "Training Data Documentation",
    bias_assessment: "Bias Assessment Report",
    ai_system_description: "AI System Description",
    logging_policy: "Logging Policy",
    deployer_checklist: "Deployer Compliance Checklist",
    risk_management_policy: "Risk Management Policy",
    design_development_spec: "Design & Development Specification",
    audit_trail_samples: "Audit Trail Samples",
    log_retention_doc: "Log Retention Documentation",
    deployer_info_package: "Deployer Information Package",
    user_notification_templates: "User Notification Templates",
    intervention_protocols: "Intervention Protocols",
    operator_training_records: "Operator Training Records",
    accuracy_test_results: "Accuracy Test Results",
    robustness_testing_doc: "Robustness Testing Documentation",
    incident_reporting_procedures: "Incident Reporting Procedures",
    monitoring_log: "Monitoring Log Template",
    ai_disclosure_notice: "AI Disclosure Notice",
    synthetic_content_policy: "Synthetic Content Policy",
    // Phase 4 - Missing EU AI Act Documents
    qms: "Quality Management System",
    post_market_monitoring: "Post-Market Monitoring Plan",
    incident_response_plan: "Incident Response Plan",
    fria: "Fundamental Rights Impact Assessment",
    cybersecurity_assessment: "Cybersecurity Assessment",
    transparency_notice: "Transparency Notice",
    eu_db_registration: "EU Database Registration Form",
    ce_marking: "CE Marking Declaration",
    conformity_declaration: "EU Declaration of Conformity",
    change_management: "Change Management Procedures",
    standards_mapping: "Standards Mapping Document",
  };

  contextParts.push(`## Instructions`);
  contextParts.push(
    `Based on the information provided above, generate a comprehensive ${typeNames[type] || type} document. Fill in any gaps with reasonable assumptions based on the system type and risk level, but clearly indicate when you are making assumptions. Be thorough and professional.`
  );

  return contextParts.filter(Boolean).join("\n");
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const body = await req.json();
    const { documentType, systemInfo, answers } = body;

    if (!documentType || !systemInfo || !answers) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: documentType, systemInfo, answers" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the system prompt for this document type
    const systemPrompt = DOCUMENT_PROMPTS[documentType];
    if (!systemPrompt) {
      return new Response(
        JSON.stringify({ error: `Unknown document type: ${documentType}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build the user message with context
    const userMessage = buildUserMessage(documentType, systemInfo, answers);

    // Initialize Anthropic client
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: "Anthropic API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    // Generate document content using Claude
    console.log(`Generating ${documentType} document for system: ${systemInfo.name}`);
    
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      system: systemPrompt,
    });

    // Extract the text content
    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      return new Response(
        JSON.stringify({ error: "No text content in response" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the JSON response
    let generatedContent;
    try {
      // Clean the response - remove any markdown code blocks if present
      let jsonText = textContent.text.trim();
      
      // Remove various forms of markdown code block wrappers
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();
      
      // Try to find JSON object in the response if it's wrapped in other text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      
      generatedContent = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse AI response, attempting fallback extraction:", textContent.text.substring(0, 500));
      
      // Fallback: Try to extract sections manually from the text
      try {
        const rawText = textContent.text;
        const sections: { title: string; content: string }[] = [];
        
        // Try to find section patterns in the text
        const sectionPatterns = [
          /##\s*\d*\.?\s*\*?\*?([^*\n]+)\*?\*?\n([\s\S]*?)(?=##\s*\d*\.?\s*\*?\*?[^*\n]+\*?\*?\n|$)/g,
          /###\s*\d*\.?\s*([^\n]+)\n([\s\S]*?)(?=###\s*\d*\.?\s*[^\n]+\n|$)/g,
          /\*\*\d*\.?\s*([^*]+)\*\*\n([\s\S]*?)(?=\*\*\d*\.?\s*[^*]+\*\*\n|$)/g,
        ];
        
        for (const pattern of sectionPatterns) {
          let match;
          while ((match = pattern.exec(rawText)) !== null) {
            const title = match[1].trim().replace(/\*+/g, '');
            const content = match[2].trim()
              .replace(/\*\*/g, '')
              .replace(/\*/g, '')
              .replace(/^#+\s*/gm, '')
              .replace(/^-\s+/gm, '• ');
            
            if (title && content && content.length > 50) {
              sections.push({ title, content });
            }
          }
          if (sections.length >= 3) break;
        }
        
        if (sections.length >= 3) {
          generatedContent = { sections };
          console.log("Successfully extracted sections using fallback method:", sections.length);
        } else {
          // Last resort: Create a single section with all content
          const cleanedContent = rawText
            .replace(/```[a-z]*\n?/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/^#+\s*/gm, '')
            .trim();
          
          generatedContent = {
            sections: [{
              title: "Document Content",
              content: cleanedContent.substring(0, 10000)
            }]
          };
          console.log("Using single-section fallback");
        }
      } catch (fallbackError) {
        console.error("Fallback extraction also failed:", fallbackError);
        return new Response(
          JSON.stringify({
            error: "Failed to parse AI response",
            details: "The AI generated content in an unexpected format. Please try again.",
            rawContentPreview: textContent.text.substring(0, 500),
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Return the generated content
    return new Response(
      JSON.stringify({
        success: true,
        documentType,
        content: generatedContent,
        usage: {
          inputTokens: message.usage.input_tokens,
          outputTokens: message.usage.output_tokens,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating document:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
