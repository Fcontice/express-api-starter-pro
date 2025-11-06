import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Invalid email").max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email").max(254),
  password: z.string().min(8).max(128),
});

// refresh/logout have no body; kept for symmetry if you later add fields
export const noopSchema = z.object({}).strict();
