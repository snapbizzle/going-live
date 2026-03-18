"use client";

import { Header } from "@/components/Header";
import { RolePool } from "@/components/RolePool";
import { TeamCanvas } from "@/components/TeamCanvas";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <RolePool />
        <TeamCanvas />
      </div>
    </div>
  );
}
