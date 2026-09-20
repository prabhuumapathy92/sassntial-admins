import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import React, { Suspense } from "react"

import ProductActionsWrapper from "../product-actions-wrapper"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import WebinarHeaderActions from "@modules/products/components/webinar-header-actions"
import { FACT_ICONS } from "@modules/products/components/webinar-icons"
import {
  getWebinarFacts,
  getWebinarFaculty,
  getWebinarRecordingUrl,
  getWebinarSchedule,
  hasLiveOption,
  parseWebinarBlocks,
} from "@modules/products/lib/webinar-content"

type TrainingProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const SectionHeading = ({
  children,
  actions,
}: {
  children: React.ReactNode
  actions?: React.ReactNode
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line bg-brand-mist px-4 py-2.5 sm:px-5">
    <h2 className="text-[15px] font-semibold text-brand-navy">{children}</h2>
    {actions}
  </div>
)

const TrainingProductTemplate = ({
  product,
  region,
  countryCode,
  images,
}: TrainingProductTemplateProps) => {
  const blocks = parseWebinarBlocks(product.description)
  const facts = getWebinarFacts(product)
  const faculty = getWebinarFaculty(product)
  const schedule = getWebinarSchedule(product)
  const recordingUrl = getWebinarRecordingUrl(product)
  const imageSrc = product.thumbnail || images?.[0]?.url || null

  const headerActions = (
    <WebinarHeaderActions
      productId={product.id}
      recordingUrl={recordingUrl}
      liveSessionLabel={
        hasLiveOption(product) || schedule.isUpcoming ? schedule.label ?? "Live session" : null
      }
    />
  )

  return (
    <div className="min-h-screen bg-brand-haze py-4 sm:py-6">
      <div className="content-container px-3 sm:px-4">
        <div className="bg-[#102735] px-4 py-2.5 sm:px-5">
          <h1 className="text-[15px] font-semibold text-white sm:text-[16px]">
            {product.title}
          </h1>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0 border border-t-0 border-brand-line bg-white">
            <div className="grid gap-5 px-4 py-5 sm:px-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-brand-line bg-brand-haze">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={product.title ?? "Webinar preview"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[13px] text-slate-400">
                    Preview unavailable
                  </div>
                )}
              </div>

              {facts.length > 0 && (
                <dl className="grid content-start gap-4 sm:grid-cols-2">
                  {facts.map((fact) => {
                    const Icon = FACT_ICONS[fact.icon]

                    return (
                      <div key={fact.label} className="flex items-start gap-2.5">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-slate" />
                        <div className="min-w-0">
                          <dt className="text-[12px] font-semibold uppercase text-brand-navy">
                            {fact.label}
                          </dt>
                          <dd className="mt-0.5 text-[13px] text-slate-700">
                            {fact.value}
                          </dd>
                        </div>
                      </div>
                    )
                  })}
                </dl>
              )}
            </div>

            {blocks.length > 0 ? (
              blocks.map((block, index) => (
                <section key={block.id} id={block.id}>
                  {block.title && (
                    <SectionHeading
                      actions={index === 0 ? headerActions : undefined}
                    >
                      {block.title}
                    </SectionHeading>
                  )}
                  {!block.title && index === 0 && (
                    <div className="flex justify-end border-b border-brand-line bg-brand-mist px-4 py-2.5 sm:px-5">
                      {headerActions}
                    </div>
                  )}
                  <div
                    className="webinar-block-content px-4 py-4 text-[13px] leading-7 text-slate-700 sm:px-5"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: block.html }}
                  />
                </section>
              ))
            ) : (
              <div className="flex justify-end border-t border-brand-line bg-brand-mist px-4 py-2.5 sm:px-5">
                {headerActions}
              </div>
            )}

            {faculty && (
              <section id="faculty">
                <SectionHeading>
                  Faculty:{" "}
                  <span className="underline underline-offset-2">
                    {faculty.name}
                  </span>
                </SectionHeading>
                <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:px-5">
                  {faculty.image && (
                    // Admin-supplied host, so plain img avoids next/image domain config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="h-[92px] w-[92px] shrink-0 border border-brand-line object-cover"
                    />
                  )}
                  <div className="min-w-0 text-[13px] leading-7 text-slate-700">
                    {faculty.bio ? (
                      <p>{faculty.bio}</p>
                    ) : (
                      <p className="text-slate-500">
                        {faculty.name} is leading this session.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-6">
            <Suspense
              fallback={
                <div className="border border-brand-line bg-white px-4 py-6 text-center text-[13px] text-slate-500">
                  Loading options...
                </div>
              }
            >
              <ProductActionsWrapper
                id={product.id}
                region={region}
                isTrainingTemplate={true}
              />
            </Suspense>
          </aside>
        </div>

        <div className="mt-8">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default TrainingProductTemplate
