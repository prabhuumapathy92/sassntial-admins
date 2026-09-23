import { HttpTypes } from "@medusajs/types"
import React from "react"

import { getProductFaqs } from "@modules/products/lib/product-faqs"

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4 shrink-0 text-brand-slate transition-transform duration-200 group-open:-rotate-180"
    aria-hidden
  >
    <path
      d="M6 9.5 12 15l6-5.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

type ProductFaqProps = {
  product: HttpTypes.StoreProduct
}

/**
 * Rendered with native `<details>` so the section needs no client JavaScript:
 * every answer is in the server-rendered HTML, which keeps it readable without
 * hydration and indexable by crawlers.
 */
const ProductFaq = ({ product }: ProductFaqProps) => {
  const faqs = getProductFaqs(product)

  if (!faqs.length) {
    return null
  }

  return (
    <section id="faqs" data-testid="product-faq">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line bg-brand-mist px-4 py-2.5 sm:px-5">
        <h2 className="text-[15px] font-semibold text-brand-navy">
          Frequently asked questions
        </h2>
      </div>

      <div className="divide-y divide-brand-line">
        {faqs.map((faq) => (
          <details key={faq.id} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-semibold text-brand-navy marker:hidden hover:bg-brand-haze sm:px-5 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0">{faq.question}</span>
              <ChevronIcon />
            </summary>
            <div className="whitespace-pre-line px-4 pb-4 text-[13px] leading-7 text-slate-700 sm:px-5">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default ProductFaq
