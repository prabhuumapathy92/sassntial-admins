"use client"

import { readWishlist, toggleWishlistItem } from "@lib/util/wishlist"
import { clx } from "@medusajs/ui"
import { useEffect, useState } from "react"

/** Bookmark toggle on a catalog card, backed by the same list as the product page. */
export default function TrainingCardBookmark({
  productId,
  title,
}: {
  productId: string
  title: string
}) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setIsSaved(readWishlist().includes(productId))
  }, [productId])

  return (
    <button
      type="button"
      onClick={() => setIsSaved(toggleWishlistItem(productId).includes(productId))}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${title} from saved` : `Save ${title}`}
      className={clx(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center border transition-colors",
        isSaved
          ? "border-[#2c7cf7] bg-[#f3f8ff] text-[#2c7cf7]"
          : "border-[#e5e9f0] bg-white text-[#cbd5e1] hover:border-[#bfdbfe] hover:text-[#2c7cf7]"
      )}
      data-testid="training-card-bookmark"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
      </svg>
    </button>
  )
}
