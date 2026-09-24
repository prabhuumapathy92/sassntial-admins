import { z } from "@medusajs/framework/zod"

/**
 * This route is public, so every field is length-capped: without a ceiling a
 * single request could write an unbounded amount of text into the table.
 */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value.length ? value : null))
    .nullable()
    .optional()

export const CreateContactSubmission = z.object({
  full_name: z.string().trim().min(1).max(200),
  company: optionalText(200),
  email: z.string().trim().email().max(320),
  phone_number: optionalText(50),
  location: optionalText(200),
  message: z.string().trim().min(1).max(5000),
})

export type CreateContactSubmissionBody = z.infer<
  typeof CreateContactSubmission
>
