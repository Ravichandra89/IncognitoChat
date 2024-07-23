import { z } from "zod";

export const VerifySchema = z.object({
  code: z.string().length(6, "Verify password length must be 6"),
});
