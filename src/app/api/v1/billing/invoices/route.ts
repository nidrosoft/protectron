import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";

export interface Invoice {
  id: string;
  number: string | null;
  status: string;
  amount: number;
  currency: string;
  description: string | null;
  createdAt: string;
  paidAt: string | null;
  invoicePdf: string | null;
  hostedInvoiceUrl: string | null;
}

// GET /api/v1/billing/invoices - Get all invoices for the organization
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
      // No billing account yet - return empty list
      return NextResponse.json({ data: { invoices: [] } });
    }

    // Fetch invoices from Stripe
    const stripeInvoices = await stripe.invoices.list({
      customer: subscription.stripe_customer_id,
      limit: 100,
    });

    // Transform invoices
    const invoices: Invoice[] = stripeInvoices.data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      status: inv.status || "unknown",
      amount: inv.amount_paid || inv.amount_due || 0,
      currency: inv.currency,
      description: inv.description || `Invoice ${inv.number || inv.id}`,
      createdAt: new Date(inv.created * 1000).toISOString(),
      paidAt: inv.status_transitions?.paid_at 
        ? new Date(inv.status_transitions.paid_at * 1000).toISOString() 
        : null,
      invoicePdf: inv.invoice_pdf || null,
      hostedInvoiceUrl: inv.hosted_invoice_url || null,
    }));

    return NextResponse.json({ data: { invoices } });
  } catch (error) {
    console.error("Error in GET /api/v1/billing/invoices:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
