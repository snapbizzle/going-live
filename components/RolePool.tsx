"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { RoleCard } from "./RoleCard";
import { RoleModal } from "./RoleModal";
import type { Role } from "@prisma/client";

export function RolePool() {
  const { data: roles = [], isLoading } = trpc.role.list.useQuery();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-gray-900">Role Pool</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
        ) : roles.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No roles yet</p>
        ) : (
          roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onClick={() => setSelectedRole(role)}
            />
          ))
        )}
      </div>
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
        >
          + Add Role
        </button>
      </div>
      {selectedRole && (
        <RoleModal
          isOpen={true}
          onClose={() => setSelectedRole(null)}
          role={selectedRole}
        />
      )}
      <RoleModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        role={null}
      />
    </aside>
  );
}
