import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  companyItems,
  getBlogPostBySlug,
} from "@modules/company/constants/company-items"
import BlogDetailTemplate from "@modules/company/templates/blog-detail"

type Params = {
  params: Promise<{
    postSlug: string
  }>
}

export async function generateStaticParams() {
  const blogItem = companyItems.find((item) => item.slug === "blog")
  const posts = blogItem?.blogPosts ?? []
  return posts.map((post) => ({
    postSlug: post.slug,
  }))
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const post = getBlogPostBySlug(params.postSlug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogDetailPage(props: Params) {
  const params = await props.params
  const post = getBlogPostBySlug(params.postSlug)

  if (!post) {
    notFound()
  }

  return <BlogDetailTemplate post={post} />
}
