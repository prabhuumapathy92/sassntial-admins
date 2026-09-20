import MarketingDetailShell from "@modules/common/components/marketing-detail-shell"
import {
  type SeoServiceCard,
  multiLocationSeoServiceCards,
} from "@modules/common/components/seo-service-grid"
import AiSeoAboutGains from "@modules/services/components/ai-seo-about-gains"
import AiSeoDifferentiators from "@modules/services/components/ai-seo-differentiators"
import AiSeoLeadForm from "@modules/services/components/ai-seo-lead-form"
import AiSeoSupportingMessage from "@modules/services/components/ai-seo-supporting-message"
import AiSeoStrategicApproach from "@modules/services/components/ai-seo-strategic-approach"
import AiSeoVisualShowcase from "@modules/services/components/ai-seo-visual-showcase"
import {
  WhoWeServeItem,
  whoWeServeItems,
} from "@modules/who-we-serve/constants/who-we-serve-items"

type WhoWeServeFaq = {
  question: string
  answer: string
}

type WhoWeServeListGroup = {
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

const buildWhoWeServeCards = (
  item: WhoWeServeItem,
  isMultiLocation: boolean
): SeoServiceCard[] => {
  if (isMultiLocation) {
    return multiLocationSeoServiceCards
  }

  const totalCards = Math.max(
    item.highlights.length,
    item.supportPoints.length,
    4
  )

  return Array.from({ length: totalCards }, (_, index) => ({
    title:
      firstAvailable(
        item.supportPoints[index],
        `Focus ${String(index + 1).padStart(2, "0")}`
      ) || `Focus ${String(index + 1).padStart(2, "0")}`,
    icon: fallbackIcons[index % fallbackIcons.length],
    segments: [
      {
        text:
          firstAvailable(
            item.highlights[index],
            item.intro,
            item.summary,
            defaultParagraph
          ) || defaultParagraph,
      },
    ],
  }))
}

const buildWhoWeServeFaqs = (
  item: WhoWeServeItem,
  heroDescription: string,
  strategyDescription: string,
  differentiatorItems: string[]
): WhoWeServeFaq[] => [
  {
    question: `What does support for ${item.label} include?`,
    answer:
      firstAvailable(heroDescription, item.intro, defaultAnswer) ||
      defaultAnswer,
  },
  {
    question: `How does Sassential approach ${item.label}?`,
    answer:
      firstAvailable(strategyDescription, item.summary, defaultAnswer) ||
      defaultAnswer,
  },
  {
    question: `What outcomes matter most for ${item.label}?`,
    answer:
      firstAvailable(
        differentiatorItems.join(", "),
        item.summary,
        defaultAnswer
      ) || defaultAnswer,
  },
  {
    question: `Can this be tailored to our market and operating model?`,
    answer:
      `Yes. We tailor programs for ${item.label.toLowerCase()} around your market context, operational realities, and growth priorities.` ||
      defaultAnswer,
  },
]

const WhoWeServeDetailTemplate = ({ item }: { item: WhoWeServeItem }) => {
  const isMultiLocation = item.slug === "multi-location-businesses"

  const heroTitle =
    firstAvailable(
      `${item.label.toUpperCase()} PROGRAMS BUILT FOR CLEARER GROWTH AND EXECUTION`,
      item.title
    ) || item.title
  const heroDescription =
    firstAvailable(item.intro, item.summary, defaultParagraph) ||
    defaultParagraph
  const strategyTitle =
    firstAvailable(
      `How We Support ${item.label}`,
      `${item.label} Strategic Approach`
    ) || `${item.label} Strategic Approach`
  const strategyDescription =
    firstAvailable(item.summary, item.intro, defaultParagraph) ||
    defaultParagraph
  const ctaLabel = "Request A Free Proposal"
  const showcaseCards = buildWhoWeServeCards(item, isMultiLocation)
  const showcaseTitle =
    firstAvailable(
      `${item.label} Growth Capabilities`,
      `${item.label} Service Areas`
    ) || `${item.label} Growth Capabilities`
  const showcaseSubtitle =
    firstAvailable(
      item.summary,
      `${item.label} systems designed to improve planning, visibility, and measurable performance.`
    ) ||
    `${item.label} systems designed to improve planning, visibility, and measurable performance.`
  const showcaseDescription =
    firstAvailable(item.intro, item.summary, defaultParagraph) ||
    defaultParagraph
  const focusItems = fillList(
    [...item.highlights, ...item.supportPoints],
    4,
    (index) => `Lorem insight ${index + 1} for ${item.label}.`
  )
  const supportingTitle =
    firstAvailable(
      `Why ${item.label} Teams Work With Sassential`,
      `Why Teams Choose Sassential`
    ) || `Why Teams Choose Sassential`
  const supportingDescription =
    firstAvailable(item.summary, item.intro, defaultParagraph) ||
    defaultParagraph
  const differentiatorItems = fillList(
    [...item.supportPoints, ...item.highlights],
    4,
    (index) => `Lorem differentiator ${index + 1} for ${item.label}.`
  ).slice(0, 6)
  const differentiatorTitle =
    firstAvailable(
      `What Matters Most for ${item.label}`,
      `What Sets ${item.label} Apart`
    ) || `What Sets ${item.label} Apart`
  const aboutTitle =
    firstAvailable(`About Our ${item.label} Programs`, `About ${item.label}`) ||
    `About ${item.label}`
  const aboutParagraphs = fillList(
    [item.intro, item.summary],
    2,
    () => defaultParagraph
  ).slice(0, 4)
  const aboutListGroups: WhoWeServeListGroup[] = [
    {
      title: `${item.label} priorities`,
      items: fillList(
        item.highlights,
        3,
        (index) => `Lorem priority ${index + 1}.`
      ).slice(0, 3),
    },
    {
      title: "Support areas",
      items: fillList(
        item.supportPoints,
        3,
        (index) => `Lorem support area ${index + 1}.`
      ).slice(0, 3),
    },
  ]
  const finalCtaTitle =
    firstAvailable(
      `Ready to grow with ${item.label}?`,
      `Talk to our team about ${item.label}`
    ) || `Ready to grow with ${item.label}?`
  const finalCtaDescription =
    firstAvailable(item.summary, item.intro, defaultParagraph) ||
    defaultParagraph
  const faqs = buildWhoWeServeFaqs(
    item,
    heroDescription,
    strategyDescription,
    differentiatorItems
  )

  return (
    <MarketingDetailShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Who We Serve", href: "/who-we-serve" },
        { label: item.label },
      ]}
      title={heroTitle}
      description={heroDescription}
      heroVariant="immersive"
      actions={[{ label: ctaLabel, href: "/company/contact-us" }]}
      heroImage={{
        src: "/multi-location-banner.jpeg",
        alt: `${item.label} audience segment hero image`,
      }}
      heroNote="We email qualified businesses within one business day"
      sectionContent={
        <AiSeoStrategicApproach
          eyebrow={item.eyebrow || "Who We Serve"}
          title={strategyTitle}
          description={strategyDescription}
          pillars={focusItems.slice(0, 4)}
          pillarsLabel={`What ${item.label} includes`}
          closingNote={supportingDescription}
          imageSrc="/ai-services.jpeg"
          imageAlt={`${item.label} strategic support visual`}
        />
      }
      sectionEyebrow={item.eyebrow || "Who We Serve"}
      sectionTitle={strategyTitle}
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
          eyebrow={item.eyebrow || "Who We Serve"}
          title={supportingTitle}
          description={supportingDescription}
          imageSrc="/ai.jpeg"
          imageAlt={`${item.label} supporting visual`}
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
    </MarketingDetailShell>
  )
}

export default WhoWeServeDetailTemplate
