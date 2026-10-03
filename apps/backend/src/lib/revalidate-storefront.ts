import type { Logger } from "@medusajs/framework/types"

import { storefrontUrl } from "./preview"

/**
 * Tells the storefront to drop its cached copy of the given tags.
 *
 * Next caches the store API responses by tag, so without this a change only
 * appears once the revalidation window elapses. The storefront's
 * /api/revalidate route accepts a secret and a tag list.
 *
 * Failures are logged rather than thrown: the content is saved either way, and
 * a storefront that is down or redeploying must not fail the caller. A backend
 * without a storefront URL or secret simply has no cache to clear.
 *
 * Resolves once the storefront has answered, so a one-off script can await it
 * before exiting.
 */
export const revalidateStorefront = async (
  tags: string[],
  logger: Logger,
  reason: string
): Promise<boolean> => {
  const secret = process.env.REVALIDATE_SECRET
  const base = storefrontUrl()

  if (!secret || !base || !tags.length) {
    return false
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
      return false
    }

    logger.info(`Revalidated "${tag}" after ${reason}`)
    return true
  } catch (error) {
    logger.warn(
      `Could not reach the storefront to revalidate "${tag}": ${
        error instanceof Error ? error.message : "unknown error"
      }`
    )
    return false
  }
}
