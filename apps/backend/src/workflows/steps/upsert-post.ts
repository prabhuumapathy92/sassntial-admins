import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { PAGE_BUILDER_MODULE } from "../../modules/page-builder"
import type PageBuilderModuleService from "../../modules/page-builder/service"
import type { PostInput } from "../../modules/page-builder/service"

export type UpsertPostStepInput = {
  post: PostInput
  post_id?: string
}

export const upsertPostStep = createStep(
  "upsert-post",
  async (input: UpsertPostStepInput, { container }) => {
    const service: PageBuilderModuleService =
      container.resolve(PAGE_BUILDER_MODULE)

    const previous = input.post_id
      ? await service.retrievePostBySlug(input.post.slug)
      : null

    const post = await service.upsertPost(input.post, input.post_id)

    return new StepResponse(post, {
      post_id: post.id,
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
      await service.removePost(context.post_id)
      return
    }

    if (context.previous) {
      const { id, published_at, reading_minutes, blocks, ...rest } =
        context.previous

      await service.upsertPost(
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

export default upsertPostStep
