import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

// Disable body parsing for webhook
export const runtime = "nodejs";

// POST /api/v1/billing/webhook - Handle Stripe webhooks
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(supabase, invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(supabase: any, session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organization_id;
  if (!organizationId) return;

  // Update subscription record
  await supabase
    .from("organization_subscriptions")
    .upsert({
      organization_id: organizationId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      status: "active",
      updated_at: new Date().toISOString(),
    });

  console.log(`Checkout completed for organization: ${organizationId}`);
}

async function handleSubscriptionUpdated(supabase: any, subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata?.organization_id;
  if (!organizationId) {
    // Try to find by customer ID
    const { data: existingSub } = await supabase
      .from("organization_subscriptions")
      .select("organization_id")
      .eq("stripe_subscription_id", subscription.id)
      .single();
    
    if (!existingSub) return;
  }

  // Get the price ID to find the plan
  const priceId = subscription.items.data[0]?.price.id;
  let planId = null;

  if (priceId) {
    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("stripe_price_id", priceId)
      .single();
    
    if (plan) planId = plan.id;
  }

  // Update subscription (using any to handle Stripe API version differences)
  const sub = subscription as any;
  await supabase
    .from("organization_subscriptions")
    .update({
      plan_id: planId,
      status: subscription.status,
      current_period_start: sub.current_period_start 
        ? new Date(sub.current_period_start * 1000).toISOString() 
        : null,
      current_period_end: sub.current_period_end 
        ? new Date(sub.current_period_end * 1000).toISOString() 
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at 
        ? new Date(subscription.canceled_at * 1000).toISOString() 
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionDeleted(supabase: any, subscription: Stripe.Subscription) {
  await supabase
    .from("organization_subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  console.log(`Subscription deleted: ${subscription.id}`);
}

async function handleInvoicePaid(supabase: any, invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find organization by customer ID
  const { data: subscription } = await supabase
    .from("organization_subscriptions")
    .select("organization_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subscription) return;

  // Record the invoice
  await supabase
    .from("billing_history")
    .upsert({
      organization_id: subscription.organization_id,
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: (invoice as any).payment_intent as string,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: "paid",
      description: invoice.description || `Invoice ${invoice.number}`,
      invoice_pdf_url: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      period_start: invoice.period_start 
        ? new Date(invoice.period_start * 1000).toISOString() 
        : null,
      period_end: invoice.period_end 
        ? new Date(invoice.period_end * 1000).toISOString() 
        : null,
      paid_at: new Date().toISOString(),
    });

  console.log(`Invoice paid: ${invoice.id}`);
}

async function handleInvoicePaymentFailed(supabase: any, invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find organization by customer ID
  const { data: subscription } = await supabase
    .from("organization_subscriptions")
    .select("organization_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subscription) return;

  // Record the failed invoice
  await supabase
    .from("billing_history")
    .upsert({
      organization_id: subscription.organization_id,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: "failed",
      description: invoice.description || `Invoice ${invoice.number}`,
      invoice_pdf_url: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
    });

  // Update subscription status
  await supabase
    .from("organization_subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  console.log(`Invoice payment failed: ${invoice.id}`);
}
