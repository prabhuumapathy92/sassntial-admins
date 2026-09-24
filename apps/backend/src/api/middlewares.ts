import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"

import { UpdateContactPage } from "./admin/contact-page/validators"
import { CreateContactSubmission } from "./store/contact-submissions/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/contact-page",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateContactPage)],
    },
    {
      matcher: "/store/contact-submissions",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateContactSubmission)],
    },
  ],
})
