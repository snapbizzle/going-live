import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const teamRoleRouter = createTRPCRouter({
  assign: publicProcedure
    .input(
      z.object({
        teamId: z.string(),
        roleId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.teamRole.create({
        data: input,
        include: { role: true, team: true },
      });
    }),

  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.teamRole.delete({ where: { id: input.id } });
    }),

  updateNotes: publicProcedure
    .input(z.object({ id: z.string(), notes: z.string().optional() }))
    .mutation(async ({ input }) => {
      return prisma.teamRole.update({
        where: { id: input.id },
        data: { notes: input.notes },
      });
    }),
});
