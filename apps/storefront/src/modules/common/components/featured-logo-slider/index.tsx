const featuredLogos = [
  {
    name: "Entrepreneur",
    className:
      "font-serif text-[1.85rem] font-semibold text-[#d7442b] small:text-[2.1rem]",
  },
  {
    name: "SEMRUSH",
    className:
      "text-[1.5rem] font-black uppercase text-[#ff6a2b] small:text-[1.8rem]",
  },
  {
    name: "HUFFPOST",
    className:
      "text-[1.45rem] font-black uppercase italic text-[#101010] small:text-[1.72rem]",
  },
  {
    name: "SocialMediaToday",
    className:
      "text-[1.15rem] font-bold text-[#28374d] small:text-[1.35rem]",
  },
  {
    name: "Hindustan Times",
    className:
      "font-serif text-[1.4rem] font-semibold text-[#2e2e2e] small:text-[1.72rem]",
  },
  {
    name: "Outlook",
    className:
      "text-[1.85rem] font-black text-[#d70f1b] small:text-[2.1rem]",
  },
] as const

const FeaturedLogoSlider = () => {
  const marqueeItems = [...featuredLogos, ...featuredLogos]

  return (
    <div className="content-container py-8 small:py-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-center gap-4">
          <span className="hidden h-px flex-1 bg-[#f15c3b] small:block" />
          <p className="text-center text-[1.02rem] font-black text-slate-950 small:text-[1.3rem]">
            <span className="text-[#f15c3b]">*</span> Our Work Featured On{" "}
            <span className="text-[#f15c3b]">*</span>
          </p>
          <span className="hidden h-px flex-1 bg-[#f15c3b] small:block" />
        </div>

        <div className="relative mt-8 overflow-hidden">
          <div
            className="animate-marquee flex w-max min-w-full items-center gap-10 whitespace-nowrap small:gap-14"
            role="list"
            aria-label="Publications featuring our work"
          >
            {marqueeItems.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex min-w-[170px] shrink-0 items-center justify-center px-2 small:min-w-[190px]"
                role="listitem"
                aria-hidden={index >= featuredLogos.length}
              >
                <span className={logo.className}>{logo.name}</span>
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white via-white/85 to-transparent small:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white/85 to-transparent small:w-20" />
        </div>
      </div>
    </div>
  )
}

export default FeaturedLogoSlider
