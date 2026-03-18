import { Header } from "@/components/Header";
import { RolePool } from "@/components/RolePool";
import { TeamCanvas } from "@/components/TeamCanvas";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <RolePool />
        <TeamCanvas />
      </div>
    </div>
  );
}
