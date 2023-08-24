import { z } from "zod"

export const contactInformationSchema = z.object({
  firstName: z.string({
    required_error: "First name is required"
  }),
  lastName: z.string({
    required_error: "Last name is required"
  }),
  phone: z.string({
    required_error: "Phone number is required"
  }),
  email: z.string({
    required_error: "Email is required"
  }),
  relationship: z.string({
    required_error: "Relationship is required"
  })
})

