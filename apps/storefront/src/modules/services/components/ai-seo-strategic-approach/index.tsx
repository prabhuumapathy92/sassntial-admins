type AiSeoStrategicApproachProps = {
  eyebrow?: string
  title: string
  description: string
  pillars?: string[]
  pillarsLabel?: string
  closingNote?: string
  imageSrc?: string
  imageAlt?: string
}

const defaultPillars = [
  "Structure content for machine readability",
  "Optimize for conversational search behavior",
  "Strengthen authority, clarity, and trust signals",
  "Expand schema and entity depth across key pages",
]

const AiSeoStrategicApproach = ({
  eyebrow = "AI search framework",
  title,
  description,
  pillars = defaultPillars,
  pillarsLabel = "What AEO involves",
  closingNote = "We help your brand become the answer source AI systems can extract, trust, and surface across modern discovery experiences.",
  imageSrc = "/ai-services.jpeg",
  imageAlt = "AI SEO services interface visual",
}: AiSeoStrategicApproachProps) => {
  return (
    <section className="mx-auto max-w-[auto] p-0">
      <article className="overflow-hidden bg-[#162033] shadow-[0_24px_52px_rgba(15,23,42,0.12)]">
        <div className="grid small:grid-cols-2">
          <div className="px-5 py-6 text-white small:px-7 small:py-7 medium:px-8 medium:py-8">
            <span className="inline-flex bg-[#ff8b38] px-3 py-1 text-[10px] font-black uppercase text-slate-950">
              {eyebrow}
            </span>

            <h2 className="mt-4 text-[1.85rem] font-black uppercase leading-[1.02] small:text-[2.2rem] medium:text-[2.45rem]">
              {title}
            </h2>

            <p className="mt-4 max-w-[35rem] text-[14px] leading-7 text-slate-300 small:text-[15px]">
              {description}
            </p>

            <p className="mt-7 text-[11px] font-semibold uppercase text-[#ffb36e]">
              {pillarsLabel}
            </p>

            <div className="mt-4 grid gap-2.5 small:grid-cols-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="border border-white/10 bg-white/[0.08] px-4 py-3.5 text-[13px] leading-6 text-slate-100 backdrop-blur-sm"
                >
                  {pillar}
                </div>
              ))}
            </div>

            <p className="mt-5 max-w-[34rem] text-[13px] leading-6 text-[#ffcf9b] small:text-[14px]">
              {closingNote}
            </p>
          </div>

          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-white p-4 small:p-5 medium:p-6">
            <div className="w-full max-w-[440px] bg-white p-2 small:p-3">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="mx-auto h-auto w-full max-w-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}

export default AiSeoStrategicApproach
