import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../../modules/page-builder"
import type PageBuilderModuleService from "../../../../modules/page-builder/service"
import { upsertPageWorkflow } from "../../../../workflows/upsert-page"
import type { UpsertPageBody } from "../validators"

export async function POST(
  req: MedusaRequest<UpsertPageBody>,
  res: MedusaResponse
) {
  const { result } = await upsertPageWorkflow(req.scope).run({
    input: { page: req.validatedBody, page_id: req.params.id },
  })

  res.json({ page: result })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  await service.removePage(req.params.id)

  res.json({ id: req.params.id, object: "page", deleted: true })
}
