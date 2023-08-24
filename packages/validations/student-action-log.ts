import { z } from "zod"

export const studentActionLogNewSchema = z.object({
  studentId: z.string({
    required_error: "Student ID is required",
  }),
  actionId: z.string({
    required_error: "Action ID is required",
  }),
  notes: z.string().optional()
})

export type StudentActionLogNewInput = z.infer<typeof studentActionLogNewSchema>
