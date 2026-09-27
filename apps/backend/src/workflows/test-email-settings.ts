import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { sendEmailSettingsTestStep } from "./steps/send-email-settings-test"

export const testEmailSettingsWorkflow = createWorkflow(
  "test-email-settings",
  (_input: Record<string, never>) => {
    const result = sendEmailSettingsTestStep({})

    return new WorkflowResponse(result)
  }
)

export default testEmailSettingsWorkflow
