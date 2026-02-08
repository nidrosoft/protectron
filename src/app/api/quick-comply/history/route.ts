/**
 * Quick Comply - Chat History Save/Load API
 *
 * POST: Save chat history for a session (for resume capability)
 * GET:  Load chat history for a session
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, messages } = body;

    if (!sessionId || !messages) {
      return NextResponse.json(
        { error: "sessionId and messages are required" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    // Verify session ownership
    const { data: session, error: sessionError } = await sb
      .from("quick_comply_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Save chat history as JSONB in the session
    const { error: updateError } = await sb
      .from("quick_comply_sessions")
      .update({
        chat_history: messages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Failed to save chat history:", updateError);
      return NextResponse.json(
        { error: "Failed to save chat history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Chat history save error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    const { data: session, error: sessionError } = await sb
      .from("quick_comply_sessions")
      .select("id, user_id, chat_history, form_data, progress, current_section, ai_system_name, risk_level, status")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      messages: session.chat_history || [],
      formData: session.form_data || {},
      progress: session.progress || 0,
      currentSection: session.current_section || "system_identification",
      aiSystemName: session.ai_system_name || null,
      riskLevel: session.risk_level || null,
      status: session.status || "active",
    });
  } catch (error) {
    console.error("Chat history load error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
