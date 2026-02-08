/**
 * Document Generation API Route
 *
 * Proxies document generation requests to the Supabase Edge Function
 * and returns the AI-generated document content. This route handles:
 * - Authentication verification
 * - Subscription tier validation
 * - Document generation logging
 * - Usage tracking
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDocumentTypeName } from "@/lib/document-generator/generators";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { documentType, systemInfo, answers, organizationId } = body;

    if (!documentType || !systemInfo) {
      return NextResponse.json(
        { error: "documentType and systemInfo are required" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    // Check subscription limits
    if (organizationId) {
      const { data: org } = await sb
        .from("organizations")
        .select("subscription_tier, tokens_used_this_month")
        .eq("id", organizationId)
        .single();

      if (org) {
        const tier = org.subscription_tier || "free";
        const tokensUsed = org.tokens_used_this_month || 0;
        const tokenLimits: Record<string, number> = {
          free: 50000,
          starter: 500000,
          professional: 2000000,
          enterprise: Infinity,
        };
        const limit = tokenLimits[tier] || 50000;

        if (tokensUsed >= limit) {
          return NextResponse.json(
            {
              error: "Token limit exceeded",
              message: `Your ${tier} plan has reached its monthly token limit. Please upgrade to continue generating documents.`,
              tier,
            },
            { status: 429 }
          );
        }
      }
    }

    // Call the Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return NextResponse.json(
        { error: "No active session" },
        { status: 401 }
      );
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/generate-document`;

    const edgeResponse = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        documentType,
        systemInfo,
        answers: answers || {},
      }),
    });

    if (!edgeResponse.ok) {
      const errorData = await edgeResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.error || "Document generation failed",
          details: errorData.details,
        },
        { status: edgeResponse.status }
      );
    }

    const result = await edgeResponse.json();

    // Log document generation
    if (organizationId && result.success) {
      const docTitle = getDocumentTypeName(documentType);

      await sb.from("document_generation_log").insert({
        organization_id: organizationId,
        user_id: user.id,
        document_type: documentType,
        document_title: docTitle,
        ai_system_name: systemInfo.name,
        tokens_used: (result.usage?.inputTokens || 0) + (result.usage?.outputTokens || 0),
        status: "completed",
      });

      // Update token usage
      if (result.usage) {
        const totalTokens =
          (result.usage.inputTokens || 0) + (result.usage.outputTokens || 0);
        await sb.rpc("increment_tokens", {
          org_id: organizationId,
          token_count: totalTokens,
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Document generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
