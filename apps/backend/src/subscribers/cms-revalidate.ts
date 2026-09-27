import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { storefrontUrl } from "../lib/preview"

/**
 * Tells the storefront to drop its cached copy when CMS content changes.
 *
 * Next caches the store API responses by tag, so without this a published page
 * or post only appears once the revalidation window elapses - an editor saves,
 * reloads, and sees the old version. The storefront's /api/revalidate route
 * already accepts a secret and a tag list; this is the caller it was waiting
 * for.
 *
 * Failures are logged rather than thrown: the content is saved either way, and
 * a storefront that is down or redeploying must not fail an admin save. The
 * time-based revalidation still catches up.
 */

/**
 * A page change also clears the navigation, because the menu hides entries
 * pointing at unpublished pages - so publishing or unpublishing one changes
 * what the header shows.
 */
const TAGS: Record<string, string[]> = {
  "cms.page.changed": ["cms-pages", "navigation"],
  "cms.post.changed": ["cms-posts"],
  "cms.navigation.changed": ["navigation"],
  "cms.footer.changed": ["footer"],
  "cms.site-settings.changed": ["site-settings"],
}

export default async function cmsRevalidateHandler({
  event,
  container,
}: SubscriberArgs<{ slug?: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const secret = process.env.REVALIDATE_SECRET
  const base = storefrontUrl()
  const tags = TAGS[event.name]

  if (!secret || !base || !tags?.length) {
    // Nothing to do rather than an error: a backend without a storefront URL
    // or secret simply has no cache to clear.
    return
  }

  const tag = tags.join(",")
  const url = `${base}/api/revalidate?tags=${encodeURIComponent(tag)}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "x-revalidate-secret": secret },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      logger.warn(
        `Revalidating "${tag}" failed: ${response.status} ${await response.text()}`
      )
      return
    }

    logger.info(`Revalidated "${tag}" after ${event.name}`)
  } catch (error) {
    logger.warn(
      `Could not reach the storefront to revalidate "${tag}": ${
        error instanceof Error ? error.message : "unknown error"
      }`
    )
  }
}

export const config: SubscriberConfig = {
  event: [
    "cms.page.changed",
    "cms.post.changed",
    "cms.navigation.changed",
    "cms.footer.changed",
    "cms.site-settings.changed",
  ],
}
