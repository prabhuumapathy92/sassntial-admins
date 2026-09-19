"use client"

import { useEffect, useRef, useState } from "react"

type StatItem = {
  value: string
  label: string
}

type AboutRevealProps = {
  eyebrow: string
  title: string
  description: string
  stats: StatItem[]
}

const AboutReveal = ({ eyebrow, title, description, stats }: AboutRevealProps) => {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const elements = itemRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (!visible.length) return

        const best = visible.reduce((current, entry) => {
          if (entry.intersectionRatio > current.intersectionRatio) return entry
          return current
        }, visible[0])

        const index = Number((best.target as HTMLElement).dataset.index)
        if (!Number.isNaN(index)) {
          setActiveIndex(index)
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="mt-6 rounded-[32px] bg-black px-8 py-14 text-white shadow-[0_30px_70px_-60px_rgba(15,23,42,0.9)] lg:px-14 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="lg:sticky lg:top-24 lg:self-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-md text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-300">
            {description}
          </p>
        </div>

        <div
          className="relative space-y-16"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        >
          {stats.map((stat, index) => {
            const isActive = index === activeIndex
            return (
              <div
                key={`${stat.value}-${index}`}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className="h-[60vh] snap-center"
              >
                <div
                  className={`sticky top-28 transition-all duration-500 ${
                    isActive ? "opacity-100 scale-105" : "opacity-20 scale-90"
                  }`}
                >
                  <p className="text-7xl font-semibold tracking-tight text-white md:text-8xl lg:text-9xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-base text-slate-300">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AboutReveal
