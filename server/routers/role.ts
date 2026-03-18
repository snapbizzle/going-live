import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@/lib/db";

export const roleRouter = router({
  list: publicProcedure.query(() => db.role.findMany({ orderBy: { name: "asc" } })),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.string().optional(),
      defaultNotes: z.string().optional(),
    }))
    .mutation(({ input }) => db.role.create({ data: input })),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.string().optional(),
      defaultNotes: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return db.role.update({ where: { id }, data });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => db.role.delete({ where: { id: input.id } })),
});
