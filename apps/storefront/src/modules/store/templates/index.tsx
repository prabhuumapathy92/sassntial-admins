import { Suspense } from "react"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import TrainingCatalog from "./training-catalog"

const PRODUCT_LIMIT = 12
const validSortOptions: SortOptions[] = [
  "created_at",
  "price_asc",
  "price_desc",
]
const validPageSizes = [12, 20, 40]

const StoreTemplate = ({
  sortBy,
  page,
  limit,
  searchQuery,
  category,
  speaker,
  month,
  countryCode,
}: {
  sortBy?: string
  page?: string
  limit?: string
  searchQuery?: string
  category?: string
  speaker?: string
  month?: string
  countryCode: string
}) => {
  const requestedPage = Number.parseInt(page || "1", 10)
  const pageNumber =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const sort = validSortOptions.includes(sortBy as SortOptions)
    ? (sortBy as SortOptions)
    : "created_at"
  const requestedLimit = Number.parseInt(limit || `${PRODUCT_LIMIT}`, 10)
  const pageSize = validPageSizes.includes(requestedLimit)
    ? requestedLimit
    : PRODUCT_LIMIT
  const fallbackCards = Array.from({ length: 4 })

  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.1),transparent_18%),linear-gradient(180deg,#f2f8fb_0%,#ffffff_100%)]"
      data-testid="category-container"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-position:center_center] [background-size:72px_72px]" />
      <div className="content-container relative py-6 small:py-8">
     
        <Suspense
          fallback={
            <div className="grid items-start gap-5 small:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] small:gap-8 medium:grid-cols-[340px_minmax(0,1fr)]">
              <div className="min-h-[720px] rounded-[28px] border border-[#d8deea] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.07)]" />
              <div className="space-y-4 small:space-y-6">
                <div className="rounded-[28px] border border-[#dbe3ef] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.07)] small:p-7">
                  <div className="h-4 w-24 rounded-full bg-[#e6ebf3]" />
                  <div className="mt-4 h-10 w-72 rounded-full bg-[#e6ebf3]" />
                  <div className="mt-5 h-12 w-full rounded-[20px] bg-[#f2f5fa]" />
                </div>
                <div className="space-y-3 small:space-y-4">
                  {fallbackCards.map((_, index) => (
                    <div
                      key={index}
                      className="h-40 rounded-[28px] border border-[#dbe3ef] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.06)]"
                    />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <TrainingCatalog
            sortBy={sort}
            page={pageNumber}
            limit={pageSize}
            searchQuery={searchQuery}
            category={category}
            speaker={speaker}
            month={month}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </section>
  )
}

export default StoreTemplate
