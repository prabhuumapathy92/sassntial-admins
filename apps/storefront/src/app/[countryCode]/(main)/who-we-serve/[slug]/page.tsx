import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getWhoWeServeBySlug,
  whoWeServeItems,
} from "@modules/who-we-serve/constants/who-we-serve-items"
import WhoWeServeDetailTemplate from "@modules/who-we-serve/templates/detail"

type Params = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return whoWeServeItems.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const item = getWhoWeServeBySlug(params.slug)

  if (!item) {
    return {}
  }

  return {
    title: item.label,
    description: item.summary,
  }
}

export default async function WhoWeServeDetailPage(props: Params) {
  const params = await props.params
  const item = getWhoWeServeBySlug(params.slug)

  if (!item) {
    notFound()
  }

  return <WhoWeServeDetailTemplate item={item} />
}
