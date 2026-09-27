import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import type { NavNode, NavTree } from "../../modules/navigation/service"
import { PAGE_BUILDER_MODULE } from "../../modules/page-builder"
import type PageBuilderModuleService from "../../modules/page-builder/service"
import type { PageStatus } from "../../modules/page-builder/service"

/**
 * Unpublishes the page behind a disabled menu entry.
 *
 * Hiding an entry is how an editor takes a destination off the site, so it is
 * forced: the page drops to draft even when another entry still links to it.
 * Those other links go with it, because the storefront hides every link to a
 * draft page. To remove one link and leave the page published, delete the row
 * instead of disabling it.
 *
 * Deliberately one-way. Enabling an entry does not publish, because saving the
 * menu would then resurrect pages someone had intentionally left in draft -
 * publishing stays an explicit act from the Pages screen.
 *
 * Only links that resolve to a page the CMS knows about are touched: a
 * hand-built route like /training has no page record, and a menu heading has
 * no destination at all.
 *
 * Only the row the editor actually switched off counts. Hiding a group hides
 * its links, but it does not unpublish what they point to: hiding the Training
 * menu's "Next Steps" column should not take the contact page - and with it the
 * Get Started button in the header - off the site.
 */

const collect = (nodes: NavNode[], disabled: Set<string>) => {
  for (const node of nodes) {
    const slug = node.href?.replace(/^\/+|\/+$/g, "")

    if (node.is_active === false && slug) {
      disabled.add(slug)
    }

    collect(node.children, disabled)
  }
}

export const syncPagesWithNavigationStep = createStep(
  "sync-pages-with-navigation",
  async (tree: NavTree, { container }) => {
    const service: PageBuilderModuleService =
      container.resolve(PAGE_BUILDER_MODULE)

    const disabled = new Set<string>()
    collect([...tree.primary, ...tree.secondary, ...tree.cta], disabled)

    const pages = await service.listPagesWithBlocks({ status: "published" })
    const changed: Array<{ id: string; previous: PageStatus }> = []

    for (const page of pages) {
      if (!disabled.has(page.slug)) {
        continue
      }

      await service.setPageStatus(page.id, "draft")
      changed.push({ id: page.id, previous: page.status })
    }

    return new StepResponse(changed, changed)
  },
  async (changed, { container }) => {
    if (!changed?.length) {
      return
    }

    const service: PageBuilderModuleService =
      container.resolve(PAGE_BUILDER_MODULE)

    for (const entry of changed) {
      await service.setPageStatus(entry.id, entry.previous)
    }
  }
)

export default syncPagesWithNavigationStep
