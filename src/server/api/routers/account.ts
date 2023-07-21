import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { AccountCreationRequestValidator } from "@/lib/validators/account";
import { z } from "zod";

export const accountRouter = createTRPCRouter({
  createAccount: protectedProcedure
    .input(AccountCreationRequestValidator)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.siteAccount.create({
        data: {
          email: input.email,
          siteId: input.siteId,
          encryptedPassword: input.encryptedPassword,
        },
      });
    }),

  getAccounts: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.siteAccount.findMany({
        where: {
          siteId: input.siteId,
        },
      });
    }),

  deleteAccount: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.siteAccount.delete({
        where: {
          id: input.accountId,
        },
      });
    }),

  editPassword: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        encryptedPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.siteAccount.update({
        where: {
          id: input.accountId,
        },
        data: {
          encryptedPassword: input.encryptedPassword,
        },
      });
    }),
});
