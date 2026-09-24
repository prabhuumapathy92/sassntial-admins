import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { CONTACT_PAGE_MODULE } from "../../modules/contact-page"
import type ContactPageModuleService from "../../modules/contact-page/service"

export type CreateContactSubmissionInput = {
  full_name: string
  company?: string | null
  email: string
  phone_number?: string | null
  location?: string | null
  message: string
}

export const createContactSubmissionStep = createStep(
  "create-contact-submission",
  async (input: CreateContactSubmissionInput, { container }) => {
    const service: ContactPageModuleService =
      container.resolve(CONTACT_PAGE_MODULE)

    const submission = await service.createContactSubmissions(input)

    return new StepResponse(submission, submission.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service: ContactPageModuleService =
      container.resolve(CONTACT_PAGE_MODULE)

    await service.deleteContactSubmissions(id)
  }
)

export default createContactSubmissionStep
