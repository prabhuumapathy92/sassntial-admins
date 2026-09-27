import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { NAVIGATION_MODULE } from "../../modules/navigation"
import type NavigationModuleService from "../../modules/navigation/service"
import type { FooterConfig } from "../../modules/navigation/service"

export const replaceFooterConfigStep = createStep(
  "replace-footer-config",
  async (input: FooterConfig, { container }) => {
    const service: NavigationModuleService =
      container.resolve(NAVIGATION_MODULE)
    const previous = await service.retrieveFooterConfig()
    const footer = await service.replaceFooterConfig(input)

    return new StepResponse(footer, previous)
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }

    const service: NavigationModuleService =
      container.resolve(NAVIGATION_MODULE)

    await service.replaceFooterConfig(previous)
  },
)

export default replaceFooterConfigStep
