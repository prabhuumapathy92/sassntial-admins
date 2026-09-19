import { CompanyItem } from "@modules/company/constants/company-items"

const contactChannels = [
  {
    label: "General inquiries",
    value: "hello@medusastore.com",
  },
  {
    label: "Support line",
    value: "+1 (213) 456-586",
  },
  {
    label: "Availability",
    value: "Monday to Friday, 09:00 - 18:00 UTC",
  },
]

const responseSignals = [
  "Training and product discovery",
  "Delivery, rollout, and service planning",
  "Remote-first sessions across time zones",
]

const connectivityRoutes = [
  {
    key: "americas",
    path: "M 86 154 C 170 94 314 132 454 432",
    duration: "7.8s",
    delay: "0s",
  },
  {
    key: "atlantic",
    path: "M 454 432 C 428 326 438 250 494 232",
    duration: "5.4s",
    delay: "1.2s",
  },
  {
    key: "europe",
    path: "M 556 214 C 592 194 628 182 676 184",
    duration: "4.8s",
    delay: "0.7s",
  },
  {
    key: "africa-india",
    path: "M 712 354 C 756 238 809 242 844 312",
    duration: "5.9s",
    delay: "1.6s",
  },
  {
    key: "asia",
    path: "M 844 312 C 900 212 970 208 1042 258",
    duration: "6.7s",
    delay: "0.35s",
  },
]

const connectivityNodes = [
  { key: "north-america", x: 86, y: 154, delay: "0s" },
  { key: "west-america", x: 182, y: 292, delay: "1.3s" },
  { key: "south-america", x: 454, y: 432, delay: "0.9s" },
  { key: "atlantic", x: 520, y: 274, delay: "1.7s" },
  { key: "europe", x: 556, y: 214, delay: "0.5s" },
  { key: "africa", x: 700, y: 364, delay: "1.9s" },
  { key: "india", x: 844, y: 312, delay: "1.1s" },
  { key: "east-asia", x: 1042, y: 258, delay: "0.25s" },
]

const inputClassName =
  "h-12 w-full border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-sky-400"

const ContactField = ({
  name,
  placeholder,
  type = "text",
  className = "",
}: {
  name: string
  placeholder: string
  type?: string
  className?: string
}) => {
  return (
    <>
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${inputClassName} ${className}`.trim()}
      />
    </>
  )
}

const ContactDetailTemplate = ({ item }: { item: CompanyItem }) => {
  return (
    <div className="pb-16 small:pb-24">
      <section className="content-container py-10 small:py-14">
        <div className="mx-auto grid w-full max-w-[1220px] gap-8 medium:grid-cols-[minmax(0,420px)_minmax(0,1fr)] medium:items-start medium:gap-8 large:grid-cols-[minmax(0,460px)_minmax(0,1fr)] large:gap-10">
          <div className="max-w-none medium:max-w-[420px] large:max-w-[460px]">
           
            <h1 className="mt-3 max-w-3xl text-3xl-semi text-ui-fg-base">
              Contact Us
            </h1>
            <p className="mt-5 text-[0.97rem] leading-8 text-slate-600">
              {item.intro}
            </p>

            <div className="mt-8 grid gap-4">
              {contactChannels.map((channel) => (
                <div
                  key={channel.label}
                  className="border-l-[3px] border-sky-500 bg-white px-5 py-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
                >
                  <p className="font-[family-name:var(--font-tech)] text-slate-500">
                    {channel.label}
                  </p>
                  <p className="mt-2 text-sm text-slate-800 small:text-base">
                    {channel.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 small:grid-cols-2 medium:grid-cols-1">
              {item.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="border border-slate-200/80 bg-slate-50 px-4 py-4"
                >
                  <p className="font-[family-name:var(--font-tech)] text-sky-700">
                    Focus
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200/80 bg-white p-5 shadow-[0_22px_52px_rgba(15,23,42,0.08)] small:p-7 large:p-8">
            <div className="border-b border-slate-200 pb-5">
              <p>
                For More Details
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl-semi text-ui-fg-base">
                Share your context and we&apos;ll route it to the right team.
              </h1>
              <p className="mt-3 max-w-[700px] text-[0.97rem] leading-7 text-slate-600">
                Use the form for product questions, delivery discussions, or
                training requests. This page now matches the new design, but it
                does not have a live submission handler yet.
              </p>
            </div>

            <form className="mt-6 grid gap-3 small:grid-cols-2">
              <ContactField name="full_name" placeholder="Full Name" />
              <ContactField name="company" placeholder="Company" />
              <ContactField name="email" type="email" placeholder="Email" />
              <ContactField
                name="phone_number"
                type="tel"
                placeholder="Phone number"
              />
              <ContactField
                name="location"
                placeholder="Location"
                className="small:col-span-2"
              />
              <div className="small:col-span-2">
                <label htmlFor="message" className="sr-only">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Your message"
                  className="min-h-[148px] w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-sky-400"
                />
              </div>

              <div className="small:col-span-2">
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center bg-[linear-gradient(90deg,#e8f7ff_0%,#35b8f4_100%)] px-6 py-3 font-[family-name:var(--font-tech)] text-sm uppercase tracking-[0.16em] text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

     
    </div>
  )
}

export default ContactDetailTemplate
