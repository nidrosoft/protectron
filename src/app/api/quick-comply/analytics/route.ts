/**
 * Quick Comply - Analytics Endpoint
 *
 * POST /api/quick-comply/analytics
 *
 * Receives analytics events from the client and logs them.
 * In a production environment, these would be forwarded to an
 * analytics service (Mixpanel, Amplitude, PostHog, etc.)
 * or stored in a dedicated analytics table.
 *
 * For now, events are logged server-side for debugging and
 * appended to the session's metadata.
 */

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(null, { status: 401 });
    }

    const { event, data, timestamp } = await req.json();

    // Log for server-side observability
    console.log(
      `[Quick Comply Analytics] ${event}`,
      JSON.stringify({ userId: user.id, ...data, timestamp })
    );

    // If there's a session ID, append the event to the session metadata
    if (data?.sessionId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any;
      const { data: session } = await sb
        .from("quick_comply_sessions")
        .select("form_data")
        .eq("id", data.sessionId)
        .eq("user_id", user.id)
        .single();

      if (session) {
        const formData = (session.form_data || {}) as Record<string, unknown>;
        const analyticsLog = (formData._analytics as Array<unknown>) || [];
        analyticsLog.push({ event, ...data, timestamp });

        // Keep only the last 50 events to avoid bloat
        const trimmedLog = analyticsLog.slice(-50);

        await sb
          .from("quick_comply_sessions")
          .update({
            form_data: { ...formData, _analytics: trimmedLog },
          })
          .eq("id", data.sessionId);
      }
    }

    return new Response(null, { status: 204 });
  } catch {
    // Analytics should never return errors to the client
    return new Response(null, { status: 204 });
  }
}
