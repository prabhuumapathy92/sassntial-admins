import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getServiceBySlug,
  serviceItems,
} from "@modules/services/constants/service-items"
import ServiceDetailTemplate from "@modules/services/templates/detail"

type Params = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return serviceItems.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const service = getServiceBySlug(params.slug)

  if (!service) {
    return {}
  }

  return {
    title: service.label,
    description: service.summary,
  }
}

export default async function ServiceDetailPage(props: Params) {
  const params = await props.params
  const service = getServiceBySlug(params.slug)

  if (!service) {
    notFound()
  }

  return <ServiceDetailTemplate service={service} />
}
