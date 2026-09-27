import { Module } from "@medusajs/framework/utils"

import PageBuilderModuleService from "./service"

export const PAGE_BUILDER_MODULE = "page_builder"

export default Module(PAGE_BUILDER_MODULE, {
  service: PageBuilderModuleService,
})
