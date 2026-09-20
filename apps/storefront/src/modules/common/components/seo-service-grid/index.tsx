import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CopySegment = {
  text: string
  accent?: boolean
}

export type SeoServiceCard = {
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
  segments: CopySegment[]
}

export const multiLocationSeoServiceCards: SeoServiceCard[] = [
  {
    title: "Local SEO",
    icon: "megaphone",
    segments: [
      {
        text: "We'll help you attract high-quality search traffic by targeting relevant industry keywords and fully optimizing content for each location, building a scalable ",
      },
      { text: "local SEO strategy", accent: true },
      { text: " that maximizes visibility across all markets." },
    ],
  },
  {
    title: "Local Listings & Directory Management",
    icon: "directory",
    segments: [
      {
        text: "Our multi-location marketing agency takes advantage of your business's physical address for each store, helping you rank ",
      },
      { text: "Google Business Profile", accent: true },
      {
        text: " Pages and land in the Map results. In turn, your audiences can easily find each of your locations online.",
      },
    ],
  },
  {
    title: "Localized Website Development",
    icon: "cursor",
    segments: [
      {
        text: "We design and develop WordPress websites to maximize user experience, SEO results, and ",
      },
      { text: "conversion rate optimization", accent: true },
      {
        text: ". Our team can support any or all parts of building a cohesive website including sitemap integration, customizable widgets, ",
      },
      { text: "SEO optimized", accent: true },
      { text: " content, site speed, mobile optimization and more." },
    ],
  },
  {
    title: "Multi-Location PPC Campaigns",
    icon: "ppc",
    segments: [
      { text: "Our multi-location marketing agency can develop " },
      { text: "paid media campaigns", accent: true },
      {
        text: " that connect with audiences across all locations with paid search, display, and other ads. We pinpoint your audience and connect with them throughout their customer journey through intent-driven campaigns to drive revenue growth.",
      },
    ],
  },
  {
    title: "Social Media Marketing",
    icon: "mail",
    segments: [
      {
        text: "Our multi-location marketing services help you connect with audiences on the ",
      },
      { text: "social media platforms", accent: true },
      {
        text: " they use, from Facebook and LinkedIn to Instagram and TikTok. We'll use a combination of locally targeted posts and ads to reach audiences and boost engagement with your brand's social media profiles.",
      },
    ],
  },
  {
    title: "Geo-Targeted Content Marketing",
    icon: "store",
    segments: [
      {
        text: "Web pages, blog posts, videos, images, SMS marketing, emails, and other content should all use geo-targeting to help you reach local audiences for every location. We'll develop and curate ",
      },
      { text: "high-quality content", accent: true },
      {
        text: " that establishes a strong connection with audiences, converting web traffic into leads and leads into loyal customers.",
      },
    ],
  },
  {
    title: "Lifecycle Marketing",
    icon: "globe",
    segments: [
      {
        text: "Maximize your multi-location marketing ROI with a fully integrated and cohesive ",
      },
      { text: "lifecycle marketing strategy", accent: true },
      {
        text: " that seamlessly guides potential customers into loyal consumers. We'll build email and SMS campaigns based on personalization, tailoring messages to your customer on channels that will reach them.",
      },
    ],
  },
  {
    title: "Reporting & Analytics",
    icon: "analytics",
    segments: [
      {
        text: "Our team of experts focus on data-driven multi-location marketing decisions. We are quick to ensure data is ",
      },
      { text: "accurate", accent: true },
      {
        text: ", stakeholders are properly informed and data is secure, providing a steady stream of growth opportunities.",
      },
    ],
  },
]

export const aiSeoServiceCards: SeoServiceCard[] = [
  {
    title: "GEO Optimization",
    icon: "directory",
    segments: [
      {
        text: "We optimize your content to ensure it can be easily discovered, extracted, and cited by AI systems through structured data, semantic HTML, and GEO strategies.",
      },
    ],
  },
  {
    title: "AEO & Conversational SEO",
    icon: "store",
    segments: [
      {
        text: "We align your content with questions, voice commands, and conversational queries so AI platforms can prioritize direct and accurate answers.",
      },
    ],
  },
  {
    title: "AI Visibility Strategy",
    icon: "globe",
    segments: [
      {
        text: "We position your brand as a trusted, unique source by refining messaging, showcasing expertise, and building a digital footprint AI systems recognize and prioritize.",
      },
    ],
  },
  {
    title: "Authority Signals & Entity SEO",
    icon: "cursor",
    segments: [
      {
        text: "We strengthen your authority with E-E-A-T principles, entity mapping, schema markup, and semantic linking to improve trust and visibility across AI ecosystems.",
      },
    ],
  },
]

