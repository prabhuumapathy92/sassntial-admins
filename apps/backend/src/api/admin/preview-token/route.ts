import crypto from "crypto"

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { storefrontUrl } from "../../../lib/preview"

/** Long enough to click through from the editor, short enough that a link
 *  pasted into a chat stops working. */
const TTL_MS = 10 * 60 * 1000

/**
 * Mints a preview link for the admin.
 *
 * The shared secret never reaches the browser: this returns a URL signed with
 * it instead. The signature covers the slug, the type and an expiry, so a
 * leaked link cannot be edited to reach a different draft and stops working
 * after ten minutes.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const secret = process.env.PREVIEW_SECRET
  const base = storefrontUrl()

  if (!secret || !base) {
    res.status(400).json({
      message: "Preview needs PREVIEW_SECRET and a storefront URL",
    })
    return
  }

  const slug = (req.query.slug as string | undefined)?.trim()
  const type = req.query.type === "post" ? "post" : "page"

  if (!slug) {
    res.status(400).json({ message: "Missing slug" })
    return
  }

  const exp = String(Date.now() + TTL_MS)
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${type}:${slug}:${exp}`)
    .digest("hex")

  const params = new URLSearchParams({ slug, type, exp, sig })

  res.json({ url: `${base}/api/preview?${params.toString()}` })
}
