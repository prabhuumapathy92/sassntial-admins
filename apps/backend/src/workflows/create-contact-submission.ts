import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import {
  createContactSubmissionStep,
  type CreateContactSubmissionInput,
} from "./steps/create-contact-submission"

export type { CreateContactSubmissionInput }

export const createContactSubmissionWorkflow = createWorkflow(
  "create-contact-submission",
  (input: CreateContactSubmissionInput) => {
    const submission = createContactSubmissionStep(input)

    return new WorkflowResponse(submission)
  }
)

export default createContactSubmissionWorkflow
