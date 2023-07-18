import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { SiteValidator } from "@/lib/validators/site";

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
      }
    });
  }),
});
