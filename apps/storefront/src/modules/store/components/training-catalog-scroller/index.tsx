"use client"

import { Children, useEffect, useMemo, useRef, useState } from "react"

const INITIAL_COUNT = 10
const STEP = 10

/**
 * Reveals the catalog a batch at a time as the shopper scrolls.
 *
 * The rows arrive as already rendered children, so the server keeps doing the
 * product rendering and this component only controls how many are on screen.
 * Every filtered product is fetched up front, so revealing more costs no
 * further requests.
 */
export default function TrainingCatalogScroller({
  title,
  eyebrow,
  subtitle,
  filters,
  emptyState,
  children,
  initialCount = INITIAL_COUNT,
  step = STEP,
}: {
  title: string
  eyebrow?: string
  subtitle?: string
  /** Rendered under the header, above the grid. */
  filters?: React.ReactNode
  /** Shown in place of the grid when nothing matches. */
  emptyState?: React.ReactNode
  children: React.ReactNode
  initialCount?: number
  step?: number
}) {
  const rows = useMemo(() => Children.toArray(children), [children])
  const total = rows.length

  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(initialCount, total)
  )
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // A new filter renders a different set of rows, so the count starts over.
  useEffect(() => {
    setVisibleCount(Math.min(initialCount, total))
  }, [initialCount, total])

  const hasMore = visibleCount < total

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!hasMore || !sentinel || typeof IntersectionObserver === "undefined") {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => Math.min(current + step, total))
        }
      },
      // Start loading before the sentinel is actually on screen so the list
      // grows without the shopper hitting a visible stop.
      { rootMargin: "320px 0px" }
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasMore, step, total, visibleCount])

  return (
    <div className="space-y-4 small:space-y-6">
      <header className="border-b border-[#e3e3e3] pb-5">
        <div className="flex flex-col gap-4 medium:flex-row medium:items-end medium:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase text-[#f59e0b]">
                {eyebrow}
              </p>
            ) : null}
            <h1
              className="mt-1.5 text-[1.75rem] font-bold leading-tight text-[#0f172a] small:text-[2.1rem]"
              data-testid="store-page-title"
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#667085]">
                {subtitle}
              </p>
            ) : null}
          </div>

          <p
            className="shrink-0 text-[13px] text-[#667085]"
            data-testid="product-pagination"
            aria-live="polite"
          >
            Showing{" "}
            <span className="font-semibold text-[#0f172a]">{visibleCount}</span>{" "}
            of <span className="font-semibold text-[#0f172a]">{total}</span>
            {total === 1 ? " session" : " sessions"}
          </p>
        </div>
      </header>

      {filters}

      {total ? (
        <ul
          className="grid grid-cols-1 gap-4 xsmall:grid-cols-2 small:grid-cols-3"
          data-testid="products-list"
        >
          {rows.slice(0, visibleCount)}
        </ul>
      ) : (
        emptyState
      )}

      {hasMore && (
        <div ref={sentinelRef} className="pt-2">
          {/* Also a real control, so the rest stays reachable without scroll
              events - keyboard users and crawlers included. */}
          <button
            type="button"
            onClick={() =>
              setVisibleCount((current) => Math.min(current + step, total))
            }
            className="w-full border border-[#dbe3ef] bg-white px-6 py-4 text-sm font-semibold text-[#5b6b7f] transition hover:border-[#bfdbfe] hover:text-[#1d4ed8]"
            data-testid="load-more-products"
          >
            Loading more training...
          </button>
        </div>
      )}
    </div>
  )
}
