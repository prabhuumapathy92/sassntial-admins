export type ResourceItem = {
  slug: string
  label: string
  eyebrow: string
  title: string
  summary: string
  intro: string
  highlights: string[]
  formats: string[]
}

export const resourceItems: ResourceItem[] = [
  {
    slug: "whitepaper",
    label: "Whitepaper",
    eyebrow: "Reference Guide",
    title: "Detailed planning documents for training, rollout, and adoption.",
    summary:
      "Long-form guidance that helps teams evaluate delivery models, enablement structure, and implementation readiness.",
    intro:
      "Whitepapers are used when stakeholders need more than a quick overview. They bring strategy, operations, and rollout considerations into one reference point for planning discussions.",
    highlights: [
      "Executive-ready rollout frameworks",
      "Training and enablement operating models",
      "Practical checkpoints for launch readiness",
    ],
    formats: ["PDF brief", "Workshop companion", "Planning reference"],
  },
  {
    slug: "blogs",
    label: "Blogs",
    eyebrow: "Insights",
    title: "Short-form thinking on product enablement, delivery, and growth.",
    summary:
      "Articles focused on day-to-day execution, launch lessons, and improvements teams can apply without a long planning cycle.",
    intro:
      "Blog content is designed for faster reading and faster action. It captures observations from delivery work and turns them into practical ideas for teams running storefronts and training programs.",
    highlights: [
      "Launch lessons from live projects",
      "Quick operational improvements",
      "Cross-functional delivery perspectives",
    ],
    formats: ["Articles", "Editorial series", "Team updates"],
  },
  {
    slug: "webinars",
    label: "Webinars",
    eyebrow: "Live Sessions",
    title: "Guided walkthroughs that turn complex topics into working sessions.",
    summary:
      "Recorded and live webinar content for onboarding, platform understanding, and topic-specific training.",
    intro:
      "Webinars help teams learn by context rather than by documentation alone. They work well for product walkthroughs, team onboarding, and recurring enablement around new releases.",
    highlights: [
      "Live product walkthrough sessions",
      "Recorded enablement modules",
      "Topic-specific Q&A formats",
    ],
    formats: ["Live webinar", "Recorded session", "Facilitated Q&A"],
  },
  {
    slug: "case-study",
    label: "Case Study",
    eyebrow: "Project Story",
    title: "Examples that show how strategy and execution came together.",
    summary:
      "Narratives that explain the business context, delivery approach, and outcomes from real engagement patterns.",
    intro:
      "Case studies connect recommendations to outcomes. They help new stakeholders understand how planning, design, technology, and training work together in a delivery environment.",
    highlights: [
      "Problem-to-outcome storylines",
      "Cross-team collaboration examples",
      "Measured improvements after launch",
    ],
    formats: ["Narrative summary", "Team snapshot", "Outcome review"],
  },
]

export const getResourceBySlug = (slug: string) =>
  resourceItems.find((resource) => resource.slug === slug)
