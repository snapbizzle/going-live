"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Role } from "@prisma/client";

interface RoleCardProps {
  role: Role;
  onClick?: () => void;
  isDraggable?: boolean;
}

export function RoleCard({ role, onClick, isDraggable = true }: RoleCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `role-${role.id}`,
    data: { role },
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDraggable ? { ...listeners, ...attributes } : {})}
      onClick={onClick}
      className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-red-500"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{role.name}</p>
        {role.category && (
          <p className="text-xs text-gray-500 truncate">{role.category}</p>
        )}
      </div>
    </div>
  );
}
