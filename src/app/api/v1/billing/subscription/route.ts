import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/billing/subscription - Get current organization subscription
export async function GET() {
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
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get subscription with plan details
    const { data: subscription, error } = await (supabase as any)
      .from("organization_subscriptions")
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq("organization_id", profile.organization_id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching subscription:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no subscription, return free plan info
    if (!subscription) {
      const { data: freePlan } = await (supabase as any)
        .from("subscription_plans")
        .select("*")
        .eq("slug", "free")
        .single();

      return NextResponse.json({
        data: {
          plan: freePlan ? {
            id: freePlan.id,
            name: freePlan.name,
            slug: freePlan.slug,
            features: freePlan.features || [],
            limits: freePlan.limits || {},
          } : {
            name: "Free",
            slug: "free",
            features: [],
            limits: {},
          },
          status: "active",
          isFreePlan: true,
        },
      });
    }

    // Transform subscription data
    const transformedSubscription = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at,
      trialStart: subscription.trial_start,
      trialEnd: subscription.trial_end,
      plan: subscription.plan ? {
        id: subscription.plan.id,
        name: subscription.plan.name,
        slug: subscription.plan.slug,
        priceMonthly: subscription.plan.price_monthly,
        priceYearly: subscription.plan.price_yearly,
        features: subscription.plan.features || [],
        limits: subscription.plan.limits || {},
      } : null,
      isFreePlan: subscription.plan?.slug === "free" || !subscription.stripe_subscription_id,
    };

    return NextResponse.json({ data: transformedSubscription });
  } catch (error) {
    console.error("Error in GET /api/v1/billing/subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
