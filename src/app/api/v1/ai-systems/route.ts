import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIdentifier, rateLimitHeaders, RATE_LIMITS } from "@/lib/security/rate-limit";
import { validateBody, createAISystemSchema, ValidationError } from "@/lib/security/validation";
import type { Json } from "@/lib/supabase/database.types";

// GET /api/v1/ai-systems - List all AI systems for the organization
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
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

    // Get AI systems with related data including requirements count and documents count
    const { data: systems, error } = await supabase
      .from("ai_systems")
      .select(`
        *,
        ai_system_certifications (*),
        agent_sdk_configs (agent_id_external, is_active),
        ai_system_requirements (id, status),
        documents (id)
      `)
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching AI systems:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform systems to include requirements counts, documents count, and SDK status
    const transformedSystems = (systems || []).map((system: any) => {
      const requirements = system.ai_system_requirements || [];
      const totalRequirements = requirements.length;
      const completedRequirements = requirements.filter((r: any) => r.status === "completed").length;
      
      // Count documents for this system
      const documents = system.documents || [];
      const documentsCount = documents.length;
      
      // Determine SDK connection status from agent_sdk_configs
      const sdkConfigs = system.agent_sdk_configs || [];
      const hasActiveConfig = sdkConfigs.some((config: any) => config.is_active);
      const sdkConnected = hasActiveConfig || system.sdk_connected || false;
      
      return {
        ...system,
        requirements_total: totalRequirements,
        requirements_completed: completedRequirements,
        documents_generated: documentsCount,
        sdk_connected: sdkConnected,
        sdk_agent_id: sdkConfigs[0]?.agent_id_external || null,
      };
    });

    return NextResponse.json({ data: transformedSystems });
  } catch (error) {
    console.error("Error in GET /api/v1/ai-systems:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/ai-systems - Create a new AI system
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const identifier = getClientIdentifier(request, user.id);
    const rateLimitResult = checkRateLimit(identifier, RATE_LIMITS.api);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    // Get user's organization and name
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const userName = profile.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

    // Check AI system limit before creating
    const { data: org } = await supabase
      .from("organizations")
      .select("plan, max_ai_systems")
      .eq("id", profile.organization_id)
      .single();

    const { count: currentCount } = await supabase
      .from("ai_systems")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", profile.organization_id);

    if (org && currentCount !== null && currentCount >= (org.max_ai_systems || 2)) {
      // Queue the "third-system-blocked" email (table not in TS types yet, use type assertion)
      await (supabase as any).from("email_queue").insert({
        user_id: user.id,
        organization_id: profile.organization_id,
        email_type: "third-system-blocked",
        scheduled_for: new Date().toISOString(),
        payload: {
          user_name: userName,
          user_email: user.email,
          current_count: currentCount,
          max_allowed: org.max_ai_systems || 2,
          plan: org.plan || "free",
        },
      });

      return NextResponse.json(
        { 
          error: "AI system limit reached",
          message: `Your ${org.plan || 'free'} plan allows ${org.max_ai_systems || 2} AI systems. Please upgrade to add more.`,
          code: "LIMIT_EXCEEDED",
          currentCount,
          maxAllowed: org.max_ai_systems || 2,
          plan: org.plan || 'free'
        }, 
        { status: 403 }
      );
    }

    // Validate request body with Zod schema
    let body;
    try {
      body = await validateBody(request, createAISystemSchema);
    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Create AI system
    const { data: system, error } = await supabase
      .from("ai_systems")
      .insert({
        organization_id: profile.organization_id,
        created_by: user.id,
        name: body.name,
        description: body.description,
        system_type: body.system_type || "ml_model",
        risk_level: body.risk_level || "minimal",
        provider: body.provider,
        model_name: body.model_name,
        category: body.category,
        deployment_status: body.deployment_status || "development",
        agent_framework: body.agent_framework,
        agent_capabilities: body.agent_capabilities,
        is_multi_agent: body.is_multi_agent || false,
        serves_eu: body.serves_eu || false,
        processes_in_eu: body.processes_in_eu || false,
        established_in_eu: body.established_in_eu || false,
        assessment_data: body.assessment_data as Json | undefined,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating AI system:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: system.id,
      user_id: user.id,
      user_name: userName,
      user_avatar_url: profile.avatar_url,
      action_type: "created",
      action_description: `Created AI system "${system.name}"`,
      target_type: "ai_system",
      target_id: system.id,
      target_name: system.name,
    });

    return NextResponse.json({ data: system }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/ai-systems:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
