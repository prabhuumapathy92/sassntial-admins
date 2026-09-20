import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MarketingDetailShell from "@modules/common/components/marketing-detail-shell"
import type { SeoServiceCard } from "@modules/common/components/seo-service-grid"
import {
  CompanyItem,
  companyItems,
} from "@modules/company/constants/company-items"
import ContactDetailTemplate from "@modules/company/templates/contact-detail"
import AiSeoAboutGains from "@modules/services/components/ai-seo-about-gains"
import AiSeoDifferentiators from "@modules/services/components/ai-seo-differentiators"
import AiSeoLeadForm from "@modules/services/components/ai-seo-lead-form"
import AiSeoSupportingMessage from "@modules/services/components/ai-seo-supporting-message"
import AiSeoStrategicApproach from "@modules/services/components/ai-seo-strategic-approach"
import AiSeoVisualShowcase from "@modules/services/components/ai-seo-visual-showcase"

const aiSlugs = [
  "ai-opportunity-discovery",
  "custom-ai-agent-development",
  "workflow-automation-integration",
  "industry-specific-ai-solution",
  "ai-infrastructure-deployment",
  "ai-optimization-continuous-improvement",
]

type AiSectionFaq = {
  question: string
  answer: string
}

type AiSectionListGroup = {
  title: string
  items: string[]
}

const defaultParagraph =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

const defaultAnswer =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum, libero in suscipit tempor, massa est feugiat nibh, ut faucibus velit magna at sapien."

const fallbackIcons: SeoServiceCard["icon"][] = [
  "megaphone",
  "directory",
  "cursor",
  "globe",
  "analytics",
  "mail",
  "store",
  "ppc",
]

const cleanText = (value?: string) => value?.replace(/\s+/g, " ").trim() ?? ""

const firstAvailable = (...values: Array<string | undefined>) =>
  values.map(cleanText).find(Boolean) || ""

const uniqueValues = (items: Array<string | undefined>) =>
  Array.from(new Set(items.map(cleanText).filter(Boolean)))

const fillList = (
  items: Array<string | undefined>,
  minimum: number,
  fallbackFactory: (index: number) => string
) => {
  const next = uniqueValues(items)

  while (next.length < minimum) {
    next.push(fallbackFactory(next.length))
  }

  return next
}

const getCompanySectionImage = (item: CompanyItem) => ({
  src:
    firstAvailable(
      item.sections?.[0]?.imageUrl,
      item.sections?.[1]?.imageUrl,
      item.heroImage?.src,
      "/ai-services.jpeg"
    ) || "/ai-services.jpeg",
  alt:
    firstAvailable(
      item.sections?.[0]?.imageAlt,
      item.sections?.[1]?.imageAlt,
      item.heroImage?.alt,
      `${item.label} AI service visual`
    ) || `${item.label} AI service visual`,
})

const buildCompanySeoCards = (item: CompanyItem): SeoServiceCard[] => {
  const sectionTitles = uniqueValues(
    item.sections?.map((section) => section.title) ?? []
  )
  const highlightTitles = uniqueValues(item.highlights)
  const supportTitles = uniqueValues(item.supportPoints)
  const cardTitles =
    item.seoCards && item.seoCards.length > 0
      ? item.seoCards.map((card) => card.title)
      : sectionTitles.length > 0
      ? sectionTitles
      : highlightTitles.length > 0
      ? highlightTitles
      : supportTitles.length > 0
      ? supportTitles
      : fillList([], 4, (index) => `${item.label} focus area ${index + 1}`)

  return cardTitles.slice(0, 6).map((title, index) => {
    const normalizedTitle = cleanText(title).toLowerCase()
    const matchingCard = item.seoCards?.find(
      (card) => cleanText(card.title).toLowerCase() === normalizedTitle
    )
    const matchingSection = item.sections?.find((section) => {
      const sectionTitle = cleanText(section.title).toLowerCase()
      const bullets = uniqueValues(section.bullets ?? []).map((bullet) =>
        bullet.toLowerCase()
      )

      return (
        sectionTitle.includes(normalizedTitle) ||
        normalizedTitle.includes(sectionTitle) ||
        bullets.includes(normalizedTitle)
      )
    })

    return {
      title,
      icon: matchingCard?.icon ?? fallbackIcons[index % fallbackIcons.length],
      segments: [
        {
          text:
            firstAvailable(
              matchingCard?.segments.map((segment) => segment.text).join(" "),
              matchingSection?.description,
              item.highlights[index],
              item.summary,
              item.intro,
              `${item.label} is structured to align AI strategy, delivery, and measurable business outcomes.`
            ) || defaultParagraph,
        },
      ],
    }
  })
}

