import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/documents/[id]/versions - Get version history for a document
export async function GET(
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

    // Get the current document to find its root
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

    // Find the root document (the one with no parent)
    let rootId = id;
    let parentId = doc.parent_document_id;
    
    // Traverse up to find root
    while (parentId) {
      const { data: parentDoc } = await supabase
        .from("documents")
        .select("id, parent_document_id")
        .eq("id", parentId)
        .single();
      
      if (parentDoc) {
        rootId = parentDoc.id;
        parentId = parentDoc.parent_document_id;
      } else {
        break;
      }
    }

    // Get all versions (documents that share the same root or are the root)
    // This includes the root and all its descendants
    const { data: versions, error } = await supabase
      .from("documents")
      .select(`
        id,
        name,
        version,
        status,
        created_at,
        updated_at,
        created_by,
        parent_document_id
      `)
      .or(`id.eq.${rootId},parent_document_id.eq.${rootId}`)
      .order("version", { ascending: false });

    if (error) {
      console.error("Error fetching versions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also get versions that have this document as ancestor
    // Build the full version tree
    const allVersionIds = new Set([rootId]);
    let foundNew = true;
    let allVersions = versions || [];

    while (foundNew) {
      foundNew = false;
      const { data: childVersions } = await supabase
        .from("documents")
        .select(`
          id,
          name,
          version,
          status,
          created_at,
          updated_at,
          created_by,
          parent_document_id
        `)
        .in("parent_document_id", Array.from(allVersionIds))
        .not("id", "in", `(${Array.from(allVersionIds).join(",")})`);

      if (childVersions && childVersions.length > 0) {
        for (const v of childVersions) {
          if (!allVersionIds.has(v.id)) {
            allVersionIds.add(v.id);
            allVersions.push(v);
            foundNew = true;
          }
        }
      }
    }

    // Sort by version descending
    allVersions.sort((a, b) => (b.version || 0) - (a.version || 0));

    // Transform the data
    const transformedVersions = allVersions.map((v: any) => ({
      id: v.id,
      name: v.name,
      version: v.version || 1,
      status: v.status || "draft",
      createdAt: v.created_at,
      updatedAt: v.updated_at,
      isCurrent: v.id === id,
    }));

    return NextResponse.json({
      data: {
        currentVersion: doc.version || 1,
        versions: transformedVersions,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/documents/[id]/versions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/documents/[id]/versions - Create a new version of the document
export async function POST(
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

    // Parse request body for optional content override
    let newContent = doc.content;
    try {
      const body = await request.json();
      if (body.content) {
        newContent = body.content;
      }
    } catch {
      // No body provided, use current content
    }

    // Create new version
    const newVersion = (doc.version || 1) + 1;

    const { data: newDoc, error: insertError } = await supabase
      .from("documents")
      .insert({
        organization_id: doc.organization_id,
        ai_system_id: doc.ai_system_id,
        name: doc.name,
        document_type: doc.document_type,
        status: "draft",
        content: newContent,
        version: newVersion,
        parent_document_id: id,
        created_by: user.id,
        generation_prompt: doc.generation_prompt,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating version:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: doc.ai_system_id,
      user_id: user.id,
      action_type: "document_version_created",
      action_description: `Created version ${newVersion} of document: ${doc.name}`,
    });

    return NextResponse.json({
      data: {
        id: newDoc.id,
        version: newVersion,
        message: `Version ${newVersion} created successfully`,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/documents/[id]/versions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
