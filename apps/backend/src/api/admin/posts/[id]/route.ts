import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../../modules/page-builder"
import type PageBuilderModuleService from "../../../../modules/page-builder/service"
import { upsertPostWorkflow } from "../../../../workflows/upsert-post"
import type { UpsertPostBody } from "../../pages/validators"

export async function POST(
  req: MedusaRequest<UpsertPostBody>,
  res: MedusaResponse
) {
  const { result } = await upsertPostWorkflow(req.scope).run({
    input: { post: req.validatedBody, post_id: req.params.id },
  })

  res.json({ post: result })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  await service.removePost(req.params.id)

  res.json({ id: req.params.id, object: "post", deleted: true })
}
