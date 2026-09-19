import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  getTrainingCategory,
  getTrainingDuration,
  getTrainingFormat,
  getTrainingInitials,
  getTrainingLevel,
  getTrainingSpeaker,
  getTrainingSummary,
  getTrainingTime,
} from "@modules/store/lib/training-catalog"

const TrainingProductRow = ({
  product,
}: {
  product: HttpTypes.StoreProduct
}) => {
  const speaker = getTrainingSpeaker(product)
  const summary = getTrainingSummary(product)
  const time = getTrainingTime(product)
  const duration = getTrainingDuration(product)
  const format = getTrainingFormat(product)
  const level = getTrainingLevel(product)
  const category = getTrainingCategory(product)
  const avatarLabel = speaker || product.title
  const initials = getTrainingInitials(avatarLabel)
  const { cheapestPrice } = getProductPrice({ product })
  const priceLabel = cheapestPrice?.calculated_price ?? "Contact for pricing"

  return (
    <li>
      <article className="group relative overflow-hidden rounded-[30px] border border-[#dbe3ef] bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_48%,#fffaf1_100%)] px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#c9d8ea] hover:shadow-[0_24px_48px_rgba(15,23,42,0.1)] small:px-6 small:py-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[linear-gradient(180deg,#2c7cf7_0%,#68b6ff_55%,#f2b544_100%)]" />
          <div className="absolute -right-16 top-0 h-36 w-36 rounded-full bg-[rgba(44,124,247,0.08)] blur-3xl transition duration-300 group-hover:bg-[rgba(44,124,247,0.14)]" />
          <div className="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-[rgba(242,181,68,0.12)] blur-2xl" />
        </div>

        <div className="relative flex flex-col gap-5 medium:flex-row medium:items-center medium:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#d6e4f5] bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2c7cf7]">
                {category}
              </span>
              {format ? (
                <span className="rounded-full bg-[#eaf4ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#235ec9]">
                  {format}
                </span>
              ) : null}
              {time ? (
                <span className="rounded-full bg-[#fff3df] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b46c13]">
                  {time}
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-white/80 bg-[linear-gradient(135deg,#dce9ff_0%,#f7fbff_60%,#fff2dd_100%)] text-sm font-bold text-[#1d4ed8] shadow-[0_14px_28px_rgba(44,124,247,0.12)] small:h-14 small:w-14">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={avatarLabel}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="min-w-0 flex-1">
                <LocalizedClientLink
                  href={`/products/${product.handle}`}
                  className="inline-flex max-w-full"
                >
                  <h3 className="text-[1.15rem] font-bold leading-tight tracking-[-0.03em] text-[#0f172a] transition group-hover:text-[#185ec9] small:text-[1.3rem]">
                    {product.title}
                  </h3>
                </LocalizedClientLink>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-[#66758c] small:text-[14px]">
                  <span className="font-medium text-[#1f2f46]">
                    {speaker ? `By ${speaker}` : "Speaker to be announced"}
                  </span>
                  {duration ? (
                    <span className="rounded-full border border-[#e2e8f0] bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6a7b91]">
                      {duration}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-[#f3dfbf] bg-[#fffaf1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#bb7a16]">
                    {level}
                  </span>
                </div>

                {summary ? (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#607089] small:text-[15px]">
                    {summary}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 medium:items-end medium:pl-6">
            <div className="rounded-[20px] border border-[#dbe6f2] bg-white/90 px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7f8da3]">
                Starting at
              </p>
              <p className="mt-1 text-lg font-bold tracking-[-0.03em] text-[#0f172a]">
                {priceLabel}
              </p>
            </div>

            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[linear-gradient(90deg,#0f5bd7_0%,#2c7cf7_58%,#63b4ff_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(44,124,247,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              View Details
            </LocalizedClientLink>
          </div>
        </div>
      </article>
    </li>
  )
}

export default TrainingProductRow
