import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { AccountCreationRequestValidator } from "@/lib/validators/account";

export const accountRouter = createTRPCRouter({
  createAccount: protectedProcedure.input(AccountCreationRequestValidator).mutation(async ({ input, ctx }) => {
    let email: string = input.email ?? "";
    
    if (!email || email.length === 0) {
      email = "not provided";
    }

    return await ctx.prisma.siteAccount.create({
      data: {
        email: email,
        siteId: input.siteId,
        // TODO: encrypt password
        encryptedPassword: input.encryptedPassword,
      },
    })
  }),
})
