import { z } from "@medusajs/framework/zod"

const emailAddress = z.string().trim().email().or(z.literal(""))

const emailSettings = z.object({
  enabled: z.boolean().default(false),
  smtp_host: z.string().trim().max(255).default(""),
  smtp_port: z.coerce.number().int().min(1).max(65535).default(587),
  smtp_secure: z.boolean().default(false),
  smtp_require_tls: z.boolean().default(true),
  smtp_username: z.string().trim().max(320).default(""),
  smtp_password: z.string().max(1000).optional(),
  clear_smtp_password: z.boolean().optional().default(false),
  from_name: z.string().trim().max(150).default(""),
  from_email: emailAddress.default(""),
  to_emails: z.array(z.string().trim().email()).max(30).default([]),
  reply_to_submitter: z.boolean().default(true),
  subject_prefix: z.string().trim().max(100).default(""),
}).superRefine((settings, context) => {
  if (settings.clear_smtp_password && settings.smtp_password?.trim()) {
    context.addIssue({
      code: "custom",
      path: ["smtp_password"],
      message: "Enter a new password or choose to clear the saved password",
    })
  }

  if (settings.enabled) {
    if (!settings.smtp_host) {
      context.addIssue({
        code: "custom",
        path: ["smtp_host"],
        message: "Enter the SMTP host before enabling email notifications",
      })
    }
    if (!settings.from_email) {
      context.addIssue({
        code: "custom",
        path: ["from_email"],
        message: "Enter a valid sender email before enabling notifications",
      })
    }
    if (!settings.to_emails.length) {
      context.addIssue({
        code: "custom",
        path: ["to_emails"],
        message: "Enter at least one recipient email before enabling notifications",
      })
    }
  }
})

export const UpdateEmailSettings = z.object({ email_settings: emailSettings })

export type UpdateEmailSettingsBody = z.infer<typeof UpdateEmailSettings>
