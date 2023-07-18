import { z } from "zod";

export const AccountValidator = z.object({
  email: z.string().email({ message: "invalid email" }).optional(),
  password: z.string().min(8, { message: "password should be at least 8 characters long" }),
});

export type AccountFormData = z.infer<typeof AccountValidator>

// im sorry i cant think of names
export const AccountCreationRequestValidator = AccountValidator.extend({
  siteId: z.string().min(1)
});

export type AccountCreationRequest = z.infer<typeof AccountCreationRequestValidator>
