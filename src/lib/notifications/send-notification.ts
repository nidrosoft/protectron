import { createClient } from "@/lib/supabase/server";

type NotificationType =
  | "team-invite"
  | "team-member-joined"
  | "team-member-removed"
  | "team-role-changed"
  | "document-generated"
  | "compliance-update"
  | "deadline-reminder"
  | "incident-created"
  | "incident-resolved"
  | "security-alert"
  | "billing-payment-success"
  | "billing-payment-failed";

interface BaseNotificationPayload {
  type: NotificationType;
  to: string;
  userId?: string;
}

interface TeamInvitePayload extends BaseNotificationPayload {
  type: "team-invite";
  inviterName: string;
  organizationName: string;
  role: string;
  inviteToken: string;
}

interface TeamMemberJoinedPayload extends BaseNotificationPayload {
  type: "team-member-joined";
  memberName: string;
  memberEmail: string;
  organizationName: string;
  role: string;
}

interface TeamMemberRemovedPayload extends BaseNotificationPayload {
  type: "team-member-removed";
  memberName: string;
  organizationName: string;
}

interface TeamRoleChangedPayload extends BaseNotificationPayload {
  type: "team-role-changed";
  memberName: string;
  organizationName: string;
  oldRole: string;
  newRole: string;
}

interface DocumentGeneratedPayload extends BaseNotificationPayload {
  type: "document-generated";
  documentName: string;
  documentType: string;
  aiSystemName: string;
}

interface ComplianceUpdatePayload extends BaseNotificationPayload {
  type: "compliance-update";
  updateTitle: string;
  updateDescription: string;
}

interface DeadlineReminderPayload extends BaseNotificationPayload {
  type: "deadline-reminder";
  deadlineTitle: string;
  deadlineDate: string;
  daysRemaining: number;
}

interface IncidentPayload extends BaseNotificationPayload {
  type: "incident-created" | "incident-resolved";
  incidentTitle: string;
  incidentSeverity: string;
  aiSystemName: string;
}

interface SecurityAlertPayload extends BaseNotificationPayload {
  type: "security-alert";
  alertType: string;
  alertDescription: string;
}

interface BillingPayload extends BaseNotificationPayload {
  type: "billing-payment-success" | "billing-payment-failed";
  amount: string;
  planName: string;
  invoiceUrl?: string;
}

export type NotificationPayload =
  | TeamInvitePayload
  | TeamMemberJoinedPayload
  | TeamMemberRemovedPayload
  | TeamRoleChangedPayload
  | DocumentGeneratedPayload
  | ComplianceUpdatePayload
  | DeadlineReminderPayload
  | IncidentPayload
  | SecurityAlertPayload
  | BillingPayload;

/**
 * Send a notification email via the Edge Function
 * The Edge Function will check user preferences before sending
 */
export async function sendNotification(
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`;

    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to send notification:", result);
      return { success: false, error: result.error || "Failed to send notification" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}

/**
 * Send notification to all admins/owners of an organization
 * The profiles.id is the same as auth.users.id
 */
export async function notifyOrganizationAdmins(
  organizationId: string,
  payload: Omit<NotificationPayload, "to" | "userId">
): Promise<void> {
  try {
    const supabase = await createClient();

    // Get all admins and owners of the organization
    const { data: admins, error } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("organization_id", organizationId)
      .in("role", ["owner", "admin"]);

    if (error || !admins) {
      console.error("Error fetching organization admins:", error);
      return;
    }

    // Get emails from auth.users for each admin
    for (const admin of admins) {
      const { data: userData } = await supabase.auth.admin.getUserById(admin.id);
      if (userData?.user?.email) {
        await sendNotification({
          ...payload,
          to: userData.user.email,
          userId: admin.id,
        } as NotificationPayload);
      }
    }
  } catch (error) {
    console.error("Error notifying organization admins:", error);
  }
}

/**
 * Send notification to all members of an organization
 */
export async function notifyOrganizationMembers(
  organizationId: string,
  payload: Omit<NotificationPayload, "to" | "userId">,
  excludeUserId?: string
): Promise<void> {
  try {
    const supabase = await createClient();

    // Get all members of the organization
    let query = supabase
      .from("profiles")
      .select("id, full_name")
      .eq("organization_id", organizationId);

    if (excludeUserId) {
      query = query.neq("id", excludeUserId);
    }

    const { data: members, error } = await query;

    if (error || !members) {
      console.error("Error fetching organization members:", error);
      return;
    }

    // Get emails from auth.users for each member
    for (const member of members) {
      const { data: userData } = await supabase.auth.admin.getUserById(member.id);
      if (userData?.user?.email) {
        await sendNotification({
          ...payload,
          to: userData.user.email,
          userId: member.id,
        } as NotificationPayload);
      }
    }
  } catch (error) {
    console.error("Error notifying organization members:", error);
  }
}
