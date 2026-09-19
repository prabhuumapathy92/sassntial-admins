export type CompanyItem = {
  slug: string
  label: string
  eyebrow: string
  title: string
  summary: string
  intro: string
  heroNote?: string
  ctaLabel?: string
  heroImage?: {
    src: string
    alt: string
  }
  highlights: string[]
  supportPoints: string[]
  proofTitle?: string
  proofItems?: Array<{
    label: string
    title: string
    meta: string
  }>
  sectionTitle?: string
  seoCards?: Array<{
    title: string
    icon:
      | "megaphone"
      | "directory"
      | "cursor"
      | "ppc"
      | "mail"
      | "store"
      | "globe"
      | "analytics"
    segments: Array<{
      text: string
      accent?: boolean
    }>
  }>
  sections?: Array<{
    title: string
    description: string
    bullets?: string[]
    imageAlt?: string
    imageUrl?: string
  }>
  supportingMessage?: {
    title: string
    description: string
  }
  differentiators?: {
    title: string
    items: string[]
  }
  aboutSection?: {
    title: string
    paragraphs: string[]
    listGroups?: Array<{
      title: string
      items: string[]
    }>
  }
  finalCta?: {
    title: string
    description: string
    primaryLabel: string
    secondaryLabel?: string
  }
  blogPosts?: BlogPost[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  imageUrl?: string
  body: string[]
}

const svgDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const aboutSection01Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900" fill="none">
  <defs>
    <linearGradient id="aboutBg1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eaf3ff" />
      <stop offset="55%" stop-color="#f7fbff" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="aboutAccent1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9fd8f8" />
      <stop offset="100%" stop-color="#cfe8ff" />
    </linearGradient>
  </defs>
  <rect width="1400" height="900" fill="url(#aboutBg1)" />
  <rect x="120" y="140" width="1160" height="620" rx="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="200" y="230" width="420" height="18" rx="9" fill="url(#aboutAccent1)" />
  <rect x="200" y="270" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="200" y="300" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="200" y="330" width="440" height="14" rx="7" fill="#dde7f1" />
  <rect x="200" y="390" width="260" height="42" rx="21" fill="#9fd8f8" />
  <text x="220" y="418" font-family="Arial, sans-serif" font-size="16" fill="#0f172a" font-weight="700">
    Delivery Model
  </text>
  <rect x="780" y="240" width="420" height="320" rx="28" fill="#f1f5f9" />
  <text x="820" y="420" font-family="Arial, sans-serif" font-size="22" fill="#0f172a" font-weight="700">
    Training + Rollout
  </text>
</svg>
`

const aboutSection02Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900" fill="none">
  <defs>
    <linearGradient id="aboutBg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7fbff" />
      <stop offset="55%" stop-color="#fff7ec" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="aboutAccent2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b6e3ff" />
      <stop offset="100%" stop-color="#9fd8f8" />
    </linearGradient>
  </defs>
  <rect width="1400" height="900" fill="url(#aboutBg2)" />
  <circle cx="260" cy="220" r="120" fill="#e1efff" />
  <circle cx="1140" cy="260" r="120" fill="#ffe8cc" />
  <rect x="160" y="300" width="1080" height="380" rx="40" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="220" y="360" width="360" height="18" rx="9" fill="url(#aboutAccent2)" />
  <rect x="220" y="400" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="220" y="430" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="220" y="460" width="440" height="14" rx="7" fill="#dde7f1" />
  <text x="760" y="520" font-family="Arial, sans-serif" font-size="22" fill="#0f172a" font-weight="700">
    Adoption Readiness
  </text>
</svg>
`

const saasIndustryDashboardSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="920" viewBox="0 0 1400 920" fill="none">
  <defs>
    <linearGradient id="saasBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef4ff" />
      <stop offset="100%" stop-color="#fdfefe" />
    </linearGradient>
    <filter id="saasShadow" x="40" y="70" width="1320" height="780" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="20" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>
  </defs>
  <rect width="1400" height="920" rx="36" fill="url(#saasBg)" />
  <g filter="url(#saasShadow)">
    <rect x="90" y="100" width="1220" height="700" rx="26" fill="#ffffff"/>
  </g>
  <rect x="90" y="100" width="88" height="700" rx="26" fill="#fbfcff"/>
  <rect x="210" y="128" width="280" height="44" rx="12" fill="#f8fafc"/>
  <circle cx="112" cy="130" r="8" fill="#5b4ef7"/>
  <rect x="114" y="142" width="40" height="40" rx="12" fill="#5b4ef7"/>
  <rect x="120" y="150" width="28" height="24" rx="6" fill="#ffffff"/>
  <rect x="116" y="228" width="34" height="10" rx="5" fill="#dbe3f1"/>
  <rect x="116" y="284" width="34" height="10" rx="5" fill="#dbe3f1"/>
  <rect x="116" y="340" width="34" height="10" rx="5" fill="#dbe3f1"/>
  <rect x="116" y="396" width="34" height="10" rx="5" fill="#dbe3f1"/>
  <rect x="116" y="452" width="34" height="10" rx="5" fill="#dbe3f1"/>
  <rect x="116" y="508" width="34" height="10" rx="5" fill="#dbe3f1"/>
  <rect x="116" y="564" width="34" height="10" rx="5" fill="#dbe3f1"/>
  <rect x="116" y="620" width="34" height="10" rx="5" fill="#dbe3f1"/>
  <rect x="240" y="214" width="560" height="250" rx="22" fill="#ffffff" stroke="#eef2f7"/>
  <rect x="834" y="214" width="370" height="250" rx="22" fill="#ffffff" stroke="#eef2f7"/>
  <rect x="240" y="496" width="560" height="124" rx="22" fill="#ffffff" stroke="#eef2f7"/>
  <rect x="834" y="496" width="370" height="124" rx="22" fill="#ffffff" stroke="#eef2f7"/>
  <rect x="240" y="650" width="420" height="110" rx="22" fill="#ffffff" stroke="#eef2f7"/>
  <rect x="690" y="650" width="514" height="110" rx="22" fill="#ffffff" stroke="#eef2f7"/>
  <text x="240" y="190" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#101828">Performance</text>
  <text x="834" y="190" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#101828">Sessions By Device</text>
  <path d="M260 350C300 300 340 420 390 318C432 232 504 408 546 330C588 252 640 452 694 334C736 246 776 278 800 312" stroke="#5b4ef7" stroke-width="8" stroke-linecap="round"/>
  <path d="M906 318C906 265 951 222 1006 222C1062 222 1106 265 1106 318C1106 371 1062 414 1006 414C951 414 906 371 906 318Z" stroke="#e8edf4" stroke-width="18"/>
  <path d="M928 318C928 278 962 246 1004 246" stroke="#5b4ef7" stroke-width="18" stroke-linecap="round"/>
  <path d="M1004 246C1045 246 1078 279 1078 320" stroke="#ff7a59" stroke-width="18" stroke-linecap="round"/>
  <path d="M1078 320C1078 345 1065 367 1044 380" stroke="#2cc8a5" stroke-width="18" stroke-linecap="round"/>
  <rect x="260" y="522" width="112" height="72" rx="16" fill="#f8fbff" stroke="#eef2f7"/>
  <rect x="404" y="522" width="112" height="72" rx="16" fill="#fffaf6" stroke="#eef2f7"/>
  <rect x="548" y="522" width="112" height="72" rx="16" fill="#f8f7ff" stroke="#eef2f7"/>
  <rect x="692" y="522" width="112" height="72" rx="16" fill="#f4fffb" stroke="#eef2f7"/>
  <text x="278" y="551" font-family="Arial, sans-serif" font-size="16" fill="#667085">Users</text>
  <text x="278" y="582" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#101828">72.6k</text>
  <text x="422" y="551" font-family="Arial, sans-serif" font-size="16" fill="#667085">Sessions</text>
  <text x="422" y="582" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#101828">87.2k</text>
  <text x="566" y="551" font-family="Arial, sans-serif" font-size="16" fill="#667085">Bounce</text>
  <text x="566" y="582" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#101828">26.3%</text>
  <text x="710" y="551" font-family="Arial, sans-serif" font-size="16" fill="#667085">Duration</text>
  <text x="710" y="582" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#101828">2m 18s</text>
  <rect x="930" y="548" width="170" height="10" rx="5" fill="#5b4ef7"/>
  <rect x="930" y="588" width="210" height="10" rx="5" fill="#ff7a59"/>
  <rect x="930" y="628" width="150" height="10" rx="5" fill="#2cc8a5"/>
  <rect x="1056" y="688" width="120" height="48" rx="14" fill="#5b4ef7"/>
  <text x="1096" y="720" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#ffffff">View</text>
</svg>
`

const blogCard01Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" fill="none">
  <defs>
    <linearGradient id="blogBg1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6aa9ff" />
      <stop offset="55%" stop-color="#4c8dd9" />
      <stop offset="100%" stop-color="#2b6cb0" />
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="url(#blogBg1)" />
  <circle cx="260" cy="200" r="110" fill="#8fbfff" />
  <circle cx="900" cy="240" r="130" fill="#7aa8e6" />
  <rect x="200" y="340" width="480" height="24" rx="12" fill="#cfe2ff" />
  <rect x="200" y="380" width="360" height="18" rx="9" fill="#b7d3ff" />
  <rect x="200" y="415" width="420" height="18" rx="9" fill="#b7d3ff" />
</svg>
`

const blogCard02Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" fill="none">
  <defs>
    <linearGradient id="blogBg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3437a8" />
      <stop offset="50%" stop-color="#2c2f8f" />
      <stop offset="100%" stop-color="#1c1f6b" />
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="url(#blogBg2)" />
  <rect x="140" y="140" width="520" height="320" rx="20" fill="#4c4fb7" />
  <rect x="720" y="200" width="320" height="220" rx="20" fill="#5a5dc4" />
  <circle cx="920" cy="140" r="60" fill="#7a7fe0" />
  <rect x="200" y="520" width="420" height="24" rx="12" fill="#c9cbff" />
  <rect x="200" y="560" width="320" height="18" rx="9" fill="#b2b5f2" />
</svg>
`

const blogCard03Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" fill="none">
  <defs>
    <linearGradient id="blogBg3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6f8bff" />
      <stop offset="50%" stop-color="#3c5ac4" />
      <stop offset="100%" stop-color="#243a8f" />
    </linearGradient>
  </defs>
  <rect width="1200" height="720" fill="url(#blogBg3)" />
  <rect x="160" y="180" width="360" height="260" rx="20" fill="#7da0ff" />
  <rect x="560" y="200" width="420" height="300" rx="20" fill="#4f6ed9" />
  <circle cx="920" cy="150" r="70" fill="#9db8ff" />
  <rect x="200" y="540" width="420" height="24" rx="12" fill="#d4ddff" />
</svg>
`

const createCompanyDetailPage = ({
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
}): CompanyItem => ({
  slug,
  label,
  eyebrow,
  title: `${label} explained through the same shared marketing page system.`,
  summary,
  intro,
  highlights,
  supportPoints,
})

const menuCompanyItems: CompanyItem[] = [
  createCompanyDetailPage({
    slug: "our-story",
    label: "Our Story",
    eyebrow: "About Ignite",
    summary:
      "The background, delivery philosophy, and growth path behind the company.",
    intro:
      "This page explains how the team evolved, what problems it focuses on, and how delivery strategy shaped the current operating model.",
    highlights: [
      "Origin story and company direction",
      "How the delivery model was shaped",
      "Why the team focuses on practical execution",
    ],
    supportPoints: ["Background", "Positioning", "Growth"],
  }),
  createCompanyDetailPage({
    slug: "our-values",
    label: "Our Values",
    eyebrow: "About Ignite",
    summary:
      "The principles that guide delivery quality, collaboration, and client communication.",
    intro:
      "Use this page to understand the standards the team expects in planning, execution, ownership, and continuous improvement.",
    highlights: [
      "Clear communication over ambiguity",
      "Execution discipline over performative process",
      "Long-term usefulness over short-term optics",
    ],
    supportPoints: ["Clarity", "Ownership", "Durability"],
  }),
  createCompanyDetailPage({
    slug: "our-team",
    label: "Our Team",
    eyebrow: "About Ignite",
    summary:
      "An overview of the cross-functional team behind strategy, design, and delivery work.",
    intro:
      "This page gives prospects and partners a clearer sense of how the team is organized and how collaboration works across disciplines.",
    highlights: [
      "Cross-functional delivery structure",
      "Design, strategy, and platform collaboration",
      "Clear roles through launch and follow-up",
    ],
    supportPoints: ["Strategy", "Design", "Delivery"],
  }),
  createCompanyDetailPage({
    slug: "clients",
    label: "Clients",
    eyebrow: "About Ignite",
    summary:
      "Examples of the kinds of teams, contexts, and business models the company supports.",
    intro:
      "This page is designed to show who the work is for, what engagement patterns are common, and where the delivery model tends to fit best.",
    highlights: [
      "B2B, ecommerce, and multi-location contexts",
      "Programs tied to launch, growth, and enablement",
      "Structured delivery for teams with multiple stakeholders",
    ],
    supportPoints: ["Fit", "Engagements", "Use Cases"],
  }),
  createCompanyDetailPage({
    slug: "diversity-inclusion",
    label: "Diversity & Inclusion",
    eyebrow: "About Ignite",
    summary:
      "How inclusion, representation, and team access are reflected in working practices.",
    intro:
      "This page outlines the commitments and internal standards that shape hiring, collaboration, and team participation across the company.",
    highlights: [
      "Inclusive hiring and collaboration intent",
      "Respectful communication standards",
      "Broader access to opportunity and contribution",
    ],
    supportPoints: ["Hiring", "Culture", "Access"],
  }),
  createCompanyDetailPage({
    slug: "our-awards",
    label: "Our Awards",
    eyebrow: "Hire Us",
    summary:
      "Recognition, milestones, and proof points that support the company narrative.",
    intro:
      "This page gives prospects a single place to review notable recognition, delivery milestones, and the signals that reinforce credibility.",
    highlights: [
      "Recognition that supports positioning",
      "Milestones connected to delivery maturity",
      "Proof points teams can reference in evaluations",
    ],
    supportPoints: ["Recognition", "Milestones", "Credibility"],
  }),
  createCompanyDetailPage({
    slug: "referral-partner",
    label: "Become a Referral Partner",
    eyebrow: "Join Our Team",
    summary:
      "Information for consultants, partners, and operators interested in referral collaboration.",
    intro:
      "Use this page to explain how referral partnerships fit, what kinds of opportunities are relevant, and how conversations are structured.",
    highlights: [
      "Referral fit and partner profile",
      "How collaboration is coordinated",
      "What information helps qualify opportunities",
    ],
    supportPoints: ["Partners", "Referrals", "Coordination"],
  }),
  createCompanyDetailPage({
    slug: "hiring-notice",
    label: "Hiring Notice",
    eyebrow: "Join Our Team",
    summary:
      "Important information for candidates reviewing active roles and hiring expectations.",
    intro:
      "This page clarifies how the hiring process works, what communication to expect, and what standards apply across open roles.",
    highlights: [
      "How the hiring flow is structured",
      "What candidates should prepare for",
      "How role expectations are communicated",
    ],
    supportPoints: ["Process", "Expectations", "Candidates"],
  }),
]

const aiCompanyItems: CompanyItem[] = [
  {
    slug: "ai-opportunity-discovery",
    label: "AI Opportunity Discovery",
    eyebrow: "AI Services",
    title: "Identify where AI will create real business impact—before you invest",
    summary: "Discover your top opportunities in just a few weeks.",
    intro:
      "Most AI initiatives fail because companies start with tools instead of opportunities. We help you uncover high-value, practical AI use cases tailored to your business—so every investment is intentional, measurable, and scalable.",
    heroNote: "Discover your top opportunities in just a few weeks.",
    ctaLabel: "Start Your AI Opportunity Discovery",
    heroImage: {
      src: "/multi-location-banner.jpeg",
      alt: "Team workshop focused on AI opportunity planning",
    },
    highlights: [
      "Business-First Opportunity Mapping",
      "3–7 High-Impact Use Cases (Fast)",
      "ROI & Feasibility Scoring",
    ],
    supportPoints: [
      "Cross-Functional Insights",
      "Hidden Efficiency Gains",
      "Risk-Aware Recommendations",
    ],
    proofItems: [],
    sectionTitle: "Key Highlights (Value-Driven Differentiators)",
    seoCards: [
      {
        title: "Business-First Opportunity Mapping",
        icon: "directory",
        segments: [
          {
            text: "We analyze your workflows, revenue streams, and cost centers to identify where AI delivers the highest impact.",
          },
        ],
      },
      {
        title: "3–7 High-Impact Use Cases (Fast)",
        icon: "megaphone",
        segments: [
          {
            text: "Within weeks, we deliver a focused set of AI opportunities—not overwhelming lists, but prioritized wins.",
          },
        ],
      },
      {
        title: "ROI & Feasibility Scoring",
        icon: "analytics",
        segments: [
          {
            text: "Each opportunity is evaluated based on potential ROI, implementation complexity, and time-to-value.",
          },
        ],
      },
      {
        title: "Cross-Functional Insights",
        icon: "globe",
        segments: [
          {
            text: "We uncover opportunities across sales, marketing, operations, customer support, and finance.",
          },
        ],
      },
      {
        title: "Hidden Efficiency Gains",
        icon: "cursor",
        segments: [
          {
            text: "Identify automation opportunities that reduce manual work and improve team productivity instantly.",
          },
        ],
      },
      {
        title: "Risk-Aware Recommendations",
        icon: "store",
        segments: [
          {
            text: "We flag data gaps, compliance concerns, and operational risks before implementation begins.",
          },
        ],
      },
    ],
    sections: [
      {
        title: "What We Deliver (Short & Crisp Insights)",
        description:
          "A focused discovery output that helps your team move from exploration to a clear, actionable AI roadmap.",
        bullets: [
          "Opportunity Heatmap: Visual breakdown of high, medium, and low-impact AI opportunities",
          "Use Case Library: 3–7 tailored AI use cases specific to your business model",
          "ROI Snapshot: Estimated revenue uplift, cost savings, or efficiency gains per use case",
          "Feasibility Analysis: Technical complexity, data readiness, and implementation effort",
          "Quick Wins Roadmap: Immediate opportunities that can be executed within 30–90 days",
        ],
      },
      {
        title: "Example AI Opportunities We Identify",
        description:
          "Representative use cases across revenue, operations, support, and back-office functions.",
        bullets: [
          "Sales: AI-driven lead scoring and personalized outreach automation",
          "Customer Support: Intelligent chatbots and ticket resolution assistants",
          "Operations: Workflow automation and predictive demand planning",
          "Marketing: Content generation, segmentation, and campaign optimization",
          "Finance: Fraud detection and automated reporting",
        ],
      },
      {
        title: "Our Approach",
        description:
          "Analyze → Identify → Prioritize → Validate",
        bullets: [
          "Analyze: Deep dive into processes, tools, and data flows",
          "Identify: Surface AI use cases aligned with business goals",
          "Prioritize: Rank based on ROI, speed, and strategic value",
          "Validate: Ensure feasibility before moving to execution",
        ],
      },
      {
        title: "Why It Matters",
        description:
          "Without structured discovery, AI investments often lead to wasted budgets, fragmented tools, and low adoption.",
        bullets: [
          "Focus only on high-impact initiatives",
          "Avoid costly experimentation",
          "Build a clear, actionable AI roadmap",
        ],
      },
    ],
    supportingMessage: {
      title: "Why It Matters",
      description:
        "Without structured discovery, AI investments often lead to wasted budgets, fragmented tools, and low adoption.",
    },
    differentiators: {
      title: "AI Opportunity Discovery Ensures You",
      items: [
        "Focus only on high-impact initiatives",
        "Avoid costly experimentation",
        "Build a clear, actionable AI roadmap",
      ],
    },
    aboutSection: {
      title: "Our Approach",
      paragraphs: [
        "Analyze → Identify → Prioritize → Validate",
      ],
      listGroups: [
        {
          title: "Analyze",
          items: [
            "Deep dive into processes, tools, and data flows",
          ],
        },
        {
          title: "Identify",
          items: [
            "Surface AI use cases aligned with business goals",
          ],
        },
        {
          title: "Prioritize",
          items: [
            "Rank based on ROI, speed, and strategic value",
          ],
        },
        {
          title: "Validate",
          items: [
            "Ensure feasibility before moving to execution",
          ],
        },
      ],
    },
    finalCta: {
      title: "Not sure where to start with AI?",
      description:
        "Discover your top opportunities in just a few weeks.",
      primaryLabel: "Start Your AI Opportunity Discovery",
    },
  },
  {
    slug: "custom-ai-agent-development",
    label: "Custom AI Agent Development",
    eyebrow: "AI Services",
    title: "Build intelligent agents that automate work, decisions, and customer interactions",
    summary: "Build intelligent systems that work like your best employees—at scale.",
    intro:
      "Off-the-shelf tools can’t handle complex, business-specific workflows. We design and deploy custom AI agents that think, act, and execute tasks across your systems—freeing your teams to focus on high-value work.",
    heroNote:
      "Build intelligent systems that work like your best employees—at scale.",
    ctaLabel: "Start Building Your Custom AI Agents",
    heroImage: {
      src: "/multi-location-banner.jpeg",
      alt: "Team designing a custom AI agent workflow",
    },
    highlights: [
      "Tailored to Your Workflows",
      "Multi-Step Task Automation",
      "System Integration Ready",
    ],
    supportPoints: [
      "Always-On Productivity",
      "Continuous Learning & Optimization",
      "Secure & Controlled Deployment",
    ],
    proofItems: [],
    sectionTitle: "Key Highlights (Value-Driven Differentiators)",
    seoCards: [
      {
        title: "Tailored to Your Workflows",
        icon: "directory",
        segments: [
          {
            text: "Agents are built around your processes—not generic templates—ensuring real operational impact.",
          },
        ],
      },
      {
        title: "Multi-Step Task Automation",
        icon: "megaphone",
        segments: [
          {
            text: "Handle complex workflows end-to-end (not just single prompts), including decision-making and execution.",
          },
        ],
      },
      {
        title: "System Integration Ready",
        icon: "globe",
        segments: [
          {
            text: "Seamlessly connect with your CRM, ERP, support tools, and internal platforms.",
          },
        ],
      },
      {
        title: "Always-On Productivity",
        icon: "cursor",
        segments: [
          {
            text: "AI agents operate 24/7, handling repetitive tasks, customer queries, and internal operations without delays.",
          },
        ],
      },
      {
        title: "Continuous Learning & Optimization",
        icon: "analytics",
        segments: [
          {
            text: "Agents improve over time using feedback loops, performance data, and evolving business needs.",
          },
        ],
      },
      {
        title: "Secure & Controlled Deployment",
        icon: "store",
        segments: [
          {
            text: "Enterprise-grade security, permissions, and governance built into every agent.",
          },
        ],
      },
    ],
    sections: [
      {
        title: "What We Deliver (Short & Crisp Insights)",
        description:
          "A focused delivery model built around role-specific agents, execution, and measurable operational value.",
        bullets: [
          "Custom AI Agents: Built for specific roles (sales assistant, support agent, ops coordinator, etc.)",
          "Workflow Automation: End-to-end execution across tools and systems",
          "Knowledge Integration: Agents trained on your internal data, SOPs, and documentation",
          "Action Capabilities: Not just answers—agents can trigger actions (emails, updates, reports)",
          "Performance Monitoring: Track accuracy, efficiency, and business impact",
        ],
      },
      {
        title: "Example AI Agents We Build",
        description:
          "Representative agents across revenue, support, operations, marketing, and executive workflows.",
        bullets: [
          "Sales Agent: Qualifies leads, drafts outreach, updates CRM automatically",
          "Customer Support Agent: Resolves tickets, suggests responses, reduces resolution time",
          "Operations Agent: Automates task coordination, reporting, and workflow management",
          "Marketing Agent: Generates content, optimizes campaigns, and analyzes performance",
          "Executive Assistant Agent: Summarizes reports, schedules tasks, and provides insights",
        ],
      },
      {
        title: "Our Approach",
        description:
          "Design → Build → Integrate → Scale",
        bullets: [
          "Design: Define agent roles, responsibilities, and workflows",
          "Build: Develop custom logic, prompts, and decision frameworks",
          "Integrate: Connect with your tools and data systems",
          "Scale: Expand capabilities across teams and use cases",
        ],
      },
      {
        title: "Why It Matters",
        description:
          "Manual workflows slow down growth and increase costs. Generic AI tools create fragmented, inconsistent outputs.",
        bullets: [
          "Faster execution across teams",
          "Lower operational costs",
          "Consistent, high-quality outputs",
          "Scalable automation without increasing headcount",
        ],
      },
    ],
    supportingMessage: {
      title: "Why It Matters",
      description:
        "Manual workflows slow down growth and increase costs. Generic AI tools create fragmented, inconsistent outputs.",
    },
    differentiators: {
      title: "Custom AI agents enable:",
      items: [
        "Faster execution across teams",
        "Lower operational costs",
        "Consistent, high-quality outputs",
        "Scalable automation without increasing headcount",
      ],
    },
    aboutSection: {
      title: "Our Approach",
      paragraphs: [
        "Design → Build → Integrate → Scale",
      ],
      listGroups: [
        {
          title: "Design",
          items: [
            "Define agent roles, responsibilities, and workflows",
          ],
        },
        {
          title: "Build",
          items: [
            "Develop custom logic, prompts, and decision frameworks",
          ],
        },
        {
          title: "Integrate",
          items: [
            "Connect with your tools and data systems",
          ],
        },
        {
          title: "Scale",
          items: [
            "Expand capabilities across teams and use cases",
          ],
        },
      ],
    },
    finalCta: {
      title: "Ready to automate your business with AI agents?",
      description:
        "Build intelligent systems that work like your best employees—at scale.",
      primaryLabel: "👉 Start Building Your Custom AI Agents",
    },
  },
  {
    slug: "workflow-automation-integration",
    label: "Workflow Automation and Integration",
    eyebrow: "AI Services",
    title: "Eliminate manual work. Connect systems. Scale operations effortlessly.",
    summary: "Transform your workflows into intelligent, automated systems.",
    intro:
      "Disconnected tools and manual processes slow down growth. We design intelligent, end-to-end workflows that automate tasks, synchronize systems, and ensure your business runs faster, leaner, and more efficiently.",
    heroNote:
      "Transform your workflows into intelligent, automated systems.",
    ctaLabel: "Start Automating Your Workflows Today",
    heroImage: {
      src: "/multi-location-banner.jpeg",
      alt: "Connected workflow automation systems",
    },
    highlights: [
      "End-to-End Process Automation",
      "Seamless System Integration",
      "Real-Time Data Synchronization",
    ],
    supportPoints: [
      "AI-Powered Decision Layers",
      "Error Reduction & Consistency",
      "Scalable Infrastructure",
    ],
    proofItems: [],
    sectionTitle: "Key Highlights (Value-Driven Differentiators)",
    seoCards: [
      {
        title: "End-to-End Process Automation",
        icon: "directory",
        segments: [
          {
            text: "Automate entire workflows—not just individual tasks—from input to execution and reporting.",
          },
        ],
      },
      {
        title: "Seamless System Integration",
        icon: "globe",
        segments: [
          {
            text: "Connect CRMs, ERPs, marketing tools, support platforms, and internal systems into one unified flow.",
          },
        ],
      },
      {
        title: "Real-Time Data Synchronization",
        icon: "cursor",
        segments: [
          {
            text: "Ensure accurate, up-to-date data across all systems—eliminating silos and duplication.",
          },
        ],
      },
      {
        title: "AI-Powered Decision Layers",
        icon: "analytics",
        segments: [
          {
            text: "Incorporate AI to handle routing, prioritization, and decision-making within workflows.",
          },
        ],
      },
      {
        title: "Error Reduction & Consistency",
        icon: "store",
        segments: [
          {
            text: "Minimize human errors while ensuring standardized, reliable outputs across operations.",
          },
        ],
      },
      {
        title: "Scalable Infrastructure",
        icon: "megaphone",
        segments: [
          {
            text: "Build workflows that grow with your business without increasing operational complexity.",
          },
        ],
      },
    ],
    sections: [
      {
        title: "What We Deliver (Short & Crisp Insights)",
        description:
          "A connected automation model built to streamline work, synchronize systems, and improve operational performance.",
        bullets: [
          "Workflow Mapping: Clear visualization of current vs. optimized processes",
          "Automation Design: Replacement of repetitive tasks with intelligent workflows",
          "System Integrations: APIs and connectors linking all your business tools",
          "Trigger-Based Actions: Automated responses based on events, data, or conditions",
          "Monitoring & Optimization: Continuous tracking and improvement of workflows",
        ],
      },
      {
        title: "Example Automation Use Cases",
        description:
          "Representative automation opportunities across revenue, onboarding, support, finance, and internal operations.",
        bullets: [
          "Sales Operations: Auto-capture leads, assign reps, and update CRM in real-time",
          "Customer Onboarding: Seamless onboarding workflows across multiple systems",
          "Support Operations: Ticket routing, response suggestions, and escalation handling",
          "Finance Processes: Invoice generation, reconciliation, and reporting automation",
          "HR & Operations: Employee onboarding, task assignment, and document workflows",
        ],
      },
      {
        title: "Our Approach",
        description:
          "Map → Automate → Integrate → Optimize",
        bullets: [
          "Map: Analyze existing workflows and identify inefficiencies",
          "Automate: Design intelligent flows to eliminate manual tasks",
          "Integrate: Connect systems for seamless data movement",
          "Optimize: Continuously refine workflows for speed and accuracy",
        ],
      },
      {
        title: "Why It Matters",
        description:
          "Manual processes and disconnected systems lead to:",
        bullets: [
          "Lost productivity",
          "Data inconsistencies",
          "Slower decision-making",
        ],
      },
    ],
    supportingMessage: {
      title: "Why It Matters",
      description:
        "Manual processes and disconnected systems lead to lost productivity, data inconsistencies, and slower decision-making.",
    },
    differentiators: {
      title: "Workflow automation and integration enable:",
      items: [
        "Faster operations at lower cost",
        "Real-time visibility across the business",
        "Scalable growth without operational bottlenecks",
      ],
    },
    aboutSection: {
      title: "Our Approach",
      paragraphs: [
        "Map → Automate → Integrate → Optimize",
      ],
      listGroups: [
        {
          title: "Map",
          items: [
            "Analyze existing workflows and identify inefficiencies",
          ],
        },
        {
          title: "Automate",
          items: [
            "Design intelligent flows to eliminate manual tasks",
          ],
        },
        {
          title: "Integrate",
          items: [
            "Connect systems for seamless data movement",
          ],
        },
        {
          title: "Optimize",
          items: [
            "Continuously refine workflows for speed and accuracy",
          ],
        },
      ],
    },
    finalCta: {
      title: "Ready to streamline and scale your operations?",
      description:
        "Transform your workflows into intelligent, automated systems.",
      primaryLabel: "👉 Start Automating Your Workflows Today",
    },
  },
  {
    slug: "industry-specific-ai-solution",
    label: "Industry Specific AI Solution",
    eyebrow: "AI Services",
    title: "AI tailored to your industry—not generic tools",
    summary: "Unlock tailored strategies that deliver real business impact.",
    intro:
      "Every industry has unique workflows, regulations, and challenges. We design custom AI solutions built specifically for your sector, ensuring faster adoption, higher ROI, and real competitive advantage.",
    heroNote:
      "Unlock tailored strategies that deliver real business impact.",
    ctaLabel: "Explore Industry-Specific AI Solutions",
    heroImage: {
      src: "/multi-location-banner.jpeg",
      alt: "Industry-specific AI planning session",
    },
    highlights: [
      "Deep Industry Alignment",
      "Pre-Built Use Case Frameworks",
      "Faster Implementation",
    ],
    supportPoints: [
      "Measurable Business Impact",
      "Compliance & Risk Awareness",
      "Competitive Differentiation",
    ],
    proofItems: [],
    sectionTitle: "Key Highlights (Value-Driven Differentiators)",
    seoCards: [
      {
        title: "Deep Industry Alignment",
        icon: "directory",
        segments: [
          {
            text: "Solutions are built around your industry’s workflows, compliance needs, and customer expectations.",
          },
        ],
      },
      {
        title: "Pre-Built Use Case Frameworks",
        icon: "store",
        segments: [
          {
            text: "Leverage proven AI use cases tailored to your sector—accelerating time-to-value.",
          },
        ],
      },
      {
        title: "Faster Implementation",
        icon: "megaphone",
        segments: [
          {
            text: "Industry-specific blueprints reduce development time and deployment complexity.",
          },
        ],
      },
      {
        title: "Measurable Business Impact",
        icon: "analytics",
        segments: [
          {
            text: "Every solution is tied to clear outcomes—revenue growth, cost savings, or efficiency gains.",
          },
        ],
      },
      {
        title: "Compliance & Risk Awareness",
        icon: "cursor",
        segments: [
          {
            text: "Built with industry regulations, data privacy, and operational risks in mind.",
          },
        ],
      },
      {
        title: "Competitive Differentiation",
        icon: "globe",
        segments: [
          {
            text: "Adopt AI in ways your competitors haven’t—creating a defensible advantage.",
          },
        ],
      },
    ],
    sections: [
      {
        title: "What We Deliver (Short & Crisp Insights)",
        description:
          "A tailored delivery model built around your industry context, operational reality, and growth goals.",
        bullets: [
          "Industry AI Use Cases: Tailored solutions aligned with your business model",
          "Custom Workflows: AI integrated into real operational processes",
          "Data Strategy Alignment: Industry-specific data utilization and optimization",
          "Solution Prototypes: Rapid pilots to validate impact before scaling",
          "Scalable Deployment Plans: From pilot to enterprise-wide rollout",
        ],
      },
      {
        title: "Industries We Support",
        description:
          "Representative sectors where industry-specific AI can create measurable operational and strategic value.",
        imageAlt: "SaaS and technology analytics dashboard",
        imageUrl: svgDataUri(saasIndustryDashboardSvg),
        bullets: [
          "SaaS & Technology: AI-powered customer insights and churn prediction; Intelligent support agents and knowledge automation; Product usage analytics and personalization",
          "Healthcare: Clinical decision support systems; Patient engagement and virtual assistants; Medical data analysis and workflow automation",
          "E-commerce & Retail: Personalized product recommendations; Inventory and demand forecasting; AI-driven customer support and engagement",
          "Manufacturing & Logistics: Predictive maintenance and downtime reduction; Supply chain optimization and forecasting; Process automation and quality control",
          "Finance & Banking: Fraud detection and risk analysis; Automated reporting and compliance workflows; AI-powered customer insights and advisory",
        ],
      },
      {
        title: "Our Approach",
        description:
          "Understand → Customize → Validate → Scale",
        bullets: [
          "Understand: Deep dive into your industry dynamics and challenges",
          "Customize: Design AI solutions aligned with your workflows",
          "Validate: Pilot solutions to ensure measurable impact",
          "Scale: Expand across teams, functions, and geographies",
        ],
      },
      {
        title: "Why It Matters",
        description:
          "Generic AI solutions often fail due to lack of context.",
        bullets: [
          "Faster adoption across teams",
          "Higher accuracy and relevance",
          "Stronger ROI with lower risk",
          "Sustainable competitive advantage",
        ],
      },
    ],
    supportingMessage: {
      title: "Why It Matters",
      description:
        "Generic AI solutions often fail due to lack of context.",
    },
    differentiators: {
      title: "Industry-specific AI ensures:",
      items: [
        "Faster adoption across teams",
        "Higher accuracy and relevance",
        "Stronger ROI with lower risk",
        "Sustainable competitive advantage",
      ],
    },
    aboutSection: {
      title: "Our Approach",
      paragraphs: [
        "Understand → Customize → Validate → Scale",
      ],
      listGroups: [
        {
          title: "Understand",
          items: [
            "Deep dive into your industry dynamics and challenges",
          ],
        },
        {
          title: "Customize",
          items: [
            "Design AI solutions aligned with your workflows",
          ],
        },
        {
          title: "Validate",
          items: [
            "Pilot solutions to ensure measurable impact",
          ],
        },
        {
          title: "Scale",
          items: [
            "Expand across teams, functions, and geographies",
          ],
        },
      ],
    },
    finalCta: {
      title: "Looking for AI solutions built for your industry?",
      description:
        "Unlock tailored strategies that deliver real business impact.",
      primaryLabel: "👉 Explore Industry-Specific AI Solutions",
    },
  },
  {
    slug: "ai-infrastructure-deployment",
    label: "AI Infrastructure and Deployment",
    eyebrow: "AI Services",
    title: "Build the foundation that makes AI scalable, secure, and production-ready",
    summary: "Build a strong foundation that powers long-term AI success.",
    intro:
      "Great AI strategies fail without the right infrastructure. We design and deploy robust AI systems that integrate with your environment, scale with demand, and operate reliably in real-world conditions.",
    heroNote:
      "Build a strong foundation that powers long-term AI success.",
    ctaLabel: "Start Your AI Infrastructure & Deployment Strategy",
    heroImage: {
      src: "/multi-location-banner.jpeg",
      alt: "AI infrastructure and deployment planning",
    },
    highlights: [
      "Production-Ready Architecture",
      "Cloud & Hybrid Infrastructure",
      "Scalable & High-Performance Systems",
    ],
    supportPoints: [
      "Secure & Compliant by Design",
      "Seamless Integration Layer",
      "Continuous Monitoring & Optimization",
    ],
    proofTitle: "AI INFRASTRUCTURE & DEPLOYMENT",
    proofItems: [
      {
        label: "Production",
        title: "Production-Ready Architecture",
        meta: "Move from prototypes to fully deployed AI systems that perform consistently at scale.",
      },
      {
        label: "Infrastructure",
        title: "Cloud & Hybrid Infrastructure",
        meta: "Flexible deployment across cloud, on-premise, or hybrid environments based on your needs.",
      },
      {
        label: "Scalable",
        title: "Scalable & High-Performance Systems",
        meta: "Handle growing data, users, and workloads without performance bottlenecks.",
      },
      {
        label: "Secure",
        title: "Secure & Compliant by Design",
        meta: "Enterprise-grade security, access control, and compliance built into every layer.",
      },
    ],
    sectionTitle: "Key Highlights (Value-Driven Differentiators)",
    seoCards: [
      {
        title: "Production-Ready Architecture",
        icon: "directory",
        segments: [
          {
            text: "Move from prototypes to fully deployed AI systems that perform consistently at scale.",
          },
        ],
      },
      {
        title: "Cloud & Hybrid Infrastructure",
        icon: "cursor",
        segments: [
          {
            text: "Flexible deployment across cloud, on-premise, or hybrid environments based on your needs.",
          },
        ],
      },
      {
        title: "Scalable & High-Performance Systems",
        icon: "analytics",
        segments: [
          {
            text: "Handle growing data, users, and workloads without performance bottlenecks.",
          },
        ],
      },
      {
        title: "Secure & Compliant by Design",
        icon: "globe",
        segments: [
          {
            text: "Enterprise-grade security, access control, and compliance built into every layer.",
          },
        ],
      },
      {
        title: "Seamless Integration Layer",
        icon: "store",
        segments: [
          {
            text: "Connect AI models with your existing applications, APIs, and data pipelines.",
          },
        ],
      },
      {
        title: "Continuous Monitoring & Optimization",
        icon: "megaphone",
        segments: [
          {
            text: "Track performance, accuracy, and system health in real time—ensuring ongoing reliability.",
          },
        ],
      },
    ],
    sections: [
      {
        title: "What We Deliver (Short & Crisp Insights)",
        description:
          "A production-oriented infrastructure model designed to support reliability, scale, security, and operational visibility.",
        bullets: [
          "AI Architecture Design: End-to-end system design tailored to your business needs",
          "Model Deployment Pipelines: Efficient, repeatable processes for deploying AI models",
          "Data Infrastructure Setup: Pipelines for clean, reliable, and scalable data flow",
          "API & System Integration: Connect AI with internal and external systems",
          "Monitoring & Governance: Tools to track performance, usage, and compliance",
        ],
      },
      {
        title: "Core Infrastructure Components",
        description:
          "The core layers required to move AI from experiment to stable, scalable production capability.",
        bullets: [
          "Data Layer: Data ingestion, storage, processing, and management",
          "Model Layer: Training, fine-tuning, and inference systems",
          "Application Layer: Interfaces, APIs, and user-facing integrations",
          "Orchestration Layer: Workflow management and automation across systems",
          "Security Layer: Access control, encryption, and compliance frameworks",
        ],
      },
      {
        title: "Our Approach",
        description:
          "Architect → Build → Deploy → Scale",
        bullets: [
          "Architect: Design infrastructure aligned with performance, cost, and security goals",
          "Build: Develop scalable pipelines, integrations, and environments",
          "Deploy: Launch AI systems into production with minimal risk",
          "Scale: Optimize for performance, cost-efficiency, and growth",
        ],
      },
      {
        title: "Why It Matters",
        description:
          "Without the right infrastructure:",
        bullets: [
          "AI models fail to scale",
          "Performance becomes inconsistent",
          "Security and compliance risks increase",
        ],
      },
    ],
    supportingMessage: {
      title: "Why It Matters",
      description:
        "Without the right infrastructure, AI models fail to scale, performance becomes inconsistent, and security and compliance risks increase.",
    },
    differentiators: {
      title: "With the right foundation, you get:",
      items: [
        "Reliable, production-grade AI systems",
        "Faster deployment cycles",
        "Lower operational risk",
        "Scalable growth without rework",
      ],
    },
    aboutSection: {
      title: "Our Approach",
      paragraphs: [
        "Architect → Build → Deploy → Scale",
      ],
      listGroups: [
        {
          title: "Architect",
          items: [
            "Design infrastructure aligned with performance, cost, and security goals",
          ],
        },
        {
          title: "Build",
          items: [
            "Develop scalable pipelines, integrations, and environments",
          ],
        },
        {
          title: "Deploy",
          items: [
            "Launch AI systems into production with minimal risk",
          ],
        },
        {
          title: "Scale",
          items: [
            "Optimize for performance, cost-efficiency, and growth",
          ],
        },
      ],
    },
    finalCta: {
      title: "Ready to take AI from prototype to production?",
      description:
        "Build a strong foundation that powers long-term AI success.",
      primaryLabel: "👉 Start Your AI Infrastructure & Deployment Strategy",
    },
  },
  {
    slug: "ai-optimization-continuous-improvement",
    label: "AI Optimization and Continuous Improvement",
    eyebrow: "AI Services",
    title: "Turn AI into a compounding advantage—not a one-time deployment",
    summary: "Turn your AI systems into a continuously improving growth engine.",
    intro:
      "Launching AI is just the beginning. Real value comes from continuously improving performance, accuracy, and impact. We ensure your AI systems evolve, adapt, and deliver increasing ROI over time.",
    heroNote:
      "Turn your AI systems into a continuously improving growth engine.",
    ctaLabel: "Optimize and Scale Your AI Systems",
    heroImage: {
      src: "/multi-location-banner.jpeg",
      alt: "AI optimization and improvement review",
    },
    highlights: [
      "Performance-Driven Optimization",
      "ROI Tracking & Enhancement",
      "Feedback Loop Integration",
    ],
    supportPoints: [
      "Adaptive Learning Systems",
      "Cost Optimization",
      "Proactive Issue Detection",
    ],
    proofTitle: "AI OPTIMIZATION & CONTINUOUS IMPROVEMENT",
    proofItems: [
      {
        label: "Performance",
        title: "Performance-Driven Optimization",
        meta: "Continuously improve model accuracy, response quality, and system efficiency.",
      },
      {
        label: "ROI",
        title: "ROI Tracking & Enhancement",
        meta: "Measure real business impact and optimize systems to maximize returns.",
      },
      {
        label: "Feedback",
        title: "Feedback Loop Integration",
        meta: "Use real user interactions and data to refine AI behavior and outputs.",
      },
      {
        label: "Adaptive",
        title: "Adaptive Learning Systems",
        meta: "Ensure models evolve with changing data, market conditions, and business needs.",
      },
    ],
    sectionTitle: "Key Highlights (Value-Driven Differentiators)",
    seoCards: [
      {
        title: "Performance-Driven Optimization",
        icon: "analytics",
        segments: [
          {
            text: "Continuously improve model accuracy, response quality, and system efficiency.",
          },
        ],
      },
      {
        title: "ROI Tracking & Enhancement",
        icon: "cursor",
        segments: [
          {
            text: "Measure real business impact and optimize systems to maximize returns.",
          },
        ],
      },
      {
        title: "Feedback Loop Integration",
        icon: "globe",
        segments: [
          {
            text: "Use real user interactions and data to refine AI behavior and outputs.",
          },
        ],
      },
      {
        title: "Adaptive Learning Systems",
        icon: "directory",
        segments: [
          {
            text: "Ensure models evolve with changing data, market conditions, and business needs.",
          },
        ],
      },
      {
        title: "Cost Optimization",
        icon: "store",
        segments: [
          {
            text: "Reduce infrastructure and model costs while improving performance.",
          },
        ],
      },
      {
        title: "Proactive Issue Detection",
        icon: "megaphone",
        segments: [
          {
            text: "Identify and resolve performance drops, errors, or inefficiencies before they impact operations.",
          },
        ],
      },
    ],
    sections: [
      {
        title: "What We Deliver (Short & Crisp Insights)",
        description:
          "A structured optimization model built to increase performance, reliability, and long-term AI ROI.",
        bullets: [
          "Performance Monitoring: Track accuracy, latency, usage, and system health",
          "Model Refinement: Continuous tuning and improvement of AI outputs",
          "A/B Testing Frameworks: Compare variations to optimize results",
          "Usage Analytics: Understand how AI is being used across teams",
          "Optimization Roadmap: Ongoing plan for scaling performance and ROI",
        ],
      },
      {
        title: "Key Optimization Areas",
        description:
          "Core optimization domains that determine whether AI systems keep delivering value as usage grows.",
        bullets: [
          "Model Accuracy: Improve prediction quality and response relevance",
          "Workflow Efficiency: Reduce time and steps in automated processes",
          "User Experience: Enhance interaction quality and usability",
          "Cost Efficiency: Optimize compute usage and infrastructure spend",
          "Scalability: Ensure systems perform under increasing demand",
        ],
      },
      {
        title: "Our Approach",
        description:
          "Monitor → Analyze → Optimize → Evolve",
        bullets: [
          "Monitor: Track system performance and business impact in real time",
          "Analyze: Identify gaps, inefficiencies, and improvement opportunities",
          "Optimize: Implement enhancements across models, workflows, and infrastructure",
          "Evolve: Continuously adapt systems as your business grows",
        ],
      },
      {
        title: "Why It Matters",
        description:
          "Most AI systems degrade over time without active optimization.",
        bullets: [
          "Sustained and increasing ROI",
          "Higher accuracy and reliability",
          "Better user adoption and trust",
          "Long-term competitive advantage",
        ],
      },
    ],
    supportingMessage: {
      title: "Why It Matters",
      description:
        "Most AI systems degrade over time without active optimization.",
    },
    differentiators: {
      title: "Continuous improvement ensures:",
      items: [
        "Sustained and increasing ROI",
        "Higher accuracy and reliability",
        "Better user adoption and trust",
        "Long-term competitive advantage",
      ],
    },
    aboutSection: {
      title: "Our Approach",
      paragraphs: [
        "Monitor → Analyze → Optimize → Evolve",
      ],
      listGroups: [
        {
          title: "Monitor",
          items: [
            "Track system performance and business impact in real time",
          ],
        },
        {
          title: "Analyze",
          items: [
            "Identify gaps, inefficiencies, and improvement opportunities",
          ],
        },
        {
          title: "Optimize",
          items: [
            "Implement enhancements across models, workflows, and infrastructure",
          ],
        },
        {
          title: "Evolve",
          items: [
            "Continuously adapt systems as your business grows",
          ],
        },
      ],
    },
    finalCta: {
      title: "Want your AI to keep getting better over time?",
      description:
        "Turn your AI systems into a continuously improving growth engine.",
      primaryLabel: "👉 Optimize and Scale Your AI Systems",
    },
  },
]

export const companyItems: CompanyItem[] = [
  {
    slug: "about-us",
    label: "About us",
    eyebrow: "Company Overview",
    title: "A delivery team built around training, rollout, and adoption.",
    summary:
      "Learn how strategy, enablement, and product guidance are combined into one operating model for delivery teams.",
    intro:
      "Our approach is structured around continuity. The same group that helps define the rollout path also supports training, operational readiness, and the next phase of adoption.",
    highlights: [
      "Shared ownership from discovery through launch",
      "Training and operational guidance in one model",
      "Clearer coordination between product and business teams",
    ],
    supportPoints: [
      "Cross-functional planning",
      "Rollout support",
      "Post-launch enablement",
    ],
    sections: [
      {
        title: "About Us",
        description:
          "At DataSack Solutions, we deliver innovative IT services with a focus on reliability, clarity, and measurable outcomes.",
        imageAlt: "Team working on delivery planning",
        imageUrl: svgDataUri(aboutSection01Svg),
      },
      {
        title: "From rollout to adoption, we stay with you.",
        description:
          "We help teams move from training into sustained adoption by aligning stakeholders, documentation, and execution plans.",
        imageAlt: "Operational readiness and adoption",
        imageUrl: svgDataUri(aboutSection02Svg),
      },
    ],
  },
  {
    slug: "careers",
    label: "Careers",
    eyebrow: "Team Growth",
    title: "Join a team focused on practical delivery and clear execution.",
    summary:
      "Explore the kind of work, collaboration style, and delivery mindset we look for across strategy, design, and platform roles.",
    intro:
      "We look for people who can connect planning to execution. That means working across functions, simplifying complexity for clients, and helping teams move with confidence.",
    highlights: [
      "Work across strategy, design, and platform delivery",
      "Contribute to client-facing rollout and enablement programs",
      "Build systems that stay useful after launch",
    ],
    supportPoints: [
      "Collaborative delivery culture",
      "Applied learning",
      "High ownership",
    ],
  },
  {
    slug: "contact-us",
    label: "Contact Us",
    eyebrow: "Reach The Team",
    title: "Start a conversation about training, services, or rollout needs.",
    summary:
      "Use the contact page to route product, enablement, and partnership conversations to the right team quickly.",
    intro:
      "Whether you need a walkthrough, a project discussion, or a follow-up on an active engagement, the contact path is designed to reduce handoffs and connect you to the right context faster.",
    highlights: [
      "Product and training inquiries",
      "Service and delivery conversations",
      "Partnership and general support routing",
    ],
    supportPoints: [
      "Demo requests",
      "Project scoping",
      "General support",
    ],
  },
  ...menuCompanyItems,
  ...aiCompanyItems,
  {
    slug: "blog",
    label: "Blog",
    eyebrow: "Company Blog",
    title: "Insights, launch notes, and delivery stories.",
    summary:
      "Updates on strategy, design, and platform delivery, with a focus on practical takeaways.",
    intro:
      "Explore product thinking, delivery lessons, and the systems we build to keep teams moving with clarity.",
    highlights: [
      "Launch notes and delivery playbooks",
      "Platform and tooling perspectives",
      "Strategic storytelling for teams",
    ],
    supportPoints: ["News", "Business", "Technology"],
    blogPosts: [
      {
        slug: "distributed-databases-agentic-ai",
        title: "Distributed Databases: Enabling Agentic AI",
        excerpt:
          "The Agentic AI Infrastructure Challenge represents a paradigm shift from traditional AI. Learn the patterns teams are adopting.",
        date: "9/21/2025",
        readTime: "5 min read",
        category: "news",
        imageUrl: svgDataUri(blogCard01Svg),
        body: [
          "Agentic AI systems need stateful, low-latency access to data across regions. That pushes teams to rethink how they store, replicate, and serve context.",
          "We outline the patterns that are emerging in production: sharded knowledge stores, locality-aware routing, and guardrails around consistency for critical workflows.",
          "The teams that move fastest align data architecture with product intent so orchestration can stay simple and predictable.",
        ],
      },
      {
        slug: "product-interfaces-2025",
        title: "Product Interfaces in 2025",
        excerpt:
          "How teams are shaping next-gen interfaces with deliberate motion, depth, and system clarity across SaaS products.",
        date: "9/18/2025",
        readTime: "4 min read",
        category: "business",
        imageUrl: svgDataUri(blogCard02Svg),
        body: [
          "Interface trends are shifting toward intentional motion and clear hierarchy. The best teams focus on framing key actions without overwhelming the user.",
          "We highlight the patterns that are working in production and how to translate them into maintainable systems.",
          "Clarity is still the most valuable feature. The tools should feel fast, not flashy.",
        ],
      },
      {
        slug: "agentic-ai-across-global-regions",
        title: "Agentic AI Across Global Regions",
        excerpt:
          "Building reliable, multi-region AI systems demands new approaches to data, orchestration, and governance.",
        date: "9/9/2025",
        readTime: "5 min read",
        category: "technology",
        imageUrl: svgDataUri(blogCard03Svg),
        body: [
          "Multi-region AI deployments require careful orchestration so latency, cost, and reliability stay within target.",
          "Teams are adopting hybrid replication strategies and separating control-plane and data-plane responsibilities.",
          "The result is a more resilient delivery pipeline that can scale with real-world usage.",
        ],
      },
      {
        slug: "design-systems-that-scale",
        title: "Design Systems That Scale",
        excerpt:
          "A practical guide to keeping UI velocity high without losing consistency or accessibility.",
        date: "8/27/2025",
        readTime: "6 min read",
        category: "design",
        imageUrl: svgDataUri(blogCard02Svg),
        body: [
          "Design systems work when they reduce decision fatigue and keep teams aligned on patterns.",
          "We outline the components that matter most and how to keep documentation light but effective.",
          "Accessibility and consistency are not tradeoffs. They are what make systems durable.",
        ],
      },
      {
        slug: "launch-readiness-checklist",
        title: "Launch Readiness Checklist",
        excerpt:
          "A step-by-step checklist to align stakeholders, content, and enablement before go-live.",
        date: "8/10/2025",
        readTime: "5 min read",
        category: "tutorial",
        imageUrl: svgDataUri(blogCard03Svg),
        body: [
          "Launch readiness is a discipline. This checklist helps teams confirm messaging, documentation, and enablement before release.",
          "We recommend reviewing it with product, marketing, and support to avoid last-minute gaps.",
          "A small investment in readiness saves large amounts of post-launch rework.",
        ],
      },
    ],
  },
]

export const getCompanyBySlug = (slug: string) =>
  companyItems.find((item) => item.slug === slug)

export const getBlogPostBySlug = (slug: string) => {
  const blogItem = companyItems.find((item) => item.slug === "blog")
  return blogItem?.blogPosts?.find((post) => post.slug === slug)
}

