import { Metadata } from "next"

import WhoWeServeTemplate from "@modules/who-we-serve/templates"

export const metadata: Metadata = {
  title: "Who We Serve",
  description:
    "Explore business types, franchise models, and industries supported by the team.",
}

export default function WhoWeServePage() {
  return <WhoWeServeTemplate />
}
