import { siteRouter } from "@/server/api/routers/site";
import { accountRouter } from "./routers/account";
import { userRouter } from "./routers/user";

import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  site: siteRouter,
  account: accountRouter,
  user: userRouter 
});

// export type definition of API
export type AppRouter = typeof appRouter;
