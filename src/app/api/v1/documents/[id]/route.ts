import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/documents/[id] - Get a specific document
export async function GET(
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

    // Fetch document
    const { data: document, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify document belongs to user's organization
    const { data: system } = await supabase
      .from("ai_systems")
      .select("id, name, organization_id")
      .eq("id", (document as any).ai_system_id)
      .single();

    if (!system || system.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const doc = document as any;
    // Transform data
    const transformedDocument = {
      id: doc.id,
      name: doc.name,
      type: doc.document_type || "other",
      status: doc.status || "draft",
      size: doc.file_size ? formatFileSize(doc.file_size) : "—",
      createdAt: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "—",
      updatedAt: doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : "—",
      systemId: doc.ai_system_id,
      systemName: system.name || "Unknown System",
      content: doc.content || null,
    };

    return NextResponse.json({ data: transformedDocument });
  } catch (error) {
    console.error("Error in GET /api/v1/documents/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/v1/documents/[id] - Update a document
export async function PATCH(
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

    // Parse request body
    const body = await request.json();
    const { name, status, content } = body;

    // Verify document belongs to user's organization
    const { data: existingDoc } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (!existingDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify AI system belongs to user's organization
    const { data: system } = await supabase
      .from("ai_systems")
      .select("organization_id")
      .eq("id", (existingDoc as any).ai_system_id)
      .single();

    if (!system || system.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Update document
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status;
    if (content !== undefined) updateData.content = content;

    const { data: updatedDoc, error: updateError } = await supabase
      .from("documents")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating document:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: updatedDoc });
  } catch (error) {
    console.error("Error in PATCH /api/v1/documents/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/documents/[id] - Delete a document
export async function DELETE(
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

    // Verify document belongs to user's organization
    const { data: existingDoc } = await supabase
      .from("documents")
      .select("*, ai_systems!inner(organization_id)")
      .eq("id", id)
      .single();

    if (!existingDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const doc = existingDoc as any;
    if (doc.ai_systems?.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete document
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting document:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/v1/documents/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
