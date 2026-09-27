import "server-only"

import { CATALOG_REVALIDATE_SECONDS } from "@lib/util/cache"

/** Managed in Medusa Admin under "SEO & analytics". */
export type SiteSettings = {
  google_analytics_id: string
  google_tag_manager_id: string
  meta_pixel_id: string
  microsoft_clarity_id: string
  google_site_verification: string
  bing_site_verification: string
  head_code: string
  body_code: string
}

const EMPTY_SITE_SETTINGS: SiteSettings = {
  google_analytics_id: "",
  google_tag_manager_id: "",
  meta_pixel_id: "",
  microsoft_clarity_id: "",
  google_site_verification: "",
  bing_site_verification: "",
  head_code: "",
  body_code: "",
}

const backendUrl = () =>
  (process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000").replace(
    /\/+$/,
    ""
  )

/**
 * A plain fetch rather than the SDK on purpose: the SDK wrapper reads the
 * locale cookie, and this runs in the root layout, where touching cookies would
 * force every page into dynamic rendering. The tag lets an admin save publish
 * instantly through /api/revalidate; the time window is the fallback.
 *
 * Any failure yields empty settings, so a backend outage drops the tracking
 * tags instead of taking the whole storefront down with it.
 */
export const retrieveSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const response = await fetch(`${backendUrl()}/store/site-settings`, {
      headers: {
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
      },
      next: {
        tags: ["site-settings"],
        revalidate: CATALOG_REVALIDATE_SECONDS,
      },
    })

    if (!response.ok) {
      return EMPTY_SITE_SETTINGS
    }

    const { site_settings } = (await response.json()) as {
      site_settings?: Partial<SiteSettings>
    }

    return { ...EMPTY_SITE_SETTINGS, ...site_settings }
  } catch (error) {
    console.error("Failed to load SEO & analytics settings", error)
    return EMPTY_SITE_SETTINGS
  }
}
