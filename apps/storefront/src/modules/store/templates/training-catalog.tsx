import { listProducts } from "@lib/data/products"
import { sortProducts } from "@lib/util/sort-products"
import { Pagination } from "@modules/store/components/pagination"
import TrainingCatalogFilters from "@modules/store/components/training-catalog-filters"
import TrainingProductRow from "@modules/store/components/training-product-row"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import {
  buildCategoryOptions,
  buildMonthOptions,
  buildSpeakerOptions,
  filterTrainingProducts,
} from "@modules/store/lib/training-catalog"

const PRODUCT_LIMIT = 12
const MAX_PRODUCTS = 100

export default async function TrainingCatalog({
  sortBy,
  page,
  searchQuery,
  category,
  speaker,
  month,
  limit = PRODUCT_LIMIT,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
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

  const totalProducts = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalProducts / limit))
  const currentPage = Math.min(page, totalPages)
  const startIndex = totalProducts ? (currentPage - 1) * limit : 0
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)
  const showingStart = totalProducts ? startIndex + 1 : 0
  const showingEnd = totalProducts ? startIndex + paginatedProducts.length : 0

  return (
    <div className="grid items-start gap-5 small:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] small:gap-8 medium:grid-cols-[340px_minmax(0,1fr)]">
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

      <div className="min-w-0 space-y-4 small:space-y-6">
        <Pagination
          title="Training catalog"
          variant="training"
          data-testid="product-pagination"
          page={currentPage}
          totalPages={totalPages}
          totalItems={totalProducts}
          pageSize={limit}
          showingStart={showingStart}
          showingEnd={showingEnd}
        />

        {paginatedProducts.length ? (
          <ul className="space-y-3 small:space-y-4" data-testid="products-list">
            {paginatedProducts.map((product) => {
              return <TrainingProductRow key={product.id} product={product} />
            })}
          </ul>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#cad5e4] bg-white px-6 py-16 text-center shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2c7cf7]">
              No results
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-[#0f172a]">
              No training products match the selected filters.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#667085]">
              Try a broader keyword, remove a speaker or month filter, or reset
              the catalog controls from the sidebar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
