import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { CertificateDocument, type CertificateData } from "@/lib/certificate/certificate-template";
import React from "react";

// POST /api/v1/agents/[id]/certificate/generate - Generate a compliance certificate PDF
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile and organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get organization details
    const { data: organization } = await supabase
      .from("organizations")
      .select("name, logo_url")
      .eq("id", profile.organization_id)
      .single();

    // Get agent details
    const { data: agent } = await supabase
      .from("ai_systems")
      .select("*, compliance_progress, compliance_status, sdk_connected, lifecycle_status")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Get requirements completion
    const { data: requirements, count: totalRequirements } = await supabase
      .from("ai_system_requirements")
      .select("status", { count: "exact" })
      .eq("ai_system_id", id);

    const completedRequirements = requirements?.filter((r) => r.status === "compliant").length || 0;

    // Get HITL rules count
    const { count: hitlRulesCount } = await supabase
      .from("agent_hitl_rules")
      .select("id", { count: "exact", head: true })
      .eq("ai_system_id", id)
      .eq("is_active", true);

    // Get open incidents count
    const { count: openIncidentsCount } = await supabase
      .from("agent_incidents")
      .select("id", { count: "exact", head: true })
      .eq("ai_system_id", id)
      .neq("status", "closed");

    // Get events count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: eventsCount } = await supabase
      .from("agent_audit_events")
      .select("id", { count: "exact", head: true })
      .eq("ai_system_id", id)
      .gte("event_timestamp", thirtyDaysAgo.toISOString());

    // Calculate compliance score
    const baseScore = totalRequirements && totalRequirements > 0
      ? (completedRequirements / totalRequirements) * 100
      : 0;

    let bonusPoints = 0;
    if ((hitlRulesCount || 0) >= 1) bonusPoints += 5;
    if ((openIncidentsCount || 0) === 0) bonusPoints += 5;
    if ((eventsCount || 0) > 0) bonusPoints += 5;

    const finalScore = Math.min(baseScore + bonusPoints, 100);

    // Determine certification level
    let certificationLevel: "bronze" | "silver" | "gold" = "bronze";
    if (finalScore >= 95) {
      certificationLevel = "gold";
    } else if (finalScore >= 85) {
      certificationLevel = "silver";
    }

    // Check if eligible for certification
    if (!agent.sdk_connected || finalScore < 70) {
      return NextResponse.json(
        { error: "System does not meet minimum certification requirements (SDK must be connected and score >= 70%)" },
        { status: 400 }
      );
    }

    // Generate certificate ID
    const certId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Calculate validity dates
    const issuedAt = new Date();
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1); // Valid for 1 year

    // Generate QR code for verification
    const verifyUrl = `https://protectron.ai/verify/${certId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#1f2937",
        light: "#ffffff",
      },
    });

    // Prepare certificate data
    const certificateData: CertificateData = {
      certId,
      systemName: agent.name,
      organizationName: organization?.name || "Unknown Organization",
      organizationLogo: organization?.logo_url || undefined,
      complianceScore: Math.round(finalScore * 10) / 10,
      certificationLevel,
      issuedAt: issuedAt.toISOString(),
      validUntil: validUntil.toISOString(),
      requirements: {
        total: totalRequirements || 0,
        completed: completedRequirements,
      },
      checks: {
        sdkConnected: agent.sdk_connected || false,
        hitlRulesActive: (hitlRulesCount || 0) >= 1,
        noOpenIncidents: (openIncidentsCount || 0) === 0,
        loggingActive: (eventsCount || 0) > 0,
      },
      qrCodeDataUrl,
    };

    // Generate PDF
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfDoc = pdf(React.createElement(CertificateDocument, { data: certificateData }) as any);
    const pdfBlob = await pdfDoc.toBlob();
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Upload to Supabase Storage
    const fileName = `certificates/${profile.organization_id}/${id}/${certId}.pdf`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading certificate:", uploadError);
      // Continue anyway - we can still return the PDF
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    // Save or update certification record
    const { data: existingCert } = await supabase
      .from("ai_system_certifications")
      .select("id")
      .eq("ai_system_id", id)
      .single();

    const certRecord = {
      ai_system_id: id,
      cert_id: certId,
      compliance_score: Math.round(finalScore * 10) / 10,
      status: "active",
      certified_at: issuedAt.toISOString(),
      valid_until: validUntil.toISOString(),
      next_verification_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      requirements_snapshot: {
        total: totalRequirements || 0,
        completed: completedRequirements,
        checks: certificateData.checks,
      },
    };

    if (existingCert) {
      await supabase
        .from("ai_system_certifications")
        .update(certRecord)
        .eq("id", existingCert.id);
    } else {
      await supabase
        .from("ai_system_certifications")
        .insert(certRecord);
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: id,
      user_id: user.id,
      action_type: "certificate_generated",
      action_description: `Generated ${certificationLevel} compliance certificate for ${agent.name}`,
    });

    // Return the PDF as a download or the certificate data
    const returnPdf = request.nextUrl.searchParams.get("download") === "true";

    if (returnPdf) {
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${agent.name.replace(/\s+/g, "-")}-certificate-${certId}.pdf"`,
        },
      });
    }

    return NextResponse.json({
      data: {
        certId,
        certificateUrl: urlData?.publicUrl || null,
        downloadUrl: `/api/v1/agents/${id}/certificate/generate?download=true`,
        issuedAt: issuedAt.toISOString(),
        validUntil: validUntil.toISOString(),
        certificationLevel,
        complianceScore: Math.round(finalScore * 10) / 10,
        verifyUrl,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/certificate/generate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
