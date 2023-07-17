import { z } from "zod";

export const SiteValidator = z.object({
  name: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/i),
  encryptionKeyHint: z.string().min(3).max(250),
})

export type SiteRequest = z.infer<typeof SiteValidator>
