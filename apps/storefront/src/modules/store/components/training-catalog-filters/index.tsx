"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { TrainingCatalogOption } from "@modules/store/lib/training-catalog"

type TrainingCatalogFiltersProps = {
  initialQuery?: string
  initialCategory?: string
  initialSpeaker?: string
  initialMonth?: string
  sortBy: SortOptions
  categoryOptions: TrainingCatalogOption[]
  speakerOptions: TrainingCatalogOption[]
  monthOptions: TrainingCatalogOption[]
}

const sortOptions: Array<{ label: string; value: SortOptions }> = [
  { label: "Latest Arrivals", value: "created_at" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
]

const controlClassName =
  "h-14 w-full appearance-none border border-[#e3e3e3] bg-white pl-5 pr-10 text-[13px] font-medium uppercase text-[#3d3d3d] outline-none transition hover:border-[#c9c9c9] focus:border-[#f59e0b]"

const Caret = () => (
  <svg
    viewBox="0 0 24 24"
    className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-[#8a8a8a]"
    fill="currentColor"
    aria-hidden
  >
    <path d="M12 16 5 8h14z" />
  </svg>
)

/** Native selects kept, styled to read as the bar's plain bordered boxes. */
const FilterSelect = ({
  value,
  onChange,
  placeholder,
  options,
}: {
  value?: string
  onChange: (value: string) => void
  placeholder: string
  options: TrainingCatalogOption[]
}) => (
  <div className="relative">
    <select
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      className={controlClassName}
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <Caret />
  </div>
)

const TrainingCatalogFilters = ({
  initialQuery,
  initialCategory,
  initialSpeaker,
  initialMonth,
  sortBy,
  categoryOptions,
  speakerOptions,
  monthOptions,
}: TrainingCatalogFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get("q") ?? ""
  const [searchValue, setSearchValue] = useState(initialQuery ?? "")

  const pushWithUpdates = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim().length) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    params.delete("page")

    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }

  useEffect(() => {
    setSearchValue(currentQuery)
  }, [currentQuery])

  useEffect(() => {
    if (searchValue === currentQuery) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (searchValue.trim().length) {
        params.set("q", searchValue)
      } else {
        params.delete("q")
      }

      params.delete("page")

      const queryString = params.toString()
      router.replace(queryString ? `${pathname}?${queryString}` : pathname)
    }, 150)

    return () => window.clearTimeout(timeoutId)
  }, [currentQuery, pathname, router, searchParams, searchValue])

  const handleReset = () => {
    setSearchValue("")
    router.replace(pathname)
  }

  const hasActiveFilters = !!(
    currentQuery ||
    initialCategory ||
    initialSpeaker ||
    initialMonth
  )

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      data-testid="training-catalog-filters"
    >
      <div className="min-w-[170px]">
        <FilterSelect
          value={initialCategory}
          onChange={(value) => pushWithUpdates({ category: value || null })}
          placeholder="Category"
          options={categoryOptions}
        />
      </div>

      <div className="min-w-[170px]">
        <FilterSelect
          value={initialSpeaker}
          onChange={(value) => pushWithUpdates({ speaker: value || null })}
          placeholder="Speaker"
          options={speakerOptions}
        />
      </div>

      <div className="min-w-[150px]">
        <FilterSelect
          value={initialMonth}
          onChange={(value) => pushWithUpdates({ month: value || null })}
          placeholder="Month"
          options={monthOptions}
        />
      </div>

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={handleReset}
          className="h-14 border border-[#e3e3e3] bg-white px-5 text-[13px] font-medium uppercase text-[#8a8a8a] transition hover:border-[#c9c9c9] hover:text-[#3d3d3d]"
        >
          Reset
        </button>
      ) : null}

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] small:min-w-[260px]">
          <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search"
            aria-label="Search training"
            className="h-14 w-full border border-[#e3e3e3] bg-white pl-11 pr-4 text-[13px] font-medium uppercase text-[#3d3d3d] outline-none transition placeholder:text-[#8a8a8a] hover:border-[#c9c9c9] focus:border-[#f59e0b]"
          />
        </div>

        <div className="relative min-w-[180px]">
          <select
            value={sortBy}
            onChange={(event) =>
              pushWithUpdates({ sortBy: event.target.value || null })
            }
            className={controlClassName}
            aria-label="Sort by"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M7 4v16m0 0 3-3m-3 3-3-3M17 20V4m0 0 3 3m-3-3-3 3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default TrainingCatalogFilters