export const seoServiceCards: SeoServiceCard[] = [
  {
    title: "Local SEO",
    icon: "directory",
    segments: [
      {
        text: "We help your business show up when it matters most. By optimizing your Google Business Profile, local listings, and NAP consistency, we ensure you capture high-intent \"near me\" searches and convert local traffic into customers.",
      },
    ],
  },
  {
    title: "Intent-Based Keyword Research",
    icon: "megaphone",
    segments: [
      {
        text: "We go beyond search volume. Our team identifies high-intent keywords that align with your audience's needs, creating a clear roadmap that connects search intent with business outcomes.",
      },
    ],
  },
  {
    title: "High-Value Content Creation",
    icon: "store",
    segments: [
      {
        text: "Content is your growth engine. We create authoritative, E-E-A-T aligned content tailored to your industry-designed to build trust, rank higher, and convert visitors into leads.",
      },
    ],
  },
  {
    title: "Technical SEO Audit",
    icon: "cursor",
    segments: [
      {
        text: "We uncover and fix the technical barriers holding your site back. From Core Web Vitals to crawlability and site structure, we optimize your website for both search engines and AI-driven indexing.",
      },
    ],
  },
  {
    title: "Competitor Analysis",
    icon: "mail",
    segments: [
      {
        text: "Understand where you stand-and how to win. We analyze your competitors to uncover keyword gaps, content opportunities, and ranking strategies that give you a competitive edge.",
      },
    ],
  },
  {
    title: "Multimedia SEO",
    icon: "globe",
    segments: [
      {
        text: "Search is becoming visual and voice-driven. We optimize your videos, images, and audio content to help you capture traffic from modern search experiences.",
      },
    ],
  },
  {
    title: "AI Search Visibility",
    icon: "analytics",
    segments: [
      {
        text: "AI is changing how users discover brands. We optimize your presence for AI-generated results using structured data, entity mapping, and authority signals-helping your brand appear in next-gen search experiences.",
      },
    ],
  },
  {
    title: "Analytics & Reporting",
    icon: "ppc",
    segments: [
      {
        text: "Transparency drives performance. We track everything-from traffic to conversions-and provide clear, actionable insights so you always know what's working and where to scale.",
      },
    ],
  },
]

export const localSeoServiceCards: SeoServiceCard[] = [
  {
    title: "Google Business Profile (GBP) Optimization",
    icon: "directory",
    segments: [
      {
        text: "We create and optimize your Google Business Profile with accurate NAP details, compelling descriptions, images, and updates-ensuring your business appears in map packs and local results when customers are ready to convert.",
      },
    ],
  },
  {
    title: "Local Keyword Research & Strategy",
    icon: "megaphone",
    segments: [
      {
        text: "We identify how your audience searches locally, including \"near me\" and location-specific queries, building a strategy that drives high-quality, conversion-focused traffic.",
      },
    ],
  },
  {
    title: "On-Page SEO for Local Landing Pages",
    icon: "store",
    segments: [
      {
        text: "We optimize your website pages with localized content, metadata, and structure-ensuring each page aligns with local intent and ranks higher in your target areas.",
      },
    ],
  },
  {
    title: "Local Citations & NAP Consistency",
    icon: "cursor",
    segments: [
      {
        text: "We build and manage your business listings across directories with consistent NAP information, improving credibility, trust, and local rankings.",
      },
    ],
  },
  {
    title: "Local Link Building & Brand Authority",
    icon: "mail",
    segments: [
      {
        text: "We strengthen your online authority through high-quality backlinks and local brand mentions, helping your business gain trust and outperform competitors.",
      },
    ],
  },
  {
    title: "Reviews & Reputation Optimization",
    icon: "globe",
    segments: [
      {
        text: "We help you generate and manage authentic customer reviews, boosting trust, visibility, and conversions-while also improving your presence in AI-driven recommendations.",
      },
    ],
  },
  {
    title: "Local Content Marketing & Blogging",
    icon: "analytics",
    segments: [
      {
        text: "We create targeted, high-quality content that connects with your local audience, improves rankings, and positions your brand as a trusted authority in your region.",
      },
    ],
  },
  {
    title: "Local SEO Analytics & Reporting",
    icon: "ppc",
    segments: [
      {
        text: "We provide clear, transparent reporting on rankings, traffic, and conversions-helping you understand performance and continuously improve your strategy.",
      },
    ],
  },
]

