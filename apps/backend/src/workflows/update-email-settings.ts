import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import type { EmailSettingsInput } from "../modules/contact-page/service"
import { updateEmailSettingsStep } from "./steps/update-email-settings"

export const updateEmailSettingsWorkflow = createWorkflow(
  "update-email-settings",
  (input: EmailSettingsInput) => {
    const settings = updateEmailSettingsStep(input)

    return new WorkflowResponse(settings)
  }
)

export default updateEmailSettingsWorkflow
