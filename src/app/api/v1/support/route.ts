import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend/client";

const SUPPORT_EMAIL = "support@protectron.ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, subject, description, category, priority, userEmail, userName } = body;

    if (!subject || !description || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!resend) {
      console.warn("Resend not configured, skipping email notification");
      return NextResponse.json({ success: true, emailSent: false });
    }

    // Send email notification to support team
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: SUPPORT_EMAIL,
      replyTo: userEmail,
      subject: `[Support Ticket] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Support Ticket</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Ticket ID:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${ticketId || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">From:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${userName || "Unknown"} (${userEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Category:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${category || "General"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Priority:</td>
                  <td style="padding: 8px 0;">
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 500; ${
                      priority === "urgent" 
                        ? "background: #fef2f2; color: #dc2626;" 
                        : priority === "high"
                        ? "background: #fff7ed; color: #ea580c;"
                        : priority === "normal"
                        ? "background: #f0fdf4; color: #16a34a;"
                        : "background: #f3f4f6; color: #6b7280;"
                    }">
                      ${priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "Normal"}
                    </span>
                  </td>
                </tr>
              </table>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              
              <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 14px;">Subject</h3>
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 14px;">${subject}</p>
              
              <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 14px;">Description</h3>
              <p style="margin: 0; color: #374151; font-size: 14px; white-space: pre-wrap;">${description}</p>
            </div>
            
            <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 12px; text-align: center;">
              Reply directly to this email to respond to the customer.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Failed to send support email:", error);
      return NextResponse.json(
        { error: "Failed to send email notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error("Support email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
