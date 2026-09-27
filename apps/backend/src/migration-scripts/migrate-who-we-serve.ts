import { MedusaContainer } from "@medusajs/framework"

import { PAGE_BUILDER_MODULE } from "../modules/page-builder"
import type PageBuilderModuleService from "../modules/page-builder/service"

import items from "./data/who-we-serve.json"

/**
 * Moves the Who We Serve pages out of the storefront's hardcoded constants and
 * into the CMS, so they can be edited in Medusa Admin.
 *
 *   npx medusa exec ./src/migration-scripts/migrate-who-we-serve.ts
 *
 * The JSON beside this file was exported from
 * apps/storefront/src/modules/who-we-serve/constants/who-we-serve-items.ts, so
 * the copy is identical to what the site already shows. Re-running overwrites
 * each page with those originals, which discards later edits - run it once per
 * environment.
 */

type WhoWeServeItem = {
  slug: string
  label: string
  eyebrow: string
  summary: string
  intro: string
  highlights: string[]
  supportPoints: string[]
}

const PARENT_SLUG = "who-we-serve"

export default async function migrateWhoWeServe({
  container,
}: {
  container: MedusaContainer
}) {
  const service: PageBuilderModuleService =
    container.resolve(PAGE_BUILDER_MODULE)

  // The index page is the breadcrumb parent, so every child inherits
  // "Home / Who We Serve / ..." without anyone typing a trail.
  const existingParent = await service.retrievePageBySlug(PARENT_SLUG)
  const parent =
    existingParent ??
    (await service.upsertPage({
      slug: PARENT_SLUG,
      title: "Who We Serve",
      breadcrumb_label: "Who We Serve",
      status: "published",
      blocks: [],
    }))

  let created = 0

  for (const item of items as WhoWeServeItem[]) {
    const slug = `${PARENT_SLUG}/${item.slug}`
    const existing = await service.retrievePageBySlug(slug)

    await service.upsertPage(
      {
        slug,
        title: item.label,
        breadcrumb_label: item.label,
        parent_id: parent.id,
        status: "published",
        seo_description: item.summary,
        blocks: [
          {
            type: "whoWeServe",
            data: {
              label: item.label,
              eyebrow: item.eyebrow,
              summary: item.summary,
              intro: item.intro,
              highlights: item.highlights,
              supportPoints: item.supportPoints,
            },
          },
        ],
      },
      existing?.id
    )

    created += 1
  }

  console.log(
    `Migrated ${created} Who We Serve pages into the CMS under "${PARENT_SLUG}".`
  )
}
