import { MedusaContainer } from "@medusajs/framework"

import { NAVIGATION_MODULE } from "../modules/navigation"
import type NavigationModuleService from "../modules/navigation/service"
import type { NavItemInput } from "../modules/navigation/service"

import navigation from "./data/navigation.json"

/**
 * Seeds the navigation from the storefront's previously hardcoded menu.
 *
 *   npx medusa exec ./src/migration-scripts/seed-navigation.ts
 *
 * The JSON beside this file was exported from
 * apps/storefront/src/modules/layout/constants/menu-items.ts, so the menu is
 * identical to what the site already shows rather than retyped.
 *
 * It replaces each menu wholesale, so re-running resets the navigation to
 * these defaults and discards edits made in the admin.
 */

type SeedNode = NavItemInput & { children?: SeedNode[] }

export default async function seedNavigation({
  container,
}: {
  container: MedusaContainer
}) {
  const service: NavigationModuleService = container.resolve(NAVIGATION_MODULE)

  await service.replaceMenu("primary", navigation.primary as SeedNode[])
  await service.replaceMenu("cta", navigation.cta as SeedNode[])

  const tree = await service.retrieveTree({ includeInactive: true })
  const count = (nodes: typeof tree.primary): number =>
    nodes.reduce((total, node) => total + 1 + count(node.children), 0)

  console.log(
    `Seeded navigation: ${count(tree.primary)} primary nodes ` +
      `(${tree.primary.length} top-level), ${count(tree.cta)} cta.`
  )
}
