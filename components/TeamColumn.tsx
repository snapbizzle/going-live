"use client";

import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import type { Team, Supply, TeamRole, Role } from "@prisma/client";
import { TeamModal } from "./TeamModal";

interface TeamRoleWithRole extends TeamRole {
  role: Role;
}

interface TeamWithRelations extends Team {
  supplies: Supply[];
  teamRoles: TeamRoleWithRole[];
}

interface TeamColumnProps {
  team: TeamWithRelations;
}

export function TeamColumn({ team }: TeamColumnProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const utils = trpc.useUtils();
  const removeRole = trpc.teamRole.remove.useMutation({
    onSuccess: () => void utils.team.list.invalidate(),
  });

  const { setNodeRef, isOver } = useDroppable({
    id: `team-${team.id}`,
    data: { teamId: team.id },
  });

  return (
    <>
      <div
        className={`flex flex-col w-56 flex-shrink-0 border border-gray-200 rounded-lg bg-white shadow-sm ${isOver ? "ring-2 ring-red-400" : ""}`}
      >
        <div
          className="flex items-center justify-between px-4 py-3 bg-red-600 rounded-t-lg cursor-pointer"
          onClick={() => setIsEditOpen(true)}
        >
          <span className="text-sm font-semibold text-white truncate">{team.name}</span>
          <span className="text-white text-xs ml-2">✏️</span>
        </div>
        <div
          ref={setNodeRef}
          className={`flex-1 p-3 space-y-2 min-h-[120px] ${isOver ? "bg-red-50" : ""}`}
        >
          {team.teamRoles.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">Drop roles here</p>
          ) : (
            team.teamRoles.map((tr) => (
              <div
                key={tr.id}
                className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded border-l-4 border-l-red-400"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{tr.role.name}</p>
                  {tr.role.category && (
                    <p className="text-xs text-gray-400">{tr.role.category}</p>
                  )}
                </div>
                <button
                  onClick={() => removeRole.mutate({ id: tr.id })}
                  className="ml-1 text-gray-400 hover:text-red-500 text-xs"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <TeamModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        team={team}
      />
    </>
  );
}
