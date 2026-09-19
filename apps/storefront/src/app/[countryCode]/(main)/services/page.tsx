import { Metadata } from "next"

import ServicesTemplate from "@modules/services/templates"

export const metadata: Metadata = {
  title: "Services",
  description: "Explore branding, experience design, technologies, and marketing services.",
}

export default function ServicesPage() {
  return <ServicesTemplate />
}
