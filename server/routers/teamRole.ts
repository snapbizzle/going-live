import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/lib/db";

export const teamRoleRouter = router({
  assign: publicProcedure
    .input(z.object({
      teamId: z.string(),
      roleId: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(({ input }) =>
      db.teamRole.create({
        data: input,
        include: { role: true, team: true },
      })
    ),

  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => db.teamRole.delete({ where: { id: input.id } })),

  updateNotes: publicProcedure
    .input(z.object({ id: z.string(), notes: z.string() }))
    .mutation(({ input }) =>
      db.teamRole.update({
        where: { id: input.id },
        data: { notes: input.notes },
      })
    ),
});
