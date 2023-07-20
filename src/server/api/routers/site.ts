import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { SiteValidator } from "@/lib/validators/site";
import { z } from "zod";

export const siteRouter = createTRPCRouter({
  createSite: protectedProcedure.input(SiteValidator).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.site.create({
      data: {
        name: input.name,
        encryptionKeyHint: input.encryptionKeyHint,
        userId: ctx.session.user.id,
      },
    });
  }),

  getSites: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.site.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        user: true,
        accounts: true,
      },
    });
  }),

  getSite: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.site.findUnique({
        where: {
          id: input.siteId,
        },
        include: {
          user: true,
          accounts: true,
        },
      });
    }),

  getEncryptionKeyHint: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.site.findUnique({
        where: {
          id: input.siteId,
        },
        select: {
          encryptionKeyHint: true,
        },
      });
    }),

  deleteSite: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.site.delete({
        where: {
          id: input.siteId,
        },
      });
    }),
});
