import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  companyItems,
  getCompanyBySlug,
} from "@modules/company/constants/company-items"
import CompanyDetailTemplate from "@modules/company/templates/detail"

type Params = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return companyItems.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const item = getCompanyBySlug(params.slug)

  if (!item) {
    return {}
  }

  return {
    title: item.label,
    description: item.summary,
  }
}

export default async function CompanyDetailPage(props: Params) {
  const params = await props.params
  const item = getCompanyBySlug(params.slug)

  if (!item) {
    notFound()
  }

  return <CompanyDetailTemplate item={item} />
}
