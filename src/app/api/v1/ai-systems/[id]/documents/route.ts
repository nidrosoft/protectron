import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/ai-systems/[id]/documents - List documents for an AI system
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    // Verify the AI system belongs to user's organization
    const { data: system } = await supabase
      .from("ai_systems")
      .select("id, organization_id")
      .eq("id", id)
      .single();

    if (!system || system.organization_id !== profile?.organization_id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get documents
    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .eq("ai_system_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: documents });
  } catch (error) {
    console.error("Error in GET /api/v1/ai-systems/[id]/documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/ai-systems/[id]/documents - Generate a new document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { document_type, name } = body;

    if (!document_type || !name) {
      return NextResponse.json(
        { error: "document_type and name are required" },
        { status: 400 }
      );
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    // Verify the AI system belongs to user's organization
    const { data: system } = await supabase
      .from("ai_systems")
      .select("id, organization_id, name, description, risk_level, system_type, provider")
      .eq("id", id)
      .single();

    if (!system || system.organization_id !== profile?.organization_id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Create the document record
    const { data: document, error: createError } = await supabase
      .from("documents")
      .insert({
        ai_system_id: id,
        organization_id: system.organization_id,
        name,
        document_type,
        status: "generating",
        generated_by: user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating document:", createError);
      return NextResponse.json(
        { error: "Failed to create document" },
        { status: 500 }
      );
    }

    // In a real implementation, this would trigger an async job to generate the document
    // For now, we'll simulate generation by updating status after a delay
    // The actual content generation would use AI/templates based on document_type

    // Update document to "completed" with placeholder content
    const { data: updatedDoc, error: updateError } = await supabase
      .from("documents")
      .update({
        status: "completed",
        generated_at: new Date().toISOString(),
        content: generateDocumentContent(document_type, system),
      })
      .eq("id", document.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating document:", updateError);
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile?.organization_id || "",
      ai_system_id: id,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email || "Unknown",
      action_type: "document_generated",
      action_description: `Generated ${document_type} document`,
      target_type: "document",
      target_id: document.id,
      target_name: name,
    });

    return NextResponse.json({ data: updatedDoc || document });
  } catch (error) {
    console.error("Error in POST /api/v1/ai-systems/[id]/documents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to generate document content based on type
function generateDocumentContent(
  documentType: string,
  system: { name: string; description: string | null; risk_level: string; system_type: string; provider: string | null }
): string {
  const templates: Record<string, string> = {
    technical_documentation: `# Technical Documentation

## System Overview
**Name:** ${system.name}
**Type:** ${system.system_type}
**Risk Level:** ${system.risk_level}
**Provider:** ${system.provider || "N/A"}

## Description
${system.description || "No description provided."}

## Architecture
[To be completed]

## Data Flow
[To be completed]

## Security Measures
[To be completed]

---
*Generated on ${new Date().toLocaleDateString()}*
`,
    risk_assessment: `# Risk Assessment Report

## System Information
**Name:** ${system.name}
**Risk Classification:** ${system.risk_level.toUpperCase()}

## Risk Analysis

### Identified Risks
[To be completed based on system analysis]

### Mitigation Measures
[To be completed]

### Residual Risks
[To be completed]

## Compliance Status
This system has been classified as ${system.risk_level} risk under the EU AI Act.

---
*Generated on ${new Date().toLocaleDateString()}*
`,
    conformity_declaration: `# EU Declaration of Conformity

## Manufacturer/Provider Information
[Organization details]

## AI System Information
**Name:** ${system.name}
**Type:** ${system.system_type}
**Risk Level:** ${system.risk_level}

## Declaration
We hereby declare that the AI system described above conforms to the requirements of the EU AI Act (Regulation (EU) 2024/1689).

## Applicable Requirements
- Article 9: Risk Management System
- Article 10: Data and Data Governance
- Article 11: Technical Documentation
- Article 13: Transparency
- Article 14: Human Oversight

---
*Generated on ${new Date().toLocaleDateString()}*
`,
    user_instructions: `# Instructions for Use

## AI System: ${system.name}

### Purpose
${system.description || "This AI system is designed to assist with automated tasks."}

### Intended Use
[To be completed]

### Limitations
[To be completed]

### Human Oversight
Users should maintain oversight of this system's outputs and decisions.

### Contact Information
For questions or issues, contact your system administrator.

---
*Generated on ${new Date().toLocaleDateString()}*
`,
  };

  return templates[documentType] || templates.technical_documentation;
}
