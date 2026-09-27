import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { NAVIGATION_MODULE } from "../../modules/navigation"
import type NavigationModuleService from "../../modules/navigation/service"
import type {
  NavItemInput,
  NavMenuKey,
  NavNode,
} from "../../modules/navigation/service"

export type ReplaceNavigationMenuInput = {
  menu: NavMenuKey
  items: NavItemInput[]
}

/** Shapes a saved tree back into the input form, so it can be re-applied. */
const toInput = (nodes: NavNode[]): NavItemInput[] =>
  nodes.map((node) => ({
    label: node.label,
    href: node.href,
    icon: node.icon,
    media: node.media,
    is_active: node.is_active,
    ...(node.children.length ? { children: toInput(node.children) } : {}),
  }))

export const replaceNavigationMenuStep = createStep(
  "replace-navigation-menu",
  async (input: ReplaceNavigationMenuInput, { container }) => {
    const service: NavigationModuleService =
      container.resolve(NAVIGATION_MODULE)

    // The menu is rewritten wholesale, so the old tree is kept to put back if a
    // later step fails.
    const before = await service.retrieveTree({ includeInactive: true })
    const tree = await service.replaceMenu(input.menu, input.items)

    return new StepResponse(tree, {
      menu: input.menu,
      items: toInput(before[input.menu] ?? []),
    })
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }

    const service: NavigationModuleService =
      container.resolve(NAVIGATION_MODULE)

    await service.replaceMenu(previous.menu, previous.items)
  }
)

export default replaceNavigationMenuStep