export const digitalPrServiceCards: SeoServiceCard[] = [
  {
    title: "PR-Led Link Building",
    icon: "megaphone",
    segments: [
      {
        text: "Strengthen your website authority with high-quality backlinks earned through strategic PR outreach. We create compelling content, connect with trusted publishers, and secure placements that enhance search rankings and drive referral traffic.",
      },
    ],
  },
  {
    title: "Data-Driven Media Campaigns",
    icon: "directory",
    segments: [
      {
        text: "Every campaign is built on research, industry insights, and audience intelligence to capture media attention while delivering measurable reach, engagement, and brand visibility.",
      },
    ],
  },
  {
    title: "Brand Mentions & Media Coverage",
    icon: "cursor",
    segments: [
      {
        text: "Increase your brand presence across news outlets, blogs, industry platforms, and social media channels through strategic outreach and meaningful media mentions.",
      },
    ],
  },
  {
    title: "Journalist & Media Outreach",
    icon: "globe",
    segments: [
      {
        text: "We connect your brand with relevant journalists, editors, and industry writers to secure authoritative media placements and stronger visibility through trusted publications.",
      },
    ],
  },
  {
    title: "Influencer Outreach & Relationship Building",
    icon: "store",
    segments: [
      {
        text: "Expand awareness through authentic influencer collaborations and strategic relationship building that amplifies your message and strengthens audience trust.",
      },
    ],
  },
  {
    title: "Press Release Strategy & Distribution",
    icon: "mail",
    segments: [
      {
        text: "From product launches to company milestones, we create and distribute press releases that improve visibility, credibility, and brand perception.",
      },
    ],
  },
  {
    title: "Executive Thought Leadership",
    icon: "ppc",
    segments: [
      {
        text: "Position your leadership team as industry experts through thought leadership content, guest articles, interviews, and expert commentary placements.",
      },
    ],
  },
  {
    title: "Industry-Specific PR Solutions",
    icon: "analytics",
    segments: [
      {
        text: "We deliver customized Digital PR strategies for SaaS, manufacturing, healthcare, pharmaceuticals, technology, and service-based industries.",
      },
    ],
  },
]

export const socialMediaServiceCards: SeoServiceCard[] = [
  {
    title: "Multi-Platform Social Strategy",
    icon: "globe",
    segments: [
      {
        text: "We design platform-specific strategies across channels like Facebook, Instagram, LinkedIn, X, and more-ensuring your brand reaches the right audience with consistent and impactful messaging.",
      },
    ],
  },
  {
    title: "Content Planning & Calendar Management",
    icon: "mail",
    segments: [
      {
        text: "Our structured content calendars ensure consistent posting with high-quality, engaging content that keeps your brand top-of-mind and drives continuous audience interaction.",
      },
    ],
  },
  {
    title: "Paid Social Campaign Management",
    icon: "ppc",
    segments: [
      {
        text: "We create and manage highly targeted ad campaigns optimized for performance. From audience targeting to creative optimization, we focus on maximizing ROI and scaling results.",
      },
    ],
  },
  {
    title: "Influencer & UGC Integration",
    icon: "megaphone",
    segments: [
      {
        text: "Leverage the power of influencers and user-generated content to build trust and authenticity. We connect your brand with relevant creators to expand reach and boost engagement.",
      },
    ],
  },
  {
    title: "Community Engagement & Management",
    icon: "directory",
    segments: [
      {
        text: "We actively manage your social presence by responding to comments, messages, and interactions-helping you build strong relationships and improve customer trust.",
      },
    ],
  },
  {
    title: "Creative Design & Visual Content",
    icon: "store",
    segments: [
      {
        text: "Our team develops visually compelling creatives, including graphics, infographics, and short-form content, designed to capture attention and enhance brand storytelling.",
      },
    ],
  },
  {
    title: "Social Listening & Audience Insights",
    icon: "cursor",
    segments: [
      {
        text: "We monitor audience behavior, trends, and conversations to refine strategies and ensure your campaigns stay relevant and effective.",
      },
    ],
  },
  {
    title: "Performance Tracking & Reporting",
    icon: "analytics",
    segments: [
      {
        text: "We provide transparent, data-driven reports that track engagement, reach, conversions, and ROI-helping you make informed marketing decisions.",
      },
    ],
  },
]

