"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { TeamColumn } from "./TeamColumn";
import { TeamModal } from "./TeamModal";
import { RoleCard } from "./RoleCard";

interface Role {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  defaultNotes?: string | null;
}

export function TeamCanvas() {
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  const { data: teams = [], isLoading } = trpc.team.getAll.useQuery();
  const utils = trpc.useUtils();

  const assignRole = trpc.teamRole.assign.useMutation({
    onSuccess: () => utils.team.getAll.invalidate(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { data } = event.active;
    if (data.current?.type === "role") {
      setActiveRole(data.current.role as Role);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveRole(null);
    const { active, over } = event;

    if (!over) return;

    const dragData = active.data.current;
    const dropData = over.data.current;

    if (dragData?.type === "role" && dropData?.type === "team") {
      const role = dragData.role as Role;
      const teamId = dropData.teamId as string;

      assignRole.mutate({ teamId, roleId: role.id });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-6">
        <div className="flex items-start gap-4 min-h-full">
          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <p className="text-gray-400">Loading teams...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center text-gray-400">
                <p className="mb-2">No teams yet</p>
                <p className="text-sm">Click &quot;Add Team&quot; to get started</p>
              </div>
            </div>
          ) : (
            teams.map((team) => <TeamColumn key={team.id} team={team} />)
          )}

          {/* Add Team Button */}
          <button
            onClick={() => setIsAddTeamOpen(true)}
            className="flex-shrink-0 flex flex-col items-center justify-center w-48 min-h-32 border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors"
          >
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-sm font-medium">Add Team</span>
          </button>
        </div>
      </main>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeRole ? (
          <RoleCard role={activeRole} isDraggable={false} />
        ) : null}
      </DragOverlay>

      {/* Add Team Modal */}
      <TeamModal
        isOpen={isAddTeamOpen}
        onClose={() => setIsAddTeamOpen(false)}
        mode="create"
      />
    </DndContext>
  );
}
