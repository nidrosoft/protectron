import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/certificates/[certId]/verify - Public endpoint to verify a certificate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certId: string }> }
) {
  try {
    const { certId } = await params;
    const supabase = await createClient();

    // Find the certificate by cert_id
    const { data: certification, error } = await supabase
      .from("ai_system_certifications")
      .select(`
        *,
        ai_systems (
          name,
          organization_id,
          organizations (
            name
          )
        )
      `)
      .eq("cert_id", certId)
      .single();

    if (error || !certification) {
      return NextResponse.json(
        { error: "Certificate not found", valid: false },
        { status: 404 }
      );
    }

    // Check if certificate is still valid
    const now = new Date();
    const validUntil = new Date(certification.valid_until || now);
    const isExpired = validUntil < now;
    const isActive = certification.status === "active";

    // Parse requirements snapshot
    const requirementsSnapshot = certification.requirements_snapshot as {
      total?: number;
      completed?: number;
      checks?: {
        sdkConnected?: boolean;
        hitlRulesActive?: boolean;
        noOpenIncidents?: boolean;
        loggingActive?: boolean;
      };
    } | null;

    return NextResponse.json({
      data: {
        valid: isActive && !isExpired,
        certId: certification.cert_id,
        systemName: certification.ai_systems?.name || "Unknown System",
        organizationName: certification.ai_systems?.organizations?.name || "Unknown Organization",
        certificationLevel: getCertificationLevel(certification.compliance_score || 0),
        complianceScore: certification.compliance_score || 0,
        issuedAt: certification.certified_at,
        validUntil: certification.valid_until,
        status: isExpired ? "expired" : certification.status,
        checks: requirementsSnapshot?.checks || {
          sdkConnected: false,
          hitlRulesActive: false,
          noOpenIncidents: false,
          loggingActive: false,
        },
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/certificates/[certId]/verify:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getCertificationLevel(score: number): "bronze" | "silver" | "gold" {
  if (score >= 95) return "gold";
  if (score >= 85) return "silver";
  return "bronze";
}
