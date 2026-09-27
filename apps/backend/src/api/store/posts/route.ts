import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../modules/page-builder"
import type PageBuilderModuleService from "../../../modules/page-builder/service"

/**
 * Published posts, newest first, for the blog index.
 *
 * Blocks come back with each post so a listing can show a preview without a
 * second round trip; the index itself only needs the metadata.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  const all = await service.listPostsWithBlocks({ status: "published" })

  // Filtered by slug rather than id, so the blog's own URLs stay readable.
  const category = req.query.category as string | undefined
  const posts = category
    ? all.filter((post) => post.category?.slug === category)
    : all

  const categories = [
    ...new Map(
      all
        .map((post) => post.category)
        .filter((entry): entry is NonNullable<typeof entry> => !!entry)
        .map((entry) => [entry.id, entry])
    ).values(),
  ]

  res.json({ posts, count: posts.length, categories })
}
