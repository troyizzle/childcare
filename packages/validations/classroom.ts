import { z } from "zod"

export const classroomNewSchema = z.object({
  name: z.string({
    required_error: "Classroom name is required"
  }).min(1, {
    message: "Classroom name is required"
  }).max(40)
})

export type ClassroomCreateInput = z.infer<typeof classroomNewSchema>

export const classroomUpdateSchema = classroomNewSchema.extend({
  id: z.string(),
  teachers: z.array(z.string()),
  students: z.array(z.string())
})

export type ClassroomUpdateInput = z.infer<typeof classroomUpdateSchema>
