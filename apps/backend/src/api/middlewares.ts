import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"

import { UpdateContactPage } from "./admin/contact-page/validators"
import { UpdateEmailSettings } from "./admin/email-settings/validators"
import { UpdateFooterConfig } from "./admin/footer/validators"
import { UpdateNavigation } from "./admin/navigation/validators"
import { UpdateSiteSettings } from "./admin/site-settings/validators"
import {
  SetPageStatus,
  SetPostStatus,
  UpsertBlogAuthor,
  UpsertBlogCategory,
  UpsertPage,
  UpsertPost,
} from "./admin/pages/validators"
import { CreateContactSubmission } from "./store/contact-submissions/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/contact-page",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateContactPage)],
    },
    {
      matcher: "/admin/email-settings",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateEmailSettings)],
    },
    {
      matcher: "/admin/navigation",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateNavigation)],
    },
    {
      matcher: "/admin/site-settings",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateSiteSettings)],
    },
    {
      matcher: "/admin/footer",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateFooterConfig)],
    },
    {
      matcher: "/admin/pages",
      method: "POST",
      middlewares: [validateAndTransformBody(UpsertPage)],
    },
    {
      matcher: "/admin/pages/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(UpsertPage)],
    },
    {
      matcher: "/admin/posts",
      method: "POST",
      middlewares: [validateAndTransformBody(UpsertPost)],
    },
    {
      matcher: "/admin/posts/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(UpsertPost)],
    },
    {
      matcher: "/admin/pages/:id/status",
      method: "POST",
      middlewares: [validateAndTransformBody(SetPageStatus)],
    },
    {
      matcher: "/admin/posts/:id/status",
      method: "POST",
      middlewares: [validateAndTransformBody(SetPostStatus)],
    },
    {
      matcher: "/admin/blog-categories",
      method: "POST",
      middlewares: [validateAndTransformBody(UpsertBlogCategory)],
    },
    {
      matcher: "/admin/blog-categories/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(UpsertBlogCategory)],
    },
    {
      matcher: "/admin/blog-authors",
      method: "POST",
      middlewares: [validateAndTransformBody(UpsertBlogAuthor)],
    },
    {
      matcher: "/admin/blog-authors/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(UpsertBlogAuthor)],
    },
    {
      matcher: "/store/contact-submissions",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateContactSubmission)],
    },
  ],
})
