import { companyItems } from "@modules/company/constants/company-items"

export type MenuLink = {
  label: string
  href: string
}

export type MegaMenuIcon = "users" | "storefront" | "globe"
  | "chart"
  | "newspaper"
  | "rocket"
  | "book"
  | "lightbulb"

export type MegaMenuGroup = {
  label: string
  icon: MegaMenuIcon
  items: MenuLink[]
}

export type MegaMenuMediaImage = {
  src: string
  alt: string
  className: string
}

export type MegaMenuMedia = {
  eyebrow?: string
  title?: string
  subtitle?: string
  images: MegaMenuMediaImage[]
}

export type MegaMenu = {
  label?: string
  groups: MegaMenuGroup[]
  media?: MegaMenuMedia
}

export type MenuItem = {
  label: string
  href: string
  children?: MenuLink[]
  megaMenu?: MegaMenu
}

const blogItem = companyItems.find((item) => item.slug === "blog")

const freeResourceImages: MegaMenuMediaImage[] = [
  {
    src: blogItem?.blogPosts?.[0]?.imageUrl ?? "/branding-section-01.svg",
    alt: blogItem?.blogPosts?.[0]?.title ?? "Free resources cover one",
    className:
      "absolute left-0 top-16 w-32 -rotate-6 shadow-[0_18px_30px_rgba(1,15,24,0.28)]",
  },
  {
    src: blogItem?.blogPosts?.[1]?.imageUrl ?? "/branding-section-02.svg",
    alt: blogItem?.blogPosts?.[1]?.title ?? "Free resources cover two",
    className:
      "absolute left-20 top-0 w-44 shadow-[0_18px_30px_rgba(1,15,24,0.28)]",
  },
  {
    src: blogItem?.blogPosts?.[2]?.imageUrl ?? "/branding-section-01.svg",
    alt: blogItem?.blogPosts?.[2]?.title ?? "Free resources cover three",
    className:
      "absolute right-0 top-16 w-32 rotate-6 shadow-[0_18px_30px_rgba(1,15,24,0.28)]",
  },
]

