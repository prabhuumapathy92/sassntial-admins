/**
 * Catalog caching policy.
 *
 * Catalog data was previously fetched with `cache: "force-cache"` and no expiry,
 * so anything edited in Medusa Admin never reached the storefront until the next
 * rebuild. These fetches are now time-revalidated, and every catalog response is
 * additionally tagged so `/api/revalidate` can refresh them on demand.
 */

const DEFAULT_REVALIDATE_SECONDS = 60

const parsed = Number.parseInt(process.env.REVALIDATE_SECONDS ?? "", 10)

export const CATALOG_REVALIDATE_SECONDS =
  Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_REVALIDATE_SECONDS

/** Tags a webhook may invalidate. Keep in sync with the getCacheOptions callers. */
export const CATALOG_CACHE_TAGS = [
  "products",
  "categories",
  "collections",
  "regions",
  "variants",
] as const
