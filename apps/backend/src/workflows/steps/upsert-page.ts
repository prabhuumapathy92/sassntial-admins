import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { PAGE_BUILDER_MODULE } from "../../modules/page-builder"
import type PageBuilderModuleService from "../../modules/page-builder/service"
import type { PageInput } from "../../modules/page-builder/service"

export type UpsertPageStepInput = {
  page: PageInput
  page_id?: string
}

export const upsertPageStep = createStep(
  "upsert-page",
  async (input: UpsertPageStepInput, { container }) => {
    const service: PageBuilderModuleService =
      container.resolve(PAGE_BUILDER_MODULE)

    // Kept so the step can restore the previous content, or delete a page it
    // created, if a later step fails.
    const previous = input.page_id
      ? await service.retrievePageBySlug(input.page.slug)
      : null

    const page = await service.upsertPage(input.page, input.page_id)

    return new StepResponse(page, {
      page_id: page.id,
      created: !previous,
      previous,
    })
  },
  async (context, { container }) => {
    if (!context) {
      return
    }

    const service: PageBuilderModuleService =
      container.resolve(PAGE_BUILDER_MODULE)

    if (context.created) {
      await service.removePage(context.page_id)
      return
    }

    if (context.previous) {
      const { id, published_at, blocks, ...rest } = context.previous

      await service.upsertPage(
        {
          ...rest,
          blocks: blocks.map((block) => ({
            type: block.type,
            position: block.position,
            data: block.data,
            is_active: block.is_active,
          })),
        },
        id
      )
    }
  }
)

export default upsertPageStep