export const primaryMenuItems: MenuItem[] = [
  {
    label: "Training",
    href: "/training",
    megaMenu: {
      label: "Training",
      groups: [
        {
          label: "Featured Programs",
          icon: "book",
          items: [
            { label: "AI Bots Automation", href: "/training" },
            { label: "Maintenance & Reliability Masterclass", href: "/training" },
            { label: "SMRP 5 Pillars", href: "/training" },
            { label: "Industry-Specific Programs", href: "/training" },
          ],
        },
        {
          label: "Delivery Formats",
          icon: "lightbulb",
          items: [
            { label: "Live Workshops", href: "/training" },
            { label: "Webinars", href: "/training" },
            { label: "On-Demand Learning", href: "/training" },
            { label: "Custom Training", href: "/training" },
          ],
        },
        {
          label: "Next Steps",
          icon: "rocket",
          items: [
            { label: "Browse Catalog", href: "/training" },
            { label: "Request a Session", href: "/company/contact-us" },
            { label: "Talk to the Team", href: "/company/contact-us" },
          ],
        },
      ],
    },
  },
  {
    label: "Who We Serve",
    href: "/who-we-serve",
    megaMenu: {
      label: "Who We Serve",
      groups: [
        {
          label: "Business Types",
          icon: "users",
          items: [
            { label: "Multi-Location Businesses", href: "/who-we-serve/multi-location-businesses" },
            { label: "B2B Marketing", href: "/who-we-serve/b2b-marketing" },
            { label: "Ecommerce", href: "/who-we-serve/ecommerce" },
            { label: "Lead Generation", href: "/who-we-serve/lead-generation" },
          ],
        },
        {
          label: "Franchise Businesses",
          icon: "storefront",
          items: [
            { label: "Franchise Marketing", href: "/who-we-serve/franchise-marketing" },
            { label: "Franchise Development", href: "/who-we-serve/franchise-development" },
            { label: "National to Local", href: "/who-we-serve/national-to-local" },
            { label: "Franchise SEO", href: "/who-we-serve/franchise-seo" },
            { label: "Franchise Paid Media", href: "/who-we-serve/franchise-paid-media" },
            { label: "Franchise Social Media", href: "/who-we-serve/franchise-social-media" },
            { label: "Franchise Email Marketing", href: "/who-we-serve/franchise-email-marketing" },
            { label: "Franchise Web Dev", href: "/who-we-serve/franchise-web-dev" },
          ],
        },
        {
          label: "Industries",
          icon: "globe",
          items: [
            { label: "Automotive Services", href: "/who-we-serve/automotive-services" },
            { label: "Dental Practices", href: "/who-we-serve/dental-practices" },
            { label: "Financial Services", href: "/who-we-serve/financial-services" },
            { label: "Home Services", href: "/who-we-serve/home-services" },
            { label: "Healthcare Practices", href: "/who-we-serve/healthcare-practices" },
            { label: "View More Industries", href: "/who-we-serve/industries" },
          ],
        },
      ],
    },
  },
  {
    label: "Services",
    href: "/services",
    megaMenu: {
      label: "Services",
      groups: [
        {
          label: "Owned Media",
          icon: "chart",
          items: [
            { label: "Content Marketing", href: "/services/content-marketing" },
            { label: "Conversion Rate Optimization", href: "/services/conversion-rate-optimization" },
            { label: "Creative & Branding", href: "/services/creative-branding" },
            { label: "Website Development", href: "/services/website-development" },
            { label: "Reporting & Data Analytics", href: "/services/reporting-data-analytics" },
            { label: "Email & SMS Marketing", href: "/services/email-sms-marketing" },
            { label: "Lifecycle Marketing", href: "/services/lifecycle-marketing" },
          ],
        },
        {
          label: "Earned Media",
          icon: "newspaper",
          items: [
            { label: "SEO", href: "/services/seo" },
            { label: "Local SEO", href: "/services/local-seo" },
            { label: "AI SEO", href: "/services/ai-seo" },
            { label: "Digital PR", href: "/services/digital-pr" },
            { label: "Social Media Management", href: "/services/social-media-management" },
          ],
        },
        {
          label: "Paid Media",
          icon: "rocket",
          items: [
            { label: "PPC", href: "/services/ppc" },
            { label: "Paid Social Advertising", href: "/services/paid-social-advertising" },
            { label: "Display Advertising", href: "/services/display-advertising" },
            { label: "Influencer Marketing", href: "/services/influencer-marketing" },
          ],
        },
      ],
    },
  },
  {
    label: "About Us",
    href: "/company",
    megaMenu: {
      label: "About Us",
      groups: [
        {
          label: "About Ignite",
          icon: "lightbulb",
          items: [
            { label: "Our Story", href: "/company/our-story" },
            { label: "Our Values", href: "/company/our-values" },
            { label: "Our Team", href: "/company/our-team" },
            { label: "Clients", href: "/company/clients" },
            { label: "Diversity & Inclusion", href: "/company/diversity-inclusion" },
          ],
        },
        {
          label: "Hire Us",
          icon: "users",
          items: [
            { label: "Contact Us - Get Started", href: "/company/contact-us" },
            { label: "Our Awards", href: "/company/our-awards" },
            { label: "Our Clients", href: "/company/clients" },
            { label: "Case Studies", href: "/company/blog" },
            { label: "Request Free Audit", href: "/company/contact-us" },
          ],
        },
        {
          label: "Join Our Team",
          icon: "storefront",
          items: [
            { label: "Become a Referral Partner", href: "/company/referral-partner" },
            { label: "Career Opportunities", href: "/company/careers" },
            { label: "Hiring Notice", href: "/company/hiring-notice" },
          ],
        },
      ],
    },
  },
  {
    label: "AI",
    href: "/company/ai-opportunity-discovery",
    megaMenu: {
      label: "AI",
      groups: [
        {
          label: "AI Strategy",
          icon: "lightbulb",
          items: [
            {
              label: "AI Opportunity Discovery",
              href: "/company/ai-opportunity-discovery",
            },
            {
              label: "Industry Specific AI Solution",
              href: "/company/industry-specific-ai-solution",
            },
            {
              label: "AI Optimization and Continuous Improvement",
              href: "/company/ai-optimization-continuous-improvement",
            },
          ],
        },
        {
          label: "AI Delivery",
          icon: "rocket",
          items: [
            {
              label: "Custom AI Agent Development",
              href: "/company/custom-ai-agent-development",
            },
            {
              label: "Workflow Automation and Integration",
              href: "/company/workflow-automation-integration",
            },
            {
              label: "AI Infrastructure and Deployment",
              href: "/company/ai-infrastructure-deployment",
            },
          ],
        },
      ],
    },
  },
  {
    label: "Free Resources",
    href: "/resources",
    megaMenu: {
      label: "Free Resources",
      groups: [
        {
          label: "Free Resources",
          icon: "book",
          items: [
            { label: "Our Blog", href: "/company/blog" },
            { label: "YouTube Channel", href: "/resources/webinars" },
            { label: "Marketing Resources", href: "/resources/whitepaper" },
            { label: "Franchise Marketing Resources", href: "/resources/whitepaper" },
            { label: "Attend Our Next Webinar", href: "/resources/webinars" },
          ],
        },
      ],
      media: {
        eyebrow: "Insights from the team",
        title: "Free resources",
        subtitle: "Articles, webinars, and planning guides for teams that want to move faster.",
        images: freeResourceImages,
      },
    },
  },
]

export const utilityMenuItems: MenuItem[] = [
  {
    label: "Account",
    href: "/account",
  },
  {
    label: "Cart",
    href: "/cart",
  },
]

export const ctaMenuItem: MenuItem = {
  label: "Get Started",
  href: "/company/contact-us",
}
