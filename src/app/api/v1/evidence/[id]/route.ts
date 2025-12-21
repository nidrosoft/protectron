import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/v1/evidence/[id] - Delete evidence
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

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

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get the evidence to verify ownership
    const { data: evidence, error: fetchError } = await supabase
      .from("evidence")
      .select(`
        id,
        ai_system_id,
        ai_systems!inner (
          organization_id
        )
      `)
      .eq("id", id)
      .single();

    if (fetchError || !evidence) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
    }

    // Verify the evidence belongs to user's organization
    const evidenceOrg = (evidence.ai_systems as any)?.organization_id;
    if (evidenceOrg !== profile.organization_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the evidence record
    const { error: deleteError } = await supabase
      .from("evidence")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting evidence:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // TODO: Also delete the file from storage if using Supabase Storage
    // if (evidence.file_url) {
    //   await supabase.storage.from('evidence').remove([evidence.file_url]);
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/v1/evidence/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
