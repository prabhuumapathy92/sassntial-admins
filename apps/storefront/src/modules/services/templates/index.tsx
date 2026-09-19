import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { serviceItems } from "@modules/services/constants/service-items"

const ServicesTemplate = () => {
  return (
    <div className="content-container pt-3 pb-10 small:pt-4 small:pb-12">
      <section className="overflow-hidden bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
        <div className="grid large:grid-cols-[1.08fr_0.92fr]">
          <div className="px-6 py-7 small:px-10 small:py-10">
            <p className="text-small-regular uppercase tracking-[0.24em] text-ui-fg-subtle">
              Services
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl-semi text-ui-fg-base">
              Service areas built to support the full training experience.
            </h1>
            <p className="mt-4 max-w-2xl text-base-regular text-ui-fg-subtle">
              Strategy, design, technology, and marketing work together here so
              launches feel clearer, tighter, and easier to scale.
            </p>

            <div className="mt-7 grid gap-3 small:grid-cols-3">
              <div className="rounded-[22px] border border-ui-border-base bg-ui-bg-subtle px-5 py-4">
                <p className="text-ui-fg-subtle">
                  Service Areas
                </p>
                <p className="mt-2 text-2xl-semi text-ui-fg-base">
                  {serviceItems.length}
                </p>
              </div>
              <div className="rounded-[22px] border border-ui-border-base bg-ui-bg-subtle px-5 py-4">
                <p className="text-ui-fg-subtle">
                  Built For
                </p>
                <p className="mt-2 text-base-regular text-ui-fg-base">
                  Training and delivery teams
                </p>
              </div>
              <div className="rounded-[22px] border border-ui-border-base bg-ui-bg-subtle px-5 py-4">
                <p className="text-ui-fg-subtle">
                  Engagement
                </p>
                <p className="mt-2 text-base-regular text-ui-fg-base">
                  Strategy through execution
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-ui-border-base bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] px-6 py-7 small:px-8 small:py-10 large:border-l large:border-t-0">
            <p className="text-small-regular uppercase tracking-[0.22em] text-ui-fg-subtle">
              Quick Access
            </p>
            <div className="mt-5 grid gap-3">
              {serviceItems.map((service, index) => (
                <LocalizedClientLink
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-[20px] border border-ui-border-base bg-white/90 px-4 py-4 transition-colors duration-200 hover:border-[#bfdbfe] hover:bg-white"
                >
                  <div>
                    <p className="text-ui-fg-subtle">
                      {service.eyebrow}
                    </p>
                    <h2 className="mt-1 text-large-semi text-ui-fg-base transition-colors duration-200 group-hover:text-[#2a83d8]">
                      {service.label}
                    </h2>
                  </div>
                  <span className="rounded-full bg-ui-bg-subtle px-3 py-1 text-small-regular text-ui-fg-subtle">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 large:grid-cols-2">
        {serviceItems.map((service, index) => (
          <LocalizedClientLink
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group block h-full rounded-[28px] border border-ui-border-base bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-small-regular uppercase tracking-[0.22em] text-ui-fg-subtle">
                  {service.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl-semi text-ui-fg-base transition-colors duration-200 group-hover:text-[#2a83d8]">
                  {service.label}
                </h2>
              </div>
              <span className="rounded-full border border-ui-border-base px-3 py-1 text-small-regular text-ui-fg-subtle">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <p className="mt-4 text-base-regular text-ui-fg-subtle">
              {service.summary}
            </p>

            <ul className="mt-5 grid gap-2.5">
              {service.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-[18px] border border-ui-border-base bg-ui-bg-subtle px-4 py-3 text-base-regular text-ui-fg-subtle"
                >
                  {capability}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between border-t border-ui-border-base pt-4">
              <p className="max-w-[70%] text-small-regular text-ui-fg-subtle">
                {service.outcomes[0]}
              </p>
              <span className="text-small-regular font-medium uppercase tracking-[0.2em] text-[#2a83d8]">
                Explore
              </span>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}

export default ServicesTemplate
