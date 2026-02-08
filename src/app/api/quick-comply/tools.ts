/**
 * Quick Comply - Tool Definitions
 *
 * Defines all AI tools available for the Quick Comply chat.
 * Tools are split into two categories:
 *
 * 1. UI Tools (no execute) - Render components on the client:
 *    showSelection, showTextInput, showMultiSelect, showDocumentPreview, navigateTo
 *
 * 2. Server Tools (with execute) - Execute logic on the server:
 *    captureResponse, updateProgress, createAISystem, generateDocuments, checkSubscription
 */

import { tool } from "ai";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { QuickComplySystemData } from "@/lib/quick-comply/types";
import { getNextSection, getDocumentTitle, SECTION_WEIGHTS } from "@/lib/quick-comply/constants";
import type { SectionId } from "@/lib/quick-comply/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = any;

const SECTION_ENUM = z.enum([
  "company_info",
  "ai_system_details",
  "risk_and_data",
  "human_oversight",
  "testing_metrics",
  "transparency",
  "review_generate",
]);

// ============================================================================
// Build all tools
// ============================================================================

export function buildTools(
  supabase: SupabaseClient,
  systemData: QuickComplySystemData
) {
  // Cast to bypass generated types that don't include new tables
  const sb = supabase as AnySupabaseClient;
  return {
    // ========================================================================
    // UI TOOL: Show Selection Options
    // Renders a selection card UI in the chat. No execute — handled on client.
    // ========================================================================
    showSelection: tool({
      description: `Display a selection of options for the user to choose from. 
        Use this when asking questions with predefined answers like purpose, 
        industry, deployment status, etc. The UI will render clickable cards.
        The user will click an option and the selection will be submitted 
        back as a chat message.`,
      inputSchema: z.object({
        question: z.string().describe("The question to display above the options"),
        options: z
          .array(
            z.object({
              value: z.string().describe("Internal value to store"),
              label: z.string().describe("Display label for the option"),
              description: z.string().optional().describe("Additional description"),
              icon: z.string().optional().describe("Only use for country flags (e.g. 🇺🇸 🇬🇧 🇩🇪). Leave empty for all other option types."),
            })
          )
          .describe("Array of options to display"),
        fieldKey: z
          .string()
          .describe('Field name to store the response, e.g., "primary_purpose"'),
        section: SECTION_ENUM.describe("Which section this field belongs to"),
        allowOther: z
          .boolean()
          .optional()
          .default(false)
          .describe("Show an 'Other' option with text input"),
      }),
      // No execute — UI-only tool, output comes from client via addToolOutput
    }),

    // ========================================================================
    // UI TOOL: Show Text Input
    // Renders a text input field in the chat. No execute — handled on client.
    // ========================================================================
    showTextInput: tool({
      description: `Display a text input field for the user to type a response.
        Use this for free-form answers like descriptions, names, or detailed 
        explanations. The user will type and submit their answer.`,
      inputSchema: z.object({
        question: z.string().describe("The question/prompt to display"),
        fieldKey: z.string().describe("Field name to store the response"),
        section: SECTION_ENUM.describe("Which section this field belongs to"),
        placeholder: z.string().optional().describe("Placeholder text for the input"),
        multiline: z
          .boolean()
          .optional()
          .default(false)
          .describe("Use textarea for longer responses"),
        inputType: z
          .enum(["text", "email", "url"])
          .optional()
          .default("text")
          .describe("Input type for validation"),
        validation: z
          .object({
            required: z.boolean().optional(),
            minLength: z.number().optional(),
            maxLength: z.number().optional(),
          })
          .optional()
          .describe("Validation rules"),
      }),
      // No execute — UI-only tool
    }),

    // ========================================================================
    // UI TOOL: Show Multi-Select
    // Renders checkboxes for multiple selections. No execute — handled on client.
    // ========================================================================
    showMultiSelect: tool({
      description: `Display multiple checkbox options for the user to select 
        several items. Use this for questions like "What types of data does 
        your system process?" where multiple answers are valid.`,
      inputSchema: z.object({
        question: z.string().describe("The question to display"),
        options: z.array(
          z.object({
            value: z.string(),
            label: z.string(),
            description: z.string().optional(),
            warning: z
              .boolean()
              .optional()
              .describe("Show warning indicator for sensitive options"),
          })
        ),
        fieldKey: z.string(),
        section: SECTION_ENUM,
        minSelections: z.number().optional().describe("Minimum required selections"),
        maxSelections: z.number().optional().describe("Maximum allowed selections"),
      }),
      // No execute — UI-only tool
    }),

    // ========================================================================
    // UI TOOL: Show Document Preview
    // Renders a preview of a generated document section. No execute.
    // ========================================================================
    showDocumentPreview: tool({
      description: `Show a preview of a compliance document based on the data 
        collected so far. Use this to show users what their documents will look 
        like. Display when you have enough context to generate a meaningful preview.`,
      inputSchema: z.object({
        documentType: z.string().describe("Type of the document"),
        documentTitle: z.string().describe("Title of the document"),
        sections: z
          .array(
            z.object({
              title: z.string(),
              content: z.string(),
            })
          )
          .describe("Document sections to preview"),
      }),
      // No execute — renders on client
    }),

    // ========================================================================
    // UI TOOL: Navigate To
    // Shows the completion card with confetti, document summary, and next steps.
    // ========================================================================
    showCompletion: tool({
      description: `Show the completion celebration card when the Quick Comply 
        process is fully finished. This shows a confetti animation, the list of 
        generated documents, compliance score, and next steps. Only call this 
        AFTER all documents have been generated and the assessment is complete.`,
      inputSchema: z.object({
        aiSystemName: z.string().describe("Name of the assessed AI system"),
        riskLevel: z.enum(["minimal", "limited", "high", "prohibited"]).describe("Determined risk level"),
        complianceScore: z.number().min(0).max(100).describe("Overall compliance score percentage"),
        documents: z.array(
          z.object({
            id: z.string(),
            type: z.string(),
            title: z.string(),
            status: z.enum(["ready", "generating", "error"]),
          })
        ).describe("List of generated compliance documents"),
      }),
      execute: async ({ aiSystemName, riskLevel, complianceScore, documents }) => {
        try {
          const sessionId = systemData.sessionId;
          if (sessionId) {
            await sb.from("quick_comply_sessions").update({
              status: "completed",
              progress: 100,
              updated_at: new Date().toISOString(),
            }).eq("id", sessionId);
          }

          // Create certification record
          const { data: certNumber } = await sb.rpc("generate_certificate_number");
          
          if (certNumber && systemData.organizationId) {
            await sb.from("compliance_certifications").insert({
              organization_id: systemData.organizationId,
              certificate_number: certNumber,
              certification_type: "quick_comply",
              risk_level: riskLevel,
              compliance_score: complianceScore,
              ai_system_name: aiSystemName,
              documents_generated: documents.map((d: { type: string }) => d.type),
              status: "active",
            });
          }

          return {
            completed: true,
            aiSystemName,
            riskLevel,
            complianceScore,
            documents,
            certificateNumber: certNumber || null,
          };
        } catch (error) {
          console.error("showCompletion error:", error);
          return {
            completed: true,
            aiSystemName,
            riskLevel,
            complianceScore,
            documents,
            certificateNumber: null,
          };
        }
      },
    }),

    // ========================================================================
    // Navigates to a different page or section. No execute — handled on client.
    // ========================================================================
    navigateTo: tool({
      description: `Navigate to a different page or section. Use when the user 
        wants to go to the dashboard, view documents, etc.`,
      inputSchema: z.object({
        destination: z.enum([
          "dashboard",
          "ai_systems",
          "documents",
          "requirements",
          "section",
        ]),
        sectionId: z
          .string()
          .optional()
          .describe('If destination is "section", which section to jump to'),
      }),
      // No execute — handled on client
    }),

    // ========================================================================
    // SERVER TOOL: Capture Response
    // Saves a user response to the session's form data.
    // ========================================================================
    captureResponse: tool({
      description: `Save a user's response to the compliance form. Call this 
        after the user provides an answer to store it in the database. You MUST 
        call this for EVERY answer the user gives.`,
      inputSchema: z.object({
        fieldKey: z.string().describe("The field name being saved"),
        value: z.union([
          z.string(),
          z.number(),
          z.boolean(),
          z.array(z.string()),
        ]).describe("The value to save"),
        section: SECTION_ENUM.describe("Which section to update"),
      }),
      execute: async ({ fieldKey, value, section }) => {
        try {
          const sessionId = systemData.sessionId;
          if (!sessionId) {
            return { saved: false, error: "No session found" };
          }

          // Get current form data
          const { data: session, error: fetchError } = await sb
            .from("quick_comply_sessions")
            .select("form_data")
            .eq("id", sessionId)
            .single();

          if (fetchError) throw fetchError;

          // Merge in the new value
          const currentFormData = (session?.form_data as Record<string, Record<string, unknown>>) || {};
          const sectionData = currentFormData[section] || {};
          const updatedFormData = {
            ...currentFormData,
            [section]: {
              ...sectionData,
              [fieldKey]: value,
            },
          };

          // Save back to DB
          const { error: updateError } = await sb
            .from("quick_comply_sessions")
            .update({
              form_data: updatedFormData,
              last_activity_at: new Date().toISOString(),
            })
            .eq("id", sessionId);

          if (updateError) throw updateError;

          return {
            saved: true,
            fieldKey,
            section,
          };
        } catch (error) {
          console.error("Error saving response:", error);
          return { saved: false, error: "Failed to save response" };
        }
      },
    }),

    // ========================================================================
    // SERVER TOOL: Update Progress
    // Updates progress tracking for a section.
    // ========================================================================
    updateProgress: tool({
      description: `Update the progress for a compliance section. Call this when 
        a section is completed or when significant progress is made within a 
        section. ALWAYS call this when completing a section.`,
      inputSchema: z.object({
        section: SECTION_ENUM,
        status: z.enum(["not_started", "in_progress", "completed"]),
        percentComplete: z
          .number()
          .min(0)
          .max(100)
          .describe("Section completion percentage"),
      }),
      execute: async ({ section, status, percentComplete }) => {
        try {
          const sessionId = systemData.sessionId;
          if (!sessionId) {
            return { updated: false, error: "No session found" };
          }

          // Get current session
          const { data: session, error: fetchError } = await sb
            .from("quick_comply_sessions")
            .select("sections_completed, progress_percentage")
            .eq("id", sessionId)
            .single();

          if (fetchError) throw fetchError;

          const currentCompleted = (session?.sections_completed as string[]) || [];
          const newCompleted =
            status === "completed" && !currentCompleted.includes(section)
              ? [...currentCompleted, section]
              : currentCompleted;

          // Calculate overall progress
          let overallProgress = 0;
          for (const [sec, weight] of Object.entries(SECTION_WEIGHTS)) {
            if (newCompleted.includes(sec)) {
              overallProgress += weight;
            } else if (sec === section) {
              overallProgress += (weight * percentComplete) / 100;
            }
          }

          const nextSection =
            status === "completed"
              ? getNextSection(section as SectionId)
              : section;

          // Update session in database
          const { error: updateError } = await sb
            .from("quick_comply_sessions")
            .update({
              current_section: nextSection,
              sections_completed: newCompleted,
              progress_percentage: Math.round(overallProgress),
              last_activity_at: new Date().toISOString(),
            })
            .eq("id", sessionId);

          if (updateError) throw updateError;

          // Sync progress to ai_systems table so dashboard/landing page stays current
          const aiSysId = systemData.aiSystemId;
          if (aiSysId) {
            const roundedProgress = Math.round(overallProgress);
            await sb
              .from("ai_systems")
              .update({
                compliance_progress: roundedProgress,
                compliance_status:
                  roundedProgress >= 100
                    ? "completed"
                    : roundedProgress > 0
                      ? "in_progress"
                      : "not_started",
                updated_at: new Date().toISOString(),
              })
              .eq("id", aiSysId);
          }

          return {
            updated: true,
            progress: {
              overall: Math.round(overallProgress),
              currentSection: nextSection,
              sectionsCompleted: newCompleted,
            },
          };
        } catch (error) {
          console.error("Error updating progress:", error);
          return { updated: false, error: "Failed to update progress" };
        }
      },
    }),

    // ========================================================================
    // SERVER TOOL: Create AI System
    // Creates a new AI system record in the database.
    // ========================================================================
    createAISystem: tool({
      description: `Create a new AI system record in the database. Call this when 
        the user provides the AI system name. This should only be called ONCE 
        per session when setting up a new AI system.`,
      inputSchema: z.object({
        name: z.string().describe("Name of the AI system"),
        description: z.string().optional().describe("Brief description of the system"),
        riskLevel: z
          .enum(["prohibited", "high", "limited", "minimal"])
          .optional()
          .describe("Initial risk level if known"),
      }),
      execute: async ({ name, description, riskLevel }) => {
        try {
          // Create the AI system record
          const { data: aiSystem, error: createError } = await sb
            .from("ai_systems")
            .insert({
              organization_id: systemData.organizationId,
              name,
              description: description || null,
              risk_level: riskLevel || "minimal",
              compliance_status: "not_started",
              compliance_progress: 0,
            })
            .select("id, name")
            .single();

          if (createError) throw createError;

          // Link the session to this AI system
          const { error: linkError } = await sb
            .from("quick_comply_sessions")
            .update({
              ai_system_id: aiSystem.id,
              last_activity_at: new Date().toISOString(),
            })
            .eq("id", systemData.sessionId);

          if (linkError) {
            console.error("Error linking session to AI system:", linkError);
          }

          return {
            created: true,
            aiSystemId: aiSystem.id,
            aiSystemName: aiSystem.name,
          };
        } catch (error) {
          console.error("Error creating AI system:", error);
          return { created: false, error: "Failed to create AI system" };
        }
      },
    }),

    // ========================================================================
    // SERVER TOOL: Generate Documents
    // Triggers generation of all compliance documents.
    // ========================================================================
    generateDocuments: tool({
      description: `Generate compliance documents based on the collected data. 
        Call this when all sections are complete and the user confirms they want 
        to generate their documents. Check subscription tier before calling.`,
      inputSchema: z.object({
        documentTypes: z
          .array(z.string())
          .describe("Which document types to generate"),
        aiSystemId: z.string().describe("The AI system ID to generate documents for"),
      }),
      execute: async ({ documentTypes, aiSystemId }) => {
        try {
          // Get the complete form data from session
          const { data: session, error: fetchError } = await sb
            .from("quick_comply_sessions")
            .select("form_data, risk_classification")
            .eq("id", systemData.sessionId)
            .single();

          if (fetchError) throw fetchError;

          const generatedDocs: Array<{
            id: string;
            type: string;
            title: string;
            status: string;
          }> = [];

          for (const docType of documentTypes) {
            // Insert document record
            const { data: doc, error: docError } = await sb
              .from("documents")
              .insert({
                ai_system_id: aiSystemId,
                organization_id: systemData.organizationId,
                type: docType,
                title: getDocumentTitle(docType),
                status: "generating",
              })
              .select("id, type, title")
              .single();

            if (docError) {
              console.error(`Error creating document ${docType}:`, docError);
              continue;
            }

            // Queue document generation via Edge Function
            try {
              await sb.functions.invoke("generate-document", {
                body: {
                  documentId: doc.id,
                  documentType: docType,
                  formData: session?.form_data,
                  aiSystemId,
                  organizationId: systemData.organizationId,
                },
              });
            } catch (genError) {
              console.error(`Error invoking generate-document for ${docType}:`, genError);
            }

            generatedDocs.push({
              id: doc.id,
              type: doc.type,
              title: doc.title,
              status: "generating",
            });
          }

          // Update session with generated docs
          await sb
            .from("quick_comply_sessions")
            .update({
              documents_generated: generatedDocs,
              status: "completed",
              completed_at: new Date().toISOString(),
              last_activity_at: new Date().toISOString(),
            })
            .eq("id", systemData.sessionId);

          // Update AI system compliance status
          await sb
            .from("ai_systems")
            .update({
              compliance_status: "in_progress",
              compliance_progress: 90, // Documents generating
            })
            .eq("id", aiSystemId);

          return {
            generated: true,
            documents: generatedDocs,
            message: `Started generating ${generatedDocs.length} documents. They will be ready in a few minutes.`,
          };
        } catch (error) {
          console.error("Error generating documents:", error);
          return { generated: false, error: "Failed to generate documents" };
        }
      },
    }),

    // ========================================================================
    // SERVER TOOL: Check Subscription
    // Returns the user's subscription tier and available features.
    // ========================================================================
    checkSubscription: tool({
      description: `Check the user's subscription tier and available features. 
        Use this before offering features that may be tier-limited, like 
        generating certain document types.`,
      inputSchema: z.object({
        feature: z
          .string()
          .optional()
          .describe("Specific feature to check access for"),
      }),
      execute: async () => {
        try {
          const { data: org, error } = await sb
            .from("organizations")
            .select("plan, subscription_tier")
            .eq("id", systemData.organizationId)
            .single();

          if (error) throw error;

          const tier = (org?.subscription_tier as string) || org?.plan || "free";

          return {
            tier,
            canGenerateDocuments: tier !== "free",
            availableDocumentTypes:
              tier === "enterprise"
                ? "all"
                : tier === "professional" || tier === "business"
                ? "provider_full"
                : tier === "starter"
                ? "core_7"
                : "risk_assessment_only",
          };
        } catch (error) {
          console.error("Error checking subscription:", error);
          return {
            tier: "free",
            canGenerateDocuments: false,
            availableDocumentTypes: "risk_assessment_only",
          };
        }
      },
    }),
  };
}