const buildCompanyFaqs = (
  item: CompanyItem,
  heroDescription: string,
  approachDescription: string,
  differentiatorItems: string[]
): AiSectionFaq[] => [
  {
    question: `What does ${item.label} include?`,
    answer:
      firstAvailable(heroDescription, item.intro, defaultAnswer) ||
      defaultAnswer,
  },
  {
    question: `How does Sassential approach ${item.label}?`,
    answer:
      firstAvailable(
        approachDescription,
        item.sections?.[0]?.description,
        defaultAnswer
      ) || defaultAnswer,
  },
  {
    question: `What outcomes can teams expect from ${item.label}?`,
    answer:
      firstAvailable(
        differentiatorItems.join(", "),
        item.summary,
        defaultAnswer
      ) || defaultAnswer,
  },
  {
    question: `Can ${item.label} be adapted to our workflows?`,
    answer:
      `Yes. We tailor ${item.label.toLowerCase()} around your business goals, team workflows, and operational constraints so the rollout is practical and measurable.` ||
      defaultAnswer,
  },
]

const CompanyDetailTemplate = ({ item }: { item: CompanyItem }) => {
  if (item.slug === "contact-us") {
    return <ContactDetailTemplate item={item} />
  }

  const isAiImmersivePage = aiSlugs.includes(item.slug)

  if (item.slug === "blog") {
    const posts = item.blogPosts ?? []

    return (
      <MarketingDetailShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Company", href: "/company" },
          { label: item.label },
        ]}
        eyebrow={item.eyebrow}
        title={item.title}
        description={item.intro}
        actions={[
          { label: "Contact Us", href: "/company/contact-us" },
          {
            label: "All Company Pages",
            href: "/company",
            variant: "secondary",
          },
        ]}
        heroNote="The shared page shell is applied here too, while the article list remains specific to the blog section."
        proofTitle="COMPANY INSIGHTS AND DELIVERY NOTES"
        sectionEyebrow="Featured Posts"
        sectionTitle="Recent Articles"
        sectionIntro={item.summary}
        featureCards={item.highlights.map((highlight, index) => ({
          title: item.supportPoints[index] || `Insight ${index + 1}`,
          description: highlight,
        }))}
      >
        <div className="grid gap-5 medium:grid-cols-2 large:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden border border-[#e6edf5] bg-white shadow-[0_16px_34px_rgba(15,23,42,0.06)]"
            >
              <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="marketing-hero-placeholder h-full w-full" />
                )}
              </div>

              <div className="px-5 py-5">
                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  {post.category} | {post.readTime}
                </p>
                <h3 className="mt-3 text-lg font-bold uppercase text-slate-900">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {post.excerpt}
                </p>
                <LocalizedClientLink
                  href={`/company/blog/${post.slug}`}
                  className="mt-5 inline-flex items-center text-sm font-semibold uppercase text-[#0b78b5] transition-colors duration-200 hover:text-slate-900"
                >
                  Read Article
                </LocalizedClientLink>
              </div>
            </article>
          ))}
        </div>
      </MarketingDetailShell>
    )
  }

  if (item.slug !== "blog") {
    const heroTitle =
      firstAvailable(
        item.title,
        `${item.label} services built to create measurable AI outcomes.`
      ) || `${item.label} services built to create measurable AI outcomes.`
    const heroDescription =
      firstAvailable(item.intro, item.summary, defaultParagraph) ||
      defaultParagraph
    const strategyTitle =
      firstAvailable(
        item.sectionTitle,
        `${item.label}: Strategic Approach to Value`
      ) || `${item.label}: Strategic Approach to Value`
    const ctaLabel =
      firstAvailable(
        item.finalCta?.primaryLabel,
        item.ctaLabel,
        "Talk To The Team"
      ) || "Talk To The Team"
    const sectionImage = getCompanySectionImage(item)
    const focusItems = fillList(
      [
        ...(item.highlights ?? []),
        ...(item.supportPoints ?? []),
        ...(item.sections?.flatMap((section) => section.bullets ?? []) ?? []),
        ...(item.seoCards?.map((card) => card.title) ?? []),
      ],
      4,
      (index) => `Lorem insight ${index + 1} for ${item.label}.`
    )
    const approachDescription =
      firstAvailable(
        item.sections?.[0]?.description,
        item.summary,
        item.intro,
        defaultParagraph
      ) || defaultParagraph
    const showcaseCards = buildCompanySeoCards(item)
    const showcaseTitle =
      firstAvailable(item.sectionTitle, `Our ${item.label} Capabilities`) ||
      `Our ${item.label} Capabilities`
    const showcaseSubtitle =
      firstAvailable(
        item.heroNote,
        `${item.label} systems designed to improve adoption, performance, and measurable business value.`
      ) ||
      `${item.label} systems designed to improve adoption, performance, and measurable business value.`
    const showcaseDescription =
      firstAvailable(item.summary, item.intro, defaultParagraph) ||
      defaultParagraph
    const supportingTitle =
      firstAvailable(
        item.supportingMessage?.title,
        `Why Teams Choose Sassential for ${item.label}`
      ) || `Why Teams Choose Sassential for ${item.label}`
    const supportingDescription =
      firstAvailable(
        item.supportingMessage?.description,
        heroDescription,
        defaultParagraph
      ) || defaultParagraph
    const differentiatorItems = fillList(
      [
        ...(item.differentiators?.items ?? []),
        ...(item.supportPoints ?? []),
        ...(item.highlights ?? []),
      ],
      4,
      (index) =>
        `Lorem differentiator ${index + 1} for ${item.label.toLowerCase()}.`
    ).slice(0, 6)
    const differentiatorTitle =
      firstAvailable(
        item.differentiators?.title,
        `What Sets ${item.label} Apart`
      ) || `What Sets ${item.label} Apart`
    const aboutTitle =
      firstAvailable(item.aboutSection?.title, `About ${item.label}`) ||
      `About ${item.label}`
    const aboutParagraphs = fillList(
      [
        ...(item.aboutSection?.paragraphs ?? []),
        item.summary,
        item.intro,
        item.sections?.[1]?.description,
      ],
      2,
      () => defaultParagraph
    ).slice(0, 4)
    const aboutListGroups: AiSectionListGroup[] =
      item.aboutSection?.listGroups && item.aboutSection.listGroups.length > 0
        ? item.aboutSection.listGroups.map((group) => ({
            title:
              firstAvailable(group.title, `${item.label} focus area`) ||
              `${item.label} focus area`,
            items: fillList(group.items, 1, () => defaultParagraph),
          }))
        : [
            {
              title: `${item.label} focus areas`,
              items: focusItems.slice(0, 3),
            },
            {
              title: "Support priorities",
              items: fillList(
                item.supportPoints,
                3,
                (index) => `Lorem support point ${index + 1} for ${item.label}.`
              ).slice(0, 3),
            },
          ]
    const finalCtaTitle =
      firstAvailable(
        item.finalCta?.title,
        `Ready to move forward with ${item.label}?`
      ) || `Ready to move forward with ${item.label}?`
    const finalCtaDescription =
      firstAvailable(
        item.finalCta?.description,
        heroDescription,
        defaultParagraph
      ) || defaultParagraph
    const faqs = buildCompanyFaqs(
      item,
      heroDescription,
      approachDescription,
      differentiatorItems
    )
    const parentLabel = isAiImmersivePage ? "AI" : "About Us"
    const parentHref = isAiImmersivePage
      ? "/company/ai-opportunity-discovery"
      : "/company"

    return (
      <MarketingDetailShell
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: parentLabel, href: parentHref },
          { label: item.label },
        ]}
        title={heroTitle}
        description={heroDescription}
        heroVariant="immersive"
        actions={[
          {
            label: ctaLabel,
            href: "/company/contact-us",
          },
        ]}
        heroNote={
          item.heroNote ||
          "We email qualified businesses within one business day"
        }
        heroImage={
          item.heroImage || {
            src: "/multi-location-banner.jpeg",
            alt: item.label,
          }
        }
        sectionContent={
          <AiSeoStrategicApproach
            eyebrow={item.eyebrow || "AI Services"}
            title={strategyTitle}
            description={approachDescription}
            pillars={focusItems.slice(0, 4)}
            pillarsLabel={`What ${item.label} includes`}
            closingNote={supportingDescription}
            imageSrc={sectionImage.src}
            imageAlt={sectionImage.alt}
          />
        }
        sectionEyebrow={item.eyebrow || "AI Services"}
        sectionTitle={strategyTitle}
        sectionIntro={heroDescription}
        featureCards={[]}
        childrenWide
        relatedLinks={[]}
      >
        <>
          <AiSeoVisualShowcase
            title={showcaseTitle}
            subtitle={showcaseSubtitle}
            description={showcaseDescription}
            cards={showcaseCards}
            ctaLabel={ctaLabel}
          />

          <div className="mx-auto p-0">
            <AiSeoSupportingMessage
              eyebrow={item.eyebrow || "AI Services"}
              title={supportingTitle}
              description={supportingDescription}
              imageSrc={sectionImage.src}
              imageAlt={sectionImage.alt}
              actionTitle={`Ready to explore ${item.label}?`}
              actionLabel={ctaLabel}
            />
          </div>

          <AiSeoDifferentiators
            title={differentiatorTitle}
            description={supportingDescription}
            items={differentiatorItems}
          />

          <AiSeoAboutGains
            title={aboutTitle}
            paragraphs={aboutParagraphs}
            listGroups={aboutListGroups}
          />

          <AiSeoLeadForm
            eyebrow={`${item.label} Proposal`}
            formIdPrefix={item.slug}
            title={finalCtaTitle}
            description={finalCtaDescription}
            primaryLabel={ctaLabel}
            focusItems={focusItems}
          />

          <article className="relative overflow-hidden px-6 py-7 shadow-[0_28px_60px_-48px_rgba(15,23,42,0.76)] small:px-8 small:py-8">
            <p className="text-[11px] font-semibold uppercase text-[#f59e0b]">
              FAQs
            </p>
            <h3 className="mt-3 text-[2rem] font-black leading-[1.02] text-slate-900 small:text-[2.3rem]">
              FAQs - {item.label}
            </h3>

            <div className="mt-8 grid gap-4">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  name={`${item.slug}-faq`}
                  className="group overflow-hidden border border-[#dfe8f1] bg-white shadow-[0_16px_30px_-28px_rgba(15,23,42,0.76)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 small:px-6">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_100%)] text-[11px] font-black uppercase text-[#1d4ed8] shadow-[0_12px_20px_rgba(15,23,42,0.08)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 small:text-lg">
                        {faq.question}
                      </h4>
                    </div>

                    <span className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center text-slate-700">
                      <span className="absolute h-[2px] w-4 bg-current" />
                      <span className="absolute h-4 w-[2px] bg-current transition-opacity duration-200 group-open:opacity-0" />
                    </span>
                  </summary>

                  <div className="border-t border-[#edf2f7] px-5 py-4 small:px-6">
                    <p className="text-sm leading-7 text-slate-600 small:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </article>
        </>
      </MarketingDetailShell>
    )
  }
}

export default CompanyDetailTemplate
