"use client";

import { Radio } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-600">
          <Radio className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-red-600 tracking-tight">
          Going Live
        </h1>
      </div>
      <span className="text-sm text-gray-500">Team Role Management</span>
    </header>
  );
}
