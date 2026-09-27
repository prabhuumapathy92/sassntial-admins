import { Metadata } from "next"
import Image from "next/image"

import { listCmsPosts, type CmsPost } from "@lib/data/cms"
import BlogFilters from "@modules/cms/components/blog-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on AI search, generative engine optimisation and technical SEO.",
}

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>
}

/**
 * Matches on the fields a reader would search by. The full published set is
 * already loaded for the grid, so filtering here avoids a second round trip.
 */
const matches = (post: CmsPost, query: string) => {
  const haystack = [
    post.title,
    post.excerpt ?? "",
    post.category?.name ?? "",
    post.author?.name ?? "",
    ...post.tags,
  ]
    .join(" ")
    .toLowerCase()

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

const ArticleCard = ({ post }: { post: CmsPost }) => (
  <li>
    <LocalizedClientLink href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f1f5f9]">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 512px) 100vw, (max-width: 1280px) 50vw, 25vw"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#eaf3ff_0%,#f7fbff_55%,#fff2dd_100%)]" />
        )}
      </div>

      {/* Category, rule, reading time — the meta line under every card. */}
      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#94a3b8]">
        {post.category ? (
          <span className="text-[#d97348]">{post.category.name}</span>
        ) : null}
        <span aria-hidden className="h-px w-6 bg-[#cbd5e1]" />
        <span>{post.reading_minutes} Min Read</span>
      </div>

      <h2 className="mt-1.5 line-clamp-2 text-[13px] font-bold leading-snug text-[#0b2450] transition-colors group-hover:text-[#d97348]">
        {post.title}
      </h2>
    </LocalizedClientLink>
  </li>
)

export default async function BlogIndex(props: Props) {
  const { category, q } = await props.searchParams
  const result = await listCmsPosts(category)

  const categories = result?.categories ?? []
  const all = result?.posts ?? []
  const posts = q?.trim() ? all.filter((post) => matches(post, q)) : all
  const active = categories.find((entry) => entry.slug === category)

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0b2450_0%,#102735_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:26px_26px]" />

        <div className="content-container relative py-14 text-center small:py-20">
          <p className="text-[0.82rem] font-bold uppercase text-[#60c8f5]">
            Insights &amp; Resources
          </p>
          <h1 className="mx-auto mt-5 max-w-[1000px] text-[clamp(1.8rem,3.2vw,3rem)] font-bold uppercase leading-[1.1] text-white">
            {active ? active.name : "AI search is moving fast. Keep up."}
          </h1>
          <p className="mx-auto mt-6 max-w-[780px] text-[clamp(0.95rem,1.2vw,1.15rem)] font-medium leading-relaxed text-white/85">
            {active?.description ??
              "Practical guidance on generative engine optimisation, answer engine visibility and the technical SEO that still decides who gets cited."}
          </p>
        </div>
      </section>

      <section className="content-container py-8 small:py-12">
        <BlogFilters
          categories={categories}
          activeCategory={category}
          initialQuery={q}
        />

        {posts.length === 0 ? (
          <div className="border border-dashed border-[#cad5e4] bg-white px-6 py-20 text-center">
            <p className="text-[12px] font-bold uppercase text-[#d97348]">
              No articles found
            </p>
            <h2 className="mt-3 text-[1.5rem] font-bold text-[#0b2450]">
              {q
                ? `Nothing matches “${q}”.`
                : category
                  ? "No articles in this category yet."
                  : "The first article is on its way."}
            </h2>
            {(q || category) && (
              <LocalizedClientLink
                href="/blog"
                className="mt-6 inline-flex min-h-12 items-center bg-brand-cta px-7 text-[13px] font-bold uppercase text-white"
              >
                View all articles
              </LocalizedClientLink>
            )}
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 medium:grid-cols-4">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
