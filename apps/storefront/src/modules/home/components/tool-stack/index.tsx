import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ToolIcon = ({ gradient }: { gradient: string }) => (
  <div className={`w-8 h-8 rounded-full ${gradient} flex-shrink-0`} />
)

const SkillCard = ({ name, gradient }: { name: string, gradient: string }) => (
  <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-full py-2.5 px-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)] whitespace-nowrap">
    <ToolIcon gradient={gradient} />
    <span className="text-[15px] font-medium text-gray-700">{name}</span>
  </div>
)

const toolsRow1 = [
  { name: "Jill", gradient: "bg-orange-400" },
  { name: "John", gradient: "bg-gradient-to-br from-yellow-400 to-green-400" },
  { name: "Jack", gradient: "bg-gradient-to-br from-orange-500 to-red-400" },
  { name: "Jill", gradient: "bg-orange-400" },
  { name: "John", gradient: "bg-gradient-to-br from-yellow-400 to-green-400" },
  { name: "Jack", gradient: "bg-gradient-to-br from-orange-500 to-red-400" },
  { name: "Jill", gradient: "bg-orange-400" },
  { name: "John", gradient: "bg-gradient-to-br from-yellow-400 to-green-400" },
  { name: "Jack", gradient: "bg-gradient-to-br from-orange-500 to-red-400" },
  { name: "Jill", gradient: "bg-orange-400" },
  { name: "John", gradient: "bg-gradient-to-br from-yellow-400 to-green-400" },
  { name: "Jack", gradient: "bg-gradient-to-br from-orange-500 to-red-400" },
]

const toolsRow2 = [
  { name: "James", gradient: "bg-gradient-to-br from-blue-400 to-green-400" },
  { name: "Jane", gradient: "bg-gradient-to-br from-pink-400 to-orange-400" },
  { name: "Jenny", gradient: "bg-gradient-to-br from-orange-400 to-green-600" },
  { name: "James", gradient: "bg-gradient-to-br from-blue-400 to-green-400" },
  { name: "Jane", gradient: "bg-gradient-to-br from-pink-400 to-orange-400" },
  { name: "Jenny", gradient: "bg-gradient-to-br from-orange-400 to-green-600" },
  { name: "James", gradient: "bg-gradient-to-br from-blue-400 to-green-400" },
  { name: "Jane", gradient: "bg-gradient-to-br from-pink-400 to-orange-400" },
  { name: "Jenny", gradient: "bg-gradient-to-br from-orange-400 to-green-600" },
  { name: "James", gradient: "bg-gradient-to-br from-blue-400 to-green-400" },
  { name: "Jane", gradient: "bg-gradient-to-br from-pink-400 to-orange-400" },
  { name: "Jenny", gradient: "bg-gradient-to-br from-orange-400 to-green-600" },
]

const ToolStack = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="content-container text-center mb-16">
        <p className="text-[13px] uppercase tracking-[0.2em] text-gray-500 font-medium mb-4">
          Our tools
        </p>
        <h2 className="text-[32px] md:text-[42px] leading-tight font-bold text-[#1F2937] max-w-3xl mx-auto">
          We are using the best-fit tool stack to scale your marketing performance
        </h2>
      </div>

      <div className="relative flex flex-col gap-6">
        {/* Row 1 - Left to Right */}
        <div className="flex overflow-hidden group">
          <div className="flex gap-6 animate-marquee whitespace-nowrap py-1">
            {[...toolsRow1, ...toolsRow1].map((tool, idx) => (
              <SkillCard key={idx} name={tool.name} gradient={tool.gradient} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex overflow-hidden group">
          <div className="flex gap-6 animate-marquee-reverse whitespace-nowrap py-1">
            {[...toolsRow2, ...toolsRow2].map((tool, idx) => (
              <SkillCard key={idx} name={tool.name} gradient={tool.gradient} />
            ))}
          </div>
        </div>
        
        {/* Gradient overlays to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
      </div>

      {/* CTA Section */}
      <div className="content-container text-center mt-32">
        <h3 className="text-[28px] md:text-[32px] font-bold text-[#1F2937] mb-2">
          Ready to see it in action?
        </h3>
        <p className="text-gray-500 mb-10">
          Get a personalized demo tailored to your needs
        </p>
        
        <div className="inline-flex items-center">
          <LocalizedClientLink
            href="/contact"
            className="bg-gradient-to-r from-[#7DD3FC] to-[#00AEEF] text-white font-bold px-10 py-4 rounded-xl text-[15px] shadow-lg shadow-sky-100 hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Request Demo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default ToolStack
