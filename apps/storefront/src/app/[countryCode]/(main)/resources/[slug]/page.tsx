import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getResourceBySlug,
  resourceItems,
} from "@modules/resources/constants/resource-items"
import ResourceDetailTemplate from "@modules/resources/templates/detail"

type Params = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return resourceItems.map((resource) => ({
    slug: resource.slug,
  }))
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const resource = getResourceBySlug(params.slug)

  if (!resource) {
    return {}
  }

  return {
    title: resource.label,
    description: resource.summary,
  }
}

export default async function ResourceDetailPage(props: Params) {
  const params = await props.params
  const resource = getResourceBySlug(params.slug)

  if (!resource) {
    notFound()
  }

  return <ResourceDetailTemplate resource={resource} />
}
