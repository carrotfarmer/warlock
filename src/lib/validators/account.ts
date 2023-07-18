import { z } from "zod";

export const AccountValidator = z.object({
  email: z.string().email({ message: "invalid email" }).optional(),
  password: z.string().min(8, { message: "password should be at least 8 characters long" }),
});

export type AccountRequest = z.infer<typeof AccountValidator>
