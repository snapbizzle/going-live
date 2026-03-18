"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { RoleCard } from "./RoleCard";
import { RoleModal } from "./RoleModal";

export function RolePool() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: roles = [], isLoading } = trpc.role.getAll.useQuery();

  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? null;

  return (
    <>
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <button
            className="flex items-center gap-1 font-semibold text-sm text-gray-700 hover:text-gray-900"
            onClick={() => setIsCollapsed((c) => !c)}
          >
            Role Pool
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Loading...
              </p>
            ) : roles.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No roles yet
              </p>
            ) : (
              roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onClick={() => setSelectedRoleId(role.id)}
                />
              ))
            )}
          </div>
        )}

        <div className="p-3 border-t border-gray-200">
          <button
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
            onClick={() => {
              setSelectedRoleId(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>
      </aside>

      <RoleModal
        isOpen={isModalOpen || selectedRoleId !== null}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRoleId(null);
        }}
        role={selectedRole}
        mode={selectedRoleId ? "view" : "create"}
      />
    </>
  );
}
