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
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.slice(7);
      }
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();
      
      generatedContent = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", textContent.text);
      return new Response(
        JSON.stringify({
          error: "Failed to parse AI response",
          rawContent: textContent.text,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
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
