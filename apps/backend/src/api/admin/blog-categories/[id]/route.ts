import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../../modules/page-builder"
import type PageBuilderModuleService from "../../../../modules/page-builder/service"

const service = (req: MedusaRequest): PageBuilderModuleService =>
  req.scope.resolve(PAGE_BUILDER_MODULE)

export async function POST(req: MedusaRequest<any>, res: MedusaResponse) {
  const category = await service(req).upsertCategory(
    req.validatedBody,
    req.params.id
  )

  res.json({ category })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  await service(req).removeCategory(req.params.id)

  res.json({ id: req.params.id, object: "blog_category", deleted: true })
}
