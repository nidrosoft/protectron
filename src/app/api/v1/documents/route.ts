import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/documents - Get all documents across all systems for the organization
export async function GET(request: Request) {
  try {
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

    // Parse query params for filtering
    const { searchParams } = new URL(request.url);
    const documentType = searchParams.get("document_type");
    const status = searchParams.get("status");
    const systemId = searchParams.get("system_id");

    // Get all AI systems for the organization first
    const { data: orgSystems } = await supabase
      .from("ai_systems")
      .select("id, name")
      .eq("organization_id", profile.organization_id);

    if (!orgSystems || orgSystems.length === 0) {
      return NextResponse.json({
        data: [],
        systems: [],
        documentTypes: [],
        total: 0,
      });
    }

    const systemIds = orgSystems.map(s => s.id);
    const systemMap = new Map(orgSystems.map(s => [s.id, s.name]));

    // Build query for documents
    let query = supabase
      .from("documents")
      .select("*")
      .in("ai_system_id", systemIds)
      .order("created_at", { ascending: false });

    // Apply filters
    if (documentType && documentType !== "all") {
      query = query.eq("document_type", documentType);
    }
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (systemId && systemId !== "all") {
      query = query.eq("ai_system_id", systemId);
    }

    const { data: documents, error } = await query;

    if (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const transformedDocuments = (documents || []).map((doc: any) => ({
      id: doc.id,
      name: doc.name,
      type: doc.document_type || "other",
      status: doc.status || "draft",
      size: doc.file_size ? formatFileSize(doc.file_size) : "—",
      createdAt: doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "—",
      updatedAt: doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : "—",
      systemId: doc.ai_system_id,
      systemName: systemMap.get(doc.ai_system_id) || "Unknown System",
    }));

    // Use orgSystems for filter dropdown
    const systems = orgSystems.map(s => ({ id: s.id, name: s.name }));

    // Get unique document types for filter dropdown
    const documentTypes = [...new Set((documents || []).map((doc: any) => doc.document_type).filter(Boolean))];

    return NextResponse.json({
      data: transformedDocuments,
      systems,
      documentTypes,
      total: transformedDocuments.length,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/documents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/documents - Create a new document
export async function POST(request: Request) {
  try {
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
    const { name, document_type, ai_system_id, generation_prompt } = body;

    if (!name || !document_type) {
      return NextResponse.json({ error: "Name and document_type are required" }, { status: 400 });
    }

    // Verify AI system belongs to user's organization (if provided)
    if (ai_system_id) {
      const { data: system } = await supabase
        .from("ai_systems")
        .select("organization_id")
        .eq("id", ai_system_id)
        .single();

      if (!system || system.organization_id !== profile.organization_id) {
        return NextResponse.json({ error: "AI System not found" }, { status: 404 });
      }
    }

    // Create document
    const { data: newDoc, error: createError } = await supabase
      .from("documents")
      .insert({
        organization_id: profile.organization_id,
        ai_system_id: ai_system_id || null,
        name,
        document_type,
        status: "draft",
        generation_prompt: generation_prompt || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating document:", createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    return NextResponse.json({ data: newDoc }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/documents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