type ServiceVisualTheme = {
  panelClass: string
  orbClass: string
  iconWrapClass: string
  bandClass: string
  accentClass: string
}

const serviceVisualThemes: ServiceVisualTheme[] = [
  {
    panelClass:
      "bg-[linear-gradient(145deg,#dbeafe_0%,#eff6ff_56%,#ffffff_100%)]",
    orbClass: "bg-[rgba(37,99,235,0.2)]",
    iconWrapClass:
      "bg-white text-[#2563eb] shadow-[0_16px_28px_rgba(37,99,235,0.16)]",
    bandClass: "bg-[#10233b]",
    accentClass: "text-[#2563eb]",
  },
  {
    panelClass:
      "bg-[linear-gradient(145deg,#fff4df_0%,#ffedd5_50%,#ffffff_100%)]",
    orbClass: "bg-[rgba(249,115,22,0.2)]",
    iconWrapClass:
      "bg-white text-[#ea580c] shadow-[0_16px_28px_rgba(249,115,22,0.16)]",
    bandClass: "bg-[#1f2937]",
    accentClass: "text-[#ea580c]",
  },
  {
    panelClass:
      "bg-[linear-gradient(145deg,#dcfce7_0%,#ecfeff_50%,#ffffff_100%)]",
    orbClass: "bg-[rgba(13,148,136,0.2)]",
    iconWrapClass:
      "bg-white text-[#0f766e] shadow-[0_16px_28px_rgba(13,148,136,0.16)]",
    bandClass: "bg-[#13313a]",
    accentClass: "text-[#0f766e]",
  },
  {
    panelClass:
      "bg-[linear-gradient(145deg,#ede9fe_0%,#f5f3ff_46%,#fff7ed_100%)]",
    orbClass: "bg-[rgba(124,58,237,0.2)]",
    iconWrapClass:
      "bg-white text-[#7c3aed] shadow-[0_16px_28px_rgba(124,58,237,0.16)]",
    bandClass: "bg-[#21153a]",
    accentClass: "text-[#7c3aed]",
  },
]

const getServiceVisualTheme = (index: number) =>
  serviceVisualThemes[index % serviceVisualThemes.length]

