import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { testEmailSettingsWorkflow } from "../../../../workflows/test-email-settings"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await testEmailSettingsWorkflow(req.scope).run({
    input: {},
  })

  res.json({ test_email: result })
}
