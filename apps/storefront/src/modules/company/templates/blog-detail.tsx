import MarketingDetailShell from "@modules/common/components/marketing-detail-shell"
import {
  BlogPost,
  companyItems,
} from "@modules/company/constants/company-items"

const BlogDetailTemplate = ({ post }: { post: BlogPost }) => {
  const blogItem = companyItems.find((item) => item.slug === "blog")
  const relatedPosts = (blogItem?.blogPosts ?? [])
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 3)

  return (
    <MarketingDetailShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Company", href: "/company" },
        { label: "Blog", href: "/company/blog" },
        { label: post.title },
      ]}
      eyebrow={post.category}
      title={post.title}
      description={post.excerpt}
      actions={[
        { label: "Back To Blog", href: "/company/blog" },
        {
          label: "Contact Us",
          href: "/company/contact-us",
          variant: "secondary",
        },
      ]}
      heroNote={`${post.date} | ${post.readTime}`}
      heroImage={
        post.imageUrl
          ? {
              src: post.imageUrl,
              alt: post.title,
            }
          : undefined
      }
      proofTitle="PRACTICAL DELIVERY INSIGHTS"
      sectionEyebrow="Article Overview"
      sectionTitle="What This Article Covers"
      sectionIntro="The article body sits inside the same reusable shell, while the content remains specific to the selected post."
      featureCards={post.body.map((paragraph, index) => ({
        title: `Key Point ${String(index + 1).padStart(2, "0")}`,
        description: paragraph,
      }))}
      relatedTitle="Read Related Articles"
      relatedHref="/company/blog"
      relatedLinks={relatedPosts.map((item) => ({
        href: `/company/blog/${item.slug}`,
        label: item.title,
        description: item.excerpt,
        eyebrow: `${item.category} | ${item.readTime}`,
      }))}
    >
      <article className="relative overflow-hidden border border-[#dbe7f2] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-6 py-7 shadow-[0_28px_60px_-48px_rgba(15,23,42,0.76)] small:px-8 small:py-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#60a5fa_0%,#f2b544_52%,#ee6b4b_100%)]" />
        <p className="text-[11px] font-semibold uppercase text-[#f59e0b]">
          Full Article
        </p>
        <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 small:text-base">
          {post.body.map((paragraph, index) => (
            <p key={`${post.slug}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </article>
    </MarketingDetailShell>
  )
}

export default BlogDetailTemplate
