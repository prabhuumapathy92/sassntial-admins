import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { storefrontUrl } from "../../../lib/preview"

/**
 * Tells the admin where the storefront lives and whether preview is usable,
 * so the Preview buttons can hide themselves rather than opening a broken link.
 */
export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.json({
    storefront_url: storefrontUrl(),
    preview_enabled: !!process.env.PREVIEW_SECRET,
  })
}
