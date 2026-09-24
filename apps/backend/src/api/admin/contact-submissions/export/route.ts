import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { CONTACT_PAGE_MODULE } from "../../../../modules/contact-page"
import type ContactPageModuleService from "../../../../modules/contact-page/service"

const COLUMNS = [
  "id",
  "created_at",
  "full_name",
  "company",
  "email",
  "phone_number",
  "location",
  "message",
] as const

/**
 * Quotes every value and doubles embedded quotes, per RFC 4180. A leading
 * =, +, - or @ is prefixed with a tab so spreadsheet software treats the cell
 * as text rather than a formula.
 */
const toCsvCell = (value: unknown) => {
  if (value === null || value === undefined) {
    return '""'
  }

  const raw = value instanceof Date ? value.toISOString() : String(value)
  const guarded = /^[=+\-@]/.test(raw) ? `\t${raw}` : raw

  return `"${guarded.replace(/"/g, '""')}"`
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: ContactPageModuleService = req.scope.resolve(
    CONTACT_PAGE_MODULE
  )

  const submissions = await service.listContactSubmissions(
    {},
    { order: { created_at: "DESC" } }
  )

  const rows = submissions.map((submission: Record<string, unknown>) =>
    COLUMNS.map((column) => toCsvCell(submission[column])).join(",")
  )

  // The BOM makes Excel read the file as UTF-8 instead of the system codepage.
  const csv = `﻿${COLUMNS.join(",")}\n${rows.join("\n")}\n`
  const filename = `contact-submissions-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`

  res.setHeader("Content-Type", "text/csv; charset=utf-8")
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
  res.send(csv)
}
