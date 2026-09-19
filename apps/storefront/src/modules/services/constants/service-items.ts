export type ServiceItem = {
  slug: string
  label: string
  eyebrow: string
  title: string
  summary: string
  intro: string
  capabilities: string[]
  outcomes: string[]
  sections?: Array<{
    title: string
    description: string
    items?: string[]
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
  faqs?: Array<{
    question: string
    answer: string
  }>
  finalCta?: {
    title: string
    description: string
    primaryLabel: string
    secondaryLabel?: string
  }
}

const svgDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

const brandingSection01Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e6f3ff" />
      <stop offset="55%" stop-color="#fff7ea" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="accent1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9fd8f8" />
      <stop offset="100%" stop-color="#cde9ff" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg1)" />
  <circle cx="220" cy="160" r="120" fill="#e1efff" />
  <circle cx="980" cy="220" r="140" fill="#ffe8cc" />
  <rect x="140" y="260" width="520" height="380" rx="36" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="180" y="320" width="320" height="16" rx="8" fill="url(#accent1)" />
  <rect x="180" y="360" width="380" height="14" rx="7" fill="#dbe7f3" />
  <rect x="180" y="390" width="340" height="14" rx="7" fill="#dbe7f3" />
  <rect x="180" y="420" width="300" height="14" rx="7" fill="#dbe7f3" />
  <rect x="180" y="470" width="220" height="42" rx="21" fill="#9fd8f8" />
  <text x="200" y="498" font-family="Arial, sans-serif" font-size="16" fill="#0f172a" font-weight="700">
    Brand Strategy
  </text>
  <text x="720" y="520" font-family="Arial, sans-serif" font-size="48" fill="#0f172a" font-weight="700">
    BRANDING
  </text>
  <text x="720" y="565" font-family="Arial, sans-serif" font-size="18" fill="#475569">
    Identity, voice, and launch systems
  </text>
</svg>
`

const brandingSection02Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff7f0" />
      <stop offset="50%" stop-color="#f1f5ff" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="accent2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#cfe8ff" />
      <stop offset="100%" stop-color="#9fd8f8" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg2)" />
  <rect x="120" y="140" width="960" height="620" rx="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="190" y="210" width="360" height="20" rx="10" fill="url(#accent2)" />
  <rect x="190" y="260" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="190" y="290" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="190" y="320" width="440" height="14" rx="7" fill="#dde7f1" />
  <rect x="190" y="370" width="260" height="42" rx="21" fill="#9fd8f8" />
  <text x="210" y="398" font-family="Arial, sans-serif" font-size="16" fill="#0f172a" font-weight="700">
    Graphic Design
  </text>
  <rect x="640" y="220" width="340" height="250" rx="28" fill="#f1f5f9" />
  <rect x="680" y="260" width="260" height="20" rx="10" fill="#cbd5e1" />
  <rect x="680" y="300" width="220" height="14" rx="7" fill="#d6e0ea" />
  <rect x="680" y="330" width="240" height="14" rx="7" fill="#d6e0ea" />
  <rect x="640" y="500" width="340" height="200" rx="28" fill="#fff1e6" />
  <text x="700" y="620" font-family="Arial, sans-serif" font-size="22" fill="#0f172a" font-weight="700">
    UI and UX
  </text>
</svg>
`

const experienceSection01Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef6ff" />
      <stop offset="55%" stop-color="#fdf5ff" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="accent3" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b6e3ff" />
      <stop offset="100%" stop-color="#9fd8f8" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg3)" />
  <rect x="130" y="170" width="940" height="560" rx="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="200" y="240" width="420" height="20" rx="10" fill="url(#accent3)" />
  <rect x="200" y="290" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="200" y="320" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="200" y="350" width="440" height="14" rx="7" fill="#dde7f1" />
  <rect x="200" y="410" width="300" height="42" rx="21" fill="#9fd8f8" />
  <text x="220" y="438" font-family="Arial, sans-serif" font-size="16" fill="#0f172a" font-weight="700">
    UX Strategy
  </text>
  <rect x="720" y="250" width="300" height="200" rx="24" fill="#f1f5f9" />
  <rect x="720" y="470" width="300" height="200" rx="24" fill="#fff1e6" />
  <text x="760" y="570" font-family="Arial, sans-serif" font-size="20" fill="#0f172a" font-weight="700">
    Journeys
  </text>
</svg>
`

const experienceSection02Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
  <defs>
    <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7fbff" />
      <stop offset="50%" stop-color="#fff7ec" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="accent4" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9fd8f8" />
      <stop offset="100%" stop-color="#bde5ff" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg4)" />
  <circle cx="260" cy="220" r="120" fill="#e1efff" />
  <circle cx="940" cy="260" r="120" fill="#ffe8cc" />
  <rect x="160" y="300" width="880" height="380" rx="40" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="220" y="360" width="360" height="20" rx="10" fill="url(#accent4)" />
  <rect x="220" y="410" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="220" y="440" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="220" y="470" width="440" height="14" rx="7" fill="#dde7f1" />
  <text x="700" y="520" font-family="Arial, sans-serif" font-size="24" fill="#0f172a" font-weight="700">
    Interface Systems
  </text>
</svg>
`

const technologiesSection01Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef7ff" />
      <stop offset="50%" stop-color="#f3f8ff" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="accent5" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9fd8f8" />
      <stop offset="100%" stop-color="#bde5ff" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg5)" />
  <rect x="150" y="170" width="900" height="560" rx="42" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="220" y="250" width="420" height="20" rx="10" fill="url(#accent5)" />
  <rect x="220" y="300" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="220" y="330" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="220" y="360" width="440" height="14" rx="7" fill="#dde7f1" />
  <rect x="720" y="260" width="260" height="180" rx="24" fill="#f1f5f9" />
  <rect x="720" y="470" width="260" height="180" rx="24" fill="#fff1e6" />
  <text x="250" y="430" font-family="Arial, sans-serif" font-size="20" fill="#0f172a" font-weight="700">
    Platform Enablement
  </text>
</svg>
`

const technologiesSection02Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
  <defs>
    <linearGradient id="bg6" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7fbff" />
      <stop offset="55%" stop-color="#fff7ec" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="accent6" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b6e3ff" />
      <stop offset="100%" stop-color="#9fd8f8" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg6)" />
  <circle cx="260" cy="220" r="120" fill="#e1efff" />
  <circle cx="940" cy="260" r="120" fill="#ffe8cc" />
  <rect x="180" y="300" width="840" height="380" rx="40" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="240" y="360" width="360" height="20" rx="10" fill="url(#accent6)" />
  <rect x="240" y="410" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="240" y="440" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="240" y="470" width="440" height="14" rx="7" fill="#dde7f1" />
  <text x="700" y="520" font-family="Arial, sans-serif" font-size="22" fill="#0f172a" font-weight="700">
    Integration Planning
  </text>
</svg>
`

const marketingSection01Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
  <defs>
    <linearGradient id="bg7" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f4f8ff" />
      <stop offset="50%" stop-color="#fff5ec" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="accent7" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9fd8f8" />
      <stop offset="100%" stop-color="#cfe8ff" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg7)" />
  <rect x="140" y="170" width="920" height="560" rx="44" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="220" y="250" width="420" height="20" rx="10" fill="url(#accent7)" />
  <rect x="220" y="300" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="220" y="330" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="220" y="360" width="440" height="14" rx="7" fill="#dde7f1" />
  <rect x="700" y="260" width="280" height="180" rx="24" fill="#f1f5f9" />
  <rect x="700" y="470" width="280" height="180" rx="24" fill="#fff1e6" />
  <text x="250" y="430" font-family="Arial, sans-serif" font-size="20" fill="#0f172a" font-weight="700">
    Launch Programs
  </text>
</svg>
`

const marketingSection02Svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
  <defs>
    <linearGradient id="bg8" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7fbff" />
      <stop offset="50%" stop-color="#fff7ec" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <linearGradient id="accent8" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b6e3ff" />
      <stop offset="100%" stop-color="#9fd8f8" />
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg8)" />
  <circle cx="260" cy="220" r="120" fill="#e1efff" />
  <circle cx="940" cy="260" r="120" fill="#ffe8cc" />
  <rect x="180" y="300" width="840" height="380" rx="40" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" />
  <rect x="240" y="360" width="360" height="20" rx="10" fill="url(#accent8)" />
  <rect x="240" y="410" width="520" height="14" rx="7" fill="#dde7f1" />
  <rect x="240" y="440" width="480" height="14" rx="7" fill="#dde7f1" />
  <rect x="240" y="470" width="440" height="14" rx="7" fill="#dde7f1" />
  <text x="700" y="520" font-family="Arial, sans-serif" font-size="22" fill="#0f172a" font-weight="700">
    Growth Reporting
  </text>
</svg>
`

