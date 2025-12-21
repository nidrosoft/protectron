import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/evidence - Get all evidence across all systems for the organization
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
    const fileType = searchParams.get("file_type");
    const systemId = searchParams.get("system_id");

    // Build query for evidence with AI system info
    let query = supabase
      .from("evidence")
      .select(`
        id,
        name,
        file_type,
        file_size,
        file_url,
        uploaded_at,
        uploaded_by,
        linked_to_description,
        ai_system_id,
        requirement_id,
        ai_systems!inner (
          id,
          name,
          organization_id
        ),
        ai_system_requirements (
          id,
          requirement_templates (
            title,
            article_id
          )
        )
      `)
      .eq("ai_systems.organization_id", profile.organization_id)
      .order("uploaded_at", { ascending: false });

    // Apply filters
    if (fileType && fileType !== "all") {
      query = query.eq("file_type", fileType);
    }
    if (systemId && systemId !== "all") {
      query = query.eq("ai_system_id", systemId);
    }

    const { data: evidence, error } = await query;

    if (error) {
      console.error("Error fetching evidence:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get uploader names
    const uploaderIds = [...new Set((evidence || []).map((e: any) => e.uploaded_by).filter(Boolean))];
    let uploaderMap: Record<string, string> = {};
    
    if (uploaderIds.length > 0) {
      const { data: uploaders } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", uploaderIds);
      
      uploaderMap = (uploaders || []).reduce((acc: Record<string, string>, u: any) => {
        acc[u.id] = u.full_name || "Unknown";
        return acc;
      }, {});
    }

    // Transform data to match frontend expectations
    const transformedEvidence = (evidence || []).map((ev: any) => ({
      id: ev.id,
      name: ev.name,
      type: ev.file_type || "PDF",
      size: ev.file_size ? formatFileSize(ev.file_size) : "—",
      sizeBytes: ev.file_size,
      uploadedAt: ev.uploaded_at ? new Date(ev.uploaded_at).toLocaleDateString() : "—",
      uploadedBy: uploaderMap[ev.uploaded_by] || "Unknown",
      uploadedById: ev.uploaded_by,
      systemId: ev.ai_system_id,
      systemName: ev.ai_systems?.name || "Unknown System",
      linkedTo: ev.ai_system_requirements?.requirement_templates?.title || ev.linked_to_description || "—",
      requirementId: ev.requirement_id,
      fileUrl: ev.file_url,
    }));

    // Get unique AI systems for filter dropdown
    const systemsMap = new Map();
    (evidence || []).forEach((ev: any) => {
      if (ev.ai_systems && !systemsMap.has(ev.ai_system_id)) {
        systemsMap.set(ev.ai_system_id, {
          id: ev.ai_system_id,
          name: ev.ai_systems.name,
        });
      }
    });
    const systems = Array.from(systemsMap.values());

    // Get unique file types for filter dropdown
    const fileTypes = [...new Set((evidence || []).map((ev: any) => ev.file_type).filter(Boolean))];

    return NextResponse.json({
      data: transformedEvidence,
      systems,
      fileTypes,
      total: transformedEvidence.length,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/evidence:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
