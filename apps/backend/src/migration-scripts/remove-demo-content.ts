import { MedusaContainer } from "@medusajs/framework"

import { PAGE_BUILDER_MODULE } from "../modules/page-builder"
import type PageBuilderModuleService from "../modules/page-builder/service"

/**
 * Deletes the sample content seeded while building the CMS, so only real
 * content remains.
 *
 *   npx medusa exec ./src/migration-scripts/remove-demo-content.ts
 *
 * Everything is matched by the exact slug or name the seed scripts used, so
 * anything created in the admin is left alone even if it shares a category.
 */

const DEMO_PAGE_SLUGS = ["preview-test"]

const DEMO_POST_SLUGS = [
  "what-is-generative-engine-optimisation",
  "structured-data-answer-engines-cite",
  "ai-visibility-audit-checklist",
  "entity-seo-beats-keywords",
  "multi-location-brand-visibility",
  "technical-seo-still-decides",
  "content-that-survives-summarisation",
  "measuring-ai-search-referrals",
]

const DEMO_CATEGORY_SLUGS = ["guides", "trends", "ai-seo", "stories"]

const DEMO_AUTHOR_NAMES = ["Prabhu Umapathy"]

export default async function removeDemoContent({
  container,
}: {
  container: MedusaContainer
}) {
  const service: PageBuilderModuleService =
    container.resolve(PAGE_BUILDER_MODULE)

  const removed = { pages: 0, posts: 0, categories: 0, authors: 0 }

  for (const slug of DEMO_PAGE_SLUGS) {
    const page = await service.retrievePageBySlug(slug)

    if (page) {
      await service.removePage(page.id)
      removed.pages += 1
    }
  }

  for (const slug of DEMO_POST_SLUGS) {
    const post = await service.retrievePostBySlug(slug)

    if (post) {
      await service.removePost(post.id)
      removed.posts += 1
    }
  }

  // Runs after the posts, so nothing is left pointing at a category or author
  // that is about to disappear.
  const categories = await service.listCategories()

  for (const category of categories) {
    if (DEMO_CATEGORY_SLUGS.includes(category.slug)) {
      await service.removeCategory(category.id)
      removed.categories += 1
    }
  }

  const authors = await service.listBylines()

  for (const author of authors) {
    if (DEMO_AUTHOR_NAMES.includes(author.name)) {
      await service.removeAuthor(author.id)
      removed.authors += 1
    }
  }

  console.log(
    `Removed demo content: ${removed.pages} pages, ${removed.posts} posts, ` +
      `${removed.categories} categories, ${removed.authors} authors.`
  )
}
