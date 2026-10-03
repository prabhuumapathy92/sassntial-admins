import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"

type RouteParams = {
  countryCode: string
  token: string
}

const safeCountryCode = (value: string) =>
  /^[a-z]{2}$/i.test(value) ? value.toLowerCase() : "us"

const htmlPage = (title: string, message: string, action?: string) => {
  const actionForm = action
    ? `<form method="post" action="${action}"><button type="submit" style="background:#2b1710;color:#fff;border:0;padding:14px 24px;cursor:pointer">Unsubscribe</button></form>`
    : ""

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#f9f6f1;font-family:Arial,Helvetica,sans-serif;color:#3a2e27"><main style="max-width:560px;margin:12vh auto;padding:36px;background:#fff;border:1px solid #e8ddd3;text-align:center"><div style="letter-spacing:.2em;color:#9a742d">AURNELLE</div><h1 style="font-size:22px;font-weight:500">${title}</h1><p style="line-height:1.7;color:#5a4a3f">${message}</p>${actionForm}</main></body></html>`
}

/** Show a confirmation page; scanners that follow links won't unsubscribe. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { countryCode, token } = await params
  const action = `/${safeCountryCode(countryCode)}/email-preferences/unsubscribe/${encodeURIComponent(token)}`
  return new NextResponse(
    htmlPage(
      "Stop cart reminders",
      "Confirm below to stop receiving Aurnelle cart reminder emails.",
      action
    ),
    { headers: { "content-type": "text/html; charset=utf-8" } }
  )
}

/** Record the opt-out through Medusa after the shopper confirms. */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  const { token } = await params
  try {
    await sdk.client.fetch("/store/abandoned-cart/unsubscribe", {
      method: "POST",
      body: { token },
    })
    return new NextResponse(
      htmlPage(
        "You’re unsubscribed",
        "You will no longer receive Aurnelle cart reminder emails."
      ),
      { headers: { "content-type": "text/html; charset=utf-8" } }
    )
  } catch {
    return new NextResponse(
      htmlPage(
        "We couldn’t update your preferences",
        "This link may be invalid. Please contact Aurnelle support if you need help."
      ),
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } }
    )
  }
}