import { MedusaContainer } from "@medusajs/framework"

import { PAGE_BUILDER_MODULE } from "../modules/page-builder"
import type PageBuilderModuleService from "../modules/page-builder/service"

import companyItems from "./data/company.json"
import resourceItems from "./data/resources.json"
import serviceItems from "./data/services.json"

/**
 * Moves the Services, Company and Resources pages out of the storefront's
 * hardcoded constants and into the CMS.
 *
 *   npx medusa exec ./src/migration-scripts/migrate-static-pages.ts
 *
 * The JSON beside this file was exported from the constants modules
 * themselves, so the copy is identical to what the site already shows rather
 * than retyped. Each section becomes one structured block matching the shape
 * its template already consumed, which keeps the design untouched.
 *
 * Re-running overwrites each page with the exported originals, so it discards
 * later edits: run it once per environment.
 *
 * Nothing here goes through a workflow, so no revalidation event fires. Follow
 * it with a POST to the storefront's /api/revalidate?tags=cms-pages.
 */

type Section = {
  key: string
  title: string
  blockType: "service" | "company" | "resource"
  items: Array<Record<string, any>>
}

const SECTIONS: Section[] = [
  {
    key: "services",
    title: "Services",
    blockType: "service",
    items: serviceItems as Array<Record<string, any>>,
  },
  {
    key: "company",
    title: "Company",
    blockType: "company",
    items: companyItems as Array<Record<string, any>>,
  },
  {
    key: "resources",
    title: "Resources",
    blockType: "resource",
    items: resourceItems as Array<Record<string, any>>,
  },
]

/** Drops keys the block schema does not declare, so a save is not rejected. */
const pick = (source: Record<string, any>, keys: string[]) =>
  keys.reduce<Record<string, any>>((data, key) => {
    if (source[key] !== undefined) {
      data[key] = source[key]
    }

    return data
  }, {})

const FIELDS: Record<Section["blockType"], string[]> = {
  service: [
    "label",
    "eyebrow",
    "title",
    "summary",
    "intro",
    "capabilities",
    "outcomes",
    "sections",
    "supportingMessage",
    "differentiators",
    "aboutSection",
    "faqs",
    "finalCta",
  ],
  company: [
    "label",
    "eyebrow",
    "title",
    "summary",
    "intro",
    "heroNote",
    "ctaLabel",
    "heroImage",
    "highlights",
    "supportPoints",
    "proofTitle",
    "proofItems",
    "sectionTitle",
    "seoCards",
    "sections",
    "supportingMessage",
    "differentiators",
    "aboutSection",
    "finalCta",
  ],
  resource: [
    "label",
    "eyebrow",
    "title",
    "summary",
    "intro",
    "highlights",
    "formats",
  ],
}

export default async function migrateStaticPages({
  container,
}: {
  container: MedusaContainer
}) {
  const service: PageBuilderModuleService =
    container.resolve(PAGE_BUILDER_MODULE)

  for (const section of SECTIONS) {
    // The index page is the breadcrumb parent, so children inherit the trail.
    const existingParent = await service.retrievePageBySlug(section.key)
    const parent =
      existingParent ??
      (await service.upsertPage({
        slug: section.key,
        title: section.title,
        breadcrumb_label: section.title,
        status: "published",
        blocks: [],
      }))

    let count = 0

    for (const item of section.items) {
      const slug = `${section.key}/${item.slug}`
      const existing = await service.retrievePageBySlug(slug)

      await service.upsertPage(
        {
          slug,
          title: item.label ?? item.title ?? item.slug,
          breadcrumb_label: item.label ?? null,
          parent_id: parent.id,
          status: "published",
          seo_description: item.summary ?? null,
          blocks: [
            {
              type: section.blockType,
              data: pick(item, FIELDS[section.blockType]),
            },
          ],
        },
        existing?.id
      )

      count += 1
    }

    console.log(`Migrated ${count} ${section.title} pages under "${section.key}".`)
  }
}
