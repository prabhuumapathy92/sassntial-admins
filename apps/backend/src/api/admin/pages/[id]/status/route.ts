import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../../../modules/page-builder"
import type PageBuilderModuleService from "../../../../../modules/page-builder/service"
import { emitCmsPageChanged } from "../../../../../lib/cms-events"
import type { SetPageStatusBody } from "../../validators"

/**
 * Publish or unpublish in one call, without resending the page.
 *
 * Emits the same event a save does, so the storefront drops both its page and
 * navigation caches - unpublishing hides the page's menu entry too.
 */
export async function POST(
  req: MedusaRequest<SetPageStatusBody>,
  res: MedusaResponse
) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  const page = await service.setPageStatus(
    req.params.id,
    req.validatedBody.status
  )

  await emitCmsPageChanged(req.scope, page.slug)

  res.json({ page })
}
