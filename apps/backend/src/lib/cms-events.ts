import { Modules } from "@medusajs/framework/utils"

/**
 * Emits the page-changed event outside a workflow.
 *
 * The status route is a single update rather than a workflow, but the
 * storefront still needs its caches cleared, so it raises the same event the
 * upsert workflow does and the revalidation subscriber handles both.
 */
export const emitCmsPageChanged = async (scope: any, slug: string) => {
  try {
    const eventBus = scope.resolve(Modules.EVENT_BUS)

    await eventBus.emit({ name: "cms.page.changed", data: { slug } })
  } catch (error) {
    // A missing event bus must not fail the status change itself.
    scope
      .resolve("logger")
      .warn(
        `Could not emit cms.page.changed: ${
          error instanceof Error ? error.message : "unknown error"
        }`
      )
  }
}
