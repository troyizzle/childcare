import { z } from "zod"

export const userUpdateSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.array(z.string()),
  children: z.array(z.string())
})

export type UserUpdateInput = z.infer<typeof userUpdateSchema>
