import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#072a36] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(28,164,195,0.28),transparent_32%),radial-gradient(circle_at_12%_18%,rgba(92,213,238,0.22),transparent_18%),radial-gradient(circle_at_88%_18%,rgba(25,129,170,0.18),transparent_16%),linear-gradient(180deg,#143341_0%,#072533_48%,#06202b_100%)]" />
        <div className="absolute inset-0 opacity-55 [background-image:radial-gradient(rgba(127,231,255,0.32)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,white,transparent_72%)]" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#1d8199]/22 blur-3xl" />
        <div className="absolute right-0 top-28 h-96 w-96 rounded-full bg-[#0d5d74]/24 blur-3xl" />
      </div>

      <div className="content-container relative px-6 pb-20 pt-14 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-center text-[0.72rem] font-semibold uppercase text-[#9de8ff]">
            AI Digital Marketing &amp; Training Solutions
          </p>

          <h4 className="mx-auto mt-7 max-w-[1080px] text-center text-[clamp(2.75rem,6vw,0.9rem)] font-black uppercase tracking-[-0.055em] text-white">
            AI digital marketing and industry-focused training solutions
          </h4>

          <p className="mx-auto mt-8 max-w-[1120px] text-center text-[clamp(1.05rem,1.55vw,1.68rem)] font-semibold leading-relaxed text-white/95">
            Help your business grow smarter and empower your team with
            future-ready skills through AI-powered marketing services and
            industry-leading training programs.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <LocalizedClientLink
              href="/services"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#e2b74f] to-[#d97348] px-9 text-[1.02rem] font-bold uppercase tracking-[0.02em] text-white shadow-[0_18px_42px_rgba(217,115,72,0.35)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(217,115,72,0.42)]"
            >
              Explore Services
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/training"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-9 text-[1.02rem] font-bold uppercase tracking-[0.02em] text-white transition-colors duration-200 hover:bg-white/18"
            >
              View Training
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
