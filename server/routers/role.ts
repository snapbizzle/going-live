import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const roleRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return prisma.role.findMany({
      orderBy: { createdAt: "asc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.role.findUnique({ where: { id: input.id } });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        category: z.string().optional(),
        defaultNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.role.create({ data: input });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        category: z.string().optional(),
        defaultNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.role.update({ where: { id }, data });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.role.delete({ where: { id: input.id } });
    }),
});