const SeoServiceIcon = ({
  icon,
}: {
  icon: SeoServiceCard["icon"]
}) => {
  const shared = {
    className: "h-7 w-7",
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }

  switch (icon) {
    case "megaphone":
      return (
        <svg {...shared}>
          <path d="M6 17.5v-3.5l12-4.5v12.5L6 17.5Z" />
          <path d="M18 12h3.5c2.2 0 4 1.8 4 4s-1.8 4-4 4H18" />
          <path d="m9 18.5 2 6h3l-1.5-5.2" />
        </svg>
      )
    case "directory":
      return (
        <svg {...shared}>
          <circle cx="16" cy="16" r="6.2" />
          <path d="M16 3.8v3.1M16 25.1v3.1M28.2 16h-3.1M6.9 16H3.8M24.5 7.5l-2.2 2.2M9.7 22.3l-2.2 2.2M24.5 24.5l-2.2-2.2M9.7 9.7 7.5 7.5" />
          <circle cx="16" cy="16" r="1.7" fill="currentColor" stroke="none" />
        </svg>
      )
    case "cursor":
      return (
        <svg {...shared}>
          <path d="M6.5 5.5 21 14l-6.7 1.6 3.3 7-3.6 1.7-3.3-7L6.5 21V5.5Z" />
          <path d="m20.6 8.7 5.2-2.1" />
        </svg>
      )
    case "ppc":
      return (
        <svg {...shared}>
          <circle cx="16" cy="16" r="8" />
          <path d="M11.5 12.5h6.3a2.4 2.4 0 0 1 0 4.8h-3.6a2.3 2.3 0 0 0 0 4.7h6" />
          <path d="M16 9.2v13.6M25 7l2.4-2.4M5 25l2.4-2.4M7 7 4.6 4.6M27.4 27.4 25 25" />
        </svg>
      )
    case "mail":
      return (
        <svg {...shared}>
          <path d="M5 9h22v14H5z" />
          <path d="m6.5 10.5 9.5 7 9.5-7" />
        </svg>
      )
    case "store":
      return (
        <svg {...shared}>
          <path d="M7 12.5h18v13H7z" />
          <path d="M10 12.5V8h12v4.5" />
          <path d="M12 17h8M12 21h5" />
        </svg>
      )
    case "globe":
      return (
        <svg {...shared}>
          <circle cx="16" cy="16" r="9" />
          <path d="M7 16h18M16 7a14 14 0 0 1 0 18M16 7a14 14 0 0 0 0 18" />
        </svg>
      )
    case "analytics":
      return (
        <svg {...shared}>
          <path d="M6 24h20" />
          <path d="M9.5 21V13M16 21V9M22.5 21v-6" />
          <path d="m8.5 10 5.3-3.6L20 10l4.5-5" />
        </svg>
      )
  }
}

const SeoServiceGrid = ({
  cards,
  ctaLabel,
  ctaHref = "/company/contact-us",
}: {
  cards: SeoServiceCard[]
  ctaLabel: string
  ctaHref?: string
}) => {
  return (
    <div className="mx-auto max-w-[1260px] p-0">
      <div className="grid grid-cols-1 gap-5 xsmall:grid-cols-2 small:grid-cols-4">
        {cards.map((card, index) => {
          const theme = getServiceVisualTheme(index)

          return (
          <article
            key={card.title}
            className="group h-full overflow-hidden border border-[#dfebf4] bg-white shadow-[0_20px_42px_-34px_rgba(15,23,42,0.7)] transition-transform duration-200 hover:-translate-y-1"
          >
            <div className={`relative h-[182px] overflow-hidden ${theme.panelClass}`}>
              <div
                className={`absolute left-[-18px] top-8 h-24 w-24 blur-2xl ${theme.orbClass}`}
              />
              <div
                className={`absolute right-[-8px] top-4 h-28 w-36 blur-2xl ${theme.orbClass}`}
              />
              <div className="absolute inset-x-5 top-5 flex items-start justify-between">
                <span className="text-[10px] font-semibold uppercase text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="relative flex h-full items-end px-5 pb-5">
                <span
                  className={`inline-flex h-14 w-14 items-center justify-center ${theme.iconWrapClass}`}
                >
                  <SeoServiceIcon icon={card.icon} />
                </span>
              </div>
            </div>

            <div className={`${theme.bandClass} px-5 py-4`}>
              <h3 className="max-w-[18ch] font-[Arial_Narrow,Roboto_Condensed,Helvetica_Neue,Arial,sans-serif] text-[0.94rem] font-black uppercase leading-[1.02] text-white">
                {card.title}
              </h3>
            </div>

            <div className="px-5 py-5">
              <p className="text-[14px] leading-7 text-slate-600">
                {card.segments.map((segment, segmentIndex) => (
                  <span
                    key={`${card.title}-${segmentIndex}`}
                    className={segment.accent ? `font-semibold ${theme.accentClass}` : undefined}
                  >
                    {segment.text}
                  </span>
                ))}
              </p>
            </div>
          </article>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <LocalizedClientLink
          href={ctaHref}
          className="inline-flex items-center justify-center bg-brand-cta px-[28px] py-3.5 text-[0.88rem] font-bold uppercase leading-6 text-white shadow-[0_18px_34px_rgba(238,107,75,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          {ctaLabel}
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SeoServiceGrid
