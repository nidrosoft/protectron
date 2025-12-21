"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/stripe-billing`;

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  limits: Record<string, number>;
  isDefault?: boolean;
  stripePriceId?: string;
}

export interface Subscription {
  id?: string;
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  plan: SubscriptionPlan | null;
  isFreePlan: boolean;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

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

interface UseBillingReturn {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCheckout: (priceId: string, planSlug: string) => Promise<string | null>;
  openBillingPortal: () => Promise<string | null>;
  fetchPaymentMethods: () => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  fetchInvoices: () => Promise<void>;
}

export function useBilling(): UseBillingReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.access_token || ""}`,
    };
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      
      // Fetch plans and subscription in parallel from Edge Function
      const [plansRes, subRes] = await Promise.all([
        fetch(`${EDGE_FUNCTION_URL}?action=plans`, { headers }),
        fetch(`${EDGE_FUNCTION_URL}?action=subscription`, { headers }),
      ]);

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData.data || []);
      }

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData.data || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${EDGE_FUNCTION_URL}?action=payment-methods`, { headers });
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch payment methods:", err);
    }
  }, [getAuthHeaders]);

  const setDefaultPaymentMethod = useCallback(async (paymentMethodId: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${EDGE_FUNCTION_URL}?action=set-default`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ paymentMethodId }),
      });

      if (response.ok) {
        // Update local state
        setPaymentMethods((prev) =>
          prev.map((pm) => ({
            ...pm,
            isDefault: pm.id === paymentMethodId,
          }))
        );
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  }, [getAuthHeaders]);

  const removePaymentMethod = useCallback(async (paymentMethodId: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${EDGE_FUNCTION_URL}?action=remove-payment-method&id=${paymentMethodId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        // Update local state
        setPaymentMethods((prev) => prev.filter((pm) => pm.id !== paymentMethodId));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  }, [getAuthHeaders]);

  const fetchInvoices = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${EDGE_FUNCTION_URL}?action=invoices`, { headers });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    }
  }, [getAuthHeaders]);

  const createCheckout = useCallback(async (priceId: string, planSlug: string): Promise<string | null> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${EDGE_FUNCTION_URL}?action=checkout`, {
        method: "POST",
        headers,
        body: JSON.stringify({ priceId, planSlug }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout");
      }

      const data = await response.json();
      return data.data?.url || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  }, [getAuthHeaders]);

  const openBillingPortal = useCallback(async (): Promise<string | null> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${EDGE_FUNCTION_URL}?action=portal`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to open billing portal");
      }

      const data = await response.json();
      return data.data?.url || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    subscription,
    plans,
    paymentMethods,
    invoices,
    isLoading,
    error,
    refetch: fetchData,
    createCheckout,
    openBillingPortal,
    fetchPaymentMethods,
    setDefaultPaymentMethod,
    removePaymentMethod,
    fetchInvoices,
  };
}
