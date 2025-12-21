import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";

// GET /api/v1/billing/payment-methods - Get all payment methods for the organization
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

    // Get Stripe customer ID
    const { data: subscription } = await (supabase as any)
      .from("organization_subscriptions")
      .select("stripe_customer_id")
      .eq("organization_id", profile.organization_id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json({ data: { paymentMethods: [], defaultPaymentMethodId: null } });
    }

    // Fetch payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: subscription.stripe_customer_id,
      type: "card",
    });

    // Get customer to find default payment method
    const customer = await stripe.customers.retrieve(subscription.stripe_customer_id);
    const defaultPaymentMethodId = 
      typeof customer !== "string" && !customer.deleted
        ? (customer.invoice_settings?.default_payment_method as string) || null
        : null;

    // Transform payment methods
    const transformedMethods = paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || "unknown",
      last4: pm.card?.last4 || "****",
      expMonth: pm.card?.exp_month || 0,
      expYear: pm.card?.exp_year || 0,
      isDefault: pm.id === defaultPaymentMethodId,
    }));

    return NextResponse.json({
      data: {
        paymentMethods: transformedMethods,
        defaultPaymentMethodId,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/billing/payment-methods:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/billing/payment-methods - Create a setup intent for adding a new payment method
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

    // Only owners and admins can manage billing
    if (!["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Get or create Stripe customer
    let { data: subscription } = await (supabase as any)
      .from("organization_subscriptions")
      .select("stripe_customer_id")
      .eq("organization_id", profile.organization_id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          organization_id: profile.organization_id,
        },
      });
      customerId = customer.id;

      // Store the customer ID
      await (supabase as any)
        .from("organization_subscriptions")
        .upsert({
          organization_id: profile.organization_id,
          stripe_customer_id: customerId,
          status: "inactive",
        });
    }

    // Create a SetupIntent for securely collecting payment details
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      metadata: {
        organization_id: profile.organization_id,
      },
    });

    return NextResponse.json({
      data: {
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/v1/billing/payment-methods:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/v1/billing/payment-methods - Set default payment method
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentMethodId } = body;

    if (!paymentMethodId) {
      return NextResponse.json({ error: "Payment method ID is required" }, { status: 400 });
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

    // Only owners and admins can manage billing
    if (!["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Get Stripe customer ID
    const { data: subscription } = await (supabase as any)
      .from("organization_subscriptions")
      .select("stripe_customer_id")
      .eq("organization_id", profile.organization_id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    // Update customer's default payment method
    await stripe.customers.update(subscription.stripe_customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Error in PATCH /api/v1/billing/payment-methods:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/billing/payment-methods - Remove a payment method
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get("id");

    if (!paymentMethodId) {
      return NextResponse.json({ error: "Payment method ID is required" }, { status: 400 });
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

    // Only owners and admins can manage billing
    if (!["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Detach the payment method
    await stripe.paymentMethods.detach(paymentMethodId);

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Error in DELETE /api/v1/billing/payment-methods:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
