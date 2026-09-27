import { emitEventStep } from "@medusajs/medusa/core-flows"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { upsertPageStep, type UpsertPageStepInput } from "./steps/upsert-page"

export const upsertPageWorkflow = createWorkflow(
  "upsert-page",
  (input: UpsertPageStepInput) => {
    const page = upsertPageStep(input)

    // Only fires once the workflow succeeds, so a failed save never tells the
    // storefront to drop its cache.
    emitEventStep({ eventName: "cms.page.changed", data: { slug: page.slug } })

    return new WorkflowResponse(page)
  }
)

export default upsertPageWorkflow
