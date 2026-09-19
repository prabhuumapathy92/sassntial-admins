import LocalizedClientLink from "@modules/common/components/localized-client-link"

const trainingPrograms = [
  "AI Bot Automation",
  "Maintenance & Reliability Masterclass",
  "SMRP 5 Pillars",
  "Industry-Specific Programs",
]

const marketingServices = [
  "AI Search Engine Optimization",
  "Content Marketing",
  "Website Development",
  "Email Marketing",
  "Branding & Design",
  "Marketing Automation",
  "Social Media Marketing",
]

const whyChooseItems = [
  {
    stat: "12+",
    title: "Launch Programs Supported",
    description:
      "Cross-functional launch support that keeps marketing, enablement, and delivery aligned from day one.",
  },
  {
    stat: "4 Weeks",
    title: "Average Onboarding Window",
    description:
      "Fast ramp-up designed to reduce handoff delays and move teams into execution quickly.",
  },
  {
    stat: "96%",
    title: "Session Satisfaction Score",
    description:
      "Training experiences built to be practical, relevant, and immediately usable by real teams.",
  },
  {
    stat: "1 Team",
    title: "Unified Growth Model",
    description:
      "One connected team guiding strategy, enablement, and growth instead of fragmented vendors.",
  },
]

const growthSteps = [
  {
    title: "Strategic Discovery",
    description:
      "We conduct a comprehensive assessment of your business landscape, identifying key challenges, opportunities, and growth levers.",
  },
  {
    title: "Insight-Led Strategy",
    description:
      "Leveraging data and industry expertise, we design a customized, outcome-driven strategy aligned with your long-term vision.",
  },
  {
    title: "Intelligent Transformation",
    description:
      "We integrate advanced AI, automation, and digital frameworks to modernize operations and unlock new efficiencies.",
  },
  {
    title: "Precision Execution",
    description:
      "Our team delivers seamless implementation across marketing, technology, and training initiatives with a focus on measurable impact.",
  },
  {
    title: "Capability Building",
    description:
      "We equip your workforce with cutting-edge skills through structured training programs, enabling sustainable performance and innovation.",
  },
  {
    title: "Continuous Optimization",
    description:
      "We continuously refine strategies using real-time insights, ensuring scalable growth, improved ROI, and long-term success.",
  },
]

const testimonials = [
  {
    quote:
      "Sassntial transformed our marketing approach with AI-driven strategies that delivered real, measurable growth. Their expertise is unmatched.",
    author: "Marketing Head, SaaS Company",
  },
  {
    quote:
      "The training programs were highly practical and immediately applicable. Our team saw a noticeable improvement in performance.",
    author: "Operations Manager, Manufacturing Firm",
  },
  {
    quote:
      "Their understanding of both technology and business strategy sets them apart. Sassntial truly acts as a growth partner.",
    author: "Founder, Tech Startup",
  },
  {
    quote:
      "The Maintenance & Reliability training helped us reduce downtime and improve efficiency significantly.",
    author: "Plant Head, Industrial Sector",
  },
  {
    quote:
      "From strategy to execution, the entire process was seamless. The results exceeded our expectations.",
    author: "Digital Lead, Enterprise Organization",
  },
]

const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) => (
  <div className="mx-auto max-w-[900px] text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3b6c82]">
      {eyebrow}
    </p>
    <h2 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#0b2450]">
      {title}
    </h2>
    <p className="mx-auto mt-5 max-w-4xl text-[1rem] leading-8 text-slate-600">
      {description}
    </p>
  </div>
)

const ListCard = ({
  title,
  items,
}: {
  title: string
  items: string[]
}) => (
  <article className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.45)]">
    <h3 className="text-[1.35rem] font-black uppercase tracking-[-0.04em] text-[#0b2450]">
      {title}
    </h3>
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-slate-700">
          <span className="mt-1 text-[#d97a4d]">{">"}</span>
          <span className="text-[0.98rem] leading-7">{item}</span>
        </li>
      ))}
    </ul>
  </article>
)

