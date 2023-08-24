import { z } from "zod"
import { contactInformationSchema } from "./contact-information"

export const studentNewSchema = z.object({
  firstName: z.string({
    required_error: "First name is required"
  }),
  lastName: z.string({
    required_error: "Last name is required"
  }),
  dob: z.date({
    required_error: "Date of birth is required"
  })
})

export type StudentNewInput = z.infer<typeof studentNewSchema>

export const studentUpdateSchema = studentNewSchema.extend({
  id: z.string(),
  contactInfos: z.array(contactInformationSchema)
})

export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>
