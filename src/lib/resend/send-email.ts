import { resend, FROM_EMAIL } from "./client";
import { TeamInviteEmail } from "./templates/team-invite";
import { render } from "@react-email/components";

interface SendTeamInviteParams {
  to: string;
  inviterName: string;
  organizationName: string;
  role: string;
  inviteToken: string;
}

export async function sendTeamInviteEmail({
  to,
  inviterName,
  organizationName,
  role,
  inviteToken,
}: SendTeamInviteParams): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn("Resend not configured, skipping email send");
    return { success: false, error: "Email service not configured" };
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://protectron.ai"}/invite/${inviteToken}`;

  try {
    const emailHtml = await render(
      TeamInviteEmail({
        inviteUrl,
        inviterName,
        organizationName,
        recipientEmail: to,
        role: role.charAt(0).toUpperCase() + role.slice(1),
      })
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `${inviterName} invited you to join ${organizationName} on Protectron`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending team invite email:", error);
      return { success: false, error: error.message };
    }

    console.log("Team invite email sent successfully:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending team invite email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
