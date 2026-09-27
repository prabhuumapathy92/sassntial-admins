import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import {
  createContactSubmissionStep,
  type CreateContactSubmissionInput,
} from "./steps/create-contact-submission"
import { sendContactSubmissionEmailStep } from "./steps/send-contact-submission-email"

export type { CreateContactSubmissionInput }

export const createContactSubmissionWorkflow = createWorkflow(
  "create-contact-submission",
  (input: CreateContactSubmissionInput) => {
    const submission = createContactSubmissionStep(input)
    const email_sent = sendContactSubmissionEmailStep(submission)

    return new WorkflowResponse({ submission, email_sent })
  }
)

export default createContactSubmissionWorkflow
