import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { revalidateStorefront } from "../lib/revalidate-storefront"
import { PAGE_BUILDER_MODULE } from "../modules/page-builder"
import type PageBuilderModuleService from "../modules/page-builder/service"
import type { PostCategoryRecord } from "../modules/page-builder/service"

import companyItems from "./data/company.json"

/**
 * Moves the site's original blog posts into the CMS.
 *
 *   npx medusa exec ./src/migration-scripts/seed-blog-posts.ts
 *
 * The blog lists published CMS posts, but these five only ever existed in the
 * hardcoded company data, so the blog showed nothing. Each post keeps its slug,
 * cover image and original date, so links and the listing order match the old
 * site, and afterwards they are edited in Medusa Admin like any other post.
 *
 * A post whose slug already exists is left alone and categories are reused by
 * slug, so re-running never overwrites an edit made in the admin. Each run ends
 * by refreshing the storefront's cached blog, so if the storefront was down the
 * first time, running this again brings the posts up.
 */

type LegacyPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  imageUrl?: string
  body: string[]
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }

    return entities[character]
  })

/** The legacy data writes dates as M/D/YYYY. */
const parseDate = (value: string) => {
  const [month, day, year] = value.split("/").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day, 9))

  return Number.isNaN(date.getTime()) ? null : date
}

const toCategoryName = (slug: string) =>
  slug.charAt(0).toUpperCase() + slug.slice(1)

export default async function seedBlogPosts({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const service: PageBuilderModuleService =
    container.resolve(PAGE_BUILDER_MODULE)

  const blog = (companyItems as Array<Record<string, any>>).find(
    (item) => item.slug === "blog"
  )
  const posts: LegacyPost[] = blog?.blogPosts ?? []

  const categories = new Map<string, PostCategoryRecord>(
    (await service.listCategories()).map((category) => [
      category.slug,
      category,
    ])
  )

  let created = 0
  let skipped = 0

  for (const post of posts) {
    if (await service.retrievePostBySlug(post.slug)) {
      skipped += 1
      continue
    }

    const categorySlug = post.category.trim().toLowerCase()
    let category = categories.get(categorySlug)

    if (!category) {
      category = await service.upsertCategory({
        name: toCategoryName(categorySlug),
        slug: categorySlug,
      })
      categories.set(categorySlug, category)
    }

    const saved = await service.upsertPost({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      cover_image: post.imageUrl ?? null,
      category_id: category.id,
      status: "published",
      seo_description: post.excerpt,
      blocks: [
        {
          type: "richText",
          data: {
            title: "",
            html: post.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(""),
          },
        },
      ],
    })

    // upsertPost stamps "now" on first publish; the original date keeps the
    // posts in the order the old blog showed them.
    const publishedAt = parseDate(post.date)

    if (publishedAt) {
      await service.updatePosts([{ id: saved.id, published_at: publishedAt }])
    }

    created += 1
  }

  logger.info(
    `Blog posts: ${created} created, ${skipped} already present`
  )

  // Always, not only when something was created: re-running the script is then
  // also how to refresh a storefront that was down during the first run.
  await revalidateStorefront(["cms-posts"], logger, "seeding blog posts")
}
