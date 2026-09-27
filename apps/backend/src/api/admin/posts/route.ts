import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../modules/page-builder"
import type PageBuilderModuleService from "../../../modules/page-builder/service"
import { upsertPostWorkflow } from "../../../workflows/upsert-post"
import { BLOCK_TYPES } from "../pages/validators"
import type { UpsertPostBody } from "../pages/validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  const posts = await service.listPostsWithBlocks()

  res.json({ posts, block_types: BLOCK_TYPES })
}

export async function POST(
  req: MedusaRequest<UpsertPostBody>,
  res: MedusaResponse
) {
  const { result } = await upsertPostWorkflow(req.scope).run({
    input: { post: req.validatedBody },
  })

  res.json({ post: result })
}
