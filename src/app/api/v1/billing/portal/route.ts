import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createBillingPortalSession } from "@/lib/stripe/server";

// POST /api/v1/billing/portal - Create a Stripe billing portal session
export async function POST(request: NextRequest) {
  try {
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
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Only owners and admins can access billing portal
    if (!["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Get subscription with Stripe customer ID
    const { data: subscription } = await (supabase as any)
      .from("organization_subscriptions")
      .select("stripe_customer_id")
      .eq("organization_id", profile.organization_id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    // Create billing portal session
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const session = await createBillingPortalSession(
      subscription.stripe_customer_id,
      `${origin}/settings/billing`
    );

    return NextResponse.json({
      data: {
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/v1/billing/portal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
