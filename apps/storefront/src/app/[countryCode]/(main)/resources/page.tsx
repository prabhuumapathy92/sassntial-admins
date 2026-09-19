import { Metadata } from "next"

import ResourcesTemplate from "@modules/resources/templates"

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore whitepapers, blogs, webinars, and case studies for planning and enablement.",
}

export default function ResourcesPage() {
  return <ResourcesTemplate />
}
