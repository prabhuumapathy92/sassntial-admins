import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import type { ContactPageInput } from "../modules/contact-page/service"

import { updateContactPageStep } from "./steps/update-contact-page"

export type UpdateContactPageInput = ContactPageInput

export const updateContactPageWorkflow = createWorkflow(
  "update-contact-page",
  (input: UpdateContactPageInput) => {
    const settings = updateContactPageStep(input)

    return new WorkflowResponse(settings)
  }
)

export default updateContactPageWorkflow
