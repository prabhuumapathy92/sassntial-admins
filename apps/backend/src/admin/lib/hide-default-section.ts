/**
 * Medusa has no API for removing a built-in detail section, so a widget that
 * replaces one has to hide it in the DOM.
 *
 * `resolve` must return the exact elements to hide. Returning an ancestor that
 * also holds unrelated fields takes the rest of the page down with it, which is
 * why the callers below match a single section container or a single row and
 * never fall back to a bare `closest("div")`.
 *
 * Returns a teardown function for the calling effect.
 */
export const hideDefaultSections = (resolve: () => HTMLElement[]) => {
  let frame: number | null = null

  const apply = () => {
    frame = null

    for (const element of resolve()) {
      if (element.dataset.medusaWidgetHidden === "true") {
        continue
      }

      element.dataset.medusaWidgetHidden = "true"
      element.style.display = "none"
    }
  }

  const schedule = () => {
    if (frame === null) {
      frame = requestAnimationFrame(apply)
    }
  }

  apply()

  // Only childList is observed. `apply` writes an attribute and an inline
  // style, so observing attributes too would make every pass retrigger the
  // observer. Coalescing into one frame keeps re-renders from thrashing it.
  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true })

  return () => {
    observer.disconnect()

    if (frame !== null) {
      cancelAnimationFrame(frame)
    }
  }
}

/** Exact, trimmed text match -- the section labels we target are short. */
export const hasLabel = (
  element: Element | null | undefined,
  labels: string[]
) => {
  const text = element?.textContent?.trim()

  return !!text && labels.includes(text)
}
