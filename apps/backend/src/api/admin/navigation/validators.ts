import { z } from "@medusajs/framework/zod"

/** Empty strings clear a field, so they normalize to null rather than "". */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable()
  .optional()

const NavMediaImage = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().default(""),
  className: z.string().trim().optional(),
})

const NavMedia = z
  .object({
    eyebrow: z.string().trim().optional(),
    title: z.string().trim().optional(),
    subtitle: z.string().trim().optional(),
    images: z.array(NavMediaImage).default([]),
  })
  .nullable()
  .optional()

/**
 * The tree is three levels deep at most (top item, mega-menu group, link), so
 * it is spelled out rather than declared recursively. An explicit depth keeps
 * the error messages readable and stops a malformed payload nesting forever.
 */
const NavLeaf = z.object({
  label: z.string().trim().min(1),
  href: optionalText,
  icon: optionalText,
  is_active: z.boolean().optional(),
})

const NavGroup = NavLeaf.extend({
  media: NavMedia,
  children: z.array(NavLeaf).optional(),
})

const NavRoot = NavLeaf.extend({
  media: NavMedia,
  children: z.array(NavGroup).optional(),
})

export const UpdateNavigation = z.object({
  menu: z.enum(["primary", "secondary", "cta"]),
  items: z.array(NavRoot),
})

export type UpdateNavigationBody = z.infer<typeof UpdateNavigation>
