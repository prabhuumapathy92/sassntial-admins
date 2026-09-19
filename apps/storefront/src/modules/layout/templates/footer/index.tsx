import BrandMark from "@modules/layout/components/brand-mark"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const footerServices = [
  { label: "SEO", href: "/services/seo" },
  { label: "Local SEO", href: "/services/local-seo" },
  { label: "AI SEO", href: "/services/ai-seo" },
  { label: "Paid Media", href: "/services/paid-social-advertising" },
  { label: "Social Media Marketing", href: "/services/social-media-management" },
  { label: "Email Marketing", href: "/services/email-sms-marketing" },
  { label: "Conversion Rate Optimization", href: "/services/conversion-rate-optimization" },
  { label: "Website Design & Development", href: "/services/website-development" },
  { label: "Digital PR", href: "/services/digital-pr" },
  { label: "Analytics & Attribution", href: "/services/reporting-data-analytics" },
]

const footerIndustries = [
  { label: "Consumer Franchise Marketing", href: "/who-we-serve/franchise-marketing" },
  { label: "Franchise Development", href: "/who-we-serve/franchise-development" },
  { label: "Multi Location", href: "/who-we-serve/multi-location-businesses" },
  { label: "ECommerce", href: "/who-we-serve/ecommerce" },
  { label: "B2B", href: "/who-we-serve/b2b-marketing" },
  { label: "Healthcare & Medical", href: "/who-we-serve/healthcare-practices" },
  { label: "Home Services", href: "/who-we-serve/home-services" },
  { label: "Financial Services", href: "/who-we-serve/financial-services" },
  { label: "View More Industries", href: "/who-we-serve/industries" },
]

const footerResources = [
  { label: "About Us", href: "/company/our-story" },
  { label: "Our Team", href: "/company/our-team" },
  { label: "Awards", href: "/company/our-awards" },
  { label: "Clients", href: "/company/clients" },
  { label: "Case Studies", href: "/company/blog" },
  { label: "Blog", href: "/company/blog" },
  { label: "Whitepaper", href: "/resources/whitepaper" },
  { label: "Blogs", href: "/resources/blogs" },
  { label: "Webinars", href: "/resources/webinars" },
  { label: "Contact Us", href: "/company/contact-us" },
  { label: "Marketing Resources", href: "/resources/whitepaper" },
  { label: "Franchise Marketing Resources", href: "/resources/whitepaper" },
]

const locations = [
  {
    city: "San Diego",
    address: "4370 La Jolla Village Drive Suite 320, San Diego, California 92122",
  },
  {
    city: "Irvine",
    address: "7700 Irvine Center Drive Suite 430, Irvine, CA 92618",
  },
  {
    city: "Orlando",
    address: "100 East Pine St, Orlando, FL 32801",
  },
  {
    city: "New York",
    address: "14 Wall Street, 20th Floor New York, NY 10005",
  },
]

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M6.94 6.5A1.94 1.94 0 1 1 3.06 6.5a1.94 1.94 0 0 1 3.88 0ZM3.4 8.75h3.08V20.6H3.4V8.75Zm5.1 0h2.95v1.62h.04c.41-.77 1.42-1.58 2.92-1.58 3.12 0 3.7 2.05 3.7 4.71v7.1h-3.08v-6.3c0-1.5-.02-3.43-2.09-3.43-2.1 0-2.42 1.64-2.42 3.32v6.41H8.5V8.75Z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.6-1.5h1.7V5a23 23 0 0 0-2.5-.1c-2.5 0-4.1 1.5-4.1 4.3V11H8v3h2.2v8h3.3Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26.7 26.7 0 0 0 2 12a26.7 26.7 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26.7 26.7 0 0 0 22 12a26.7 26.7 0 0 0-.4-4.8ZM10 15.2V8.8l5.6 3.2-5.6 3.2Z" />
      </svg>
    ),
  },
]

const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string
  links: Array<{ label: string; href: string }>
}) => {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
        {title}
      </h3>
      <ul className="mt-5 space-y-2.5">
        {links.map((link, index) => (
          <li key={`${title}-${link.label}-${index}`}>
            <LocalizedClientLink
              href={link.href}
              className="text-[0.95rem] leading-6 text-white/82 transition-colors duration-200 hover:text-[#f8c86f]"
            >
              {link.label}
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

const SocialButton = ({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: React.ReactNode
}) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white transition-colors duration-200 hover:bg-white/12 hover:text-[#f8c86f]"
      target="_blank"
      rel="noreferrer"
    >
      {icon}
    </a>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#173141] text-white">
      <div className="content-container py-12 sm:py-16">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_320px]">
          <FooterLinkColumn title="Services" links={footerServices} />
          <FooterLinkColumn title="Industries" links={footerIndustries} />
          <FooterLinkColumn title="Resources" links={footerResources} />

          <div className="flex flex-col items-start gap-6 xl:items-center">
            <LocalizedClientLink href="/" className="inline-flex items-center">
              <BrandMark variant="light" className="scale-[0.92] origin-left xl:origin-center" />
            </LocalizedClientLink>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <SocialButton
                  key={social.label}
                  href={social.href}
                  label={social.label}
                  icon={social.icon}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <LocalizedClientLink
                href="/company/contact-us"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#f3c04f] to-[#e07b4c] px-5 text-[0.88rem] font-bold uppercase tracking-[0.08em] text-white shadow-[0_14px_30px_rgba(224,123,76,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Request a Free Proposal
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/resources"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#f0b94f] to-[#d96f46] px-5 text-[0.88rem] font-bold uppercase tracking-[0.08em] text-white shadow-[0_14px_30px_rgba(224,123,76,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Join the Newsletter
              </LocalizedClientLink>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-10">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {locations.map((location) => (
              <div key={location.city} className="text-center xl:text-left">
                <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-white">
                  {location.city}
                </h4>
                <p className="mx-auto mt-4 max-w-[220px] text-[0.92rem] leading-7 text-white/78 xl:mx-0">
                  {location.address}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-center">
          <a
            href="tel:6197521955"
            className="text-xl font-black tracking-[0.04em] text-white transition-colors duration-200 hover:text-[#f8c86f]"
          >
            (619) 752-1955
          </a>
          <p className="text-sm font-medium text-white/72">
            © {currentYear} Ignite Visibility. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/50">
            <LocalizedClientLink
              href="/content/privacy-policy"
              className="transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </LocalizedClientLink>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <LocalizedClientLink
              href="/content/terms-of-use"
              className="transition-colors duration-200 hover:text-white"
            >
              Terms of Service
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
