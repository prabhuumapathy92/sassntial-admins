import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { NAVIGATION_MODULE } from "../../../modules/navigation"
import type NavigationModuleService from "../../../modules/navigation/service"
import type { NavNode, NavTree } from "../../../modules/navigation/service"
import { PAGE_BUILDER_MODULE } from "../../../modules/page-builder"
import type PageBuilderModuleService from "../../../modules/page-builder/service"

/**
 * Hides menu entries that point at unpublished pages.
 *
 * Computed on read rather than stored, so unpublishing a page takes its menu
 * entry with it and republishing brings it back, with no second place to keep
 * in sync. Only links to pages the CMS actually knows about are considered: a
 * hand-built route like /training has no page record and must not disappear.
 *
 * A group left with no visible children is dropped too, since an empty
 * mega-menu column reads as broken. A top-level item keeps its place if it has
 * a destination of its own.
 */
const prune = (nodes: NavNode[], hidden: Set<string>): NavNode[] =>
  nodes.flatMap((node) => {
    const slug = node.href?.replace(/^\/+|\/+$/g, "")

    if (slug && hidden.has(slug)) {
      return []
    }

    const children = prune(node.children, hidden)

    // A heading exists only to hold links; without them it has nothing to show.
    if (!node.href && node.children.length && !children.length) {
      return []
    }

    return [{ ...node, children }]
  })

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: NavigationModuleService = req.scope.resolve(NAVIGATION_MODULE)
  const pages: PageBuilderModuleService = req.scope.resolve(PAGE_BUILDER_MODULE)

  const tree = await service.retrieveTree()

  const drafts = await pages.listPagesWithBlocks({ status: "draft" })
  const hidden = new Set(drafts.map((page) => page.slug))

  const navigation = (
    Object.entries(tree) as Array<[keyof NavTree, NavNode[]]>
  ).reduce<NavTree>(
    (result, [menu, nodes]) => ({ ...result, [menu]: prune(nodes, hidden) }),
    { primary: [], secondary: [], cta: [] }
  )

  res.json({ navigation })
}
