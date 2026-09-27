import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../modules/page-builder"
import type PageBuilderModuleService from "../../../modules/page-builder/service"

const service = (req: MedusaRequest): PageBuilderModuleService =>
  req.scope.resolve(PAGE_BUILDER_MODULE)

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({ authors: await service(req).listBylines() })
}

export async function POST(req: MedusaRequest<any>, res: MedusaResponse) {
  const author = await service(req).upsertAuthor(req.validatedBody)

  res.json({ author })
}
