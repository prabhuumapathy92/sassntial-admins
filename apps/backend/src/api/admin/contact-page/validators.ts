import { z } from "@medusajs/framework/zod"

/** Empty strings clear a field, so they normalize to null rather than "". */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable()
  .optional()

export const UpdateContactPage = z.object({
  intro: optionalText,
  general_inquiries_email: z
    .union([z.string().trim().email(), z.literal("")])
    .transform((value) => (value.length ? value : null))
    .nullable()
    .optional(),
  support_line: optionalText,
  availability: optionalText,
  focus_items: z
    .array(z.string().trim())
    .transform((items) => items.filter((item) => item.length > 0))
    .optional(),
  form_eyebrow: optionalText,
  form_heading: optionalText,
  form_description: optionalText,
})

export type UpdateContactPageBody = z.infer<typeof UpdateContactPage>
