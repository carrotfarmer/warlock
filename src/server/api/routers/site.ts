import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { SiteValidator } from "@/lib/validators/site";

export const siteRouter = createTRPCRouter({
  createSite: protectedProcedure 
    .input(SiteValidator)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.site.create({
        data: {
          name: input.name,
          encryptionKeyHint: input.encryptionKeyHint,
          userId: ctx.session.user.id,
        }
      })
    }),
});
