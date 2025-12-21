import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/v1/agents/[id]/export - Export audit trail
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

    const body = await request.json();
    const { format = "json", start_date, end_date, event_types } = body;

    // Build query
    let query = supabase
      .from("agent_audit_events")
      .select("*")
      .eq("ai_system_id", id)
      .order("event_timestamp", { ascending: false });

    if (start_date) {
      query = query.gte("event_timestamp", start_date);
    }
    if (end_date) {
      query = query.lte("event_timestamp", end_date);
    }
    if (event_types && Array.isArray(event_types) && event_types.length > 0) {
      query = query.in("event_type", event_types);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error("Error fetching events for export:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format based on requested format
    if (format === "csv") {
      // Generate CSV
      const headers = [
        "id",
        "event_type",
        "event_name",
        "action",
        "timestamp",
        "trace_id",
        "session_id",
        "duration_ms",
        "tokens_input",
        "tokens_output",
        "confidence",
        "reasoning",
      ];

      const csvRows = [headers.join(",")];
      for (const event of events || []) {
        const row = [
          event.id,
          event.event_type,
          event.event_name || "",
          event.action || "",
          event.event_timestamp,
          event.trace_id,
          event.session_id || "",
          event.duration_ms || "",
          event.tokens_input || "",
          event.tokens_output || "",
          event.confidence || "",
          (event.reasoning || "").replace(/,/g, ";").replace(/\n/g, " "),
        ];
        csvRows.push(row.map((v) => `"${v}"`).join(","));
      }

      return new NextResponse(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="audit-trail-${id}-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Default: JSON format
    return NextResponse.json({
      data: {
        agent_id: id,
        export_date: new Date().toISOString(),
        period: {
          start: start_date || null,
          end: end_date || null,
        },
        total_events: events?.length || 0,
        events,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/export:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
