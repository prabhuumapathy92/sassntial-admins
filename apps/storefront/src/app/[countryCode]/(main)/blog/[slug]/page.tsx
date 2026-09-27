import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { getCmsPost, listCmsPosts, type CmsPost } from "@lib/data/cms"
import BlockRenderer from "@modules/cms/components/block-renderer"
import Breadcrumbs from "@modules/cms/components/breadcrumbs"
import PreviewBanner from "@modules/cms/components/preview-banner"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

export const dynamic = "force-dynamic"

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const result = await getCmsPost(slug)

  if (!result?.post) {
    return {}
  }

  const { post } = result

  return {
    title: post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    openGraph: {
      type: "article",
      title: post.title,
      ...(post.excerpt ? { description: post.excerpt } : {}),
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
      ...(post.cover_image ? { images: [{ url: post.cover_image }] } : {}),
    },
  }
}

/** Article measure. Body copy is unreadable at full container width. */
const MEASURE = "mx-auto w-full max-w-[720px] px-6"

export default async function BlogPostRoute(props: Props) {
  const { slug } = await props.params
  const result = await getCmsPost(slug)

  if (!result?.post) {
    notFound()
  }

  const { post, breadcrumbs, preview } = result

  const related = ((await listCmsPosts(post.category?.slug))?.posts ?? [])
    .filter((entry) => entry.id !== post.id)
    .slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.cover_image ? { image: [post.cover_image] } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.author
      ? { author: { "@type": "Person", name: post.author.name } }
      : {}),
  }

  return (
    <>
      {preview && <PreviewBanner status={post.status} />}

      <article className="bg-white pb-4">
        {/* Light editorial masthead, matching the listing rather than the
            marketing pages' dark hero: the article is reading, not selling. */}
        <div className={`${MEASURE} pt-2`}>
          <Breadcrumbs
            items={breadcrumbs}
            baseUrl={process.env.NEXT_PUBLIC_BASE_URL}
            className="px-0"
          />
        </div>

        <header className={`${MEASURE} pt-6 small:pt-10`}>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase text-[#94a3b8]">
            {post.category ? (
              <LocalizedClientLink
                href={`/blog?category=${post.category.slug}`}
                className="text-[#d97348] transition-colors hover:text-[#b45309]"
              >
                {post.category.name}
              </LocalizedClientLink>
            ) : null}
            <span aria-hidden className="h-px w-6 bg-[#cbd5e1]" />
            {post.published_at ? (
              <time dateTime={post.published_at}>
                {formatDate(post.published_at)}
              </time>
            ) : null}
            <span>· {post.reading_minutes} Min Read</span>
          </div>

          <h1 className="mt-4 text-[clamp(1.75rem,3.4vw,2.7rem)] font-bold leading-[1.12] text-[#0b2450]">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-5 text-[clamp(1rem,1.25vw,1.2rem)] leading-8 text-[#5b6b7f]">
              {post.excerpt}
            </p>
          ) : null}

        </header>

        {/* Sits inside the measure rather than bleeding full width, so the eye
            stays on one column from masthead to body. */}
        {post.cover_image ? (
          <figure className={`${MEASURE} mt-8`}>
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f1f5f9]">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
                priority
              />
            </div>
          </figure>
        ) : null}

        <div className={`${MEASURE} [&_section]:!px-0 py-8 small:py-10`}>
          <BlockRenderer blocks={post.blocks} />
        </div>

        {post.tags.length > 0 && (
          <div className={`${MEASURE} pb-8`}>
            <ul className="flex flex-wrap gap-2 border-t border-[#eef2f7] pt-6">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-[#e5e9f0] px-3 py-1.5 text-[12px] text-[#667085]"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        )}

      </article>

      {related.length > 0 && (
        <section className="border-t border-[#e5e9f0] bg-[#fbfcfe]">
          <div className="content-container py-12 small:py-16">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e5e9f0] pb-3">
              <h2 className="text-[11px] font-bold uppercase text-[#0b2450]">
                {post.category ? `More in ${post.category.name}` : "More reading"}
              </h2>
              <LocalizedClientLink
                href="/blog"
                className="text-[11px] font-bold uppercase text-[#d97348] hover:text-[#b45309]"
              >
                All articles
              </LocalizedClientLink>
            </div>

            <ul className="mt-7 grid grid-cols-2 gap-x-5 gap-y-8 medium:grid-cols-3">
              {related.map((entry: CmsPost) => (
                <li key={entry.id}>
                  <LocalizedClientLink
                    href={`/blog/${entry.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f1f5f9]">
                      {entry.cover_image ? (
                        <Image
                          src={entry.cover_image}
                          alt={entry.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 1280px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(135deg,#eaf3ff_0%,#f7fbff_55%,#fff2dd_100%)]" />
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[#94a3b8]">
                      {entry.category ? (
                        <span className="text-[#d97348]">
                          {entry.category.name}
                        </span>
                      ) : null}
                      <span aria-hidden className="h-px w-6 bg-[#cbd5e1]" />
                      <span>{entry.reading_minutes} Min Read</span>
                    </div>

                    <h3 className="mt-1.5 line-clamp-2 text-[13px] font-bold leading-snug text-[#0b2450] transition-colors group-hover:text-[#d97348]">
                      {entry.title}
                    </h3>
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-[#0b2450]">
        <div className="content-container py-12 text-center small:py-14">
          <h2 className="text-[clamp(1.3rem,2vw,1.9rem)] font-bold uppercase leading-tight text-white">
            Want this working on your site?
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-7 text-white/70">
            Get a free AI SEO audit and see how your brand shows up across
            search and AI assistants.
          </p>
          <LocalizedClientLink
            href="/company/contact-us"
            className="mt-6 inline-flex min-h-12 items-center bg-brand-cta px-7 text-[13px] font-bold uppercase text-white transition-transform duration-200 hover:-translate-y-0.5"
          >
            Get a free audit
          </LocalizedClientLink>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
