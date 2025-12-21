import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/v1/documents/[id]/duplicate - Duplicate a document
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get original document
    const { data: originalDoc } = await supabase
      .from("documents")
      .select("*, ai_systems!inner(organization_id)")
      .eq("id", id)
      .single();

    if (!originalDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const doc = originalDoc as any;
    if (doc.ai_systems?.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Create duplicate
    const { data: duplicatedDoc, error: duplicateError } = await supabase
      .from("documents")
      .insert({
        organization_id: profile.organization_id,
        ai_system_id: doc.ai_system_id,
        name: `${doc.name} (Copy)`,
        document_type: doc.document_type,
        status: "draft",
        mime_type: doc.mime_type,
        generation_prompt: doc.generation_prompt,
        version: 1,
        parent_document_id: doc.id,
        created_by: user.id,
      })
      .select()
      .single();

    if (duplicateError) {
      console.error("Error duplicating document:", duplicateError);
      return NextResponse.json({ error: duplicateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: duplicatedDoc }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/documents/[id]/duplicate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
