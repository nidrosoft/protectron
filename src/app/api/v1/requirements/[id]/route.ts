import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/v1/requirements/[id] - Update requirement status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, linked_evidence_id, linked_document_id, notes } = body;

    // Verify the requirement belongs to user's organization
    const { data: requirement, error: fetchError } = await supabase
      .from("ai_system_requirements")
      .select(`
        id,
        ai_system_id,
        ai_systems!inner(organization_id)
      `)
      .eq("id", id)
      .single();

    if (fetchError || !requirement) {
      return NextResponse.json(
        { error: "Requirement not found" },
        { status: 404 }
      );
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const reqOrgId = (requirement.ai_systems as any)?.organization_id;
    if (reqOrgId !== profile?.organization_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the requirement
    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (linked_evidence_id !== undefined) updateData.linked_evidence_id = linked_evidence_id;
    if (linked_document_id !== undefined) updateData.linked_document_id = linked_document_id;
    if (notes !== undefined) updateData.notes = notes;

    const { data: updated, error: updateError } = await supabase
      .from("ai_system_requirements")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating requirement:", updateError);
      return NextResponse.json(
        { error: "Failed to update requirement" },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile?.organization_id || "",
      ai_system_id: requirement.ai_system_id,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email || "Unknown",
      action_type: "requirement_updated",
      action_description: status === "completed" ? "Completed requirement" : "Updated requirement",
      target_type: "requirement",
      target_id: id,
      target_name: updated.title || "",
    });

    // Update AI system compliance progress
    const { data: allReqs } = await supabase
      .from("ai_system_requirements")
      .select("status")
      .eq("ai_system_id", requirement.ai_system_id);

    if (allReqs) {
      const total = allReqs.length;
      const completed = allReqs.filter((r) => r.status === "completed").length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      const complianceStatus = progress === 100 ? "compliant" : progress > 0 ? "in_progress" : "not_started";

      await supabase
        .from("ai_systems")
        .update({
          compliance_progress: progress,
          compliance_status: complianceStatus,
        })
        .eq("id", requirement.ai_system_id);
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error in PATCH /api/v1/requirements/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/v1/requirements/[id] - Get requirement details
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

    const { data: requirement, error } = await supabase
      .from("ai_system_requirements")
      .select(`
        *,
        ai_systems!inner(organization_id, name)
      `)
      .eq("id", id)
      .single();

    if (error || !requirement) {
      return NextResponse.json(
        { error: "Requirement not found" },
        { status: 404 }
      );
    }

    // Verify organization access
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const reqOrgId = (requirement.ai_systems as any)?.organization_id;
    if (reqOrgId !== profile?.organization_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: requirement });
  } catch (error) {
    console.error("Error in GET /api/v1/requirements/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
