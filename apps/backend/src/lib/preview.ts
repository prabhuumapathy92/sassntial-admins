import type { MedusaRequest } from "@medusajs/framework/http"

/**
 * Whether this request may see unpublished content.
 *
 * The store API is public, so drafts are only served when the caller presents
 * the shared preview secret. The storefront keeps that secret server-side and
 * never exposes it to the browser, so a draft slug cannot be reached by
 * guessing. With no secret configured, preview is off rather than open.
 */
export const isPreviewRequest = (req: MedusaRequest): boolean => {
  const expected = process.env.PREVIEW_SECRET

  if (!expected) {
    return false
  }

  const provided =
    (req.headers["x-preview-secret"] as string | undefined) ??
    (req.query.preview_secret as string | undefined)

  return provided === expected
}

/**
 * The storefront's public base URL, used to build preview links in the admin.
 * Falls back to the first entry in STORE_CORS, which is already the
 * storefront's origin in every environment this runs in.
 */
export const storefrontUrl = (): string | null => {
  const explicit = process.env.STOREFRONT_URL?.trim()

  if (explicit) {
    return explicit.replace(/\/+$/, "")
  }

  const [first] = (process.env.STORE_CORS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => /^https?:\/\//.test(entry))

  return first ? first.replace(/\/+$/, "") : null
}
