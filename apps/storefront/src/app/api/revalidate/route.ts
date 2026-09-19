import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

import { CATALOG_CACHE_TAGS } from "@lib/util/cache"

export const dynamic = "force-dynamic"

/**
 * On-demand cache invalidation for Medusa Admin changes.
 *
 * Without this, catalog edits only appear once the time-based revalidation
 * window elapses. Point a Medusa subscriber at this route to publish instantly:
 *
 *   POST https://<storefront>/api/revalidate?secret=$REVALIDATE_SECRET
 *   POST https://<storefront>/api/revalidate?secret=...&tags=products,collections
 *
 * The secret may also be sent as an `x-revalidate-secret` header.
 */
const authorize = (request: NextRequest) => {
  const expected = process.env.REVALIDATE_SECRET

  if (!expected) {
    return { ok: false, status: 500, message: "REVALIDATE_SECRET is not set" }
  }

  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret")

  if (provided !== expected) {
    return { ok: false, status: 401, message: "Invalid secret" }
  }

  return { ok: true as const }
}

const resolveTags = (request: NextRequest) => {
  const requested = request.nextUrl.searchParams.get("tags")

  if (!requested) {
    return [...CATALOG_CACHE_TAGS]
  }

  const allowed = new Set<string>(CATALOG_CACHE_TAGS)

  return requested
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => allowed.has(tag))
}

const handle = async (request: NextRequest) => {
  const auth = authorize(request)

  if (!auth.ok) {
    return NextResponse.json(
      { revalidated: false, message: auth.message },
      { status: auth.status }
    )
  }

  const tags = resolveTags(request)

  if (!tags.length) {
    return NextResponse.json(
      {
        revalidated: false,
        message: `No known tags requested. Valid tags: ${CATALOG_CACHE_TAGS.join(", ")}`,
      },
      { status: 400 }
    )
  }

  tags.forEach((tag) => revalidateTag(tag))

  return NextResponse.json({ revalidated: true, tags, now: Date.now() })
}

export async function POST(request: NextRequest) {
  return handle(request)
}

// Allowed so the endpoint can be verified from a browser or curl.
export async function GET(request: NextRequest) {
  return handle(request)
}
