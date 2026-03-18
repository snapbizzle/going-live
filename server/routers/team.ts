import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/lib/db";

const supplySchema = z.object({
  item: z.string().min(1),
  quantity: z.number().int().min(0),
});

export const teamRouter = router({
  list: publicProcedure.query(() =>
    db.team.findMany({
      include: {
        supplies: true,
        teamRoles: { include: { role: true } },
      },
      orderBy: { name: "asc" },
    })
  ),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      units: z.array(z.string()).default([]),
      areas: z.array(z.string()).default([]),
      supplies: z.array(supplySchema).default([]),
    }))
    .mutation(({ input }) =>
      db.team.create({
        data: {
          name: input.name,
          units: input.units,
          areas: input.areas,
          supplies: { create: input.supplies },
        },
        include: { supplies: true, teamRoles: { include: { role: true } } },
      })
    ),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1),
      units: z.array(z.string()).default([]),
      areas: z.array(z.string()).default([]),
      supplies: z.array(supplySchema).default([]),
    }))
    .mutation(async ({ input }) => {
      const { id, supplies, ...data } = input;
      await db.supply.deleteMany({ where: { teamId: id } });
      return db.team.update({
        where: { id },
        data: {
          ...data,
          supplies: { create: supplies },
        },
        include: { supplies: true, teamRoles: { include: { role: true } } },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => db.team.delete({ where: { id: input.id } })),
});
