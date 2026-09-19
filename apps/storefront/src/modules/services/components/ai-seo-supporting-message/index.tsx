import MarketingSupportingMessage from "@modules/common/components/marketing-supporting-message"

type AiSeoSupportingMessageProps = {
  title: string
  description: string
  eyebrow?: string
  imageSrc?: string
  imageAlt?: string
  actionTitle?: string
  actionLabel?: string
  actionHref?: string
}

const AiSeoSupportingMessage = ({
  title,
  description,
  eyebrow = "Supporting Message",
  imageSrc = "/ai.jpeg",
  imageAlt = "AI SEO supporting visual",
  actionTitle = "Ready to Join Our AI SEO Success Stories?",
  actionLabel = "Get Top Ranking",
  actionHref = "/company/contact-us",
}: AiSeoSupportingMessageProps) => {
  return (
    <MarketingSupportingMessage
      title={title}
      description={description}
      eyebrow={eyebrow}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      showActionCard
      actionTitle={actionTitle}
      actionLabel={actionLabel}
      actionHref={actionHref}
    />
  )
}

export default AiSeoSupportingMessage
