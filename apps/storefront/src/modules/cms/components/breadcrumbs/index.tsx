import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { Breadcrumb } from "@lib/data/cms"

/**
 * Renders the derived trail, and emits the matching BreadcrumbList structured
 * data from the same array so the two can never disagree. Answer engines read
 * the JSON-LD; people read the links.
 */
const Breadcrumbs = ({
  items,
  baseUrl,
  tone = "light",
  className = "",
}: {
  items: Breadcrumb[]
  baseUrl?: string
  tone?: "light" | "dark"
  /** Lets a caller that already provides its own measure drop the gutter. */
  className?: string
}) => {
  if (!items.length) {
    return null
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && baseUrl
        ? { item: `${baseUrl.replace(/\/+$/, "")}${item.href}` }
        : {}),
    })),
  }

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={`pt-6 ${className || "content-container"}`}
      >
        <ol
          className={`flex flex-wrap items-center gap-2 text-[12px] ${
            tone === "dark" ? "text-white/55" : "text-[#667085]"
          }`}
        >
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden>/</span>}
              {item.href ? (
                <LocalizedClientLink
                  href={item.href}
                  className={
                    tone === "dark"
                      ? "hover:text-white"
                      : "hover:text-[#2c7cf7]"
                  }
                >
                  {item.label}
                </LocalizedClientLink>
              ) : (
                <span
                  aria-current="page"
                  className={tone === "dark" ? "text-white" : "text-[#0f172a]"}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}

export default Breadcrumbs
