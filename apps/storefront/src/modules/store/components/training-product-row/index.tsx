import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { stripHtml } from "@modules/products/lib/webinar-content"
import TrainingCardBookmark from "@modules/store/components/training-card-bookmark"
import {
  getTrainingCategory,
  getTrainingDuration,
  getTrainingFormat,
  getTrainingInitials,
  getTrainingLevel,
  getTrainingSpeaker,
  getTrainingSpeakerRole,
  getTrainingSummary,
  getTrainingTime,
} from "@modules/store/lib/training-catalog"

const TrainingProductRow = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const speaker = getTrainingSpeaker(product)
  const speakerRole = getTrainingSpeakerRole(product)
  // Medusa stores descriptions as HTML, so the card renders the text content
  // rather than the markup, collapsed onto a single run and clamped to two
  // lines by `line-clamp-2` below.
  const rawSummary = getTrainingSummary(product)
  const summary = rawSummary
    ? stripHtml(rawSummary).replace(/\s+/g, " ").trim() || null
    : null
  const time = getTrainingTime(product)
  const duration = getTrainingDuration(product)
  const format = getTrainingFormat(product)
  const level = getTrainingLevel(product)
  const category = getTrainingCategory(product)
  const avatarLabel = speaker || product.title
  const initials = getTrainingInitials(avatarLabel)
  const { cheapestPrice } = getProductPrice({ product })
  const priceLabel = cheapestPrice?.calculated_price ?? "Contact for pricing"
  const hasDiscount =
    !!cheapestPrice &&
    cheapestPrice.original_price_number > cheapestPrice.calculated_price_number

  // Only facts the product actually carries, so a card never shows a blank slot.
  const facts = [duration, time, format].filter(Boolean) as string[]

  return (
    <li className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden border border-[#e5e9f0] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="border border-[#d6e4f5] bg-[#f3f8ff] px-2.5 py-1 text-[9px] font-semibold uppercase text-[#2c7cf7]">
              {category}
            </span>
            <span className="border border-[#e5e9f0] bg-[#f8fafc] px-2.5 py-1 text-[9px] font-semibold uppercase text-[#64748b]">
              {level}
            </span>
          </div>

          <TrainingCardBookmark productId={product.id} title={product.title} />
        </div>

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="mt-4 inline-flex max-w-full"
        >
          <h3 className="line-clamp-2 text-[1.05rem] font-bold leading-snug text-[#0f172a] transition group-hover:text-[#185ec9]">
            {product.title}
          </h3>
        </LocalizedClientLink>

        {summary ? (
          <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-[#64748b]">
            {summary}
          </p>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-[#e5e9f0] bg-[linear-gradient(135deg,#dce9ff_0%,#f7fbff_60%,#fff2dd_100%)] text-[11px] font-bold text-[#1d4ed8]"
            >
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={avatarLabel}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#0f172a]">
                {speaker || "Speaker to be announced"}
              </p>
              {speakerRole ? (
                <p className="truncate text-[11px] text-[#94a3b8]">
                  {speakerRole}
                </p>
              ) : null}
            </div>
          </div>

          {format ? (
            <span className="shrink-0 text-[11px] font-semibold text-[#2c7cf7]">
              {format}
            </span>
          ) : null}
        </div>

        {facts.length ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#94a3b8]">
            {facts.map((fact, index) => (
              <span key={fact} className="flex items-center gap-3">
                {index > 0 ? <span className="text-[#cbd5e1]">·</span> : null}
                {fact}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#eef2f7] pt-4">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase text-[#94a3b8]">
              Starting at
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-[1.3rem] font-bold text-[#0f172a]">
                {priceLabel}
              </span>
              {hasDiscount ? (
                <span className="text-[12px] text-[#94a3b8] line-through">
                  {cheapestPrice!.original_price}
                </span>
              ) : null}
            </p>
          </div>

          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="inline-flex shrink-0 items-center justify-center bg-brand-cta px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_10px_22px_rgba(44,124,247,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            View Details
          </LocalizedClientLink>
        </div>
      </article>
    </li>
  )
}

export default TrainingProductRow
