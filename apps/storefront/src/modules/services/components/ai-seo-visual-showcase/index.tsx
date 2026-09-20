import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { SeoServiceCard } from "@modules/common/components/seo-service-grid"

type AiSeoVisualShowcaseProps = {
  cards: SeoServiceCard[]
  ctaLabel: string
  ctaHref?: string
  title?: string
  subtitle?: string
  description?: string
}

type VisualTheme = {
  eyebrow: string
  panelClass: string
  bandClass: string
  metricA: {
    value: string
    label: string
  }
  metricB: {
    value: string
    label: string
  }
  art: "geo" | "aeo" | "visibility" | "authority"
}

const visualThemes: Record<string, VisualTheme> = {
  "GEO Optimization": {
    eyebrow: "",
    panelClass:
      "bg-[linear-gradient(145deg,#d8ecff_0%,#edf6ff_45%,#ffffff_100%)]",
    bandClass: "bg-[#111827]",
    metricA: {
      value: "",
      label: "",
    },
    metricB: {
      value: "",
      label: "",
    },
    art: "geo",
  },
  "AEO & Conversational SEO": {
    eyebrow: "",
    panelClass:
      "bg-[linear-gradient(145deg,#fff0d8_0%,#ffe2bd_46%,#fffaf1_100%)]",
    bandClass: "bg-[#111827]",
    metricA: {
      value: "",
      label: "",
    },
    metricB: {
      value: "",
      label: "",
    },
    art: "aeo",
  },
  "AI Visibility Strategy": {
    eyebrow: "",
    panelClass:
      "bg-[linear-gradient(145deg,#e2fff0_0%,#d6f8ff_48%,#ffffff_100%)]",
    bandClass: "bg-[#111827]",
    metricA: {
      value: "",
      label: "",
    },
    metricB: {
      value: "",
      label: "",
    },
    art: "visibility",
  },
  "Authority Signals & SEO": {
    eyebrow: "",
    panelClass:
      "bg-[linear-gradient(145deg,#eef2ff_0%,#f7f3ff_42%,#fffdf7_100%)]",
    bandClass: "bg-[#111827]",
    metricA: {
      value: "",
      label: "",
    },
    metricB: {
      value: "",
      label: "",
    },
    art: "authority",
  },
}

const fallbackThemes: VisualTheme[] = [
  {
    eyebrow: "Service Focus",
    panelClass: "bg-[linear-gradient(145deg,#edf4ff_0%,#ffffff_100%)]",
    bandClass: "bg-[#111827]",
    metricA: {
      value: "",
      label: "",
    },
    metricB: {
      value: "",
      label: "",
    },
    art: "visibility",
  },
  {
    eyebrow: "Delivery Layer",
    panelClass:
      "bg-[linear-gradient(145deg,#fff0d8_0%,#fff7ed_46%,#ffffff_100%)]",
    bandClass: "bg-[#1f2937]",
    metricA: {
      value: "",
      label: "",
    },
    metricB: {
      value: "",
      label: "",
    },
    art: "aeo",
  },
  {
    eyebrow: "Growth Signal",
    panelClass:
      "bg-[linear-gradient(145deg,#e2fff0_0%,#ecfeff_48%,#ffffff_100%)]",
    bandClass: "bg-[#13313a]",
    metricA: {
      value: "",
      label: "",
    },
    metricB: {
      value: "",
      label: "",
    },
    art: "geo",
  },
  {
    eyebrow: "Authority Layer",
    panelClass:
      "bg-[linear-gradient(145deg,#eef2ff_0%,#f7f3ff_42%,#fffdf7_100%)]",
    bandClass: "bg-[#21153a]",
    metricA: {
      value: "",
      label: "",
    },
    metricB: {
      value: "",
      label: "",
    },
    art: "authority",
  },
]

const getCardCopy = (card: SeoServiceCard) =>
  card.segments
    .map((segment) => segment.text)
    .join("")
    .trim()

const GeoArt = () => (
  <div className="absolute inset-0 overflow-hidden">
    <img
      src="/geo-optimization.jpeg"
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover object-center"
    />
  </div>
)

const AeoArt = () => (
  <div className="absolute inset-0 overflow-hidden">
    <img
      src="/aeo.jpeg"
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover object-center"
    />
  </div>
)

const VisibilityArt = () => (
  <div className="absolute inset-0 overflow-hidden">
    <img
      src="/ai-visibility.jpeg"
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover object-center"
    />
  </div>
)

const AuthorityArt = () => (
  <div className="absolute inset-0 overflow-hidden">
    <img
      src="/authority.jpeg"
      alt=""
      aria-hidden="true"
      className="h-full w-full object-cover object-center"
    />
  </div>
)

const ServiceArt = ({ art }: { art: VisualTheme["art"] }) => {
  switch (art) {
    case "geo":
      return <GeoArt />
    case "aeo":
      return <AeoArt />
    case "visibility":
      return <VisibilityArt />
    case "authority":
      return <AuthorityArt />
  }
}

const AiSeoVisualShowcase = ({
  cards,
  ctaLabel,
  ctaHref = "/company/contact-us",
  title = "AI SEO Services Built to Improve Answer Visibility",
  subtitle = "AIO, AEO, GEO, and authority systems designed for the next era of search.",
  description = "We've replaced the plain text service cards with a more visual showcase so each AI SEO capability feels easier to scan, understand, and compare at a glance.",
}: AiSeoVisualShowcaseProps) => {
  return (
    <section className="mx-auto max-w-[1260px] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] px-5 py-7 shadow-[0_20px_42px_rgba(15,23,42,0.06)] small:px-7 small:py-12 medium:px-8">
      <div className="mx-auto max-w-[860px] text-center">
        <h2 className="text-[2rem] font-black leading-[1.05] text-slate-900 small:text-[2.35rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[0.98rem] font-semibold italic text-slate-600">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="mx-auto mt-4 max-w-[46rem] text-[15px] leading-7 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="mt-9 grid gap-5 small:grid-cols-2 medium:grid-cols-4">
        {cards.map((card, index) => {
          const theme =
            visualThemes[card.title] ||
            fallbackThemes[index % fallbackThemes.length]

          return (
            <article
              key={card.title}
              className="overflow-hidden border border-[#e5ebf4] bg-white shadow-[0_16px_32px_rgba(15,23,42,0.08)]"
            >
              <div
                className={`relative h-[210px] overflow-hidden ${theme.panelClass}`}
              >
                <span className="absolute left-4 top-4 z-[1] bg-white/90 px-3 py-1 text-[10px] font-bold uppercase text-slate-700">
                  {theme.eyebrow}
                </span>
                <ServiceArt art={theme.art} />
              </div>

              <div className={`${theme.bandClass} px-4 py-3`}>
                <h3 className="text-[0.95rem] font-black uppercase leading-5 text-white">
                  {card.title}
                </h3>
              </div>

              <div className="px-4 py-4">
                <p className="text-[13px] leading-6 text-slate-600">
                  {getCardCopy(card)}
                </p>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <LocalizedClientLink
          href={ctaHref}
          className="inline-flex items-center justify-center bg-brand-cta px-[26px] py-3.5 text-[0.86rem] font-bold uppercase leading-6 text-white shadow-[0_18px_34px_rgba(238,107,75,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          {ctaLabel}
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default AiSeoVisualShowcase
