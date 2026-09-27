import crypto from "crypto"

import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/** Timing-safe compare; `timingSafeEqual` throws on a length mismatch. */
const matches = (a: string, b: string) => {
  const left = new Uint8Array(Buffer.from(a))
  const right = new Uint8Array(Buffer.from(b))

  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

/**
 * Turns on draft mode and sends the editor to the page being previewed.
 *
 * The link is signed by the admin rather than carrying the shared secret, so a
 * forwarded link cannot be edited to reach a different draft and expires on its
 * own. Verification happens here rather than on the rendered page, so draft
 * access is limited to the cookie this sets for that browser.
 *
 * `?exit=1` clears it again.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.PREVIEW_SECRET
  const params = request.nextUrl.searchParams

  if (params.get("exit")) {
    ;(await draftMode()).disable()
    redirect(params.get("redirect") || "/")
  }

  if (!secret) {
    return NextResponse.json(
      { message: "PREVIEW_SECRET is not set" },
      { status: 500 }
    )
  }

  const slug = params.get("slug")
  const type = params.get("type") === "post" ? "post" : "page"
  const exp = params.get("exp")
  const sig = params.get("sig")

  if (!slug || !exp || !sig) {
    return NextResponse.json(
      { message: "This preview link is incomplete. Open it from Medusa Admin." },
      { status: 400 }
    )
  }

  if (Number(exp) < Date.now()) {
    return NextResponse.json(
      { message: "This preview link has expired. Open a new one from Medusa Admin." },
      { status: 401 }
    )
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${type}:${slug}:${exp}`)
    .digest("hex")

  if (!matches(sig, expected)) {
    return NextResponse.json(
      { message: "This preview link is not valid." },
      { status: 401 }
    )
  }

  ;(await draftMode()).enable()

  const countryCode = params.get("countryCode") || "dk"

  redirect(`/${countryCode}${type === "post" ? "/blog" : ""}/${slug}`)
}
