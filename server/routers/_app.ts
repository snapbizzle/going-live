import { router } from "../trpc";
import { roleRouter } from "./role";
import { teamRouter } from "./team";
import { teamRoleRouter } from "./teamRole";

export const appRouter = router({
  role: roleRouter,
  team: teamRouter,
  teamRole: teamRoleRouter,
});

export type AppRouter = typeof appRouter;
