import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/billing/plans - Get all available subscription plans
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all active plans
    const { data: plans, error } = await (supabase as any)
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching plans:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform plans for frontend
    const transformedPlans = plans.map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      description: plan.description,
      priceMonthly: plan.price_monthly,
      priceYearly: plan.price_yearly,
      currency: plan.currency,
      features: plan.features || [],
      limits: plan.limits || {},
      isDefault: plan.is_default,
      stripePriceId: plan.stripe_price_id,
    }));

    return NextResponse.json({ data: transformedPlans });
  } catch (error) {
    console.error("Error in GET /api/v1/billing/plans:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
