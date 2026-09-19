import { Metadata } from "next"
import { redirect } from "next/navigation"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// Catalog pages are prerendered; this lets Medusa Admin edits appear without
// a rebuild. /api/revalidate publishes changes immediately.
export const revalidate = 60

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
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

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, limit, q, category, speaker, month } = searchParams

  const nextSearchParams = new URLSearchParams()

  if (sortBy) {
    nextSearchParams.set("sortBy", sortBy)
  }

  if (page) {
    nextSearchParams.set("page", page)
  }

  if (limit) {
    nextSearchParams.set("limit", limit)
  }

  if (q) {
    nextSearchParams.set("q", q)
  }

  if (category) {
    nextSearchParams.set("category", category)
  }

  if (speaker) {
    nextSearchParams.set("speaker", speaker)
  }

  if (month) {
    nextSearchParams.set("month", month)
  }

  const queryString = nextSearchParams.toString()

  redirect(
    `/${params.countryCode}/training${queryString ? `?${queryString}` : ""}`
  )
}
