import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const teamRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return prisma.team.findMany({
      include: {
        teamRoles: {
          include: { role: true },
        },
        supplies: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.team.findUnique({
        where: { id: input.id },
        include: {
          teamRoles: { include: { role: true } },
          supplies: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        units: z.array(z.string()).default([]),
        areas: z.array(z.string()).default([]),
        supplies: z
          .array(
            z.object({
              item: z.string().min(1),
              quantity: z.number().int().min(0),
            })
          )
          .default([]),
      })
    )
    .mutation(async ({ input }) => {
      const { supplies, ...teamData } = input;
      return prisma.team.create({
        data: {
          ...teamData,
          supplies: {
            create: supplies,
          },
        },
        include: {
          teamRoles: { include: { role: true } },
          supplies: true,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        units: z.array(z.string()).default([]),
        areas: z.array(z.string()).default([]),
        supplies: z
          .array(
            z.object({
              id: z.string().optional(),
              item: z.string().min(1),
              quantity: z.number().int().min(0),
            })
          )
          .default([]),
      })
    )
    .mutation(async ({ input }) => {
      const { id, supplies, ...data } = input;

      // Delete existing supplies and recreate
      await prisma.supply.deleteMany({ where: { teamId: id } });

      return prisma.team.update({
        where: { id },
        data: {
          ...data,
          supplies: {
            create: supplies.map(({ item, quantity }) => ({ item, quantity })),
          },
        },
        include: {
          teamRoles: { include: { role: true } },
          supplies: true,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.team.delete({ where: { id: input.id } });
    }),
});
