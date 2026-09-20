import AiSeoAboutGains from "@modules/services/components/ai-seo-about-gains"
import AiSeoDifferentiators from "@modules/services/components/ai-seo-differentiators"
import AiSeoLeadForm from "@modules/services/components/ai-seo-lead-form"
import AiSeoSupportingMessage from "@modules/services/components/ai-seo-supporting-message"
import AiSeoStrategicApproach from "@modules/services/components/ai-seo-strategic-approach"
import AiSeoVisualShowcase from "@modules/services/components/ai-seo-visual-showcase"
import MarketingDetailShell from "@modules/common/components/marketing-detail-shell"
import {
  type SeoServiceCard,
  aiSeoServiceCards,
  digitalPrServiceCards,
  localSeoServiceCards,
  seoServiceCards,
  socialMediaServiceCards,
} from "@modules/common/components/seo-service-grid"
import { ServiceItem } from "@modules/services/constants/service-items"

type ServiceListGroup = {
  title: string
  items: string[]
}

type ServiceFaq = {
  question: string
  answer: string
}

type ServicePresentation = {
  heroTitle: string
  heroDescription: string
  sectionTitle: string
  showcaseTitle: string
  showcaseSubtitle: string
  showcaseDescription: string
  cards: SeoServiceCard[]
  ctaLabel: string
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

const servicePresentationOverrides: Partial<
  Record<string, Partial<ServicePresentation>>
> = {
  seo: {
    heroTitle: "EXPERT SEO SERVICES THAT DRIVE REAL BUSINESS GROWTH",
    heroDescription:
      "At Sassntial, we deliver ROI-focused, data-driven SEO strategies designed to increase visibility, attract qualified traffic, and turn search intent into revenue.",
    sectionTitle: "Our SEO Services",
    showcaseTitle: "Our SEO Services",
    showcaseSubtitle:
      "Intent-based execution, technical clarity, and measurable growth systems.",
    showcaseDescription:
      "From technical SEO to content, authority, and analytics, our service mix is structured to improve visibility and move qualified visitors toward conversion.",
    cards: seoServiceCards,
    ctaLabel: "Request A Free Proposal",
  },
  "local-seo": {
    heroTitle: "OWN THE MAP & DOMINATE LOCAL SEARCH WITH SASSNTIAL",
    heroDescription:
      "Increase your local visibility, appear in top map results, and attract high-intent customers ready to take action.",
    sectionTitle: "Our Local SEO Services",
    showcaseTitle: "Our Local SEO Services",
    showcaseSubtitle:
      "Map pack visibility, trusted local presence, and conversion-ready traffic.",
    showcaseDescription:
      "We blend Google Business Profile optimization, local content, review strategy, and reporting into a local search system built for measurable growth.",
    cards: localSeoServiceCards,
    ctaLabel: "Request A Free Proposal",
  },
  "ai-seo": {
    heroTitle:
      "GAIN VISIBILITY IN AI-POWERED SEARCH WITH SASSNTIAL'S AI SEO SERVICES",
    heroDescription:
      "Search is evolving rapidly with AI-driven experiences like generative search, voice assistants, and conversational queries.",
    sectionTitle: "AI SEO Services: Our Strategic Approach to Visibility",
    showcaseTitle: "AI SEO Services Built to Improve Answer Visibility",
    showcaseSubtitle:
      "AIO, AEO, GEO, and authority systems designed for the next era of search.",
    showcaseDescription:
      "We have replaced plain text service cards with a more visual showcase so each AI SEO capability is easier to scan, understand, and compare at a glance.",
    cards: aiSeoServiceCards,
    ctaLabel: "Get Free AI SEO Audit",
  },
  "digital-pr": {
    heroTitle:
      "ATTRACT THE RIGHT ATTENTION WITH SAASNTIAL'S DIGITAL PR SERVICES",
    heroDescription:
      "Build authority, credibility, and measurable brand visibility with our performance-driven Digital PR solutions.",
    sectionTitle: "Our Digital PR Services",
    showcaseTitle: "Our Digital PR Services",
    showcaseSubtitle:
      "Authority building, media relevance, and SEO-aware storytelling.",
    showcaseDescription:
      "Each Digital PR capability supports stronger visibility, higher trust, and a more durable brand footprint across publishers and search surfaces.",
    cards: digitalPrServiceCards,
    ctaLabel: "Request A Free Proposal",
  },
  "social-media-management": {
    heroTitle: "SOCIAL MEDIA MARKETING SERVICES THAT DRIVE REAL ENGAGEMENT",
    sectionTitle: "Our Social Media Management Services",
    showcaseTitle: "Our Social Media Management Services",
    showcaseSubtitle:
      "Platform-specific strategy, creative consistency, and measurable engagement.",
    showcaseDescription:
      "We structure social media programs around planning, publishing, community management, and reporting so your channels support real business growth.",
    cards: socialMediaServiceCards,
    ctaLabel: "Request A Free Proposal",
  },
}

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

const buildGeneratedCards = (service: ServiceItem): SeoServiceCard[] => {
  const sections = service.sections ?? []
  const capabilityTitles = uniqueValues(service.capabilities)
  const sectionTitles = uniqueValues(sections.map((section) => section.title))
  const titles =
    capabilityTitles.length > 0
      ? capabilityTitles
      : sectionTitles.length > 0
      ? sectionTitles
      : fillList([], 4, (index) => `${service.label} focus area ${index + 1}`)

  return titles.map((title, index) => {
    const normalizedTitle = cleanText(title).toLowerCase()
    const matchingSection = sections.find((section) => {
      const sectionTitle = cleanText(section.title).toLowerCase()
      const sectionItems = uniqueValues(section.items ?? []).map((item) =>
        item.toLowerCase()
      )

      return (
        sectionTitle.includes(normalizedTitle) ||
        normalizedTitle.includes(sectionTitle) ||
        sectionItems.includes(normalizedTitle)
      )
    })

    return {
      title,
      icon: fallbackIcons[index % fallbackIcons.length],
      segments: [
        {
          text: firstAvailable(
            matchingSection?.description,
            sections[index]?.description,
            service.summary,
            service.intro,
            `${service.label} services are structured to align planning, delivery, and measurable business growth.`
          ),
        },
      ],
    }
  })
}

const getHeroImage = (service: ServiceItem) => {
  const imageSrc = cleanText(service.sections?.[0]?.imageUrl)

  if (!imageSrc || imageSrc.startsWith("data:image")) {
    return {
      src: "/multi-location-banner.jpeg",
      alt: "Team collaborating in an office meeting",
    }
  }

  return {
    src: imageSrc,
    alt:
      firstAvailable(
        service.sections?.[0]?.imageAlt,
        `${service.label} service hero image`
      ) || `${service.label} service hero image`,
  }
}

const getSectionImage = (service: ServiceItem) => ({
  src: firstAvailable(
    service.sections?.[0]?.imageUrl,
    service.sections?.[1]?.imageUrl,
    "/ai-services.jpeg"
  ),
  alt:
    firstAvailable(
      service.sections?.[0]?.imageAlt,
      service.sections?.[1]?.imageAlt,
      `${service.label} service visual`
    ) || `${service.label} service visual`,
})

const buildFallbackFaqs = (
  service: ServiceItem,
  heroDescription: string,
  approachDescription: string,
  outcomes: string[]
): ServiceFaq[] => {
  const outcomeLine =
    outcomes.length > 0
      ? `We measure performance through ${outcomes
          .slice(0, 3)
          .join(", ")
          .toLowerCase()}.`
      : defaultAnswer

  return [
    {
      question: `What does ${service.label} include?`,
      answer: firstAvailable(heroDescription, service.intro, defaultAnswer),
    },
    {
      question: `How does Sassntial approach ${service.label}?`,
      answer: firstAvailable(
        approachDescription,
        service.sections?.[0]?.description,
        defaultAnswer
      ),
    },
    {
      question: `How do you measure ${service.label} success?`,
      answer: outcomeLine,
    },
    {
      question: `Can ${service.label} be tailored to my business goals?`,
      answer:
        `Yes. We adapt ${service.label.toLowerCase()} strategy, delivery, and reporting to match your goals, stage, and operational priorities.` ||
        defaultAnswer,
    },
  ]
}

const ServiceDetailTemplate = ({ service }: { service: ServiceItem }) => {
  const override = servicePresentationOverrides[service.slug]
  const heroTitle =
    firstAvailable(
      override?.heroTitle,
      service.title,
      `${service.label} services built for measurable growth.`
    ) || `${service.label} services built for measurable growth.`
  const heroDescription =
    firstAvailable(
      override?.heroDescription,
      service.summary,
      service.intro,
      defaultParagraph
    ) || defaultParagraph
  const sectionTitle =
    firstAvailable(
      override?.sectionTitle,
      service.sections?.[0]?.title,
      `${service.label} Services: Our Strategic Approach`
    ) || `${service.label} Services: Our Strategic Approach`
  const ctaLabel =
    firstAvailable(
      service.finalCta?.primaryLabel,
      override?.ctaLabel,
      "Request A Free Proposal"
    ) || "Request A Free Proposal"
  const showcaseCards = override?.cards ?? buildGeneratedCards(service)
  const showcaseTitle =
    firstAvailable(
      override?.showcaseTitle,
      `Explore Our ${service.label} Capabilities`
    ) || `Explore Our ${service.label} Capabilities`
  const showcaseSubtitle =
    firstAvailable(
      override?.showcaseSubtitle,
      `${service.label} service highlights built for structured execution.`
    ) || `${service.label} service highlights built for structured execution.`
  const showcaseDescription =
    firstAvailable(
      override?.showcaseDescription,
      service.summary,
      service.intro,
      defaultParagraph
    ) || defaultParagraph

  const heroImage = getHeroImage(service)
  const sectionImage = getSectionImage(service)
  const focusItems = fillList(
    [
      ...service.capabilities,
      ...(service.sections?.flatMap((section) => section.items ?? []) ?? []),
      ...service.outcomes,
    ],
    4,
    (index) => `Lorem insight ${index + 1} for ${service.label}.`
  )
  const approachDescription =
    firstAvailable(
      service.sections?.[0]?.description,
      service.summary,
      service.intro,
      defaultParagraph
    ) || defaultParagraph
  const supportingTitle =
    firstAvailable(
      service.supportingMessage?.title,
      `Why Brands Choose Sassntial for ${service.label}`
    ) || `Why Brands Choose Sassntial for ${service.label}`
  const supportingDescription =
    firstAvailable(
      service.supportingMessage?.description,
      heroDescription,
      defaultParagraph
    ) || defaultParagraph
  const differentiatorItems = fillList(
    [
      ...(service.differentiators?.items ?? []),
      ...service.outcomes,
      ...service.capabilities,
    ],
    4,
    (index) =>
      `Lorem differentiator ${
        index + 1
      } for ${service.label.toLowerCase()} services.`
  ).slice(0, 6)
  const differentiatorTitle =
    firstAvailable(
      service.differentiators?.title,
      `What Sets Our ${service.label} Services Apart`
    ) || `What Sets Our ${service.label} Services Apart`
  const differentiatorDescription =
    firstAvailable(
      service.supportingMessage?.description,
      `We combine strategy, execution, and reporting to make ${service.label.toLowerCase()} easier to scale, measure, and improve over time.`,
      defaultParagraph
    ) || defaultParagraph
  const aboutParagraphs = fillList(
    [
      ...(service.aboutSection?.paragraphs ?? []),
      heroDescription,
      service.sections?.[0]?.description,
      service.sections?.[1]?.description,
    ],
    2,
    () => defaultParagraph
  ).slice(0, 4)
  const aboutListGroups: ServiceListGroup[] =
    service.aboutSection?.listGroups &&
    service.aboutSection.listGroups.length > 0
      ? service.aboutSection.listGroups.map((group) => ({
          title:
            firstAvailable(group.title, `${service.label} focus area`) ||
            `${service.label} focus area`,
          items: fillList(group.items, 1, () => defaultParagraph),
        }))
      : [
          {
            title: `${service.label} focus areas`,
            items: focusItems.slice(0, 3),
          },
          {
            title: "Expected outcomes",
            items: fillList(
              service.outcomes,
              3,
              (index) =>
                `Lorem outcome ${
                  index + 1
                } for ${service.label.toLowerCase()} services.`
            ).slice(0, 3),
          },
        ]
  const aboutTitle =
    firstAvailable(
      service.aboutSection?.title,
      `About Our ${service.label} Services`
    ) || `About Our ${service.label} Services`
  const faqOutcomes = uniqueValues(service.outcomes)
  const faqs =
    service.faqs && service.faqs.length > 0
      ? service.faqs
      : buildFallbackFaqs(
          service,
          heroDescription,
          approachDescription,
          faqOutcomes
        )
  const finalCtaTitle =
    firstAvailable(
      service.finalCta?.title,
      `Ready to Grow with ${service.label}?`
    ) || `Ready to Grow with ${service.label}?`
  const finalCtaDescription =
    firstAvailable(
      service.finalCta?.description,
      heroDescription,
      defaultParagraph
    ) || defaultParagraph

  return (
    <MarketingDetailShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: service.label },
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
      heroNote="We email qualified businesses within one business day"
      heroImage={heroImage}
      sectionContent={
        <AiSeoStrategicApproach
          eyebrow={service.eyebrow || "Service Framework"}
          title={sectionTitle}
          description={approachDescription}
          pillars={focusItems.slice(0, 4)}
          pillarsLabel={`What ${service.label} includes`}
          closingNote={supportingDescription}
          imageSrc={sectionImage.src}
          imageAlt={sectionImage.alt}
        />
      }
      sectionEyebrow={service.eyebrow || "Service Detail"}
      sectionTitle={sectionTitle}
      sectionIntro={heroDescription}
      featureCards={[]}
      childrenWide
    >
      <AiSeoVisualShowcase
        title={showcaseTitle}
        subtitle={showcaseSubtitle}
        description={showcaseDescription}
        cards={showcaseCards}
        ctaLabel={ctaLabel}
      />

      <div className="mx-auto p-0">
        <AiSeoSupportingMessage
          eyebrow={service.eyebrow || "Supporting Message"}
          title={supportingTitle}
          description={supportingDescription}
          imageSrc={sectionImage.src}
          imageAlt={sectionImage.alt}
          actionTitle={`Ready to explore ${service.label}?`}
          actionLabel={ctaLabel}
        />
      </div>

      <AiSeoDifferentiators
        title={differentiatorTitle}
        description={differentiatorDescription}
        items={differentiatorItems}
      />

      <AiSeoAboutGains
        title={aboutTitle}
        paragraphs={aboutParagraphs}
        listGroups={aboutListGroups}
      />

      <AiSeoLeadForm
        eyebrow={`${service.label} Proposal`}
        formIdPrefix={service.slug}
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
          FAQs - {service.label} Services
        </h3>

        <div className="mt-8 grid gap-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              name={`${service.slug}-faq`}
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
    </MarketingDetailShell>
  )
}

export default ServiceDetailTemplate
