import { ReactNode } from "react"

import FeaturedLogoSlider from "@modules/common/components/featured-logo-slider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BreadcrumbItem = {
  label: string
  href?: string
}

type HeroAction = {
  label: string
  href: string
  variant?: "primary" | "secondary"
}

type CredibilityItem = {
  label: string
  title: string
  meta: string
}

type FeatureCard = {
  title: string
  description: string
  bullets?: string[]
}

type RelatedLink = {
  href: string
  label: string
  description: string
  eyebrow?: string
}

type MarketingDetailShellProps = {
  breadcrumbs: BreadcrumbItem[]
  eyebrow?: string
  title: string
  description: string
  heroVariant?: "default" | "immersive"
  actions?: HeroAction[]
  heroNote?: string
  heroImage?: {
    src: string
    alt: string
  }
  heroImageFit?: "cover" | "contain"
  proofTitle?: string
  proofItems?: CredibilityItem[]
  proofContent?: ReactNode
  sectionContent?: ReactNode
  sectionEyebrow?: string
  sectionTitle: string
  sectionIntro?: string
  featureCards?: FeatureCard[]
  children?: ReactNode
  childrenWide?: boolean
  relatedTitle?: string
  relatedHref?: string
  relatedLabel?: string
  relatedLinks?: RelatedLink[]
}

type CardTheme = {
  surfaceClass: string
  bandClass: string
  badgeClass: string
  dotClass: string
  glowClass: string
  lineClass: string
}

const cardThemes: CardTheme[] = [
  {
    surfaceClass:
      "bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)]",
    bandClass: "bg-[#10233b]",
    badgeClass:
      "bg-[linear-gradient(135deg,#eff6ff_0%,#dbeafe_100%)] text-[#1d4ed8]",
    dotClass: "bg-[#2563eb]",
    glowClass: "bg-[rgba(37,99,235,0.12)]",
    lineClass: "bg-[linear-gradient(90deg,#60a5fa_0%,#2563eb_100%)]",
  },
  {
    surfaceClass:
      "bg-[linear-gradient(180deg,#ffffff_0%,#fff7ed_100%)]",
    bandClass: "bg-[#1f2937]",
    badgeClass:
      "bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] text-[#ea580c]",
    dotClass: "bg-[#f97316]",
    glowClass: "bg-[rgba(249,115,22,0.12)]",
    lineClass: "bg-[linear-gradient(90deg,#fbbf24_0%,#f97316_100%)]",
  },
  {
    surfaceClass:
      "bg-[linear-gradient(180deg,#ffffff_0%,#f0fdfa_100%)]",
    bandClass: "bg-[#13313a]",
    badgeClass:
      "bg-[linear-gradient(135deg,#ecfeff_0%,#ccfbf1_100%)] text-[#0f766e]",
    dotClass: "bg-[#14b8a6]",
    glowClass: "bg-[rgba(20,184,166,0.12)]",
    lineClass: "bg-[linear-gradient(90deg,#2dd4bf_0%,#0f766e_100%)]",
  },
  {
    surfaceClass:
      "bg-[linear-gradient(180deg,#ffffff_0%,#f5f3ff_100%)]",
    bandClass: "bg-[#21153a]",
    badgeClass:
      "bg-[linear-gradient(135deg,#f5f3ff_0%,#ede9fe_100%)] text-[#7c3aed]",
    dotClass: "bg-[#8b5cf6]",
    glowClass: "bg-[rgba(139,92,246,0.12)]",
    lineClass: "bg-[linear-gradient(90deg,#c084fc_0%,#7c3aed_100%)]",
  },
]

const getCardMonogram = (title: string, index: number) => {
  const words = title
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean)

  if (words.length === 0) {
    return String(index + 1).padStart(2, "0")
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

const getCardTheme = (index: number) => cardThemes[index % cardThemes.length]

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </svg>
)

