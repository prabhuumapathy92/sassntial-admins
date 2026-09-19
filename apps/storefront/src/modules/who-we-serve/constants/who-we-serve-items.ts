export type WhoWeServeItem = {
  slug: string
  label: string
  eyebrow: string
  title: string
  summary: string
  intro: string
  highlights: string[]
  supportPoints: string[]
}

const createWhoWeServeItem = ({
  slug,
  label,
  eyebrow,
  summary,
  intro,
  highlights,
  supportPoints,
}: {
  slug: string
  label: string
  eyebrow: string
  summary: string
  intro: string
  highlights: string[]
  supportPoints: string[]
}): WhoWeServeItem => ({
  slug,
  label,
  eyebrow,
  title: `${label} programs supported through the same shared page system.`,
  summary,
  intro,
  highlights,
  supportPoints,
})

export const whoWeServeItems: WhoWeServeItem[] = [
  createWhoWeServeItem({
    slug: "multi-location-businesses",
    label: "Multi-Location Businesses",
    eyebrow: "Business Types",
    summary:
      "Support for organizations balancing brand consistency with market-level execution.",
    intro:
      "These pages explain how we help multi-location businesses coordinate strategy, local execution, and reporting across distributed teams.",
    highlights: [
      "Central strategy with local flexibility",
      "Consistent rollout patterns across locations",
      "Reporting structures for distributed programs",
    ],
    supportPoints: ["Operations", "Scale", "Consistency"],
  }),
  createWhoWeServeItem({
    slug: "b2b-marketing",
    label: "B2B Marketing",
    eyebrow: "Business Types",
    summary:
      "Programs shaped around longer sales cycles, multiple stakeholders, and demand generation coordination.",
    intro:
      "This page is focused on how strategy, content, and campaigns support B2B teams that need stronger alignment between marketing and sales.",
    highlights: [
      "Long-cycle campaign planning",
      "Sales enablement and demand coordination",
      "Content systems that support evaluation journeys",
    ],
    supportPoints: ["Pipeline", "Enablement", "Coordination"],
  }),
  createWhoWeServeItem({
    slug: "ecommerce",
    label: "Ecommerce",
    eyebrow: "Business Types",
    summary:
      "Growth, merchandising, and lifecycle support for commerce teams operating across acquisition and retention channels.",
    intro:
      "Use this page to explain how ecommerce teams benefit from stronger storefront planning, channel coordination, and performance visibility.",
    highlights: [
      "Acquisition and retention alignment",
      "Storefront and conversion planning",
      "Reporting loops tied to commerce performance",
    ],
    supportPoints: ["Storefront", "Lifecycle", "Growth"],
  }),
  createWhoWeServeItem({
    slug: "lead-generation",
    label: "Lead Generation",
    eyebrow: "Business Types",
    summary:
      "Demand programs built around lead quality, conversion paths, and measurable follow-up systems.",
    intro:
      "This page focuses on how lead-generation teams improve campaign structure, landing experiences, and handoff processes across the funnel.",
    highlights: [
      "Offer and campaign architecture",
      "Landing page and conversion planning",
      "Pipeline-focused reporting and optimization",
    ],
    supportPoints: ["Demand", "Funnel", "Reporting"],
  }),
  createWhoWeServeItem({
    slug: "franchise-marketing",
    label: "Franchise Marketing",
    eyebrow: "Franchise Businesses",
    summary:
      "Programs that support brand-level direction while accounting for local operator realities.",
    intro:
      "This page is built for franchise contexts where teams need a balance of central planning, local execution, and usable systems.",
    highlights: [
      "Brand-to-local coordination",
      "Shared systems across franchise networks",
      "Clear governance for distributed execution",
    ],
    supportPoints: ["Franchise", "Governance", "Local"],
  }),
  createWhoWeServeItem({
    slug: "franchise-development",
    label: "Franchise Development",
    eyebrow: "Franchise Businesses",
    summary:
      "Support for brands building awareness and qualification programs around growth and territory expansion.",
    intro:
      "Use this page to speak to franchise development initiatives that need structured messaging, campaign flow, and stakeholder visibility.",
    highlights: [
      "Growth-focused messaging systems",
      "Prospect qualification paths",
      "Coordination between brand and development teams",
    ],
    supportPoints: ["Expansion", "Messaging", "Qualification"],
  }),
  createWhoWeServeItem({
    slug: "national-to-local",
    label: "National to Local",
    eyebrow: "Franchise Businesses",
    summary:
      "Programs designed to carry national strategy into local execution without losing clarity.",
    intro:
      "This page explains how national-level direction can be translated into local campaigns, content, and operational checklists.",
    highlights: [
      "National campaign adaptation",
      "Local rollout planning",
      "Shared reporting across levels",
    ],
    supportPoints: ["Adaptation", "Rollout", "Alignment"],
  }),
  createWhoWeServeItem({
    slug: "franchise-seo",
    label: "Franchise SEO",
    eyebrow: "Franchise Businesses",
    summary:
      "Search programs tailored to location networks, listing consistency, and local discoverability.",
    intro:
      "This page is specific to franchise SEO needs, including centralized standards and location-aware search execution.",
    highlights: [
      "Location search consistency",
      "Shared content and listing standards",
      "Market-level optimization planning",
    ],
    supportPoints: ["Search", "Locations", "Visibility"],
  }),
  createWhoWeServeItem({
    slug: "franchise-paid-media",
    label: "Franchise Paid Media",
    eyebrow: "Franchise Businesses",
    summary:
      "Paid channel programs designed for local relevance and central oversight across franchise networks.",
    intro:
      "Use this page for franchise paid-media programs that require balancing market-level performance with brand-level structure.",
    highlights: [
      "Paid media governance across locations",
      "Creative and audience coordination",
      "Reporting visibility for local and central teams",
    ],
    supportPoints: ["Paid Media", "Governance", "Locations"],
  }),
  createWhoWeServeItem({
    slug: "franchise-social-media",
    label: "Franchise Social Media",
    eyebrow: "Franchise Businesses",
    summary:
      "Social channel systems that help local operators stay active without losing brand consistency.",
    intro:
      "This page covers how franchise social programs can be structured for central strategy, local adaptation, and easier publishing workflows.",
    highlights: [
      "Shared channel standards",
      "Local content adaptation support",
      "Social governance across operators",
    ],
    supportPoints: ["Social", "Operators", "Brand"],
  }),
  createWhoWeServeItem({
    slug: "franchise-email-marketing",
    label: "Franchise Email Marketing",
    eyebrow: "Franchise Businesses",
    summary:
      "Lifecycle and campaign messaging designed for network-wide coordination with local relevance.",
    intro:
      "This page explains how franchise email programs are structured so central teams and local operators can work from the same playbook.",
    highlights: [
      "Shared lifecycle messaging rules",
      "Central-to-local campaign structure",
      "Segmented communication flows",
    ],
    supportPoints: ["Email", "Lifecycle", "Coordination"],
  }),
  createWhoWeServeItem({
    slug: "franchise-web-dev",
    label: "Franchise Web Dev",
    eyebrow: "Franchise Businesses",
    summary:
      "Web delivery support for brands managing corporate standards alongside location-specific needs.",
    intro:
      "This page is tailored to franchise web development contexts where reusable components and location flexibility both matter.",
    highlights: [
      "Reusable templates for distributed brands",
      "Location-specific content structures",
      "Governance for updates and rollout",
    ],
    supportPoints: ["Web", "Templates", "Rollout"],
  }),
  createWhoWeServeItem({
    slug: "automotive-services",
    label: "Automotive Services",
    eyebrow: "Industries",
    summary:
      "Industry-specific marketing and delivery support shaped around service demand and local competition.",
    intro:
      "This page is positioned for automotive service organizations that need clearer demand-generation and customer retention programs.",
    highlights: [
      "Local market visibility programs",
      "Service-led messaging and offers",
      "Retention communication and booking support",
    ],
    supportPoints: ["Automotive", "Service Demand", "Retention"],
  }),
  createWhoWeServeItem({
    slug: "dental-practices",
    label: "Dental Practices",
    eyebrow: "Industries",
    summary:
      "Programs for dental organizations balancing patient acquisition, local visibility, and trust-building content.",
    intro:
      "This page is meant for dental practices that need structured campaign support and better operational alignment around growth.",
    highlights: [
      "Patient acquisition programs",
      "Trust-focused messaging systems",
      "Location and provider visibility support",
    ],
    supportPoints: ["Dental", "Patients", "Visibility"],
  }),
  createWhoWeServeItem({
    slug: "financial-services",
    label: "Financial Services",
    eyebrow: "Industries",
    summary:
      "Programs adapted for trust, regulatory sensitivity, and longer consideration cycles.",
    intro:
      "Use this page to describe how financial-services teams benefit from clearer content systems, campaign structure, and authority building.",
    highlights: [
      "Trust-building content and messaging",
      "Longer-cycle campaign planning",
      "Structured reporting for regulated contexts",
    ],
    supportPoints: ["Trust", "Authority", "Planning"],
  }),
  createWhoWeServeItem({
    slug: "home-services",
    label: "Home Services",
    eyebrow: "Industries",
    summary:
      "Demand-generation and operational programs for service businesses competing at the local level.",
    intro:
      "This page is built for home-services brands that need fast, location-sensitive growth systems tied to real operational capacity.",
    highlights: [
      "Lead-generation support for local markets",
      "Operationally aware campaign planning",
      "Retention and repeat-service communication",
    ],
    supportPoints: ["Leads", "Local", "Operations"],
  }),
  createWhoWeServeItem({
    slug: "healthcare-practices",
    label: "Healthcare Practices",
    eyebrow: "Industries",
    summary:
      "Programs designed for patient trust, local visibility, and communication clarity.",
    intro:
      "This page explains how healthcare practices can structure growth programs around trust, discoverability, and better patient-facing experiences.",
    highlights: [
      "Patient-trust messaging systems",
      "Location and specialty visibility",
      "Content clarity across care journeys",
    ],
    supportPoints: ["Healthcare", "Trust", "Discovery"],
  }),
  createWhoWeServeItem({
    slug: "industries",
    label: "View More Industries",
    eyebrow: "Industries",
    summary:
      "A broader view of the industry contexts and delivery models supported across the portfolio.",
    intro:
      "Use this page as the umbrella destination for additional industries, delivery patterns, and team fit discussions.",
    highlights: [
      "Industry-specific positioning themes",
      "Common operating models across sectors",
      "Frameworks that can be adapted by vertical",
    ],
    supportPoints: ["Sectors", "Frameworks", "Fit"],
  }),
]

export const getWhoWeServeBySlug = (slug: string) =>
  whoWeServeItems.find((item) => item.slug === slug)
