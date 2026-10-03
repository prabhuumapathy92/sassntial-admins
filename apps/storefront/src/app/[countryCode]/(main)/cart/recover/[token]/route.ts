import { NextRequest, NextResponse } from "next/server"
import { setCartId } from "@lib/data/cookies"
import { sdk } from "@lib/config"

type RouteParams = {
  countryCode: string
  token: string
}

/** Validates the emailed recovery token and restores the cart cookie. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { countryCode, token } = await params
  const cartUrl = new URL(`/${countryCode}/cart`, request.url)

  try {
    const result = await sdk.client.fetch<{ cart_id: string }>(
      `/store/abandoned-cart/recover/${encodeURIComponent(token)}`,
      { method: "GET", cache: "no-store" }
    )

    if (!result?.cart_id) {
      throw new Error("Recovery response did not include a cart")
    }

    await setCartId(result.cart_id)
    cartUrl.searchParams.set("recovered", "1")
  } catch {
    cartUrl.searchParams.set("recovery", "expired")
  }

  return NextResponse.redirect(cartUrl)
}