const MarketingDetailShell = ({
  breadcrumbs,
  eyebrow,
  title,
  description,
  heroVariant = "default",
  actions = [],
  heroNote,
  heroImage,
  heroImageFit = "cover",
  proofContent,
  sectionContent,
  sectionEyebrow,
  sectionTitle,
  sectionIntro,
  featureCards = [],
  children,
  childrenWide = false,
  relatedTitle,
  relatedHref,
  relatedLabel = "View All",
  relatedLinks = [],
}: MarketingDetailShellProps) => {
  const isImmersiveHero = heroVariant === "immersive"
  const isSingleFeatureCard = featureCards.length === 1

  return (
    <>
      <section className="marketing-hero">
        <div className={isImmersiveHero ? "w-full" : "content-container py-6 small:py-8"}>
          <div
            className={`marketing-hero-panel overflow-hidden border border-white/10 ${
              isImmersiveHero
                ? "marketing-hero-panel-immersive border-x-0 rounded-none"
                : "rounded-[36px]"
            }`}
          >
            <div
              className={
                isImmersiveHero
                  ? "relative min-h-[420px] small:min-h-[500px] large:min-h-[560px]"
                  : "grid min-h-[420px] large:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.82fr)]"
              }
            >
              {isImmersiveHero && (
                <div className="marketing-hero-media marketing-hero-media-immersive absolute inset-0">
                  {heroImage ? (
                    <img
                      src={heroImage.src}
                      alt={heroImage.alt}
                      className="h-full w-full object-cover object-[68%_center]"
                    />
                  ) : (
                    <div className="marketing-hero-placeholder h-full w-full" />
                  )}
                </div>
              )}

              <div
                className={`relative z-[1] ${
                  isImmersiveHero
                    ? "mx-auto flex w-full max-w-[1320px] px-5 py-8 small:px-7 small:py-10 large:px-7 large:py-12"
                    : "px-6 py-8 small:px-8 small:py-10 large:px-10 large:py-11"
                }`}
              >
                <div className={isImmersiveHero ? "marketing-immersive-copy" : "max-w-[42rem]"}>
                  <div
                    className={`flex flex-wrap items-center gap-3 ${
                      isImmersiveHero
                        ? "marketing-immersive-breadcrumbs"
                        : "text-[11px] font-semibold uppercase tracking-[0.2em] text-white/72"
                    }`}
                  >
                    {breadcrumbs.map((item, index) => (
                      <div key={`${item.label}-${index}`} className="flex items-center gap-3">
                        {item.href ? (
                          <LocalizedClientLink
                            href={item.href}
                            className="transition-colors duration-200 hover:text-white"
                          >
                            {item.label}
                          </LocalizedClientLink>
                        ) : (
                          <span className="text-white">{item.label}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                          isImmersiveHero ? (
                            <span className="text-white/70">/</span>
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#f2b544]" />
                          )
                        )}
                      </div>
                    ))}
                  </div>

                  {eyebrow && (
                    <p
                      className={`mt-6 inline-flex rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 font-semibold uppercase text-[#ffd28d] backdrop-blur-sm ${
                        isImmersiveHero
                          ? "text-[0.88rem] tracking-[0.18em]"
                          : "text-[10px] tracking-[0.22em]"
                      }`}
                    >
                      {eyebrow}
                    </p>
                  )}

                  <h2
                    className={`mt-6 uppercase text-white ${
                      !isImmersiveHero
                        ? "max-w-[14ch] text-[2.5rem] font-black leading-[0.94] small:text-[3rem] large:text-[3.65rem]"
                        : ""
                    }`}
                  >
                    {title}
                  </h2>

                  <p
                    className={`mt-5 text-slate-200 ${
                      isImmersiveHero
                        ? "marketing-immersive-body"
                        : "max-w-[34rem] text-[15px] leading-8 small:text-[1rem]"
                    }`}
                  >
                    {description}
                  </p>

                  {actions.length > 0 && (
                    <div className="mt-9 flex flex-col gap-3 small:flex-row">
                      {actions.map((action) => {
                        const isSecondary = action.variant === "secondary"

                        return (
                          <LocalizedClientLink
                            key={`${action.href}-${action.label}`}
                            href={action.href}
                            className={
                              isSecondary
                                ? "inline-flex min-h-11 items-center justify-center rounded-full border border-white/18 bg-white/[0.06] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-white/10"
                                : "inline-flex items-center justify-center rounded-[999px] bg-[linear-gradient(90deg,#f2b544_0%,#ee6b4b_100%)] px-[28px] py-3.5 text-[0.88rem] font-bold uppercase tracking-[0.03em] text-white shadow-[0_18px_34px_rgba(238,107,75,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
                            }
                          >
                            {action.label}
                          </LocalizedClientLink>
                        )
                      })}
                    </div>
                  )}

                  {heroNote && (
                    <div
                      className={`mt-7 ${
                        isImmersiveHero
                          ? "flex items-center gap-4 text-[0.98rem] italic text-white"
                          : "inline-flex max-w-[30rem] items-center gap-3 rounded-[20px] border border-white/12 bg-white/[0.08] px-4 py-3 text-sm text-slate-200 backdrop-blur-sm"
                      }`}
                    >
                      <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#2494f2] shadow-[0_14px_24px_rgba(36,148,242,0.28)]">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M4 13.5 9.2 18 20 6" />
                          <path d="M8.5 8.5 4 13" />
                          <path d="M15.5 15.5 20 11" />
                        </svg>
                      </span>
                      <p className={isImmersiveHero ? "drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)]" : ""}>
                        {heroNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {!isImmersiveHero && (
                <div className="relative flex min-h-[300px] items-stretch p-5 small:p-6 large:p-7">
                  <div className="absolute inset-5 rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-[2px] small:inset-6 large:inset-7" />
                  <div className="absolute left-8 top-8 h-20 w-20 rounded-[26px] border border-white/10 bg-white/[0.05] backdrop-blur-sm small:left-10" />
                  <div className="absolute right-10 top-10 h-16 w-28 rounded-full bg-[rgba(242,181,68,0.2)] blur-2xl" />
                  <div
                    className={`relative z-[1] flex-1 overflow-hidden rounded-[30px] border border-white/12 shadow-[0_28px_48px_rgba(8,21,35,0.24)] ${
                      heroImageFit === "contain" ? "bg-[#10233b]" : ""
                    }`}
                  >
                    {heroImage ? (
                      <img
                        src={heroImage.src}
                        alt={heroImage.alt}
                        className={`h-full w-full ${
                          heroImageFit === "contain" ? "object-contain" : "object-cover"
                        }`}
                      />
                    ) : (
                      <div className="marketing-hero-placeholder h-full w-full" />
                    )}
                    {heroImageFit !== "contain" && (
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_0%,rgba(15,23,42,0.28)_100%)]" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-transparent">
        {proofContent ?? <FeaturedLogoSlider />}
      </section>

      <section className="marketing-pattern-surface">
        <div className="content-container p-0">
          <div className="grid">
            {sectionContent ? (
              <div>{sectionContent}</div>
            ) : (
              <article className="relative overflow-hidden rounded-[36px] border border-[#dbe7f2] bg-[#10233b] px-6 py-7 text-white shadow-[0_28px_60px_-48px_rgba(15,23,42,0.88)] small:px-8 small:py-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,181,68,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.16),transparent_34%)]" />
                <div className="relative mx-auto max-w-[920px] text-center">
                  {sectionEyebrow && (
                    <p className="inline-flex rounded-full border border-white/12 bg-white/[0.08] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ffd28d] backdrop-blur-sm">
                      {sectionEyebrow}
                    </p>
                  )}

                  <h2 className="mt-5 text-[2rem] font-black uppercase leading-[1.02] text-white small:text-[2.4rem]">
                    {sectionTitle}
                  </h2>

                  {sectionIntro && (
                    <p className="mx-auto mt-4 max-w-[44rem] text-[15px] leading-8 text-slate-200">
                      {sectionIntro}
                    </p>
                  )}
                </div>
              </article>
            )}

            {featureCards.length > 0 && (
              <div
                className={`mx-auto grid w-full gap-5 ${
                  isSingleFeatureCard
                    ? "max-w-[1160px] grid-cols-1"
                    : "max-w-[1120px] xsmall:grid-cols-2 small:grid-cols-4"
                }`}
              >
                {featureCards.map((card, index) => {
                  const theme = getCardTheme(index)

                  if (isSingleFeatureCard) {
                    return (
                      <article
                        key={`${card.title}-${index}`}
                        className="relative overflow-hidden rounded-[36px] border border-[#dbe7f2] bg-white shadow-[0_28px_60px_-48px_rgba(15,23,42,0.76)]"
                      >
                        <div className={`absolute inset-x-0 top-0 h-1 ${theme.lineClass}`} />
                        <div className="grid large:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
                          <div className="relative overflow-hidden bg-[#10233b] px-6 py-7 text-white small:px-7 small:py-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(242,181,68,0.18),transparent_34%)]" />
                            <div className="relative">
                              <span
                                className={`inline-flex h-12 w-12 items-center justify-center rounded-[18px] text-[11px] font-black uppercase shadow-[0_14px_24px_rgba(0,0,0,0.18)] ${theme.badgeClass}`}
                              >
                                01
                              </span>
                              {card.description && (
                                <p className="mt-6 max-w-[26rem] text-[15px] leading-8 text-slate-200">
                                  {card.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className={`relative px-5 py-5 small:px-6 small:py-6 ${theme.surfaceClass}`}>
                            <div
                              className={`absolute right-[-10px] top-5 h-24 w-24 rounded-full blur-2xl ${theme.glowClass}`}
                            />
                            {card.bullets && card.bullets.length > 0 ? (
                              <div className="relative grid gap-4 small:grid-cols-2">
                                {card.bullets.map((bullet, bulletIndex) => (
                                  <article
                                    key={bullet}
                                    className="rounded-[24px] border border-white/80 bg-white/90 px-5 py-5 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.8)] backdrop-blur-sm"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span
                                        className={`inline-flex h-11 w-11 items-center justify-center rounded-[16px] text-[11px] font-black uppercase shadow-[0_12px_20px_rgba(15,23,42,0.08)] ${theme.badgeClass}`}
                                      >
                                        {String(bulletIndex + 1).padStart(2, "0")}
                                      </span>
                                      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                        Service Area
                                      </span>
                                    </div>
                                    <p className="mt-5 text-[1rem] leading-7 text-slate-700">
                                      {bullet}
                                    </p>
                                  </article>
                                ))}
                              </div>
                            ) : (
                              <p className="relative text-base leading-8 text-slate-600">
                                {card.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  }

                  return (
                    <article
                      key={`${card.title}-${index}`}
                      className={`group relative overflow-hidden rounded-[28px] border border-[#dfe7f1] shadow-[0_20px_42px_-34px_rgba(15,23,42,0.72)] ${theme.surfaceClass}`}
                    >
                      <div
                        className={`absolute left-[-16px] top-6 h-20 w-20 rounded-full blur-2xl ${theme.glowClass}`}
                      />
                      <div className={`absolute inset-x-0 top-0 h-1 ${theme.lineClass}`} />

                      <div className="relative px-5 pt-5">
                        <div className="flex items-center justify-between gap-4">
                          <span
                            className={`inline-flex h-11 w-11 items-center justify-center rounded-[16px] text-[11px] font-black uppercase shadow-[0_12px_20px_rgba(15,23,42,0.08)] ${theme.badgeClass}`}
                          >
                            {getCardMonogram(card.title, index)}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      <div className={`relative mt-5 px-5 py-4 ${theme.bandClass}`}>
                        <h3 className="text-base font-black uppercase leading-6 text-white">
                          {card.title}
                        </h3>
                      </div>

                      <div className="relative px-5 pb-5 pt-4">
                        <p className="text-sm leading-7 text-slate-600">
                          {card.description}
                        </p>

                        {card.bullets && card.bullets.length > 0 && (
                          <ul className="mt-5 grid gap-3">
                            {card.bullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="flex items-start gap-3 text-sm leading-7 text-slate-600"
                              >
                                <span
                                  className={`mt-2 inline-flex h-2 w-2 rounded-full ${theme.dotClass}`}
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

            {children && (
              <div className={`mx-auto w-full ${childrenWide ? "max-w-[1320px]" : "max-w-[1040px]"}`}>
                {children}
              </div>
            )}

            {relatedLinks.length > 0 && (
              <article className="relative overflow-hidden rounded-[36px] border border-[#dbe7f2] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-6 py-7 shadow-[0_28px_60px_-48px_rgba(15,23,42,0.76)] small:px-8 small:py-8">
                <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#60a5fa_0%,#f2b544_52%,#ee6b4b_100%)]" />
                <div className="flex flex-col gap-4 small:flex-row small:items-end small:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Keep Exploring
                    </p>
                    <h2 className="mt-3 text-[2rem] font-black uppercase leading-[0.98] text-slate-900 small:text-[2.35rem]">
                      {relatedTitle || "Related Pages"}
                    </h2>
                  </div>

                  {relatedHref && (
                    <LocalizedClientLink
                      href={relatedHref}
                      className="inline-flex items-center gap-2 text-[0.9rem] font-semibold uppercase tracking-[0.16em] text-[#0b78b5] transition-colors duration-200 hover:text-slate-900"
                    >
                      <span>{relatedLabel}</span>
                      <ArrowIcon />
                    </LocalizedClientLink>
                  )}
                </div>

                <div className="mt-8 grid gap-5 xsmall:grid-cols-2 small:grid-cols-3">
                  {relatedLinks.map((item, index) => {
                    const theme = getCardTheme(index)

                    return (
                      <LocalizedClientLink
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        className={`group relative overflow-hidden rounded-[28px] border border-[#e1e9f2] px-5 py-5 shadow-[0_16px_34px_-30px_rgba(15,23,42,0.82)] transition-transform duration-200 hover:-translate-y-1 ${theme.surfaceClass}`}
                      >
                        <div className={`absolute inset-x-0 top-0 h-1 ${theme.lineClass}`} />
                        <div
                          className={`absolute right-[-12px] top-5 h-20 w-20 rounded-full blur-2xl ${theme.glowClass}`}
                        />

                        {item.eyebrow && (
                          <p className="relative text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                            {item.eyebrow}
                          </p>
                        )}

                        <div className={`relative mt-5 rounded-[22px] px-4 py-4 ${theme.bandClass}`}>
                          <h3 className="text-[1.08rem] font-black uppercase leading-[1.08] text-white">
                            {item.label}
                          </h3>
                        </div>

                        <p className="relative mt-4 text-sm leading-7 text-slate-600">
                          {item.description}
                        </p>

                        <span
                          className={`relative mt-6 inline-flex h-11 w-11 items-center justify-center rounded-[16px] shadow-[0_12px_20px_rgba(15,23,42,0.08)] ${theme.badgeClass}`}
                        >
                          <ArrowIcon />
                        </span>
                      </LocalizedClientLink>
                    )
                  })}
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default MarketingDetailShell
