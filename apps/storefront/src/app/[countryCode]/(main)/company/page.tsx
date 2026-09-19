import { Metadata } from "next"

import CompanyTemplate from "@modules/company/templates"

export const metadata: Metadata = {
  title: "Company",
  description: "Explore company information, careers, and contact options.",
}

export default function CompanyPage() {
  return <CompanyTemplate />
}
