import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import MarketingSections from "@modules/home/components/marketing-sections"

export const metadata: Metadata = {
  title: "Sassntial | AI Digital Marketing & Training Solutions",
  description:
    "AI-powered marketing services and industry-focused training programs that help businesses grow smarter and build future-ready teams.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  await props.params

  return (
    <>
      <Hero />
      <MarketingSections />
    </>
  )
}
