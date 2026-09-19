type StrapiAboutProps = {
  data: any
}

const getAboutAttributes = (data: any) => {
  if (!data) return {}
  const record = Array.isArray(data.data) ? data.data[0] : data.data
  return record?.attributes ?? record ?? {}
}

const extractText = (value: unknown) => {
  if (typeof value === "string") return value
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => {
        if (typeof item === "string") return item
        if (item && typeof item === "object") {
          const maybeText = (item as { text?: unknown }).text
          if (typeof maybeText === "string") return maybeText
          const maybeTitle = (item as { title?: unknown }).title
          if (typeof maybeTitle === "string") return maybeTitle
          const maybeChildren = (item as { children?: unknown }).children
          if (Array.isArray(maybeChildren)) {
            return maybeChildren
              .map((child) => (typeof child?.text === "string" ? child.text : ""))
              .filter(Boolean)
              .join("")
          }
        }
        return ""
      })
      .filter(Boolean)
    return parts.length ? parts.join("\n\n") : null
  }
  return null
}

const getListItems = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (typeof item === "string") return item
      if (item && typeof item === "object") {
        return (
          extractText((item as { text?: unknown }).text) ||
          extractText((item as { title?: unknown }).title) ||
          extractText(item)
        )
      }
      return null
    })
    .filter(Boolean) as string[]
}

const getStats = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (item && typeof item === "object") {
        const record = item as {
          value?: unknown
          number?: unknown
          percent?: unknown
          title?: unknown
          label?: unknown
          text?: unknown
        }
        const statValue =
          extractText(record.value) ||
          extractText(record.number) ||
          extractText(record.percent) ||
          null
        const statLabel =
          extractText(record.label) || extractText(record.title) || extractText(record.text) || null
        if (!statValue && !statLabel) return null
        return { value: statValue, label: statLabel }
      }
      return null
    })
    .filter(Boolean) as Array<{ value: string | null; label: string | null }>
}

const StrapiAbout = ({ data }: StrapiAboutProps) => {
  const about = getAboutAttributes(data)

  if (!data) {
    return (
      <section className="py-16">
        <div className="content-container">
          <p className="text-center text-slate-600">Unable to load about information.</p>
        </div>
      </section>
    )
  }

  const title = extractText(about.title) || extractText(about.heading) || null
  const description =
    extractText(about.description) || extractText(about.body) || extractText(about.content) || null
  const blocks = Array.isArray(about.blocks) ? about.blocks : []
  const heroBlock = blocks.find((block) => block?.__component === "shared.hero")

  const eyebrow =
    extractText(heroBlock?.subtitle) || extractText(about.subtitle) || "Brand Strategy"
  const heroTitle = extractText(heroBlock?.title) || title || "Build a brand system teams can scale with confidence."
  const heroDescription =
    extractText(heroBlock?.description) ||
    description ||
    "We shape brand foundations that help product, sales, and leadership teams communicate with one voice across every launch moment."
  const pillItems = [
    ...getListItems(heroBlock?.items),
    ...getListItems(heroBlock?.list),
    ...getListItems(heroBlock?.points),
    ...getListItems(heroBlock?.services),
    ...getListItems(heroBlock?.features),
    ...getListItems(about.items),
    ...getListItems(about.list),
    ...getListItems(about.points),
    ...getListItems(about.services),
    ...getListItems(about.features),
  ].filter(Boolean)
  const primaryCtaText = extractText(heroBlock?.button1_text) || "Browse Training"
  const primaryCtaLink =
    (heroBlock?.button1_link as string | null) || (about.button1_link as string | null) || "#"
  const secondaryCtaText = extractText(heroBlock?.button2_text) || "All Services"
  const secondaryCtaLink =
    (heroBlock?.button2_link as string | null) || (about.button2_link as string | null) || "#"
  const statsHeading =
    extractText(about.stats_heading) ||
    extractText(about.stats_title) ||
    "What we deliver, measured"
  const statsDescription =
    extractText(about.stats_description) ||
    extractText(about.stats_body) ||
    "Scroll to see the impact we drive across strategy, design, and delivery."
  const stats = [
    ...getStats(about.stats),
    ...getStats(about.metrics),
    ...getStats(about.kpis),
  ]
  const fallbackStats = [
    { value: "70%", label: "Faster launch cycles" },
    { value: "80%", label: "Reduction in handoff friction" },
    { value: "90%", label: "Stakeholder alignment" },
  ]
  const statItems = stats.length > 0 ? stats : fallbackStats

  return (
    <section className="py-16 bg-slate-50">
      <div className="content-container">
        <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-12 shadow-[0_30px_70px_-60px_rgba(15,23,42,0.9)] lg:px-14 lg:py-16">
          <div className="space-y-6">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                {eyebrow}
              </p>
            )}
            {heroTitle && (
              <h2 className="max-w-3xl text-3xl font-semibold text-slate-900 md:text-4xl lg:text-5xl">
                {heroTitle}
              </h2>
            )}
            {heroDescription && (
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                {heroDescription}
              </p>
            )}
            {pillItems.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {pillItems.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-4 pt-2">
              {primaryCtaText && (
                <a
                  className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-400/30 transition hover:bg-sky-300"
                  href={primaryCtaLink}
                >
                  {primaryCtaText}
                </a>
              )}
              {secondaryCtaText && (
                <a
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                  href={secondaryCtaLink}
                >
                  {secondaryCtaText}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-[28px] bg-slate-950 px-8 py-12 text-white shadow-[0_30px_70px_-60px_rgba(15,23,42,0.9)] lg:px-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Outcomes
              </p>
              <h3 className="mt-4 max-w-md text-3xl font-semibold text-white md:text-4xl">
                {statsHeading}
              </h3>
              <p className="mt-4 max-w-md text-base text-slate-300">
                {statsDescription}
              </p>
            </div>
            <div
              className="relative space-y-16"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
              }}
            >
              {statItems.map((stat, index) => (
                <div key={`${stat.value}-${index}`} className="h-[60vh]">
                  <div className="sticky top-28">
                    <p className="text-6xl font-semibold tracking-tight text-white md:text-7xl">
                      {stat.value}
                    </p>
                    {stat.label && (
                      <p className="mt-3 text-base text-slate-300">{stat.label}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StrapiAbout
