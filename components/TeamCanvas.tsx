"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { trpc } from "@/lib/trpc";
import { TeamColumn } from "./TeamColumn";
import { TeamModal } from "./TeamModal";
import { RoleCard } from "./RoleCard";
import type { Role } from "@prisma/client";

export function TeamCanvas() {
  const { data: teams = [], isLoading } = trpc.team.list.useQuery();
  const utils = trpc.useUtils();
  const assignRole = trpc.teamRole.assign.useMutation({
    onSuccess: () => void utils.team.list.invalidate(),
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.role) setActiveRole(data.role as Role);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveRole(null);
    const { active, over } = event;
    if (!over) return;

    const roleData = active.data.current?.role as Role | undefined;
    const teamId = over.data.current?.teamId as string | undefined;

    if (roleData && teamId) {
      assignRole.mutate({ teamId, roleId: roleData.id });
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No teams yet. Add a team to get started.</p>
            </div>
          ) : (
            <div className="flex gap-6 pb-6">
              {teams.map((team) => (
                <TeamColumn key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            + Add Team
          </button>
        </div>
      </main>
      <DragOverlay>
        {activeRole ? (
          <RoleCard role={activeRole} isDraggable={false} />
        ) : null}
      </DragOverlay>
      <TeamModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        team={null}
      />
    </DndContext>
  );
}
