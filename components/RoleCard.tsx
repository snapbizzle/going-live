"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  defaultNotes?: string | null;
}

interface RoleCardProps {
  role: Role;
  onClick?: () => void;
  isDraggable?: boolean;
  compact?: boolean;
}

export function RoleCard({
  role,
  onClick,
  isDraggable = true,
  compact = false,
}: RoleCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `role-${role.id}`,
      data: { type: "role", role },
      disabled: !isDraggable,
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white border border-gray-200 rounded-md border-l-4 border-l-red-600 shadow-sm",
        "flex items-center gap-2 cursor-pointer hover:shadow-md transition-shadow",
        compact ? "px-2 py-1.5" : "px-3 py-2",
        isDragging && "opacity-50 shadow-lg ring-2 ring-red-300"
      )}
      onClick={onClick}
    >
      {isDraggable && (
        <div
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium text-gray-800 truncate",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {role.name}
        </p>
        {!compact && role.category && (
          <p className="text-xs text-gray-500 truncate">{role.category}</p>
        )}
      </div>
    </div>
  );
}
