import { z } from "@medusajs/framework/zod"

/**
 * The tracking IDs are interpolated into inline scripts on the storefront, so
 * each one is held to its provider's exact format. Anything looser would let a
 * crafted "ID" break out of the script string.
 */
const trackingId = (pattern: RegExp, message: string, uppercase = false) =>
  z
    .string()
    .trim()
    .max(50)
    .default("")
    .transform((value) => (uppercase ? value.toUpperCase() : value))
    .refine((value) => value === "" || pattern.test(value), { message })

/**
 * Search consoles hand out a whole <meta> tag, and admins usually paste it as
 * is. Only the content value is kept, so either form works.
 */
const verificationCode = (message: string) =>
  z
    .string()
    .trim()
    .max(500)
    .default("")
    .transform((value) => {
      const match = value.match(/content\s*=\s*["']([^"']*)["']/i)

      return (match ? match[1] : value).trim()
    })
    .refine(
      (value) => value === "" || /^[A-Za-z0-9_\-.:=+/]{4,200}$/.test(value),
      { message }
    )

const customCode = z.string().max(20000).default("")

const siteSettings = z.object({
  google_analytics_id: trackingId(
    /^(G|GT|AW)-[A-Z0-9]{4,20}$/,
    "Enter a Google tag ID such as G-XXXXXXXXXX",
    true
  ),
  google_tag_manager_id: trackingId(
    /^GTM-[A-Z0-9]{4,12}$/,
    "Enter a Google Tag Manager container ID such as GTM-XXXXXXX",
    true
  ),
  meta_pixel_id: trackingId(
    /^\d{5,20}$/,
    "Enter the numeric Meta Pixel ID"
  ),
  microsoft_clarity_id: trackingId(
    /^[a-z0-9]{6,20}$/i,
    "Enter the Microsoft Clarity project ID"
  ),
  google_site_verification: verificationCode(
    "Enter the Google Search Console verification code"
  ),
  bing_site_verification: verificationCode(
    "Enter the Bing Webmaster Tools verification code"
  ),
  head_code: customCode,
  body_code: customCode,
})

export const UpdateSiteSettings = z.object({ site_settings: siteSettings })

export type UpdateSiteSettingsBody = z.infer<typeof UpdateSiteSettings>
