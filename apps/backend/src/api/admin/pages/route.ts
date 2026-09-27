import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../modules/page-builder"
import type PageBuilderModuleService from "../../../modules/page-builder/service"
import { upsertPageWorkflow } from "../../../workflows/upsert-page"
import { BLOCK_TYPES } from "./validators"
import type { UpsertPageBody } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  const pages = await service.listPagesWithBlocks()

  // The editor builds its "add block" menu from this, so a new block type
  // shows up without shipping a matching admin release.
  res.json({ pages, block_types: BLOCK_TYPES })
}

export async function POST(
  req: MedusaRequest<UpsertPageBody>,
  res: MedusaResponse
) {
  const { result } = await upsertPageWorkflow(req.scope).run({
    input: { page: req.validatedBody },
  })

  res.json({ page: result })
}
