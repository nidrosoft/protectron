import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/v1/documents/[id]/versions/[versionId]/restore - Restore a specific version
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id, versionId } = await params;
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

    // Get the current document
    const { data: currentDoc } = await supabase
      .from("documents")
      .select("*, ai_systems!inner(organization_id)")
      .eq("id", id)
      .single();

    if (!currentDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const doc = currentDoc as any;
    if (doc.ai_systems?.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Get the version to restore
    const { data: versionDoc } = await supabase
      .from("documents")
      .select("*")
      .eq("id", versionId)
      .single();

    if (!versionDoc) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    const version = versionDoc as any;

    // Create a new version with the restored content
    const newVersion = (doc.version || 1) + 1;

    const { data: restoredDoc, error: insertError } = await supabase
      .from("documents")
      .insert({
        organization_id: doc.organization_id,
        ai_system_id: doc.ai_system_id,
        name: doc.name,
        document_type: doc.document_type,
        status: "draft",
        content: version.content,
        version: newVersion,
        parent_document_id: id,
        created_by: user.id,
        generation_prompt: version.generation_prompt,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error restoring version:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: doc.ai_system_id,
      user_id: user.id,
      action_type: "document_version_restored",
      action_description: `Restored document "${doc.name}" to version ${version.version} (created as version ${newVersion})`,
    });

    return NextResponse.json({
      data: {
        id: restoredDoc.id,
        version: newVersion,
        restoredFromVersion: version.version,
        message: `Restored to version ${version.version} (saved as version ${newVersion})`,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/documents/[id]/versions/[versionId]/restore:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
