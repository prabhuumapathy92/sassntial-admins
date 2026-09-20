type AiSeoDifferentiatorsProps = {
  title: string
  items: string[]
  description?: string
}

const AiSeoDifferentiators = ({
  title,
  items,
  description = "We focus on practical AI SEO execution that improves visibility, sharpens intent alignment, and supports long-term search growth.",
}: AiSeoDifferentiatorsProps) => {
  const midpoint = Math.ceil(items.length / 2)
  const columns = [items.slice(0, midpoint), items.slice(midpoint)].filter(
    (column) => column.length > 0
  )

  return (
    <section className="mx-auto">
      <article className="bg-white px-6 py-8 shadow-[0_18px_36px_rgba(15,23,42,0.06)] small:px-8 small:py-10">
        <div className="mx-auto max-w-[860px] text-center">
          <h3 className="text-[1.95rem] font-black leading-[1.04] text-slate-900 small:text-[2.3rem]">
            {title}
          </h3>
          <p className="mx-auto mt-4 max-w-[48rem] text-[14px] leading-7 text-slate-600 small:text-[15px]">
            {description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 small:grid-cols-2 small:gap-x-8">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="grid gap-3">
              {column.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border border-[#edf1f6] bg-[#f3f3f3] px-5 py-3.5"
                >
                  <span className="pr-4 text-[14px] font-medium text-slate-700">
                    {item}
                  </span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-500">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v13" />
                      <path d="m7 13 5 5 5-5" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default AiSeoDifferentiators
