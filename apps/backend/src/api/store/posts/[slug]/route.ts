import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { PAGE_BUILDER_MODULE } from "../../../../modules/page-builder"
import type PageBuilderModuleService from "../../../../modules/page-builder/service"
import { isPreviewRequest } from "../../../../lib/preview"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: PageBuilderModuleService =
    req.scope.resolve(PAGE_BUILDER_MODULE)

  const slug = decodeURIComponent(req.params.slug)
  const preview = isPreviewRequest(req)
  const post = await service.retrievePostBySlug(
    slug,
    preview ? {} : { status: "published" }
  )

  if (!post) {
    res.status(404).json({ message: `Post "${slug}" not found` })
    return
  }

  // Derived here so every consumer renders the same trail, and so the category
  // crumb stays in step with the post's own category.
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(post.category
      ? [
          {
            label: post.category.name,
            href: `/blog?category=${encodeURIComponent(post.category.slug)}`,
          },
        ]
      : []),
    { label: post.title, href: null },
  ]

  res.json({ post, breadcrumbs, preview })
}
