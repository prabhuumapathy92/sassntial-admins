import { emitEventStep } from "@medusajs/medusa/core-flows"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { upsertPostStep, type UpsertPostStepInput } from "./steps/upsert-post"

export const upsertPostWorkflow = createWorkflow(
  "upsert-post",
  (input: UpsertPostStepInput) => {
    const post = upsertPostStep(input)

    emitEventStep({ eventName: "cms.post.changed", data: { slug: post.slug } })

    return new WorkflowResponse(post)
  }
)

export default upsertPostWorkflow
