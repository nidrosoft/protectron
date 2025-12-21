import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateStripeCustomer, createCheckoutSession } from "@/lib/stripe/server";

// POST /api/v1/billing/checkout - Create a Stripe checkout session
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
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Only owners and admins can manage billing
    if (!["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { priceId, planSlug } = body;

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    // Get organization details
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", profile.organization_id)
      .single();

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      profile.organization_id,
      user.email || "",
      org?.name
    );

    // Create checkout session
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const session = await createCheckoutSession(
      customerId,
      priceId,
      profile.organization_id,
      `${origin}/settings/billing?success=true&plan=${planSlug}`,
      `${origin}/settings/billing?canceled=true`
    );

    return NextResponse.json({
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/v1/billing/checkout:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
