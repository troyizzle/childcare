import { z } from "zod";

export const actionNewSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  })
})

export type ActionNewInput = z.infer<typeof actionNewSchema>;
