import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { CONTACT_PAGE_MODULE } from "../../../modules/contact-page"
import type ContactPageModuleService from "../../../modules/contact-page/service"

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

const toInt = (value: unknown, fallback: number) => {
  const parsed = Number.parseInt(String(value ?? ""), 10)

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContactPageModuleService = req.scope.resolve(
    CONTACT_PAGE_MODULE
  )

  const limit = Math.min(toInt(req.query.limit, DEFAULT_LIMIT), MAX_LIMIT)
  const offset = toInt(req.query.offset, 0)

  const [contact_submissions, count] =
    await service.listAndCountContactSubmissions(
      {},
      { take: limit, skip: offset, order: { created_at: "DESC" } }
    )

  res.json({ contact_submissions, count, limit, offset })
}
