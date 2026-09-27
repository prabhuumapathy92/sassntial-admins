import { z } from "@medusajs/framework/zod"

const link = z.object({
  label: z.string().trim().min(1).max(100),
  href: z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .refine(
      (value) =>
        (value.startsWith("/") && !value.startsWith("//")) ||
        /^(https?:\/\/|mailto:|tel:|#)/i.test(value),
      "Use a site path, https URL, email, phone, or page anchor",
    ),
})

const footerConfig = z.object({
  theme: z.enum(["navy", "dark", "light"]).default("navy"),
  logo_url: z.string().trim().max(1000).default(""),
  logo_alt: z.string().trim().max(150).default("SaaSential"),
  groups: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(100),
        links: z.array(link).max(40),
      }),
    )
    .max(8),
  social_links: z
    .array(
      link.extend({
        platform: z.enum([
          "linkedin",
          "facebook",
          "instagram",
          "youtube",
          "x",
          "tiktok",
          "custom",
        ]),
      }),
    )
    .max(12),
  cta: z.object({
    label: z.string().trim().max(100).default(""),
    href: z.string().trim().max(1000).default(""),
  }),
  locations: z
    .array(
      z.object({
        city: z.string().trim().min(1).max(100),
        address: z.string().trim().min(1).max(500),
      }),
    )
    .max(12),
  phone_label: z.string().trim().max(100),
  phone_href: z.string().trim().max(500),
  copyright_text: z.string().trim().max(300),
  legal_links: z.array(link).max(12),
})

export const UpdateFooterConfig = z.object({ footer: footerConfig })

export type UpdateFooterConfigBody = z.infer<typeof UpdateFooterConfig>
