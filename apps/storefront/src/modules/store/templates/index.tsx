import { Suspense } from "react"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import TrainingCatalog from "./training-catalog"

const PRODUCT_LIMIT = 10
const validSortOptions: SortOptions[] = [
  "created_at",
  "price_asc",
  "price_desc",
]
const validPageSizes = [10, 20, 40]

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
            <div className="space-y-5 small:space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-14 w-[170px] border border-[#e3e3e3] bg-white"
                  />
                ))}
              </div>
              <div className="border border-[#dbe3ef] bg-white p-5 shadow-[0_18px_44px_rgba(15,23,42,0.07)] small:p-7">
                <div className="h-4 w-24 bg-[#e6ebf3]" />
                <div className="mt-4 h-10 w-72 bg-[#e6ebf3]" />
              </div>
              <div className="grid grid-cols-1 gap-4 xsmall:grid-cols-2 small:grid-cols-3">
                {fallbackCards.map((_, index) => (
                  <div
                    key={index}
                    className="h-[300px] border border-[#e5e9f0] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                  />
                ))}
              </div>
            </div>
          }
        >
          <TrainingCatalog
            sortBy={sort}
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
