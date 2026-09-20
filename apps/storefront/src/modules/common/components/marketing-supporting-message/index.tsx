import LocalizedClientLink from "@modules/common/components/localized-client-link"

type MarketingSupportingMessageProps = {
  title: string
  description: string
  eyebrow?: string
  imageSrc?: string
  imageAlt?: string
  showActionCard?: boolean
  actionTitle?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

const MarketingSupportingMessage = ({
  title,
  description,
  eyebrow = "Supporting Message",
  imageSrc = "/ai.jpeg",
  imageAlt = "Supporting visual",
  showActionCard = false,
  actionTitle = "Ready to Join Our AI SEO Success Stories?",
  actionLabel = "Get Top Ranking",
  actionHref = "/company/contact-us",
  className = "",
}: MarketingSupportingMessageProps) => {
  const hasIllustration = Boolean(imageSrc)

  return (
    <article
      className={`mx-auto overflow-hidden bg-[#f1f1f1] ${className}`.trim()}
    >
      <div
        className={`items-center gap-8 px-7 py-8 small:px-10 small:py-10 ${
          hasIllustration
            ? "grid small:grid-cols-[300px_minmax(0,1fr)]"
            : "flex flex-col"
        }`}
      >
        {hasIllustration && (
          <div className="flex justify-center">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-auto w-full max-w-[250px] object-contain"
            />
          </div>
        )}

        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase text-[#f59e0b]">
            {eyebrow}
          </p>
          <h3 className="mx-auto mt-4 text-[2rem] font-black leading-[1.02] text-slate-900 small:text-[2.35rem]">
            {title}
          </h3>
          <p className="mx-auto mt-5 text-[15px] leading-7 text-slate-600">
            {description}
          </p>

          {showActionCard && (
            <div className="mx-auto mt-8 max-w-[520px] border border-[#e7ebf1] bg-white px-6 py-5 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
              <p className="text-[0.98rem] font-semibold text-slate-900">
                {actionTitle}
              </p>
              <div className="mt-4 flex justify-center">
                <LocalizedClientLink
                  href={actionHref}
                  className="inline-flex items-center justify-center bg-brand-cta px-8 py-3 text-[0.95rem] font-bold text-white shadow-[0_14px_28px_rgba(71,83,217,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {actionLabel}
                </LocalizedClientLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default MarketingSupportingMessage
