import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { SiteValidator } from "@/lib/validators/site";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { decrypt } from "@/lib/utils";

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
      const site = await ctx.prisma.site.findUnique({
        where: {
          id: input.siteId,
        },
        include: {
          user: true,
          accounts: true,
        },
      });

      if (!site) {
        throw new TRPCError({ message: "site not found", code: "NOT_FOUND" });
      }

      return site;
    }),

  getEncryptionKeyHint: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.site.findUnique({
        where: {
          id: input.siteId,
        },
        select: {
          encryptionKeyHint: true,
        },
      });

      if (!data) {
        throw new TRPCError({ message: "site not found", code: "NOT_FOUND" });
      }

      return data;
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

  downloadSiteData: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        encryptionKey: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const site = await ctx.prisma.site.findUnique({
        where: {
          id: input.siteId,
        },
        include: {
          accounts: true,
        },
      });

      if (!site) {
        throw new TRPCError({ message: "site not found", code: "NOT_FOUND" });
      }

      const data = site.accounts.map((account) => {
        const decryptedPassword = decrypt(account.encryptedPassword, input.encryptionKey);

        if (decryptedPassword.includes("�")) {
          throw new TRPCError({
            message: "invalid encryption key",
            code: "BAD_REQUEST",
          });
        }

        return {
          ...account,
          password: decryptedPassword,
        };
      });

      const file = JSON.stringify(data, null, 2);

      return {
        file,
        fileName: `${site.name}.json`,
      };
    }),

  editSite: protectedProcedure
    .input(
      SiteValidator.extend({
        siteId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.site.update({
        where: {
          id: input.siteId,
        },
        data: {
          name: input.name,
          encryptionKeyHint: input.encryptionKeyHint,
        },
      });
    }),

  verifyEncryptionKey: protectedProcedure
    .input(
      z.object({
        siteId: z.string(),
        encryptionKey: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const site = await ctx.prisma.site.findUnique({
        where: {
          id: input.siteId,
        },
        include: {
          accounts: true,
        },
      });

      site?.accounts.map((account) => {
        const decryptedPassword = decrypt(account.encryptedPassword, input.encryptionKey);

        if (decryptedPassword.includes("�") || decryptedPassword.length < 1) {
          throw new TRPCError({
            message: "invalid encryption key",
            code: "BAD_REQUEST",
          });
        }
      });

      return true;
    }),
});
