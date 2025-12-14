"use client";

import { useState } from "react";
import { Add } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { useToast } from "@/components/base/toast/toast";

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
  invitedAt: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Cyriac Gbogou",
    email: "cyriac@acme.com",
    role: "owner",
    avatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    isCurrentUser: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@acme.com",
    role: "admin",
    avatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
  },
  {
    id: "3",
    name: "Marcus Chen",
    email: "marcus@acme.com",
    role: "member",
    avatar: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
  },
];

const mockPendingInvites: PendingInvite[] = [
  {
    id: "inv-1",
    email: "elena@acme.com",
    invitedAt: "Dec 10, 2024",
  },
];

const roleConfig = {
  owner: { label: "Owner", color: "purple" as const },
  admin: { label: "Admin", color: "blue" as const },
  member: { label: "Member", color: "gray" as const },
};

export const TeamSettings = () => {
  const { addToast } = useToast();
  const [members] = useState<TeamMember[]>(mockTeamMembers);
  const [pendingInvites] = useState<PendingInvite[]>(mockPendingInvites);
  const maxMembers = 5;

  const handleInvite = () => {
    addToast({
      title: "Invite Member",
      message: "Invite member modal would open here.",
      type: "info",
    });
  };

  const handleResendInvite = (email: string) => {
    addToast({
      title: "Invite resent",
      message: `Invitation resent to ${email}.`,
      type: "success",
    });
  };

  const handleCancelInvite = (id: string) => {
    addToast({
      title: "Invite cancelled",
      message: "The invitation has been cancelled.",
      type: "warning",
    });
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-secondary pb-5">
            <div>
              <h2 className="text-lg font-semibold text-primary">Team Members</h2>
              <p className="mt-1 text-sm text-tertiary">
                Manage your team members and their access levels. ({members.length} of {maxMembers})
              </p>
            </div>
            <Button
              color="primary"
              size="md"
              iconLeading={({ className }) => <Add size={18} color="currentColor" className={className} />}
              onClick={handleInvite}
            >
              Invite Member
            </Button>
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
                          onClick={() => handleResendInvite(invite.email)}
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
    </div>
  );
};

export default TeamSettings;
