"use client"

import { clx } from "@medusajs/ui"
import {
  CalendarIcon,
  HeartIcon,
  PlayIcon,
} from "@modules/products/components/webinar-icons"
import { readWishlist, toggleWishlistItem } from "@lib/util/wishlist"
import { useEffect, useState } from "react"

type WebinarHeaderActionsProps = {
  productId: string
  recordingUrl?: string | null
  liveSessionLabel?: string | null
}

export default function WebinarHeaderActions({
  productId,
  recordingUrl,
  liveSessionLabel,
}: WebinarHeaderActionsProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    setIsWishlisted(readWishlist().includes(productId))
  }, [productId])

  const toggleWishlist = () => {
    setIsWishlisted(toggleWishlistItem(productId).includes(productId))
  }

  // These are secondary to Add To Cart, so they stay in the navy tier and leave
  // the gold gradient to the one primary action on the page.
  const buttonClass =
    "inline-flex items-center gap-1.5 border px-3.5 py-1.5 text-[12px] font-semibold transition-colors"

  const outline =
    "border-brand-navy/25 bg-white text-brand-navy hover:border-brand-navy/50 hover:bg-brand-mist"

  const solid =
    "border-brand-navy bg-brand-navy text-white hover:bg-brand-ink"

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={toggleWishlist}
        aria-pressed={isWishlisted}
        className={clx(buttonClass, isWishlisted ? solid : outline)}
      >
        <HeartIcon className="h-3.5 w-3.5" filled={isWishlisted} />
        {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
      </button>

      {recordingUrl && (
        <a
          href={recordingUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={clx(buttonClass, outline)}
        >
          <PlayIcon className="h-3 w-3" />
          Play Recording
        </a>
      )}

      {liveSessionLabel && (
        <a
          href="#webinar-options"
          className={clx(buttonClass, solid)}
          title={`Live session: ${liveSessionLabel}`}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          Schedule Live
        </a>
      )}
    </div>
  )
}
