import MarketingDetailShell from "@modules/common/components/marketing-detail-shell"
import {
  ResourceItem,
  resourceItems,
} from "@modules/resources/constants/resource-items"

const ResourceDetailTemplate = ({ resource }: { resource: ResourceItem }) => {
  const relatedResources = resourceItems
    .filter((candidate) => candidate.slug !== resource.slug)
    .slice(0, 3)

  const featureCards = resource.formats.map((format, index) => ({
    title: format,
    description:
      resource.highlights[index] ||
      resource.summary ||
      "Reusable resource formats for training, rollout, and adoption planning.",
    bullets:
      index === 0
        ? resource.highlights
        : undefined,
  }))

  return (
    <MarketingDetailShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Resources", href: "/resources" },
        { label: resource.label },
      ]}
      eyebrow={resource.eyebrow}
      title={resource.title}
      description={resource.intro}
      actions={[
        { label: "Browse Training", href: "/training" },
        { label: "All Resources", href: "/resources", variant: "secondary" },
      ]}
      heroNote="This shared shell is reusable across resource pages, while the cards and messaging are driven by each page's own content."
      proofTitle="RESOURCE FORMATS BUILT FOR DELIVERY TEAMS"
      sectionEyebrow={resource.label}
      sectionTitle={`${resource.label} Formats Include`}
      sectionIntro={resource.summary}
      featureCards={featureCards}
      relatedTitle="Explore Related Resources"
      relatedHref="/resources"
      relatedLinks={relatedResources.map((item) => ({
        href: `/resources/${item.slug}`,
        label: item.label,
        description: item.summary,
        eyebrow: item.eyebrow,
      }))}
    />
  )
}

export default ResourceDetailTemplate
