import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../../../modules/page-builder"
import type PageBuilderModuleService from "../../../../../modules/page-builder/service"
import type { SetPostStatusBody } from "../../../pages/validators"

/**
 * Publish or unpublish in one call.
 *
 * Separate from the upsert route so toggling visibility does not require
 * resending the whole post, and so it cannot accidentally overwrite content
 * edited elsewhere in the meantime.
 */
export async function POST(
  req: MedusaRequest<SetPostStatusBody>,
  res: MedusaResponse
) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  const post = await service.setPostStatus(
    req.params.id,
    req.validatedBody.status
  )

  res.json({ post })
}
