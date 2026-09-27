import { emitEventStep } from "@medusajs/medusa/core-flows"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import {
  replaceNavigationMenuStep,
  type ReplaceNavigationMenuInput,
} from "./steps/replace-navigation-menu"
import { syncPagesWithNavigationStep } from "./steps/sync-pages-with-navigation"

export const replaceNavigationMenuWorkflow = createWorkflow(
  "replace-navigation-menu",
  (input: ReplaceNavigationMenuInput) => {
    const tree = replaceNavigationMenuStep(input)

    // A disabled entry unpublishes the page it links to, so visibility is
    // controlled from one place.
    syncPagesWithNavigationStep(tree)

    // Both caches: the menu changed, and page statuses may have with it.
    emitEventStep({ eventName: "cms.page.changed", data: {} })

    return new WorkflowResponse(tree)
  }
)

export default replaceNavigationMenuWorkflow
