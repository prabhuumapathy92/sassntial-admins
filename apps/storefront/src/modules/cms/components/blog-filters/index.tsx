"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Category = { id: string; name: string; slug: string }

/**
 * Category tabs and article search.
 *
 * Both live in the URL rather than component state, so a filtered view is
 * shareable and the back button behaves. The tabs are links so they work
 * without JavaScript; only the search box needs the client.
 */
const BlogFilters = ({
  categories,
  activeCategory,
  initialQuery,
}: {
  categories: Category[]
  activeCategory?: string
  initialQuery?: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get("q") ?? ""
  const [value, setValue] = useState(initialQuery ?? "")

  useEffect(() => {
    setValue(currentQuery)
  }, [currentQuery])

  // Debounced so each keystroke does not push a history entry.
  useEffect(() => {
    if (value === currentQuery) {
      return
    }

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (value.trim().length) {
        params.set("q", value)
      } else {
        params.delete("q")
      }

      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    }, 200)

    return () => window.clearTimeout(timeout)
  }, [currentQuery, pathname, router, searchParams, value])

  const tabClass = (isActive: boolean) =>
    `whitespace-nowrap border-b-2 pb-2 text-[11px] font-semibold uppercase transition-colors ${
      isActive
        ? "border-[#d97348] text-[#d97348]"
        : "border-transparent text-[#667085] hover:text-[#0f172a]"
    }`

  const href = (slug?: string) => {
    const params = new URLSearchParams()

    if (slug) {
      params.set("category", slug)
    }

    if (currentQuery) {
      params.set("q", currentQuery)
    }

    const query = params.toString()

    return query ? `/blog?${query}` : "/blog"
  }

  return (
    <div className="flex flex-col gap-4 border-b border-[#e5e9f0] pb-3 medium:flex-row medium:items-end medium:justify-between">
      <nav aria-label="Article categories">
        <ul className="-mb-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <li>
            <LocalizedClientLink
              href={href()}
              aria-current={activeCategory ? undefined : "page"}
              className={tabClass(!activeCategory)}
            >
              All articles
            </LocalizedClientLink>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <LocalizedClientLink
                href={href(category.slug)}
                aria-current={
                  activeCategory === category.slug ? "page" : undefined
                }
                className={tabClass(activeCategory === category.slug)}
              >
                {category.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative w-full medium:max-w-[300px]">
        <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search articles..."
          aria-label="Search articles"
          className="h-11 w-full border border-[#e3e3e3] bg-white pl-11 pr-4 text-[14px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] hover:border-[#c9c9c9] focus:border-[#d97348]"
        />
      </div>
    </div>
  )
}

export default BlogFilters
