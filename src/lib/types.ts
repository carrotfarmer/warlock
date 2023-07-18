import type { Site, SiteAccount, User } from "@prisma/client";

export type ExtendedSite = Site & {
  user: User;
  accounts: SiteAccount[];
}
