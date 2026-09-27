import { emitEventStep } from "@medusajs/medusa/core-flows"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import type { FooterConfig } from "../modules/navigation/service"
import { replaceFooterConfigStep } from "./steps/replace-footer-config"

export const replaceFooterConfigWorkflow = createWorkflow(
  "replace-footer-config",
  (input: { footer: FooterConfig }) => {
    const footer = replaceFooterConfigStep(input.footer)

    emitEventStep({ eventName: "cms.footer.changed", data: {} })

    return new WorkflowResponse(footer)
  },
)

export default replaceFooterConfigWorkflow
