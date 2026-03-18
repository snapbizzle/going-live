"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { RoleCard } from "./RoleCard";
import { RoleModal } from "./RoleModal";
import { TeamModal } from "./TeamModal";

interface Role {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  defaultNotes?: string | null;
}

interface TeamRole {
  id: string;
  roleId: string;
  notes?: string | null;
  role: Role;
}

interface Supply {
  id: string;
  item: string;
  quantity: number;
}

interface Team {
  id: string;
  name: string;
  units: string[];
  areas: string[];
  teamRoles: TeamRole[];
  supplies: Supply[];
}

interface TeamColumnProps {
  team: Team;
}

export function TeamColumn({ team }: TeamColumnProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `team-${team.id}`,
    data: { type: "team", teamId: team.id },
  });

  const utils = trpc.useUtils();
  const removeTeamRole = trpc.teamRole.remove.useMutation({
    onSuccess: () => utils.team.getAll.invalidate(),
  });

  return (
    <>
      <div className="flex flex-col w-48 flex-shrink-0">
        {/* Team Header */}
        <button
          className="w-full flex items-center justify-between px-3 py-2 bg-red-600 text-white rounded-t-md hover:bg-red-700 transition-colors"
          onClick={() => setIsTeamModalOpen(true)}
        >
          <span className="font-semibold text-sm truncate">{team.name}</span>
          <ChevronDown className="w-4 h-4 flex-shrink-0 ml-1" />
        </button>

        {/* Drop Zone */}
        <div
          ref={setNodeRef}
          className={cn(
            "flex-1 min-h-32 p-2 space-y-2 rounded-b-md border border-t-0 border-gray-200 bg-white",
            isOver && "bg-red-50 border-red-300 border-dashed"
          )}
        >
          {team.teamRoles.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">
              Drop roles here
            </p>
          ) : (
            team.teamRoles.map((tr) => (
              <div key={tr.id} className="group relative">
                <RoleCard
                  role={tr.role}
                  compact
                  onClick={() => setSelectedRole(tr.role)}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTeamRole.mutate({ id: tr.id });
                  }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center hover:bg-red-700"
                  title="Remove from team"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Role Modal */}
      {selectedRole && (
        <RoleModal
          isOpen={true}
          onClose={() => setSelectedRole(null)}
          role={selectedRole}
          mode="view"
        />
      )}

      {/* Team Modal */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        team={team}
      />
    </>
  );
}
