import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { createContactSubmissionWorkflow } from "../../../workflows/create-contact-submission"
import type { CreateContactSubmissionBody } from "./validators"

export async function POST(
  req: MedusaRequest<CreateContactSubmissionBody>,
  res: MedusaResponse
) {
  const { result } = await createContactSubmissionWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  // Only the id goes back: the storefront needs a success signal, not the row.
  res.status(201).json({ contact_submission: { id: result.id } })
}
