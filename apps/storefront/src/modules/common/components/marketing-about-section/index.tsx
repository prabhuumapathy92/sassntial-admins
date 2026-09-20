type MarketingAboutSectionProps = {
  title: string
  paragraphs: string[]
  listGroups?: {
    title: string
    items: string[]
  }[]
  className?: string
}

type AboutCard = {
  title?: string
  subtitle?: string
  bullets?: string[]
  body?: string
}

const cardThemes = [
  {
    iconClass:
      "bg-[linear-gradient(135deg,#ff9b45_0%,#f97316_100%)] shadow-[4px_6px_0_rgba(194,65,12,0.22)]",
    bulletClass: "text-[#f97316]",
    icon: "visibility" as const,
  },
  {
    iconClass:
      "bg-[linear-gradient(135deg,#b777ff_0%,#7c3aed_100%)] shadow-[4px_6px_0_rgba(91,33,182,0.22)]",
    bulletClass: "text-[#7c3aed]",
    icon: "roi" as const,
  },
  {
    iconClass:
      "bg-[linear-gradient(135deg,#31d8d0_0%,#14b8a6_100%)] shadow-[4px_6px_0_rgba(13,148,136,0.22)]",
    bulletClass: "text-[#14b8a6]",
    icon: "time" as const,
  },
] as const

const AboutIcon = ({
  type,
  className,
}: {
  type: "visibility" | "roi" | "time"
  className: string
}) => {
  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center text-white ${className}`}
    >
      {type === "visibility" && (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3c3.7 0 6 2.8 6 6 0 2.3-1.2 4.1-2.7 5.7-.9 1-1.3 2-1.3 3.3h-4c0-1.3-.4-2.3-1.3-3.3C7.2 13.1 6 11.3 6 9c0-3.2 2.3-6 6-6Z" />
          <path d="M10 21h4" />
        </svg>
      )}
      {type === "roi" && (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M13.8 2 5.5 13.2h4.7L9.7 22l8.8-11.3h-4.8L13.8 2Z" />
        </svg>
      )}
      {type === "time" && (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="13" r="7" />
          <path d="M12 9v4l2.8 1.8" />
          <path d="M9 3h6" />
          <path d="M17.5 5.5 19 4" />
        </svg>
      )}
    </span>
  )
}

const MarketingAboutSection = ({
  title,
  paragraphs,
  listGroups = [],
  className = "",
}: MarketingAboutSectionProps) => {
  const shouldConvertAllParagraphsToCards =
    listGroups.length === 0 && paragraphs.length <= 2

  const introParagraphs = shouldConvertAllParagraphsToCards
    ? []
    : paragraphs.slice(0, Math.min(2, paragraphs.length))

  const remainingParagraphs = shouldConvertAllParagraphsToCards
    ? paragraphs
    : paragraphs.slice(introParagraphs.length)

  const cards: AboutCard[] = [
    ...remainingParagraphs.map((paragraph) => ({
      body: paragraph,
    })),
    ...listGroups.map((group) => ({
      title: group.title,
      bullets: group.items,
    })),
  ]

  return (
    <section className={`mx-auto ${className}`.trim()}>
      <article className="px-6 py-8 shadow-[0_18px_36px_rgba(15,23,42,0.06)] small:px-8 small:py-10">
        <div className="mx-auto max-w-[900px] text-center">
          <h3 className="mt-4 text-[2rem] font-black leading-[1.04] text-slate-900 small:text-[2.45rem]">
            {title}
          </h3>

          {introParagraphs.length > 0 && (
            <div className="mx-auto mt-4 grid max-w-[48rem] gap-3">
              {introParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[14px] leading-7 text-slate-600 small:text-[15px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        {cards.length > 0 && (
          <div className="mt-10 grid gap-8 small:grid-cols-2 large:grid-cols-3">
            {cards.map((card, index) => {
              const theme = cardThemes[index % cardThemes.length]

              return (
                <article key={`${card.title || card.body}-${index}`}>
                  <AboutIcon type={theme.icon} className={theme.iconClass} />

                  {card.title && (
                    <h4 className="mt-5 text-[1.02rem] font-black leading-7 text-slate-900">
                      {card.title}
                    </h4>
                  )}

                  {card.subtitle && (
                    <p className="mt-3 text-[14px] leading-7 text-slate-600">
                      {card.subtitle}
                    </p>
                  )}

                  {card.body && (
                    <p className="mt-5 text-[14px] leading-7 text-slate-600">
                      {card.body}
                    </p>
                  )}

                  {card.bullets && card.bullets.length > 0 && (
                    <ul className="mt-5 grid gap-3">
                      {card.bullets.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-[14px] leading-6 text-slate-600"
                        >
                          <span className={`mt-1.5 ${theme.bulletClass}`}>
                            <svg
                              viewBox="0 0 20 20"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m4 10 4 4 8-8" />
                            </svg>
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </article>
    </section>
  )
}

export default MarketingAboutSection
