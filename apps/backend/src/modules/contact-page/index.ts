import { Module } from "@medusajs/framework/utils"

import ContactPageModuleService from "./service"

export const CONTACT_PAGE_MODULE = "contact_page"

export default Module(CONTACT_PAGE_MODULE, {
  service: ContactPageModuleService,
})