const createServiceDetailPage = ({
  slug,
  label,
  eyebrow,
  summary,
  intro,
  capabilities,
  outcomes,
}: {
  slug: string
  label: string
  eyebrow: string
  summary: string
  intro: string
  capabilities: string[]
  outcomes: string[]
}): ServiceItem => ({
  slug,
  label,
  eyebrow,
  title: `${label} programs built for structured execution and measurable growth.`,
  summary,
  intro,
  capabilities,
  outcomes,
  sections: [
    {
      title: `${label} strategy and execution`,
      description: intro,
      items: capabilities,
    },
    {
      title: `What teams gain from ${label.toLowerCase()}`,
      description:
        "Each page follows the same shared design system, but the messaging and focus points are specific to the service area.",
      items: outcomes,
    },
  ],
})

const menuServiceItems: ServiceItem[] = [
  {
    slug: "content-marketing",
    label: "Content Marketing",
    eyebrow: "Owned Media",
    title: "Content Marketing Services",
    summary:
      "Content Marketing Services at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    intro:
      "Content Marketing Services at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    capabilities: [
      "Strategic planning aligned with business goals",
      "Execution using modern tools",
      "Continuous optimization",
      "Advanced analytics and tracking",
    ],
    outcomes: [
      "Proven expertise",
      "ROI-focused approach",
      "Transparent reporting",
      "Customized strategies",
      "Innovation-driven execution",
      "High-touch communication",
    ],
    sections: [
      {
        title: "Our Services Include",
        description: "",
        imageUrl: "/services_img/content-marketing.png",
        imageAlt: "Content Marketing Services",
        items: [
          "Strategic planning aligned with business goals",
          "Execution using modern tools",
          "Continuous optimization",
          "Advanced analytics and tracking",
        ],
      },
    ],
    supportingMessage: {
      title: "WHY WORK WITH US?",
      description:
        "We combine strategy, execution, and data to drive measurable ROI and long-term growth.",
    },
    differentiators: {
      title: "WHAT SETS US APART",
      items: [
        "Proven expertise",
        "ROI-focused approach",
        "Transparent reporting",
        "Customized strategies",
        "Innovation-driven execution",
        "High-touch communication",
      ],
    },
    faqs: [
      {
        question: "What is this service?",
        answer:
          "This service improves performance, engagement, and conversions using structured strategies.",
      },
      {
        question: "Why is it important?",
        answer:
          "It ensures better ROI and long-term growth.",
      },
      {
        question: "How long to see results?",
        answer:
          "Initial results appear in weeks, full impact in months.",
      },
      {
        question: "Is it customizable?",
        answer:
          "Yes, tailored to your business goals.",
      },
      {
        question: "How is success measured?",
        answer:
          "Using KPIs like traffic, conversions, and ROI.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes, detailed performance reports are included.",
      },
    ],
  },
  {
    slug: "conversion-rate-optimization",
    label: "Conversion Rate Optimization",
    eyebrow: "Owned Media",
    title: "Conversion Rate Optimization (CRO)",
    summary:
      "Conversion Rate Optimization (CRO) at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    intro:
      "Conversion Rate Optimization (CRO) at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    capabilities: [
      "Strategic planning aligned with business goals",
      "Execution using modern tools",
      "Continuous optimization",
      "Advanced analytics and tracking",
    ],
    outcomes: [
      "Proven expertise",
      "ROI-focused approach",
      "Transparent reporting",
      "Customized strategies",
      "Innovation-driven execution",
      "High-touch communication",
    ],
    sections: [
      {
        title: "Our Services Include",
        description: "",
        items: [
          "Strategic planning aligned with business goals",
          "Execution using modern tools",
          "Continuous optimization",
          "Advanced analytics and tracking",
        ],
      },
    ],
    supportingMessage: {
      title: "WHY WORK WITH US?",
      description:
        "We combine strategy, execution, and data to drive measurable ROI and long-term growth.",
    },
    differentiators: {
      title: "WHAT SETS US APART",
      items: [
        "Proven expertise",
        "ROI-focused approach",
        "Transparent reporting",
        "Customized strategies",
        "Innovation-driven execution",
        "High-touch communication",
      ],
    },
    faqs: [
      {
        question: "What is this service?",
        answer:
          "This service improves performance, engagement, and conversions using structured strategies.",
      },
      {
        question: "Why is it important?",
        answer:
          "It ensures better ROI and long-term growth.",
      },
      {
        question: "How long to see results?",
        answer:
          "Initial results appear in weeks, full impact in months.",
      },
      {
        question: "Is it customizable?",
        answer:
          "Yes, tailored to your business goals.",
      },
      {
        question: "How is success measured?",
        answer:
          "Using KPIs like traffic, conversions, and ROI.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes, detailed performance reports are included.",
      },
    ],
  },
  {
    slug: "creative-branding",
    label: "Creative Design Services",
    eyebrow: "Owned Media",
    title: "Creative Design Services",
    summary:
      "Creative Design Services at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    intro:
      "Creative Design Services at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    capabilities: [
      "Strategic planning aligned with business goals",
      "Execution using modern tools",
      "Continuous optimization",
      "Advanced analytics and tracking",
    ],
    outcomes: [
      "Proven expertise",
      "ROI-focused approach",
      "Transparent reporting",
      "Customized strategies",
      "Innovation-driven execution",
      "High-touch communication",
    ],
    sections: [
      {
        title: "Our Services Include",
        description: "",
        items: [
          "Strategic planning aligned with business goals",
          "Execution using modern tools",
          "Continuous optimization",
          "Advanced analytics and tracking",
        ],
      },
    ],
    supportingMessage: {
      title: "WHY WORK WITH US?",
      description:
        "We combine strategy, execution, and data to drive measurable ROI and long-term growth.",
    },
    differentiators: {
      title: "WHAT SETS US APART",
      items: [
        "Proven expertise",
        "ROI-focused approach",
        "Transparent reporting",
        "Customized strategies",
        "Innovation-driven execution",
        "High-touch communication",
      ],
    },
    faqs: [
      {
        question: "What is this service?",
        answer:
          "This service improves performance, engagement, and conversions using structured strategies.",
      },
      {
        question: "Why is it important?",
        answer:
          "It ensures better ROI and long-term growth.",
      },
      {
        question: "How long to see results?",
        answer:
          "Initial results appear in weeks, full impact in months.",
      },
      {
        question: "Is it customizable?",
        answer:
          "Yes, tailored to your business goals.",
      },
      {
        question: "How is success measured?",
        answer:
          "Using KPIs like traffic, conversions, and ROI.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes, detailed performance reports are included.",
      },
    ],
  },
  {
    slug: "website-development",
    label: "Website Development",
    eyebrow: "Owned Media",
    title: "Build websites that perform and convert",
    summary:
      "Fast, scalable website development for teams that need stronger UX, SEO, and measurable growth.",
    intro:
      "We design and build modern websites with better UX, stronger performance, and clear paths to conversion.",
    capabilities: [
      "Custom Website Development (React, Next.js, Node.js)",
      "Ecommerce & Shopify Development",
      "Mobile-First UX/UI Design",
      "Website Speed & Performance Optimization",
      "SEO-Optimized Architecture & Technical SEO",
      "Backend & Database Development (PostgreSQL, TypeORM)",
      "Cloud, DevOps & Deployment (Docker, Kubernetes, NGINX)",
      "Hosting Solutions (VPS, Single & Multi-Domain Hosting)",
      "Website Security & CDN Integration (Cloudflare)",
      "Email Integration & Automation Services",
      "Franchise & Multi-Location Website Systems",
      "Landing Page Design & Development",
    ],
    outcomes: [
      "Modern tech stack (React Js, Next.js, Node.js, TypeScript)",
      "Scalable backend architecture (PostgreSQL, Redis, TypeORM)",
      "Advanced DevOps and deployment (Docker, Kubernetes, NGINX Other tools also)",
      "Performance-focused development with Core Web Vitals optimization",
      "SEO-first website architecture and structure",
      "Secure and reliable hosting solutions (VPS & cloud)",
      "Integrated CDN and security (Cloudflare)",
      "Custom-built solutions tailored to your business model",
      "Transparent reporting and project management",
      "Dedicated team with continuous support and innovation",
    ],
    sections: [
      {
        title: "Our Website Development Services Include",
        description:
          "SaaSntial delivers modern, scalable, and conversion-focused website development solutions tailored to your business goals. Our approach combines cutting-edge technologies, performance optimization, and user-centric design to build websites that not only look exceptional but also perform at the highest level.",
        imageUrl: "/Custom-Website-Development.jpeg",
        imageAlt: "Custom website development illustration",
        items: [
          "Custom Website Development (React, Next.js, Node.js) - We build fully customized websites and web applications using modern frameworks like React and Next.js, supported by Node.js and Express.js for backend performance. This ensures fast, scalable, and SEO-friendly digital experiences tailored to your business.",
          "Ecommerce & Shopify Development - We develop high-converting eCommerce platforms using Shopify and custom frameworks, with optimized product pages, seamless checkout experiences, and CRO-focused design to maximize sales.",
          "Mobile-First UX/UI Design - Our design approach ensures a seamless experience across all devices. With a strong focus on mobile-first design, we improve engagement, usability, and conversion rates.",
          "Website Speed & Performance Optimization - We optimize your website for speed using caching (Redis), CDN integration (Cloudflare), and performance tuning to meet Core Web Vitals and improve user experience and SEO rankings.",
          "SEO-Optimized Architecture & Technical SEO - We build websites with clean code, structured data, optimized site architecture, and Next.js SSR capabilities to ensure maximum visibility in search engines and AI-driven search platforms.",
          "Backend & Database Development (PostgreSQL, TypeORM) - We design and manage scalable backend systems with secure APIs, efficient database architecture, and optimized performance using PostgreSQL and TypeORM.",
          "Cloud, DevOps & Deployment (Docker, Kubernetes, NGINX) - Our deployment process uses Docker and Kubernetes for scalability and NGINX for performance optimization. We ensure smooth CI/CD pipelines and secure deployments across VPS and cloud environments.",
          "Hosting Solutions (VPS, Single & Multi-Domain Hosting) - We provide flexible hosting solutions including VPS servers, single-domain, and multi-domain hosting setups tailored to your business needs, ensuring uptime, security, and scalability.",
          "Website Security & CDN Integration (Cloudflare) - We implement advanced security measures, SSL configurations, firewall protection, and CDN integration via Cloudflare to ensure fast, secure, and reliable websites.",
          "Email Integration & Automation Services - We integrate email services for transactional emails, notifications, and marketing automation, ensuring seamless communication with your users and customers.",
          "Franchise & Multi-Location Website Systems - We build scalable website systems for franchises and multi-location businesses, enabling centralized control with localized customization for each branch.",
          "Landing Page Design & Development - We create high-converting landing pages with optimized UX, compelling messaging, and strong CTAs to maximize lead generation and conversions.",
        ],
      },
    ],
    supportingMessage: {
      title: "WHY WORK WITH US?",
      description:
        "At SaaSntial, we combine technology, design, and strategy to deliver websites that drive real business results. Our development process is built on scalability, performance, and user experience, ensuring your website becomes a powerful growth engine. From initial planning to deployment and ongoing support, we provide end-to-end solutions tailored to your needs.",
    },
    differentiators: {
      title: "WHAT SETS OUR WEBSITE DEVELOPMENT SERVICES APART",
      items: [
        "Modern tech stack (React Js, Next.js, Node.js, TypeScript)",
        "Scalable backend architecture (PostgreSQL, Redis, TypeORM)",
        "Advanced DevOps and deployment (Docker, Kubernetes, NGINX Other tools also)",
        "Performance-focused development with Core Web Vitals optimization",
        "SEO-first website architecture and structure",
        "Secure and reliable hosting solutions (VPS & cloud)",
        "Integrated CDN and security (Cloudflare)",
        "Custom-built solutions tailored to your business model",
        "Transparent reporting and project management",
        "Dedicated team with continuous support and innovation",
      ],
    },
    aboutSection: {
      title: "The Leader in Website Development",
      paragraphs: [
        "SaaSntial is a future-focused digital growth partner specializing in AI-powered marketing, website development, SEO, and digital transformation solutions. We help businesses build high-performing digital platforms that drive visibility, engagement, and revenue.",
        "Our website development process follows a structured approach-starting with strategy and planning, followed by UX/UI design, development, testing, and deployment. Post-launch, we continue to support your business with monitoring, optimization, and maintenance to ensure long-term success.",
      ],
    },
    faqs: [
      {
        question: "What technologies do you use for website development?",
        answer:
          "We use modern technologies including Node.js, React, Next.js, TypeScript, PostgreSQL, Redis, Docker, Kubernetes, and Cloudflare to build scalable and high-performance websites.",
      },
      {
        question: "Do you provide custom website development or use templates?",
        answer:
          "We primarily build custom websites tailored to your business needs, ensuring flexibility, scalability, and better performance.",
      },
      {
        question: "How do you ensure website performance and speed?",
        answer:
          "We optimize performance using caching, CDN integration, clean code practices, and Core Web Vitals optimization techniques.",
      },
      {
        question: "Do you offer hosting and deployment services?",
        answer:
          "Yes, we provide VPS hosting, single and multi-domain hosting, and complete deployment solutions using modern DevOps practices.",
      },
      {
        question: "Will my website be SEO-friendly?",
        answer:
          "Absolutely. We follow SEO best practices, including optimized architecture, structured data, and performance optimization.",
      },
      {
        question: "Do you provide post-launch support and maintenance?",
        answer:
          "Yes, we offer continuous monitoring, updates, and maintenance to ensure your website performs optimally at all times.",
      },
    ],
  },
  {
    slug: "reporting-data-analytics",
    label: "Reporting & Data Analytics",
    eyebrow: "Owned Media",
    title: "Reporting & Data Analytics",
    summary:
      "Reporting & Data Analytics at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    intro:
      "Reporting & Data Analytics at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    capabilities: [
      "Strategic planning aligned with business goals",
      "Execution using modern tools",
      "Continuous optimization",
      "Advanced analytics and tracking",
    ],
    outcomes: [
      "Proven expertise",
      "ROI-focused approach",
      "Transparent reporting",
      "Customized strategies",
      "Innovation-driven execution",
      "High-touch communication",
    ],
    sections: [
      {
        title: "Our Services Include",
        description: "",
        items: [
          "Strategic planning aligned with business goals",
          "Execution using modern tools",
          "Continuous optimization",
          "Advanced analytics and tracking",
        ],
      },
    ],
    supportingMessage: {
      title: "WHY WORK WITH US?",
      description:
        "We combine strategy, execution, and data to drive measurable ROI and long-term growth.",
    },
    differentiators: {
      title: "WHAT SETS US APART",
      items: [
        "Proven expertise",
        "ROI-focused approach",
        "Transparent reporting",
        "Customized strategies",
        "Innovation-driven execution",
        "High-touch communication",
      ],
    },
    faqs: [
      {
        question: "What is this service?",
        answer:
          "This service improves performance, engagement, and conversions using structured strategies.",
      },
      {
        question: "Why is it important?",
        answer:
          "It ensures better ROI and long-term growth.",
      },
      {
        question: "How long to see results?",
        answer:
          "Initial results appear in weeks, full impact in months.",
      },
      {
        question: "Is it customizable?",
        answer:
          "Yes, tailored to your business goals.",
      },
      {
        question: "How is success measured?",
        answer:
          "Using KPIs like traffic, conversions, and ROI.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes, detailed performance reports are included.",
      },
    ],
  },
  {
    slug: "email-sms-marketing",
    label: "Email Marketing Services",
    eyebrow: "Owned Media",
    title: "Email Marketing Services",
    summary:
      "Email Marketing Services at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    intro:
      "Email Marketing Services at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    capabilities: [
      "Strategic planning aligned with business goals",
      "Execution using modern tools",
      "Continuous optimization",
      "Advanced analytics and tracking",
    ],
    outcomes: [
      "Proven expertise",
      "ROI-focused approach",
      "Transparent reporting",
      "Customized strategies",
      "Innovation-driven execution",
      "High-touch communication",
    ],
    sections: [
      {
        title: "Our Services Include",
        description: "",
        items: [
          "Strategic planning aligned with business goals",
          "Execution using modern tools",
          "Continuous optimization",
          "Advanced analytics and tracking",
        ],
      },
    ],
    supportingMessage: {
      title: "WHY WORK WITH US?",
      description:
        "We combine strategy, execution, and data to drive measurable ROI and long-term growth.",
    },
    differentiators: {
      title: "WHAT SETS US APART",
      items: [
        "Proven expertise",
        "ROI-focused approach",
        "Transparent reporting",
        "Customized strategies",
        "Innovation-driven execution",
        "High-touch communication",
      ],
    },
    faqs: [
      {
        question: "What is this service?",
        answer:
          "This service improves performance, engagement, and conversions using structured strategies.",
      },
      {
        question: "Why is it important?",
        answer:
          "It ensures better ROI and long-term growth.",
      },
      {
        question: "How long to see results?",
        answer:
          "Initial results appear in weeks, full impact in months.",
      },
      {
        question: "Is it customizable?",
        answer:
          "Yes, tailored to your business goals.",
      },
      {
        question: "How is success measured?",
        answer:
          "Using KPIs like traffic, conversions, and ROI.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes, detailed performance reports are included.",
      },
    ],
  },
  {
    slug: "lifecycle-marketing",
    label: "Lifecycle Marketing Services",
    eyebrow: "Owned Media",
    title: "Lifecycle Marketing Services",
    summary:
      "Lifecycle Marketing Services at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    intro:
      "Lifecycle Marketing Services at SaaSntial focuses on delivering measurable growth through strategic execution, data-driven insights, and continuous optimization.",
    capabilities: [
      "Strategic planning aligned with business goals",
      "Execution using modern tools",
      "Continuous optimization",
      "Advanced analytics and tracking",
    ],
    outcomes: [
      "Proven expertise",
      "ROI-focused approach",
      "Transparent reporting",
      "Customized strategies",
      "Innovation-driven execution",
      "High-touch communication",
    ],
    sections: [
      {
        title: "Our Services Include",
        description: "",
        items: [
          "Strategic planning aligned with business goals",
          "Execution using modern tools",
          "Continuous optimization",
          "Advanced analytics and tracking",
        ],
      },
    ],
    supportingMessage: {
      title: "WHY WORK WITH US?",
      description:
        "We combine strategy, execution, and data to drive measurable ROI and long-term growth.",
    },
    differentiators: {
      title: "WHAT SETS US APART",
      items: [
        "Proven expertise",
        "ROI-focused approach",
        "Transparent reporting",
        "Customized strategies",
        "Innovation-driven execution",
        "High-touch communication",
      ],
    },
    faqs: [
      {
        question: "What is this service?",
        answer:
          "This service improves performance, engagement, and conversions using structured strategies.",
      },
      {
        question: "Why is it important?",
        answer:
          "It ensures better ROI and long-term growth.",
      },
      {
        question: "How long to see results?",
        answer:
          "Initial results appear in weeks, full impact in months.",
      },
      {
        question: "Is it customizable?",
        answer:
          "Yes, tailored to your business goals.",
      },
      {
        question: "How is success measured?",
        answer:
          "Using KPIs like traffic, conversions, and ROI.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes, detailed performance reports are included.",
      },
    ],
  },
  {
    slug: "seo",
    label: "SEO",
    eyebrow: "Earned Media",
    title: "Expert SEO Services That Drive Real Business Growth",
    summary:
      "At Sassntial, we deliver ROI-focused, data-driven SEO strategies designed to increase visibility, attract qualified traffic, and turn search intent into revenue.",
    intro:
      "Search is no longer just about rankings, it's about visibility across search, AI platforms, voice, and multimedia. As a growing digital partner, we combine innovation, AI-driven insights, and performance marketing to help businesses compete and scale in today's evolving search landscape.",
    capabilities: [
      "Local SEO",
      "Intent-Based Keyword Research",
      "High-Value Content Creation",
      "Technical SEO Audit",
    ],
    outcomes: [
      "Increase visibility and attract qualified traffic",
      "Turn search intent into revenue",
      "Build a scalable revenue engine from search",
    ],
    sections: [
      {
        title: "A Modern SEO Approach Built for Today's Search",
        description:
          "Search is no longer just about rankings, it's about visibility across search, AI platforms, voice, and multimedia. As a growing digital partner, we combine innovation, AI-driven insights, and performance marketing to help businesses compete and scale in today's evolving search landscape.",
      },
      {
        title: "Local SEO",
        description:
          "We help your business show up when it matters most. By optimizing your Google Business Profile, local listings, and NAP consistency, we ensure you capture high-intent \"near me\" searches and convert local traffic into customers.",
      },
      {
        title: "Intent-Based Keyword Research",
        description:
          "We go beyond search volume. Our team identifies high-intent keywords that align with your audience's needs, creating a clear roadmap that connects search intent with business outcomes.",
      },
      {
        title: "High-Value Content Creation",
        description:
          "Content is your growth engine. We create authoritative, E-E-A-T aligned content tailored to your industry-designed to build trust, rank higher, and convert visitors into leads.",
      },
      {
        title: "Technical SEO Audit",
        description:
          "We uncover and fix the technical barriers holding your site back. From Core Web Vitals to crawlability and site structure, we optimize your website for both search engines and AI-driven indexing.",
      },
      {
        title: "Competitor Analysis",
        description:
          "Understand where you stand-and how to win. We analyze your competitors to uncover keyword gaps, content opportunities, and ranking strategies that give you a competitive edge.",
      },
      {
        title: "Multimedia SEO",
        description:
          "Search is becoming visual and voice-driven. We optimize your videos, images, and audio content to help you capture traffic from modern search experiences.",
      },
      {
        title: "AI Search Visibility",
        description:
          "AI is changing how users discover brands. We optimize your presence for AI-generated results using structured data, entity mapping, and authority signals-helping your brand appear in next-gen search experiences.",
      },
      {
        title: "Analytics & Reporting",
        description:
          "Transparency drives performance. We track everything-from traffic to conversions-and provide clear, actionable insights so you always know what's working and where to scale.",
      },
    ],
    supportingMessage: {
      title: "Why Choose Sassntial for SEO",
      description:
        "At Sassntial, we take an agile and personalized approach to SEO, ensuring every strategy is tailored to your unique business needs, never a one-size-fits-all solution. Our AI-first execution keeps you ahead in the evolving search landscape, while our performance-driven mindset focuses on what truly matters: leads, revenue, and ROI. With transparent communication and clear reporting, you always know where your growth stands. More than just a service provider, we act as your growth partner in building long-term SEO engines that deliver measurable results, foster lasting relationships, and help your business scale sustainably.",
    },
    aboutSection: {
      title: "Your Partner in SEO Success",
      paragraphs: [
        "Sassntial is built for businesses that want more than just rankings-we deliver measurable growth, qualified traffic, and real ROI. Our approach combines AI-driven insights, data-backed strategies, and performance marketing expertise to help brands compete and win in today's evolving search landscape.",
        "We operate as an extension of your team, bringing agility, precision, and a deep focus on outcomes. Every strategy is tailored, continuously optimized, and aligned with your business goals. From technical SEO to content and AI visibility, we ensure every effort contributes directly to growth.",
        "Our mission is simple: turn search visibility into a scalable revenue engine. When you partner with Sassntial, you get a team that is proactive, accountable, and fully invested in your long-term success.",
      ],
      listGroups: [
        {
          title: "About Sassntial",
          items: [
            "Performance-driven SEO partner focused on growth and ROI",
            "Expertise in AI-first SEO and modern search strategies",
            "Proven execution across startups, SMEs, and scaling brands",
            "End-to-end capabilities: technical SEO, content, and analytics",
            "Transparent reporting with a focus on business outcomes",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "How long does SEO take to show results?",
        answer:
          "SEO is a long-term strategy. Typically, you can expect noticeable improvements within 3-6 months, depending on your industry and competition.",
      },
      {
        question: "How is Sassntial different from other SEO agencies?",
        answer:
          "We focus on AI-driven SEO, personalized strategies, and real business outcomes-not just rankings.",
      },
      {
        question: "Do you guarantee first-page rankings?",
        answer:
          "No ethical agency can guarantee rankings. What we guarantee is a data-driven strategy focused on growth and ROI.",
      },
      {
        question: "What tools do you use for SEO?",
        answer:
          "We use industry-leading tools like Google Analytics, Search Console, SEMrush, along with custom tracking systems to measure performance.",
      },
      {
        question: "Is SEO better than paid ads?",
        answer:
          "SEO and paid ads work best together. SEO builds long-term organic growth, while ads provide immediate visibility.",
      },
      {
        question: "Can SEO help small or new businesses?",
        answer:
          "Absolutely. SEO is one of the most effective ways for startups to build visibility, trust, and sustainable traffic without relying solely on paid channels.",
      },
    ],
  },
  {
    slug: "local-seo",
    label: "Local SEO",
    eyebrow: "Earned Media",
    title: "Own the Map & Dominate Local Search with Sassntial",
    summary:
      "Increase your local visibility, appear in top map results, and attract high-intent customers ready to take action.",
    intro:
      "Sassntial is a modern Local SEO partner focused on helping businesses grow their presence in specific geographic areas. We combine location-based optimization, search intent strategy, and AI-driven insights to ensure your business is visible across Google Maps, local search results, and voice search.",
    capabilities: [
      "Google Business Profile (GBP) Optimization",
      "Local Keyword Research & Strategy",
      "On-Page SEO for Local Landing Pages",
      "Local Citations & NAP Consistency",
    ],
    outcomes: [
      "Appear in top map results",
      "Attract high-intent local customers",
      "Turn local searches into real customers and consistent revenue",
    ],
    sections: [
      {
        title: "Local SEO Agency",
        description:
          "Sassntial is a modern Local SEO partner focused on helping businesses grow their presence in specific geographic areas. We combine location-based optimization, search intent strategy, and AI-driven insights to ensure your business is visible across Google Maps, local search results, and voice search.",
        items: [
          "Turn local searches into real customers and consistent revenue",
        ],
      },
      {
        title: "Google Business Profile (GBP) Optimization",
        description:
          "We create and optimize your Google Business Profile with accurate NAP details, compelling descriptions, images, and updates-ensuring your business appears in map packs and local results when customers are ready to convert.",
      },
      {
        title: "Local Keyword Research & Strategy",
        description:
          "We identify how your audience searches locally, including \"near me\" and location-specific queries, building a strategy that drives high-quality, conversion-focused traffic.",
      },
      {
        title: "On-Page SEO for Local Landing Pages",
        description:
          "We optimize your website pages with localized content, metadata, and structure-ensuring each page aligns with local intent and ranks higher in your target areas.",
      },
      {
        title: "Local Citations & NAP Consistency",
        description:
          "We build and manage your business listings across directories with consistent NAP information, improving credibility, trust, and local rankings.",
      },
      {
        title: "Local Link Building & Brand Authority",
        description:
          "We strengthen your online authority through high-quality backlinks and local brand mentions, helping your business gain trust and outperform competitors.",
      },
      {
        title: "Reviews & Reputation Optimization",
        description:
          "We help you generate and manage authentic customer reviews, boosting trust, visibility, and conversions-while also improving your presence in AI-driven recommendations.",
      },
      {
        title: "Local Content Marketing & Blogging",
        description:
          "We create targeted, high-quality content that connects with your local audience, improves rankings, and positions your brand as a trusted authority in your region.",
      },
      {
        title: "Local SEO Analytics & Reporting",
        description:
          "We provide clear, transparent reporting on rankings, traffic, and conversions-helping you understand performance and continuously improve your strategy.",
      },
    ],
    supportingMessage: {
      title: "Why Work With Sassntial for Local SEO?",
      description:
        "Unlike traditional agencies, Sassntial focuses on agility, personalization, and measurable results. We don't use generic templates-instead, we craft custom Local SEO strategies based on your business, location, and competition. With an AI-first approach and performance mindset, we ensure every action is aligned with generating leads and revenue, not just visibility.",
    },
    differentiators: {
      title: "What Sets Our Local SEO Services Apart?",
      items: [
        "Tailored Strategies for Every Business",
        "AI-Driven Local Optimization",
        "Data-Backed Decision Making",
        "Transparent Reporting & Insights",
        "Focused on Leads, Not Just Rankings",
      ],
    },
    aboutSection: {
      title: "About Sassntial - Your Local SEO Partner",
      paragraphs: [
        "Sassntial is a growing digital marketing partner focused on helping businesses succeed in local and AI-driven search environments.",
        "We specialize in building scalable Local SEO strategies that connect your business with the right audience at the right time. From keyword research to content and technical optimization, every step we take is designed to drive measurable growth and long-term success.",
        "If you're searching for \"local SEO services near me,\" Sassntial delivers solutions that are customized, performance-driven, and built to convert.",
      ],
    },
    faqs: [
      {
        question: "What is Local SEO and why is it important?",
        answer:
          "Local SEO helps your business appear in location-based searches, making it easier for nearby customers to find and contact you.",
      },
      {
        question: "How long does Local SEO take to show results?",
        answer:
          "Most businesses start seeing improvements within 2-4 months, depending on competition and current visibility.",
      },
      {
        question: "Do I need Local SEO if I already run ads?",
        answer:
          "Yes. Local SEO provides long-term organic visibility, while ads deliver short-term traffic. Both work best together.",
      },
      {
        question: "Can you optimize multiple locations?",
        answer:
          "Absolutely. We create and manage location-specific strategies for businesses with multiple branches.",
      },
      {
        question: "How do reviews impact Local SEO?",
        answer:
          "Positive reviews improve trust, rankings, and conversions, making them a key factor in local search success.",
      },
      {
        question: "How do you measure Local SEO success?",
        answer:
          "We track map rankings, website traffic, leads, calls, and conversions to measure real business impact.",
      },
    ],
    finalCta: {
      title: "Ready to Dominate Local Search?",
      description:
        "Let Sassntial help you turn local searches into consistent leads and revenue.",
      primaryLabel: "Request A Free Proposal",
    },
  },
  {
    slug: "ai-seo",
    label: "AI SEO",
    eyebrow: "Earned Media",
    title: "Gain Visibility in AI-Powered Search with Sassntial's AI SEO Services",
    summary:
      "Search is evolving rapidly with AI-driven experiences like generative search, voice assistants, and conversational queries. At Sassntial, we help your brand stay ahead by optimizing for AI-powered discovery, ensuring you appear not just in rankings-but directly in AI-generated answers, summaries, and recommendations.",
    intro:
      "Search is evolving rapidly with AI-driven experiences like generative search, voice assistants, and conversational queries. ",
    capabilities: [
      "GEO Optimization",
      "AEO & Conversational SEO",
      "AI Visibility Strategy",
      "Authority Signals & Entity SEO",
    ],
    outcomes: [
      "AI visibility, user intent, and conversion-driven outcomes",
      "Agile, transparent, and tailored execution",
      "Continuous optimization across search engines and AI platforms",
      "Stronger authority and more qualified traffic",
    ],
    sections: [
      {
        title: "Leading AI SEO Company",
        description:
          "Sassntial is a forward-thinking AI SEO partner focused on helping businesses adapt and thrive in the new era of search. Our approach blends Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), and traditional SEO fundamentals to ensure your brand is visible across Google, AI assistants, and emerging search platforms.",
        items: [
          "Increased visibility",
          "Stronger authority",
          "More qualified traffic that converts",
        ],
      },
      {
        title: "GEO Optimization",
        description:
          "We optimize your content to ensure it can be easily discovered, extracted, and cited by AI systems. Through structured data, semantic HTML, and GEO strategies, we improve your chances of appearing in featured snippets, AI summaries, and generative search results.",
      },
      {
        title: "AEO & Conversational SEO",
        description:
          "We align your content with how users actually search today-through questions, voice commands, and conversational queries. By implementing AEO strategies, we ensure your content is structured to provide direct, accurate answers that AI platforms prioritize.",
      },
      {
        title: "AI Visibility Strategy",
        description:
          "In AI search, generic content gets ignored. We position your brand as a trusted, unique source by refining your messaging, showcasing expertise, and building a strong digital footprint that AI systems recognize and prioritize.",
      },
      {
        title: "Authority Signals & Entity SEO",
        description:
          "We strengthen your brand's authority using E-E-A-T principles, entity mapping, schema markup, and semantic linking. This ensures your business is accurately represented in knowledge graphs and AI ecosystems, increasing trust and visibility.",
      },
    ],
    supportingMessage: {
      title: "Why Work With Sassntial Over Other AI SEO Agencies?",
      description:
        "Sassntial combines AI innovation with real-world SEO expertise to deliver strategies that actually perform. Unlike traditional agencies that focus only on rankings, we prioritize AI visibility, user intent, and conversion-driven outcomes. Our approach is agile, transparent, and tailored-ensuring your business stays ahead in a constantly evolving search landscape. We act as your growth partner, continuously optimizing your presence across search engines, AI platforms, and emerging discovery channels-so you don't just compete, you lead.",
    },
    differentiators: {
      title: "What Sets Our AI SEO Services Apart",
      items: [
        "AI visibility, user intent, and conversion-driven outcomes",
        "Agile, transparent, and tailored execution",
        "Continuous optimization across AI platforms",
        "Entity-based SEO and semantic search expertise",
      ],
    },
    aboutSection: {
      title: "About Our AI SEO Services",
      paragraphs: [
        "At Sassntial, we believe AI is a powerful enhancer-not a replacement-for effective SEO. Our approach combines advanced AI tools, data insights, and human expertise to deliver scalable and sustainable growth.",
        "But every decision is guided by strategy, creativity, and business understanding.",
        "Unlike traditional SEO, AI SEO ensures your brand is directly referenced in AI-generated answers, making you a trusted source in the eyes of both users and algorithms.",
        "This ensures your business is fully prepared for the future of search and discovery.",
      ],
      listGroups: [
        {
          title: "We use AI to:",
          items: [
            "Identify emerging search trends",
            "Predict content performance",
            "Optimize strategies at scale",
          ],
        },
        {
          title: "Our framework focuses on:",
          items: [
            "GEO (Generative Engine Optimization)",
            "AEO (Answer Engine Optimization)",
            "Entity-based SEO & semantic search",
            "Continuous optimization for AI platforms",
          ],
        },
      ],
    },
    faqs: [
      {
        question: "What is AI SEO?",
        answer:
          "AI SEO focuses on optimizing your content to appear in AI-generated results, voice search, and conversational queries, not just traditional rankings.",
      },
      {
        question: "What are GEO and AEO?",
        answer:
          "GEO (Generative Engine Optimization): Optimizing content for AI-generated search results. AEO (Answer Engine Optimization): Structuring content to directly answer user queries.",
      },
      {
        question: "How is AI SEO different from traditional SEO?",
        answer:
          "Traditional SEO focuses on rankings, while AI SEO focuses on being selected and cited by AI systems in answers and summaries.",
      },
      {
        question: "Can AI SEO improve my traffic?",
        answer:
          "Yes. AI SEO helps you capture high-intent traffic from modern search experiences, including voice and AI-driven platforms.",
      },
      {
        question: "How long does AI SEO take to show results?",
        answer:
          "Results typically start appearing within 2-5 months, depending on your industry and competition.",
      },
      {
        question: "Is AI SEO necessary for my business?",
        answer:
          "Yes. As search shifts toward AI, businesses that adapt early gain a major competitive advantage in visibility and authority.",
      },
    ],
    finalCta: {
      title: "Ready to Rank in AI Search Results?",
      description:
        "Let Sassntial help you build a future-ready SEO strategy that gets your brand featured, cited, and chosen.",
      primaryLabel: "Get Free AI SEO Audit",
      secondaryLabel: "Talk to an AI SEO Expert",
    },
  },
  {
    slug: "digital-pr",
    label: "Digital PR",
    eyebrow: "Earned Media",
    title: "Attract the Right Attention with SaaSntial's Digital PR Services",
    summary:
      "Build authority, credibility, and measurable brand visibility with our performance-driven Digital PR solutions.  At SaaSntial, we go beyond traditional press coverage by combining strategic storytelling, media outreach, and SEO-focused PR campaigns that generate real business outcomes.",
    intro:
      "Build authority, credibility, and measurable brand visibility with our performance-driven Digital PR solutions. At SaaSntial, we go beyond traditional press coverage by combining strategic storytelling, media outreach, and SEO-focused PR campaigns that generate real business outcomes. Every campaign is backed by actionable insights, helping you refine strategy, strengthen brand trust, and drive long-term visibility.",
    capabilities: [
      "PR-Led Link Building",
      "Data-Driven Media Campaigns",
      "Brand Mentions & Media Coverage",
      "Journalist & Media Outreach",
      "Influencer Outreach & Relationship Building",
      "Press Release Strategy & Distribution",
      "Executive Thought Leadership",
      "Industry-Specific PR Solutions",
    ],
    outcomes: [
      "Proven industry expertise",
      "ROI-focused campaign execution",
      "Transparent reporting & analytics",
      "Customized PR strategies",
      "High-touch communication model",
      "Innovation-led execution",
      "Expert-led media relationships",
    ],
    sections: [
      {
        title: "SaaSntial - A Trusted Digital PR Partner for Modern Brands",
        description:
          "SaaSntial helps brands earn meaningful media attention through data-led PR strategies that drive awareness, backlinks, and thought leadership. Our team blends digital marketing expertise with strategic public relations to ensure your brand gets noticed across top-tier publications, industry platforms, blogs, and social channels. From startups to enterprises, we create PR campaigns that deliver measurable growth.",
        items: [
          "Proven industry expertise",
          "ROI-focused campaign execution",
          "Transparent reporting & analytics",
        ],
      },
      {
        title: "PR-Led Link Building",
        description:
          "Strengthen your website authority with high-quality backlinks earned through strategic PR outreach. We create compelling content, connect with trusted publishers, and secure placements that enhance search rankings and drive referral traffic. Integrated with our AI SEO services, this becomes a powerful long-term growth strategy.",
      },
      {
        title: "Data-Driven Media Campaigns",
        description:
          "Every campaign is built on research, industry insights, and audience intelligence. We create impactful PR campaigns designed to capture media attention while delivering measurable reach, engagement, and brand visibility.",
      },
      {
        title: "Brand Mentions & Media Coverage",
        description:
          "Increase your brand presence across news outlets, blogs, industry platforms, and social media channels. Through our extensive network of media contacts and strategic outreach, we help your business earn meaningful mentions where your audience is already engaged.",
      },
      {
        title: "Journalist & Media Outreach",
        description:
          "We connect your brand with relevant journalists, editors, and industry writers to secure authoritative media placements. Our targeted outreach approach helps establish credibility and drive visibility through trusted publications.",
      },
      {
        title: "Influencer Outreach & Relationship Building",
        description:
          "Expand awareness through authentic influencer collaborations and strategic relationship building. We identify relevant voices in your industry to amplify your message and strengthen audience trust.",
      },
      {
        title: "Press Release Strategy & Distribution",
        description:
          "From product launches to company milestones, we create and distribute press releases that reach the right audience at the right time. Every release is strategically crafted to improve visibility, credibility, and brand perception.",
      },
      {
        title: "Executive Thought Leadership",
        description:
          "Position your leadership team as industry experts through high-impact thought leadership content, guest articles, interviews, and expert commentary placements that build authority and trust.",
      },
      {
        title: "Industry-Specific PR Solutions",
        description:
          "We deliver customized Digital PR strategies for SaaS, manufacturing, healthcare, pharmaceuticals, technology, and service-based industries, ensuring industry relevance and stronger media resonance.",
      },
    ],
    supportingMessage: {
      title: "Why Work with SaaSntial?",
      description:
        "At SaaSntial, we combine Digital PR, AI-powered SEO, content strategy, and performance marketing into one integrated growth framework. Our focus is not just media visibility-but measurable ROI, search authority, and brand reputation.",
    },
    differentiators: {
      title: "What Sets Our Digital PR Services Apart",
      items: [
        "Proven industry expertise",
        "ROI-focused campaign execution",
        "Transparent reporting & analytics",
        "Customized PR strategies",
        "High-touch communication model",
        "Innovation-led execution",
        "Expert-led media relationships",
      ],
    },
    aboutSection: {
      title: "About SaaSntial",
      paragraphs: [
        "SaaSntial is a future-focused digital growth partner specializing in AI-powered marketing, Digital PR, SEO, and professional training solutions. We help businesses build authority, generate visibility, and accelerate growth through data-driven strategies and innovative execution.",
        "Our integrated approach combines PR, SEO, social media, and content marketing into one cohesive strategy that drives measurable business impact.",
      ],
    },
    faqs: [
      {
        question: "What is Digital PR and how does it benefit my business?",
        answer:
          "Digital PR is a strategy that combines public relations with digital marketing to increase brand visibility, earn high-quality backlinks, and improve search engine rankings. It helps businesses build credibility, drive organic traffic, and gain media exposure across online platforms.",
      },
      {
        question: "How does Digital PR improve SEO rankings?",
        answer:
          "Digital PR improves SEO by earning authoritative backlinks, increasing brand mentions, and enhancing domain authority. These signals help search engines recognize your website as trustworthy, leading to higher rankings and better visibility.",
      },
      {
        question: "What is the difference between traditional PR and Digital PR?",
        answer:
          "Traditional PR focuses on offline media like print and TV, while Digital PR targets online publications, blogs, and influencers. Digital PR also provides measurable results such as traffic, backlinks, and engagement metrics.",
      },
      {
        question: "How long does it take to see results from Digital PR?",
        answer:
          "Digital PR typically starts showing results within a few weeks to a few months, depending on campaign strategy, industry competition, and outreach efforts. Long-term benefits include sustained traffic and improved search authority.",
      },
      {
        question: "What industries can benefit from Digital PR services?",
        answer:
          "Digital PR is effective across industries including SaaS, healthcare, manufacturing, finance, eCommerce, and technology. Any business looking to build brand authority and online visibility can benefit from Digital PR.",
      },
      {
        question: "How do you measure the success of Digital PR campaigns?",
        answer:
          "Success is measured through key metrics such as backlinks earned, media coverage, referral traffic, keyword rankings, brand mentions, and overall ROI. At SaaSntial, we provide transparent reporting with actionable insights.",
      },
    ],
  },
  {
    slug: "social-media-management",
    label: "Social Media Management",
    eyebrow: "Earned Media",
    title: "Social Media Management Services That Drive Real Engagement",
    summary:
      "Connect with the right audience, at the right time, with SaaSntial's data-driven social media management services. We create tailored strategies that go beyond posting-focusing on engagement, brand building, and measurable business growth across all major platforms.",
    intro:
      "At SaaSntial, we combine creativity, data, and AI-powered insights to deliver high-impact social media strategies. Our team helps brands build a strong digital presence, increase engagement, and drive conversions through a mix of organic content, paid campaigns, and influencer collaborations. Whether you're a startup or an enterprise, we ensure your brand stands out in a crowded social landscape.",
    capabilities: [
      "Multi-platform social strategy",
      "Content planning and calendar management",
      "Paid social campaign management",
      "Influencer and UGC integration",
      "Community engagement and management",
      "Creative design and visual content",
      "Social listening and audience insights",
      "Performance tracking and reporting",
    ],
    outcomes: [
      "Data-driven targeting and audience insights",
      "Strong expertise across industries",
      "Integrated organic and paid strategies",
      "Proven track record of performance",
      "Clear and actionable reporting",
      "Dedicated account management",
      "Transparent communication and collaboration",
    ],
    sections: [
      {
        title: "SaaSntial - Your Strategic Social Media Growth Partner",
        description:
          "At SaaSntial, we combine creativity, data, and AI-powered insights to deliver high-impact social media strategies. Our team helps brands build a strong digital presence, increase engagement, and drive conversions through a mix of organic content, paid campaigns, and influencer collaborations. Whether you're a startup or an enterprise, we ensure your brand stands out in a crowded social landscape.",
        items: [
          "Data-driven targeting and audience insights",
          "Integrated organic and paid strategies",
          "Clear and actionable reporting",
        ],
      },
      {
        title: "Multi-platform social strategy",
        description:
          "We design platform-specific strategies across channels like Facebook, Instagram, LinkedIn, X, and more, ensuring your brand reaches the right audience with consistent and impactful messaging.",
      },
      {
        title: "Content planning and calendar management",
        description:
          "Our structured content calendars support consistent posting with high-quality, engaging content that keeps your brand top-of-mind and encourages continuous audience interaction.",
      },
      {
        title: "Paid social campaign management",
        description:
          "We create and manage highly targeted ad campaigns optimized for performance, from audience targeting to creative optimization, with a focus on ROI and scalable results.",
      },
      {
        title: "Influencer and UGC integration",
        description:
          "We connect your brand with relevant creators and user-generated content opportunities to build trust, expand reach, and strengthen authenticity.",
      },
      {
        title: "Community engagement and management",
        description:
          "We actively manage your social presence by responding to comments, messages, and interactions so you can build stronger relationships and improve customer trust.",
      },
      {
        title: "Creative design and visual content",
        description:
          "Our team develops visually compelling creatives, including graphics, infographics, and short-form content designed to capture attention and strengthen brand storytelling.",
      },
      {
        title: "Social listening and audience insights",
        description:
          "We monitor audience behavior, trends, and conversations to refine strategy and keep your campaigns relevant, timely, and effective.",
      },
      {
        title: "Performance tracking and reporting",
        description:
          "We provide transparent, data-driven reporting across engagement, reach, conversions, and ROI so marketing decisions stay grounded in measurable performance.",
      },
      {
        title: "What sets our social media services apart",
        description:
          "SaaSntial delivers a holistic approach to social media marketing-combining strategy, creativity, and performance marketing to drive real business outcomes. Our focus is on building long-term brand value while delivering measurable results.",
        items: [
          "Data-driven targeting and audience insights",
          "Strong expertise across industries",
          "Integrated organic and paid strategies",
          "Proven track record of performance",
          "Clear and actionable reporting",
          "Dedicated account management",
          "Transparent communication and collaboration",
        ],
      },
    ],
    supportingMessage: {
      title: "Why Work with SaaSntial?",
      description:
        "SaaSntial delivers a holistic approach to social media marketing-combining strategy, creativity, and performance marketing to drive real business outcomes. Our focus is on building long-term brand value while delivering measurable results.",
    },
    differentiators: {
      title: "What Sets Our Social Media Services Apart",
      items: [
        "Data-driven targeting and audience insights",
        "Strong expertise across industries",
        "Integrated organic and paid strategies",
        "Proven track record of performance",
        "Clear and actionable reporting",
        "Dedicated account management",
        "Transparent communication and collaboration",
      ],
    },
    aboutSection: {
      title: "About SaaSntial",
      paragraphs: [
        "SaaSntial is a modern digital growth company specializing in AI-powered marketing, SEO, Digital PR, and social media management. We help brands scale their digital presence through innovative strategies, advanced tools, and performance-driven execution.",
        "Our approach integrates social media with SEO, content marketing, and digital PR to create a unified growth ecosystem that delivers consistent and measurable results.",
      ],
    },
    faqs: [
      {
        question: "What does social media management include?",
        answer:
          "Social media management includes strategy development, content creation, posting, engagement, paid advertising, and performance tracking across platforms.",
      },
      {
        question: "Which social media platforms should my business focus on?",
        answer:
          "It depends on your target audience and industry. We help identify the right platforms such as Instagram, LinkedIn, Facebook, or others based on your business goals.",
      },
      {
        question: "How often should I post on social media?",
        answer:
          "Consistency is key. Most businesses benefit from posting several times per week, supported by a structured content calendar.",
      },
      {
        question: "Do you manage paid social media campaigns?",
        answer:
          "Yes, we create, manage, and optimize paid campaigns to ensure maximum reach, engagement, and ROI.",
      },
      {
        question: "How do you measure social media success?",
        answer:
          "We track metrics like engagement rate, reach, impressions, conversions, and ROI to evaluate campaign performance.",
      },
      {
        question: "Can social media marketing generate leads and sales?",
        answer:
          "Absolutely. With the right strategy, targeting, and content, social media can become a powerful channel for lead generation and revenue growth.",
      },
    ],
  },
  createServiceDetailPage({
    slug: "ppc",
    label: "PPC",
    eyebrow: "Paid Media",
    summary:
      "Paid search program planning and optimization designed around efficiency, intent, and measurable pipeline impact.",
    intro:
      "We help teams structure paid search accounts and reporting loops so campaign decisions are faster, clearer, and tied to business outcomes.",
    capabilities: [
      "Account structure and keyword strategy",
      "Landing page and offer alignment",
      "Bid, budget, and reporting optimization",
    ],
    outcomes: [
      "Clearer paid search decision-making",
      "Better coordination between ads and landing experiences",
      "More useful performance reporting",
    ],
  }),
  createServiceDetailPage({
    slug: "paid-social-advertising",
    label: "Paid Social Advertising",
    eyebrow: "Paid Media",
    summary:
      "Audience, message, and creative planning for social ad programs across launch and demand-generation campaigns.",
    intro:
      "We build paid social systems that connect targeting, creative, and campaign structure into more intentional acquisition programs.",
    capabilities: [
      "Audience and offer planning",
      "Creative testing structures",
      "Campaign optimization and reporting",
    ],
    outcomes: [
      "More disciplined paid social testing",
      "Better creative-to-audience alignment",
      "Stronger visibility into paid social performance",
    ],
  }),
  createServiceDetailPage({
    slug: "display-advertising",
    label: "Display Advertising",
    eyebrow: "Paid Media",
    summary:
      "Display programs focused on awareness, retargeting, and message reinforcement across the buying journey.",
    intro:
      "We plan display programs with clearer segmentation, creative roles, and reporting frameworks so awareness efforts stay useful.",
    capabilities: [
      "Awareness and retargeting strategy",
      "Creative variant planning",
      "Placement review and reporting",
    ],
    outcomes: [
      "Clearer role for display within the mix",
      "Better message reinforcement across channels",
      "More accountable awareness programs",
    ],
  }),
  createServiceDetailPage({
    slug: "influencer-marketing",
    label: "Influencer Marketing",
    eyebrow: "Paid Media",
    summary:
      "Partner and creator programs designed to support reach, credibility, and campaign storytelling.",
    intro:
      "We help teams structure influencer initiatives with clearer partner selection, campaign goals, and content expectations.",
    capabilities: [
      "Creator fit and partnership planning",
      "Campaign brief and asset coordination",
      "Performance review and follow-up planning",
    ],
    outcomes: [
      "More structured creator collaborations",
      "Better campaign coherence across paid and partner content",
      "Clearer measurement for influencer initiatives",
    ],
  }),
]

export const serviceItems: ServiceItem[] = [
  {
    slug: "branding",
    label: "Branding",
    eyebrow: "",
    title: "Build a brand system teams can scale with confidence.",
    summary:"",
    intro:
      "We shape brand foundations that help product, sales, and leadership teams communicate with one voice across every launch moment.",
    capabilities: [
      "",
      "Visual direction and identity systems",
      "Launch kits for internal and external teams",
    ],
    outcomes: [
      "",
      "",
      "Consistent brand decisions from strategy to execution",
    ],
    sections: [
      {
        title: "Branding is more than visuals - it is our voice.",
        description:
          "We craft brands, products, websites, and growth programs with strategy, design, and technology.",
        items: [
          "Logo design and brand guidelines",
          "Graphic design",
          "Diagrams and infographics",
          "Motion graphics and animations",
          "Mockups",
          "Editing and VFX",
        ],
        imageAlt: "Branding workshop and identity sketches",
        imageUrl: svgDataUri(brandingSection01Svg),
      },
      {
        title: "Graphic Design",
        description:
          "Design human-centered interfaces across platforms that are clear, elegant, and delightful.",
        items: [
          "UI and UX design",
          "Website design",
          "Mobile experience",
          "Commerce experience",
          "Human-machine interface",
        ],
        imageAlt: "Graphic design process with printed materials",
        imageUrl: svgDataUri(brandingSection02Svg),
      },
    ],
  },
  {
    slug: "experience-design",
    label: "Experience Design",
    eyebrow: "UX Strategy",
    title: "Design journeys that feel clear, useful, and conversion-ready.",
    summary:
      "Service blueprints, interface systems, and customer flows designed around actual business goals.",
    intro:
      "From discovery to interface refinement, we focus on experiences that reduce friction for customers and internal operators alike.",
    capabilities: [
      "Customer journey mapping and service flows",
      "Wireframes, UI systems, and component patterns",
      "Conversion-focused landing and campaign design",
    ],
    outcomes: [
      "More coherent digital touchpoints",
      "Better handoff between design and development",
      "Fewer usability blockers in launch cycles",
    ],
    sections: [
      {
        title: "Design journeys that feel clear, useful, and conversion-ready.",
        description:
          "We plan the path from discovery to action with structured flows, clear moments of intent, and reusable UX patterns.",
        items: [
          "Customer journey mapping and service flows",
          "Wireframes, UI systems, and component patterns",
          "Conversion-focused landing and campaign design",
          "Usability refinement and friction removal",
        ],
        imageAlt: "Experience design journey mapping",
        imageUrl: svgDataUri(experienceSection01Svg),
      },
      {
        title: "Interface systems that scale with your product.",
        description:
          "Create consistent components and interaction rules so teams can ship faster without losing quality.",
        items: [
          "Design system foundations",
          "Component libraries and tokens",
          "Prototyping and interaction specs",
          "Handoff and documentation",
        ],
        imageAlt: "Interface system components",
        imageUrl: svgDataUri(experienceSection02Svg),
      },
    ],
  },
  {
    slug: "technologies",
    label: "Technologies",
    eyebrow: "Platform Enablement",
    title: "Connect the tools, workflows, and systems behind delivery.",
    summary:
      "Technical planning, integration support, and platform guidance that make launches more reliable.",
    intro:
      "We align storefront, content, and operational tools so the product experience is supported by stable, maintainable delivery systems.",
    capabilities: [
      "Implementation planning and solution mapping",
      "Platform audits and integration guidance",
      "Frontend refinement for content and commerce teams",
    ],
    outcomes: [
      "Cleaner technical decision-making",
      "Reduced launch risk across environments",
      "Better alignment between business goals and platform setup",
    ],
    sections: [
      {
        title: "Connect the tools, workflows, and systems behind delivery.",
        description:
          "We align storefront, content, and operational tools so the product experience is supported by stable, maintainable delivery systems.",
        items: [
          "Implementation planning and solution mapping",
          "Platform audits and integration guidance",
          "Frontend refinement for content and commerce teams",
          "Deployment readiness and QA checks",
        ],
        imageAlt: "Platform enablement planning",
        imageUrl: svgDataUri(technologiesSection01Svg),
      },
      {
        title: "Integration plans that keep launches predictable.",
        description:
          "Structure data flows, environments, and delivery checklists so teams can ship confidently.",
        items: [
          "Data flow and API design reviews",
          "Infrastructure alignment and environment strategy",
          "Performance checks and observability setup",
          "Documentation and runbooks",
        ],
        imageAlt: "Integration planning systems",
        imageUrl: svgDataUri(technologiesSection02Svg),
      },
    ],
  },
  {
    slug: "marketing",
    label: "Marketing",
    eyebrow: "Growth Programs",
    title: "Turn launches into structured demand-generation programs.",
    summary:
      "Campaign planning, content systems, and measurement models built for sustained traction.",
    intro:
      "We create the planning and content structure needed to carry a launch forward into repeatable marketing execution.",
    capabilities: [
      "Campaign architecture and go-to-market planning",
      "Content systems for sales and demand teams",
      "Performance reporting and optimization loops",
    ],
    outcomes: [
      "More focused launch communication",
      "Stronger coordination between teams and channels",
      "Clearer reporting on impact and next actions",
    ],
    sections: [
      {
        title: "Turn launches into structured demand-generation programs.",
        description:
          "We build the campaign architecture and content systems needed to sustain momentum after launch.",
        items: [
          "Campaign planning and go-to-market sequencing",
          "Content systems for sales and demand teams",
          "Audience segmentation and messaging",
          "Launch readiness checklists",
        ],
        imageAlt: "Launch program planning",
        imageUrl: svgDataUri(marketingSection01Svg),
      },
      {
        title: "Measurement loops that keep growth accountable.",
        description:
          "Set up reporting and optimization routines so teams see what is working and what needs adjustment.",
        items: [
          "Performance reporting dashboards",
          "Channel health monitoring",
          "Experiment tracking and optimization",
          "Insights summaries for leadership",
        ],
        imageAlt: "Marketing performance reporting",
        imageUrl: svgDataUri(marketingSection02Svg),
      },
    ],
  },
  ...menuServiceItems,
]

export const getServiceBySlug = (slug: string) =>
  serviceItems.find((service) => service.slug === slug)
