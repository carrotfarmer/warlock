import { z } from "zod";

export const AccountValidator = z.object({
  email: z.string().email({ message: "invalid email" }).optional(),
  password: z.string().min(8, { message: "password should be at least 8 characters long" }),
  encryptionKey: z
    .string()
    .min(3, { message: "encryption key must be greater than 3 characters!" })
    .max(75, "encryption key cannot be greater than 75 characters!"),
});

export type AccountFormData = z.infer<typeof AccountValidator>;

// im sorry i cant think of names
export const AccountCreationRequestValidator = AccountValidator.extend({
  siteId: z.string().min(1),
  encryptedPassword: z.string().min(1),
}).omit({
  encryptionKey: true,
  password: true,
});

export type AccountCreationRequest = z.infer<typeof AccountCreationRequestValidator>;
