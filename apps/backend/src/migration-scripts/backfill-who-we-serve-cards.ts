import { MedusaContainer } from "@medusajs/framework"

import { PAGE_BUILDER_MODULE } from "../modules/page-builder"
import type PageBuilderModuleService from "../modules/page-builder/service"

/**
 * Gives every Who We Serve page explicit capability cards.
 *
 *   npx medusa exec ./src/migration-scripts/backfill-who-we-serve-cards.ts
 *
 * The cards used to be generated from highlights and support points, with four
 * fixed illustrations cycled behind them - so an editor could not change the
 * card copy or its artwork. This writes the current values into the block as
 * real cards, matching what the site already renders, after which they are
 * editable like any other list.
 *
 * Pages that already have cards are left alone, so re-running never overwrites
 * an edit.
 */

/** The four illustrations the showcase cycled through, in the same order. */
const DEFAULT_IMAGES = [
  "/geo-optimization.jpeg",
  "/aeo.jpeg",
  "/ai-visibility.jpeg",
  "/authority.jpeg",
]

export default async function backfillCards({
  container,
}: {
  container: MedusaContainer
}) {
  const service: PageBuilderModuleService =
    container.resolve(PAGE_BUILDER_MODULE)

  const pages = await service.listPagesWithBlocks()
  let updated = 0
  let skipped = 0

  for (const page of pages) {
    const block = page.blocks.find((entry) => entry.type === "whoWeServe")

    if (!block) {
      continue
    }

    const data = block.data as Record<string, any>

    if (Array.isArray(data.cards) && data.cards.length) {
      skipped += 1
      continue
    }

    const highlights: string[] = Array.isArray(data.highlights)
      ? data.highlights
      : []
    const supportPoints: string[] = Array.isArray(data.supportPoints)
      ? data.supportPoints
      : []

    const count = Math.max(highlights.length, supportPoints.length)

    const cards = Array.from({ length: count }, (_, index) => ({
      title: supportPoints[index] ?? `Focus ${String(index + 1).padStart(2, "0")}`,
      description: highlights[index] ?? data.intro ?? data.summary ?? "",
      image: DEFAULT_IMAGES[index % DEFAULT_IMAGES.length],
    }))

    await service.upsertPage(
      {
        slug: page.slug,
        title: page.title,
        breadcrumb_label: page.breadcrumb_label,
        parent_id: page.parent_id,
        status: page.status,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        blocks: page.blocks.map((entry) =>
          entry.id === block.id
            ? { type: entry.type, data: { ...data, cards }, is_active: true }
            : {
                type: entry.type,
                data: entry.data,
                is_active: entry.is_active,
              }
        ),
      },
      page.id
    )

    updated += 1
  }

  console.log(
    `Backfilled capability cards on ${updated} pages (${skipped} already had them).`
  )
}
