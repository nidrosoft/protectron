/**
 * Compliance Badge SVG Generator
 *
 * Generates an embeddable SVG badge for verified EU AI Act compliance.
 * Publicly accessible — anyone with the cert ID can view/embed the badge.
 *
 * GET /api/badges/[certId]?style=standard|compact|detailed
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface CertData {
  certificate_number: string;
  ai_system_name: string;
  risk_level: string;
  compliance_score: number;
  status: string;
  issued_at: string;
  expires_at: string;
  badge_color: string;
  organizations: { name: string } | null;
}

function getRiskColor(level: string): string {
  switch (level) {
    case "minimal":
      return "#12B76A";
    case "limited":
      return "#7F56D9";
    case "high":
      return "#F79009";
    case "prohibited":
      return "#F04438";
    default:
      return "#667085";
  }
}

function generateStandardBadge(cert: CertData): string {
  const riskColor = getRiskColor(cert.risk_level);
  const orgName = cert.organizations?.name || "Organization";
  const issuedDate = new Date(cert.issued_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="120" viewBox="0 0 280 120" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="280" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FAFAFA"/>
      <stop offset="100%" stop-color="#F5F5F5"/>
    </linearGradient>
    <filter id="shadow" x="-4" y="-2" width="288" height="128">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="280" height="120" rx="12" fill="url(#bg)" filter="url(#shadow)" stroke="#E4E7EC" stroke-width="1"/>
  
  <!-- Left accent bar -->
  <rect x="0" y="0" width="4" height="120" rx="2" fill="${cert.badge_color}"/>
  
  <!-- Shield icon -->
  <g transform="translate(20, 20)">
    <circle cx="20" cy="20" r="20" fill="${cert.badge_color}" opacity="0.1"/>
    <path d="M20 8L10 13V20C10 26.5 14.3 32.4 20 34C25.7 32.4 30 26.5 30 20V13L20 8Z" fill="${cert.badge_color}"/>
    <path d="M17 21L19.5 23.5L24 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  
  <!-- Title -->
  <text x="68" y="30" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="700" fill="#101828">EU AI Act Compliant</text>
  
  <!-- System name -->
  <text x="68" y="48" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#475467">${escapeXml(truncate(cert.ai_system_name, 28))}</text>
  
  <!-- Risk level badge -->
  <rect x="68" y="56" width="${cert.risk_level.length * 7 + 30}" height="18" rx="9" fill="${riskColor}" opacity="0.1"/>
  <circle cx="77" cy="65" r="3" fill="${riskColor}"/>
  <text x="84" y="69" font-family="Inter, system-ui, sans-serif" font-size="9" font-weight="600" fill="${riskColor}" text-transform="capitalize">${capitalize(cert.risk_level)} Risk</text>
  
  <!-- Score -->
  <text x="220" y="42" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="800" fill="${cert.badge_color}" text-anchor="middle">${cert.compliance_score}%</text>
  <text x="220" y="55" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#667085" text-anchor="middle">Score</text>
  
  <!-- Footer -->
  <line x1="16" y1="88" x2="264" y2="88" stroke="#E4E7EC" stroke-width="1"/>
  <text x="16" y="106" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#98A2B3">Cert: ${cert.certificate_number}</text>
  <text x="264" y="106" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#98A2B3" text-anchor="end">Verified by ComplyAI · ${issuedDate}</text>
</svg>`;
}

function generateCompactBadge(cert: CertData): string {
  const riskColor = getRiskColor(cert.risk_level);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="36" viewBox="0 0 200 36" fill="none">
  <rect width="200" height="36" rx="18" fill="#FAFAFA" stroke="#E4E7EC" stroke-width="1"/>
  
  <!-- Shield -->
  <circle cx="18" cy="18" r="12" fill="${cert.badge_color}" opacity="0.1"/>
  <path d="M18 10L12 13.5V18C12 22.25 14.7 26.15 18 27.25C21.3 26.15 24 22.25 24 18V13.5L18 10Z" fill="${cert.badge_color}"/>
  <path d="M16 18.5L17.5 20L20.5 16.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Text -->
  <text x="36" y="15" font-family="Inter, system-ui, sans-serif" font-size="9" font-weight="700" fill="#101828">EU AI Act Compliant</text>
  <text x="36" y="27" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#667085">${cert.certificate_number}</text>
  
  <!-- Score circle -->
  <circle cx="175" cy="18" r="13" fill="${riskColor}" opacity="0.1"/>
  <text x="175" y="22" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="800" fill="${riskColor}" text-anchor="middle">${cert.compliance_score}%</text>
</svg>`;
}

function generateDetailedBadge(cert: CertData): string {
  const riskColor = getRiskColor(cert.risk_level);
  const orgName = cert.organizations?.name || "Organization";
  const issuedDate = new Date(cert.issued_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const expiresDate = new Date(cert.expires_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://complyai.eu"}/verify/${cert.certificate_number}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="200" viewBox="0 0 340 200" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="340" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FAFAFA"/>
      <stop offset="100%" stop-color="#F2F4F7"/>
    </linearGradient>
  </defs>

  <rect width="340" height="200" rx="16" fill="url(#bg)" stroke="#E4E7EC" stroke-width="1"/>
  <rect x="0" y="0" width="340" height="4" rx="2" fill="${cert.badge_color}"/>

  <!-- Header -->
  <g transform="translate(20, 20)">
    <circle cx="18" cy="18" r="18" fill="${cert.badge_color}" opacity="0.12"/>
    <path d="M18 7L8 12V19C8 25.5 12.3 31.4 18 33C23.7 31.4 28 25.5 28 19V12L18 7Z" fill="${cert.badge_color}"/>
    <path d="M15 20L17.5 22.5L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  
  <text x="64" y="30" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="700" fill="#101828">EU AI Act Compliance Certificate</text>
  <text x="64" y="48" font-family="Inter, system-ui, sans-serif" font-size="10" fill="#475467">Verified by ComplyAI</text>

  <!-- Divider -->
  <line x1="20" y1="62" x2="320" y2="62" stroke="#E4E7EC" stroke-width="1"/>

  <!-- Details -->
  <text x="20" y="82" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#98A2B3">ORGANIZATION</text>
  <text x="20" y="96" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" fill="#344054">${escapeXml(truncate(orgName, 30))}</text>

  <text x="200" y="82" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#98A2B3">AI SYSTEM</text>
  <text x="200" y="96" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="600" fill="#344054">${escapeXml(truncate(cert.ai_system_name, 20))}</text>

  <text x="20" y="120" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#98A2B3">RISK LEVEL</text>
  <rect x="20" y="126" width="${cert.risk_level.length * 6 + 24}" height="16" rx="8" fill="${riskColor}" opacity="0.1"/>
  <text x="32" y="137" font-family="Inter, system-ui, sans-serif" font-size="9" font-weight="600" fill="${riskColor}">${capitalize(cert.risk_level)}</text>

  <text x="200" y="120" font-family="Inter, system-ui, sans-serif" font-size="9" fill="#98A2B3">COMPLIANCE SCORE</text>
  <text x="200" y="140" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="800" fill="${cert.badge_color}">${cert.compliance_score}%</text>

  <!-- Footer -->
  <line x1="20" y1="158" x2="320" y2="158" stroke="#E4E7EC" stroke-width="1"/>
  
  <text x="20" y="176" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#98A2B3">Certificate: ${cert.certificate_number}</text>
  <text x="20" y="190" font-family="Inter, system-ui, sans-serif" font-size="8" fill="#98A2B3">Issued: ${issuedDate} · Expires: ${expiresDate}</text>
  <text x="320" y="190" font-family="Inter, system-ui, sans-serif" font-size="8" fill="${cert.badge_color}" text-anchor="end">Verify at complyai.eu</text>
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.substring(0, max - 1) + "…" : str;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certId: string }> }
) {
  try {
    const { certId } = await params;
    const style =
      (req.nextUrl.searchParams.get("style") as "standard" | "compact" | "detailed") ||
      "standard";
    const format = req.nextUrl.searchParams.get("format") || "svg";

    // Use service role key for public badge access (no auth required)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: cert, error } = await supabase
      .from("compliance_certifications")
      .select(
        `
        certificate_number,
        ai_system_name,
        risk_level,
        compliance_score,
        status,
        issued_at,
        expires_at,
        badge_color,
        organizations (name)
      `
      )
      .or(`id.eq.${certId},certificate_number.eq.${certId}`)
      .eq("status", "active")
      .single();

    if (error || !cert) {
      // Return a "not found" badge
      const notFoundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="36" viewBox="0 0 200 36" fill="none">
        <rect width="200" height="36" rx="18" fill="#FEF3F2" stroke="#FEC8C8" stroke-width="1"/>
        <text x="100" y="22" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="600" fill="#D92D20" text-anchor="middle">Certificate Not Found</text>
      </svg>`;

      return new NextResponse(notFoundSvg, {
        status: 404,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    const certData = cert as unknown as CertData;

    // Check expiration
    if (new Date(certData.expires_at) < new Date()) {
      const expiredSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="36" viewBox="0 0 200 36" fill="none">
        <rect width="200" height="36" rx="18" fill="#FFFAEB" stroke="#FEDF89" stroke-width="1"/>
        <text x="100" y="22" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="600" fill="#B54708" text-anchor="middle">Certificate Expired</text>
      </svg>`;

      return new NextResponse(expiredSvg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Generate badge SVG based on style
    let svg: string;
    switch (style) {
      case "compact":
        svg = generateCompactBadge(certData);
        break;
      case "detailed":
        svg = generateDetailedBadge(certData);
        break;
      default:
        svg = generateStandardBadge(certData);
    }

    if (format === "json") {
      return NextResponse.json({
        certificateNumber: certData.certificate_number,
        aiSystemName: certData.ai_system_name,
        riskLevel: certData.risk_level,
        complianceScore: certData.compliance_score,
        status: certData.status,
        issuedAt: certData.issued_at,
        expiresAt: certData.expires_at,
        organization: certData.organizations?.name,
      });
    }

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Badge generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
