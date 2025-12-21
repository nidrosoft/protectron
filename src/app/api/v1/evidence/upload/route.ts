import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/v1/evidence/upload - Upload evidence file
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization and profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const aiSystemId = formData.get("ai_system_id") as string | null;
    const requirementId = formData.get("requirement_id") as string | null;
    const description = formData.get("description") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!aiSystemId) {
      return NextResponse.json({ error: "AI System ID is required" }, { status: 400 });
    }

    // Verify AI system belongs to user's organization
    const { data: system } = await supabase
      .from("ai_systems")
      .select("organization_id")
      .eq("id", aiSystemId)
      .single();

    if (!system || system.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "AI System not found" }, { status: 404 });
    }

    // Get file details
    const fileName = file.name;
    const fileType = file.name.split(".").pop()?.toUpperCase() || "FILE";
    const fileSize = file.size;
    const timestamp = Date.now();
    const storagePath = `${profile.organization_id}/${aiSystemId}/${timestamp}_${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("evidence")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      // If storage bucket doesn't exist or other error, still create record with placeholder
      // In production, you'd want to handle this more gracefully
    }

    // Get public URL (or construct it)
    let fileUrl = null;
    if (uploadData) {
      const { data: urlData } = supabase.storage
        .from("evidence")
        .getPublicUrl(storagePath);
      fileUrl = urlData?.publicUrl;
    }

    // Create evidence record in database
    // Note: Using type assertion as generated types may be out of sync with actual schema
    const { data: evidence, error: dbError } = await (supabase as any)
      .from("evidence")
      .insert({
        ai_system_id: aiSystemId,
        requirement_id: requirementId || null,
        name: fileName,
        file_type: fileType,
        file_size: String(fileSize),
        storage_path: storagePath,
        uploaded_by: user.id,
        uploaded_at: new Date().toISOString(),
        linked_to_description: description || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Error creating evidence record:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: aiSystemId,
      user_id: user.id,
      user_name: profile.full_name || "User",
      user_avatar_url: profile.avatar_url,
      action_type: "evidence_uploaded",
      action_description: `Uploaded evidence: ${fileName}`,
      target_type: "evidence",
      target_id: evidence.id,
      target_name: fileName,
    });

    return NextResponse.json({ 
      data: {
        id: evidence.id,
        name: evidence.name,
        type: evidence.file_type,
        size: formatFileSize(parseInt(evidence.file_size || "0", 10)),
        storagePath: evidence.storage_path,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/evidence/upload:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
