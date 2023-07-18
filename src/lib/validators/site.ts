import { z } from "zod";

export const SiteValidator = z.object({
  name: z
    .string()
    .min(3, { message: "site name must be greater than 3 characters!" })
    .max(100, { message: "site name cannot be greater than 100 characters!" })
    .regex(/^[a-z0-9-]+$/i, { message: "site name must contain alphanumeric and dashes only!" }),
  encryptionKeyHint: z
    .string()
    .min(3, { message: "encryption key hint must be greater than 3 characters!" })
    .max(250, { message: "encryption key hint cannot be greater than 250 characters!" }),
});

export type SiteRequest = z.infer<typeof SiteValidator>;

export const CreateSiteValidator = SiteValidator.extend({
  encryptionKey: z
    .string()
    .min(3, { message: "encryption key must be greater than 3 characters!" })
    .max(75, "encryption key cannot be greater than 75 characters!"),
});

export type CreateSiteFormData = z.infer<typeof CreateSiteValidator>;
