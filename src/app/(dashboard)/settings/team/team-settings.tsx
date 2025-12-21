"use client";

import { useState, useEffect, useCallback } from "react";
import { Add } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { useToast } from "@/components/base/toast/toast";
import { InviteMemberModal } from "./invite-member-modal";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar: string;
  isCurrentUser?: boolean;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  invitedAt: string;
}

const roleConfig = {
  owner: { label: "Owner", color: "purple" as const },
  admin: { label: "Admin", color: "blue" as const },
  member: { label: "Member", color: "gray" as const },
};

export const TeamSettings = () => {
  const { addToast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [maxMembers, setMaxMembers] = useState(5);
  const [userRole, setUserRole] = useState<string>("member");
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const fetchTeamData = useCallback(async () => {
    try {
      // Fetch members
      const membersRes = await fetch("/api/v1/team/members");
      if (membersRes.ok) {
        const { data, userRole: role, maxMembers: max } = await membersRes.json();
        setMembers(data || []);
        setUserRole(role || "member");
        setMaxMembers(max || 5);
      }

      // Fetch pending invites
      const invitesRes = await fetch("/api/v1/team/invites");
      if (invitesRes.ok) {
        const { data } = await invitesRes.json();
        const transformedInvites = (data || []).map((invite: any) => ({
          id: invite.id,
          email: invite.email,
          role: invite.role,
          invitedAt: new Date(invite.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));
        setPendingInvites(transformedInvites);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  const canInvite = userRole === "owner" || userRole === "admin";

  const handleResendInvite = async (id: string, email: string) => {
    try {
      const response = await fetch(`/api/v1/team/invites/${id}`, {
        method: "POST",
      });
      if (response.ok) {
        addToast({
          title: "Invite resent",
          message: `Invitation resent to ${email}.`,
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error resending invite:", error);
    }
  };

  const handleCancelInvite = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/team/invites/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPendingInvites((prev) => prev.filter((inv) => inv.id !== id));
        addToast({
          title: "Invite cancelled",
          message: "The invitation has been cancelled.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error cancelling invite:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-32 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-secondary pb-5">
            <div>
              <h2 className="text-lg font-semibold text-primary">Team Members</h2>
              <p className="mt-1 text-sm text-tertiary">
                Manage your team members and their access levels. ({members.length} of {maxMembers})
              </p>
            </div>
            {canInvite && (
              <Button
                color="primary"
                size="md"
                iconLeading={({ className }) => <Add size={18} color="currentColor" className={className} />}
                onClick={() => setIsInviteModalOpen(true)}
              >
                Invite Member
              </Button>
            )}
          </div>

          {/* Team Members - Two column layout */}
          <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
            <div>
              <label className="text-sm font-medium text-secondary">Active Members</label>
              <p className="mt-0.5 text-xs text-tertiary">People with access to this workspace</p>
            </div>
            <div>
              <TableCard.Root>
                <Table aria-label="Team Members" selectionMode="none">
                  <Table.Header>
                    <Table.Head id="member" isRowHeader label="Member" />
                    <Table.Head id="role" label="Role" />
                    <Table.Head id="email" label="Email" />
                    <Table.Head id="actions" label="" />
                  </Table.Header>
                  <Table.Body items={members}>
                    {(member: TeamMember) => (
                      <Table.Row id={member.id} className="odd:bg-secondary_subtle">
                        <Table.Cell>
                          <div className="flex items-center gap-3">
                            <Avatar size="sm" src={member.avatar} alt={member.name} />
                            <div>
                              <p className="text-sm font-medium text-primary">
                                {member.name}
                                {member.isCurrentUser && (
                                  <span className="ml-2 text-xs text-tertiary">(you)</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge size="sm" color={roleConfig[member.role].color}>
                            {roleConfig[member.role].label}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-sm text-tertiary">{member.email}</span>
                        </Table.Cell>
                        <Table.Cell className="px-4">
                          {!member.isCurrentUser && <TableRowActionsDropdown />}
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </TableCard.Root>
            </div>
          </div>

          <hr className="h-px w-full border-none bg-border-secondary" />

          {/* Pending Invitations - Two column layout */}
          <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
            <div>
              <label className="text-sm font-medium text-secondary">Pending Invitations</label>
              <p className="mt-0.5 text-xs text-tertiary">Invites awaiting acceptance</p>
            </div>
            <div>
              {pendingInvites.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between rounded-lg border border-secondary bg-secondary_subtle p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                          <span className="text-xs font-medium text-gray-600">
                            {invite.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-primary">{invite.email}</p>
                          <p className="text-xs text-tertiary">Invited {invite.invitedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          color="secondary"
                          onClick={() => handleResendInvite(invite.id, invite.email)}
                        >
                          Resend
                        </Button>
                        <Button
                          size="sm"
                          color="tertiary"
                          onClick={() => handleCancelInvite(invite.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-tertiary">No pending invitations</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        userRole={userRole}
        onInviteSent={() => {
          fetchTeamData();
          addToast({
            title: "Invitation sent",
            message: "The team member invitation has been sent.",
            type: "success",
          });
        }}
      />
    </div>
  );
};

export default TeamSettings;
