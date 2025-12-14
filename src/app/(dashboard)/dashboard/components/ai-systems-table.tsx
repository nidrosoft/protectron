"use client";

import { Cpu } from "iconsax-react";
import { Plus, Eye, Edit05, Upload01, CheckCircle } from "@untitledui/icons";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Table, TableCard } from "@/components/application/table/table";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { riskLevelConfig, statusConfig } from "../data/mock-data";

interface AISystem {
  id: string;
  name: string;
  riskLevel: "high" | "limited" | "minimal";
  status: "compliant" | "in_progress" | "not_started";
  progress: number;
  requirements: { completed: number; total: number };
  deadline: string | null;
}

interface AISystemsTableProps {
  systems: AISystem[];
}

export const AISystemsTable = ({ systems }: AISystemsTableProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Compliance by AI System</h2>
        <Button size="sm" color="secondary" iconLeading={Plus} href="/ai-systems/new">
          Add System
        </Button>
      </div>

      <TableCard.Root>
        <Table aria-label="AI Systems">
          <Table.Header>
            <Table.Head id="name" isRowHeader label="AI System" className="w-full" />
            <Table.Head id="risk" label="Risk Level" />
            <Table.Head id="status" label="Status" />
            <Table.Head id="progress" label="Progress" className="min-w-32" />
            <Table.Head id="deadline" label="Deadline" />
            <Table.Head id="actions" label="" className="w-12" />
          </Table.Header>
          <Table.Body items={systems}>
            {(system) => (
              <Table.Row id={system.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Cpu size={20} color="currentColor" className="text-gray-600" variant="Linear" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{system.name}</p>
                      <p className="text-sm text-tertiary">
                        {system.requirements.completed}/{system.requirements.total} requirements
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <BadgeWithDot
                    size="sm"
                    type="modern"
                    color={riskLevelConfig[system.riskLevel].color}
                  >
                    {riskLevelConfig[system.riskLevel].label}
                  </BadgeWithDot>
                </Table.Cell>
                <Table.Cell>
                  <BadgeWithDot
                    size="sm"
                    type="modern"
                    color={statusConfig[system.status].color}
                  >
                    {statusConfig[system.status].label}
                  </BadgeWithDot>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <ProgressBarBase value={system.progress} className="w-20" />
                    <span className="text-sm font-medium text-secondary">{system.progress}%</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {system.deadline ? (
                    <span className="text-sm text-warning-600 font-medium">
                      {system.deadline}
                    </span>
                  ) : (
                    <span className="text-sm text-tertiary">—</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Dropdown.Root>
                    <Dropdown.DotsButton />
                    <Dropdown.Popover>
                      <Dropdown.Menu>
                        <Dropdown.Item label="View Details" icon={Eye} href={`/ai-systems/${system.id}`} />
                        <Dropdown.Item label="Edit System" icon={Edit05} onAction={() => {}} />
                        <Dropdown.Item label="Upload Evidence" icon={Upload01} onAction={() => {}} />
                        <Dropdown.Separator />
                        <Dropdown.Item label="Mark Complete" icon={CheckCircle} onAction={() => {}} />
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown.Root>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableCard.Root>
    </div>
  );
};

export default AISystemsTable;
