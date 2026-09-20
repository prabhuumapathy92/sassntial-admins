import { listProducts } from "@lib/data/products"
import { sortProducts } from "@lib/util/sort-products"
import TrainingCatalogFilters from "@modules/store/components/training-catalog-filters"
import TrainingCatalogScroller from "@modules/store/components/training-catalog-scroller"
import TrainingProductRow from "@modules/store/components/training-product-row"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import {
  buildCategoryOptions,
  buildMonthOptions,
  buildSpeakerOptions,
  filterTrainingProducts,
} from "@modules/store/lib/training-catalog"

// First batch rendered before the shopper scrolls; the rest follows in
// batches of the same size as the sentinel comes into view.
const PRODUCT_LIMIT = 10
const MAX_PRODUCTS = 100

export default async function TrainingCatalog({
  sortBy,
  searchQuery,
  category,
  speaker,
  month,
  limit = PRODUCT_LIMIT,
  countryCode,
}: {
  sortBy?: SortOptions
  searchQuery?: string
  category?: string
  speaker?: string
  month?: string
  limit?: number
  countryCode: string
}) {
  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      limit: MAX_PRODUCTS,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy || "created_at")
  const categoryOptions = buildCategoryOptions(sortedProducts)
  const speakerOptions = buildSpeakerOptions(sortedProducts)
  const monthOptions = buildMonthOptions(sortedProducts)
  const filteredProducts = filterTrainingProducts({
    products: sortedProducts,
    query: searchQuery,
    categoryId: category,
    speaker,
    month,
  })

  return (
    <div className="space-y-5 small:space-y-6">
      <div className="min-w-0">
        <TrainingCatalogScroller
          title="Training catalog"
          eyebrow="All Training"
          subtitle="Live sessions, recordings and value packs. Filter by category, speaker or month to find the right one."
          initialCount={limit}
          emptyState={
            <div className="border border-dashed border-[#cad5e4] bg-white px-6 py-16 text-center shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold uppercase text-[#2c7cf7]">
                No results
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#0f172a]">
                No training products match the selected filters.
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#667085]">
                Try a broader keyword, or clear a filter from the bar above.
              </p>
            </div>
          }
          filters={
            <TrainingCatalogFilters
              initialQuery={searchQuery}
              initialCategory={category}
              initialSpeaker={speaker}
              initialMonth={month}
              sortBy={sortBy || "created_at"}
              categoryOptions={categoryOptions}
              speakerOptions={speakerOptions}
              monthOptions={monthOptions}
            />
          }
        >
          {filteredProducts.map((product) => {
            return <TrainingProductRow key={product.id} product={product} />
          })}
        </TrainingCatalogScroller>
      </div>
    </div>
  )
}
