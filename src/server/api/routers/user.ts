import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    // get number of sites, accounts and passwords
    const sites = await ctx.prisma.site.count({
      where: { userId: ctx.session.user.id },
    });

    const accounts = await ctx.prisma.site.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        accounts: true 
      }
    });

    const accountsLen: number = accounts.reduce((acc, site) => {
      return acc + site.accounts.length;
    }, 0);

    return {
      sitesCount: sites,
      accountsCount: accountsLen,
    };
  }),
});
