import MarketingAboutSection from "@modules/common/components/marketing-about-section"

type AiSeoAboutGainsProps = {
  title: string
  paragraphs: string[]
  listGroups?: {
    title: string
    items: string[]
  }[]
}

const AiSeoAboutGains = ({
  title,
  paragraphs,
  listGroups = [],
}: AiSeoAboutGainsProps) => {
  return (
    <MarketingAboutSection
      title={title}
      paragraphs={paragraphs}
      listGroups={listGroups}
    />
  )
}

export default AiSeoAboutGains
