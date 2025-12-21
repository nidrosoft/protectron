import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/ai-systems/[id]/evidence - List evidence for an AI system
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

    // Get evidence
    const { data: evidence, error } = await supabase
      .from("evidence")
      .select("*")
      .eq("ai_system_id", id)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("Error fetching evidence:", error);
      return NextResponse.json(
        { error: "Failed to fetch evidence" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: evidence });
  } catch (error) {
    console.error("Error in GET /api/v1/ai-systems/[id]/evidence:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/v1/ai-systems/[id]/evidence - Upload new evidence
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
    const { name, file_type, file_url, file_size, linked_requirement_id, description } = body;

    if (!name || !file_type) {
      return NextResponse.json(
        { error: "name and file_type are required" },
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
      .select("id, organization_id, name")
      .eq("id", id)
      .single();

    if (!system || system.organization_id !== profile?.organization_id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Create the evidence record
    const { data: evidence, error: createError } = await supabase
      .from("evidence")
      .insert({
        ai_system_id: id,
        organization_id: system.organization_id,
        name,
        file_type,
        file_size: file_size || null,
        storage_path: file_url || "",
        description: description || null,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating evidence:", createError);
      return NextResponse.json(
        { error: "Failed to create evidence record" },
        { status: 500 }
      );
    }

    // If linked to a requirement, update the requirement
    if (linked_requirement_id) {
      await supabase
        .from("ai_system_requirements")
        .update({ linked_evidence_id: evidence.id })
        .eq("id", linked_requirement_id);
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile?.organization_id || "",
      ai_system_id: id,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email || "Unknown",
      action_type: "evidence_uploaded",
      action_description: `Uploaded evidence: ${name}`,
      target_type: "evidence",
      target_id: evidence.id,
      target_name: name,
    });

    return NextResponse.json({ data: evidence });
  } catch (error) {
    console.error("Error in POST /api/v1/ai-systems/[id]/evidence:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
