"use client";

import { useState } from "react";
import { RoleModal } from "./RoleModal";

export function Header() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-2xl font-bold">●</span>
          <span className="text-xl font-bold text-gray-900">Going Live</span>
        </div>
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Manage Roles
        </button>
      </header>
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        role={null}
      />
    </>
  );
}