const MarketingSections = () => {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-20 text-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(232,180,152,0.16),transparent_14%),radial-gradient(circle_at_86%_16%,rgba(121,189,208,0.14),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(214,227,239,0.24),transparent_20%)]" />
          <div className="absolute -left-16 top-0 h-56 w-56 rounded-full border border-[#f1ddd2]" />
          <div className="absolute right-0 top-16 h-64 w-64 translate-x-1/2 rounded-full border border-[#d8e7ef]" />
        </div>

        <div className="content-container relative">
          <SectionHeading
            eyebrow=""
            title="AI-powered marketing and industry-leading training programs"
            description="AI-powered marketing at Sassntial leverages advanced data analytics, automation, and machine learning to create highly targeted, personalized campaigns that drive measurable growth. Our industry-leading training programs are designed to upskill teams with practical, real-world strategies, ensuring they stay ahead in a rapidly evolving landscape and maximize the impact of modern marketing technologies."
          />

          <div className="mx-auto mt-14 grid max-w-[1160px] gap-8 lg:grid-cols-2">
            <ListCard title="Advanced Training Programs" items={trainingPrograms} />
            <ListCard title="AI Digital Marketing Services" items={marketingServices} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#eef5f8] py-20 text-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(232,180,152,0.18),transparent_14%),radial-gradient(circle_at_88%_20%,rgba(121,189,208,0.22),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />
        </div>

        <div className="content-container relative">
          <div className="mx-auto max-w-[1160px] rounded-[32px] border border-[#d8e4eb] bg-[linear-gradient(180deg,#f4f8fb_0%,#f4f8fb_100%)] p-4 shadow-[0_36px_80px_-58px_rgba(8,36,77,0.65)] md:p-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)]">
              <div className="relative overflow-hidden rounded-[28px] bg-[#08244d] p-8 text-white md:p-10">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#1f4f83]/40 blur-3xl" />
                  <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#0ea5b7]/18 blur-3xl" />
                  <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-[#f3b46b]/16 blur-3xl" />
                </div>

                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9de8ff]">
                    Why Choose Sassntial
                  </p>
                  <h2 className="mt-6 max-w-[11ch] text-[clamp(2rem,3.7vw,3.6rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
                    Clearer ownership. Faster execution.
                  </h2>
                  <p className="mt-6 max-w-[32ch] text-[0.98rem] leading-7 text-white/78">
                    We ensure fewer handoffs, clearer ownership, and tighter
                    alignment between your business needs and digital
                    solutions.
                  </p>

                  <div className="mt-10 rounded-[24px] border border-white/10 bg-white/8 p-6 backdrop-blur-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9de8ff]">
                      Operating Advantage
                    </p>
                    <p className="mt-4 text-[clamp(2rem,3vw,2.75rem)] font-black tracking-[-0.06em] text-white">
                      One connected model
                    </p>
                    <p className="mt-4 text-sm leading-7 text-white/72">
                      Strategy, training, and implementation move through one
                      coordinated system instead of disconnected partners.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {whyChooseItems.map((item, index) => (
                  <article
                    key={item.title}
                    className={`group relative overflow-hidden rounded-[28px] border border-[#d7e2ea] bg-white p-6 shadow-[0_25px_55px_-42px_rgba(15,23,42,0.55)] transition-transform duration-300 hover:-translate-y-1 md:p-7 ${
                      index % 2 === 1 ? "xl:translate-y-6" : ""
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f3b46b] via-[#0ea5b7] to-[#123b72]" />
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#eff8fc]" />
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-[clamp(2rem,3vw,3rem)] font-black leading-none tracking-[-0.07em] text-[#0b2450]">
                          {item.stat}
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f5fb] text-lg font-black text-[#d97a4d] shadow-inner">
                          +
                        </div>
                      </div>

                      <h3 className="mt-7 max-w-[13ch] text-[1rem] font-black uppercase leading-[1.05] tracking-[-0.04em] text-[#0b2450] md:text-[1.05rem]">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-[0.92rem] leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 text-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(232,180,152,0.12),transparent_14%),radial-gradient(circle_at_76%_18%,rgba(121,189,208,0.12),transparent_18%),radial-gradient(circle_at_50%_84%,rgba(214,227,239,0.22),transparent_20%)]" />
        </div>

        <div className="content-container relative">
          <SectionHeading
            eyebrow=""
            title="Your Partner in Growth"
            description="From first demo to post-launch adoption, Sassntial is your trusted partner. We blend marketing expertise, training excellence, and AI innovation into a single delivery model to help you scale faster, smarter, and with confidence."
          />

          <div className="mx-auto mt-14 grid max-w-[1160px] gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {growthSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.45)]"
              >
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3b6c82]">
                  Step {index + 1}
                </div>
                <h3 className="mt-4 text-[1.25rem] font-black uppercase tracking-[-0.03em] text-[#0b2450]">
                  {step.title}
                </h3>
                <p className="mt-4 text-[0.96rem] leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0b2450] py-20 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(157,232,255,0.18),transparent_18%),radial-gradient(circle_at_84%_22%,rgba(226,183,79,0.16),transparent_16%)]" />
        </div>

        <div className="content-container relative">
          <div className="mx-auto max-w-[900px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9de8ff]">
              Our Clients
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-white">
              Trusted by forward-thinking organizations
            </h2>
            <p className="mx-auto mt-5 max-w-4xl text-[1rem] leading-8 text-white/80">
             At SaaSntial, we partner with forward-thinking organizations across industries who are committed to innovation, efficiency, and growth. From emerging startups to established enterprises, our clients trust us to deliver AI-driven marketing solutions and industry-focused training that create measurable impact. We build long-term relationships by understanding unique business needs and consistently delivering value through strategy, technology, and expertise.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[980px] rounded-[28px] border border-white/10 bg-white/6 p-8 backdrop-blur-sm">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[20px] border border-white/10 bg-white/8 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9de8ff]">
                  Innovation
                </p>
                <p className="mt-4 text-[0.98rem] leading-7 text-white/80">
                  We work with teams ready to modernize how they market, train,
                  and operate.
                </p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/8 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9de8ff]">
                  Efficiency
                </p>
                <p className="mt-4 text-[0.98rem] leading-7 text-white/80">
                  Our delivery model connects strategy, execution, and capability
                  building under one team.
                </p>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/8 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9de8ff]">
                  Growth
                </p>
                <p className="mt-4 text-[0.98rem] leading-7 text-white/80">
                  Every engagement is designed to improve ROI, performance, and
                  long-term business outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 text-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(232,180,152,0.12),transparent_14%),radial-gradient(circle_at_82%_12%,rgba(121,189,208,0.12),transparent_18%),radial-gradient(circle_at_50%_82%,rgba(214,227,239,0.18),transparent_20%)]" />
        </div>

        <div className="content-container relative">
          <div className="mx-auto max-w-[900px] text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#3b6c82]">
              Testimonials
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#0b2450]">
              Results our clients talk about
            </h2>
            <p className="mx-auto mt-5 max-w-4xl text-[1rem] leading-8 text-slate-600">
             Hear directly from our clients about their experience with SaaSntial and the impact of our solutions. Their success stories reflect our commitment to delivering measurable results and lasting value.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-[1160px] gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.quote}
                className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.45)]"
              >
                <div className="text-3xl font-black leading-none text-[#d97a4d]">
                  &rdquo;
                </div>
                <p className="mt-5 text-[0.98rem] leading-7 text-slate-600">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.08em] text-[#0b2450]">
                  {testimonial.author}
                </p>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-16 flex max-w-[1160px] flex-wrap items-center justify-center gap-4">
            <LocalizedClientLink
              href="/services"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#e2b74f] to-[#d97348] px-8 text-sm font-bold uppercase tracking-[0.05em] text-white shadow-[0_16px_32px_rgba(217,115,72,0.26)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Explore Marketing Services
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/training"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-8 text-sm font-bold uppercase tracking-[0.05em] text-[#0b2450] transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
            >
              Browse Training Programs
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </>
  )
}

export default MarketingSections
