import { createTRPCRouter } from "@/server/trpc";
import { roleRouter } from "./role";
import { teamRouter } from "./team";
import { teamRoleRouter } from "./teamRole";

export const appRouter = createTRPCRouter({
  role: roleRouter,
  team: teamRouter,
  teamRole: teamRoleRouter,
});

export type AppRouter = typeof appRouter;
