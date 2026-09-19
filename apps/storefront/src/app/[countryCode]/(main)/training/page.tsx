import { Metadata } from "next"

import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// Catalog pages are prerendered; this lets Medusa Admin edits appear without
// a rebuild. /api/revalidate publishes changes immediately.
export const revalidate = 60

export const metadata: Metadata = {
  title: "Training",
  description: "Browse all training products and sessions.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    limit?: string
    q?: string
    category?: string
    speaker?: string
    month?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function TrainingPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, limit, q, category, speaker, month } = searchParams

  return (
    <>     

      <section id="training-catalog">
        <StoreTemplate
          sortBy={sortBy}
          page={page}
          limit={limit}
          searchQuery={q}
          category={category}
          speaker={speaker}
          month={month}
          countryCode={params.countryCode}
        />
      </section>
    </>
  )
}
