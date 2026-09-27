import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  ArrowDownMini,
  ArrowUpMini,
  DocumentText,
  Plus,
  Trash,
} from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  IconButton,
  Input,
  Label,
  Select,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { sdk } from "../../lib/sdk"

type FooterLink = { label: string; href: string }
type FooterGroup = { title: string; links: FooterLink[] }
type FooterSocialLink = FooterLink & { platform: string }
type FooterLocation = { city: string; address: string }
type FooterConfig = {
  theme: "navy" | "dark" | "light"
  logo_url: string
  logo_alt: string
  groups: FooterGroup[]
  social_links: FooterSocialLink[]
  cta: FooterLink
  locations: FooterLocation[]
  phone_label: string
  phone_href: string
  copyright_text: string
  legal_links: FooterLink[]
}

const move = <T,>(items: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= items.length || from === to) {
    return items
  }

  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

const Panel = ({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) => (
  <section className="flex flex-col gap-4 border border-ui-border-base bg-ui-bg-base p-5">
    <div>
      <Heading level="h3">{title}</Heading>
      {description ? (
        <Text size="small" className="mt-1 text-ui-fg-subtle">
          {description}
        </Text>
      ) : null}
    </div>
    {children}
  </section>
)

const FooterPage = () => {
  const queryClient = useQueryClient()
  const [footer, setFooter] = useState<FooterConfig | null>(null)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["footer-config"],
    queryFn: () => sdk.client.fetch<{ footer: FooterConfig }>("/admin/footer"),
  })

  useEffect(() => {
    if (data?.footer) {
      setFooter(data.footer)
    }
  }, [data])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (next: FooterConfig) =>
      sdk.client.fetch<{ footer: FooterConfig }>("/admin/footer", {
        method: "POST",
        body: { footer: next },
      }),
    onSuccess: ({ footer: saved }) => {
      setFooter(saved)
      queryClient.setQueryData(["footer-config"], { footer: saved })
      toast.success("Footer saved", {
        description: "The storefront footer has been updated.",
      })
    },
    onError: (saveError: Error) =>
      toast.error(saveError.message || "Could not save the footer"),
  })

  const patch = (values: Partial<FooterConfig>) =>
    setFooter((current) => (current ? { ...current, ...values } : current))

  const patchGroup = (index: number, values: Partial<FooterGroup>) => {
    if (!footer) {
      return
    }

    patch({
      groups: footer.groups.map((group, position) =>
        position === index ? { ...group, ...values } : group,
      ),
    })
  }

  const patchGroupLink = (
    groupIndex: number,
    linkIndex: number,
    values: Partial<FooterLink>,
  ) => {
    if (!footer) {
      return
    }

    patch({
      groups: footer.groups.map((group, position) =>
        position === groupIndex
          ? {
              ...group,
              links: group.links.map((link, index) =>
                index === linkIndex ? { ...link, ...values } : link,
              ),
            }
          : group,
      ),
    })
  }

  const patchSocial = (index: number, values: Partial<FooterSocialLink>) => {
    if (!footer) {
      return
    }

    patch({
      social_links: footer.social_links.map((link, position) =>
        position === index ? { ...link, ...values } : link,
      ),
    })
  }

  const patchLocation = (index: number, values: Partial<FooterLocation>) => {
    if (!footer) {
      return
    }

    patch({
      locations: footer.locations.map((location, position) =>
        position === index ? { ...location, ...values } : location,
      ),
    })
  }

  const patchLegalLink = (index: number, values: Partial<FooterLink>) => {
    if (!footer) {
      return
    }

    patch({
      legal_links: footer.legal_links.map((link, position) =>
        position === index ? { ...link, ...values } : link,
      ),
    })
  }

  const save = async () => {
    if (!footer) {
      return
    }

    const clean: FooterConfig = {
      ...footer,
      groups: footer.groups
        .filter((group) => group.title.trim())
        .map((group) => ({
          ...group,
          title: group.title.trim(),
          links: group.links
            .filter((link) => link.label.trim() || link.href.trim())
            .map((link) => ({
              label: link.label.trim(),
              href: link.href.trim(),
            })),
        })),
      social_links: footer.social_links
        .filter((link) => link.label.trim() || link.href.trim())
        .map((link) => ({
          ...link,
          label: link.label.trim(),
          href: link.href.trim(),
        })),
      locations: footer.locations
        .filter((location) => location.city.trim() || location.address.trim())
        .map((location) => ({
          city: location.city.trim(),
          address: location.address.trim(),
        })),
      legal_links: footer.legal_links
        .filter((link) => link.label.trim() || link.href.trim())
        .map((link) => ({
          label: link.label.trim(),
          href: link.href.trim(),
        })),
    }

    await mutateAsync(clean)
  }

  if (isLoading || !footer) {
    if (isError) {
      return (
        <Container>
          <Text className="text-ui-fg-error">
            {(error as Error)?.message ?? "Could not load footer settings"}
          </Text>
        </Container>
      )
    }

    return (
      <Container>
        <Text>Loading footer settings...</Text>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h2">Footer</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Edit the shared footer content shown across the storefront.
          </Text>
        </div>
        <Button onClick={save} isLoading={isPending}>
          Save footer
        </Button>
      </div>

      <div className="grid gap-5 px-6 py-6 xl:grid-cols-2">
        <Panel
          title="Brand and contact"
          description="Logo, phone number, and copyright line."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label size="small" weight="plus">
                Footer color theme
              </Label>
              <Select
                value={footer.theme}
                onValueChange={(theme) =>
                  patch({ theme: theme as FooterConfig["theme"] })
                }
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="navy">Navy blue</Select.Item>
                  <Select.Item value="dark">Deep navy</Select.Item>
                  <Select.Item value="light">Light</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label size="small" weight="plus">
                Logo image URL
              </Label>
              <Input
                value={footer.logo_url}
                placeholder="Optional image URL; leave empty to use the site logo"
                onChange={(event) => patch({ logo_url: event.target.value })}
              />
            </div>
            <div>
              <Label size="small" weight="plus">
                Logo alt text
              </Label>
              <Input
                value={footer.logo_alt}
                onChange={(event) => patch({ logo_alt: event.target.value })}
              />
            </div>
            <div>
              <Label size="small" weight="plus">
                Phone display
              </Label>
              <Input
                value={footer.phone_label}
                placeholder="(619) 752-1955"
                onChange={(event) => patch({ phone_label: event.target.value })}
              />
            </div>
            <div>
              <Label size="small" weight="plus">
                Phone link
              </Label>
              <Input
                value={footer.phone_href}
                placeholder="tel:6197521955"
                onChange={(event) => patch({ phone_href: event.target.value })}
              />
            </div>
            <div>
              <Label size="small" weight="plus">
                Copyright text
              </Label>
              <Input
                value={footer.copyright_text}
                onChange={(event) =>
                  patch({ copyright_text: event.target.value })
                }
              />
            </div>
          </div>
        </Panel>

        <Panel
          title="Call to action"
          description="The highlighted button beside the social links."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label size="small" weight="plus">
                Button label
              </Label>
              <Input
                value={footer.cta.label}
                onChange={(event) =>
                  patch({ cta: { ...footer.cta, label: event.target.value } })
                }
              />
            </div>
            <div>
              <Label size="small" weight="plus">
                Button link
              </Label>
              <Input
                value={footer.cta.href}
                placeholder="/company/contact-us"
                onChange={(event) =>
                  patch({ cta: { ...footer.cta, href: event.target.value } })
                }
              />
            </div>
          </div>
        </Panel>

        <Panel
          title="Footer link columns"
          description="Create columns, then add and order links within each one."
        >
          <div className="flex flex-col gap-4">
            {footer.groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="flex flex-col gap-3 border border-ui-border-base bg-ui-bg-subtle p-4"
              >
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label size="small" weight="plus">
                      Column heading
                    </Label>
                    <Input
                      value={group.title}
                      onChange={(event) =>
                        patchGroup(groupIndex, { title: event.target.value })
                      }
                    />
                  </div>
                  <IconButton
                    size="small"
                    variant="transparent"
                    disabled={groupIndex === 0}
                    onClick={() =>
                      patch({
                        groups: move(footer.groups, groupIndex, groupIndex - 1),
                      })
                    }
                    aria-label="Move column up"
                  >
                    <ArrowUpMini />
                  </IconButton>
                  <IconButton
                    size="small"
                    variant="transparent"
                    disabled={groupIndex === footer.groups.length - 1}
                    onClick={() =>
                      patch({
                        groups: move(footer.groups, groupIndex, groupIndex + 1),
                      })
                    }
                    aria-label="Move column down"
                  >
                    <ArrowDownMini />
                  </IconButton>
                  <IconButton
                    size="small"
                    variant="transparent"
                    onClick={() =>
                      patch({
                        groups: footer.groups.filter(
                          (_, index) => index !== groupIndex,
                        ),
                      })
                    }
                    aria-label="Remove column"
                  >
                    <Trash />
                  </IconButton>
                </div>

                {group.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="grid gap-2 md:grid-cols-[1fr_1fr_auto_auto_auto] md:items-end"
                  >
                    <div>
                      <Label size="small">Link label</Label>
                      <Input
                        value={link.label}
                        onChange={(event) =>
                          patchGroupLink(groupIndex, linkIndex, {
                            label: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label size="small">Destination</Label>
                      <Input
                        value={link.href}
                        placeholder="/page or https://..."
                        onChange={(event) =>
                          patchGroupLink(groupIndex, linkIndex, {
                            href: event.target.value,
                          })
                        }
                      />
                    </div>
                    <IconButton
                      size="small"
                      variant="transparent"
                      disabled={linkIndex === 0}
                      onClick={() =>
                        patchGroup(groupIndex, {
                          links: move(group.links, linkIndex, linkIndex - 1),
                        })
                      }
                      aria-label="Move link up"
                    >
                      <ArrowUpMini />
                    </IconButton>
                    <IconButton
                      size="small"
                      variant="transparent"
                      disabled={linkIndex === group.links.length - 1}
                      onClick={() =>
                        patchGroup(groupIndex, {
                          links: move(group.links, linkIndex, linkIndex + 1),
                        })
                      }
                      aria-label="Move link down"
                    >
                      <ArrowDownMini />
                    </IconButton>
                    <IconButton
                      size="small"
                      variant="transparent"
                      onClick={() =>
                        patchGroup(groupIndex, {
                          links: group.links.filter(
                            (_, index) => index !== linkIndex,
                          ),
                        })
                      }
                      aria-label="Remove link"
                    >
                      <Trash />
                    </IconButton>
                  </div>
                ))}

                <Button
                  size="small"
                  variant="secondary"
                  className="w-fit"
                  onClick={() =>
                    patchGroup(groupIndex, {
                      links: [...group.links, { label: "", href: "" }],
                    })
                  }
                >
                  <Plus /> Add link
                </Button>
              </div>
            ))}
            <Button
              size="small"
              variant="secondary"
              className="w-fit"
              disabled={footer.groups.length >= 8}
              onClick={() =>
                patch({
                  groups: [
                    ...footer.groups,
                    { title: "New column", links: [] },
                  ],
                })
              }
            >
              <Plus /> Add link column
            </Button>
          </div>
        </Panel>

        <Panel
          title="Social links"
          description="Choose an icon style and destination for each profile."
        >
          <div className="flex flex-col gap-3">
            {footer.social_links.map((social, index) => (
              <div
                key={index}
                className="grid gap-2 md:grid-cols-[1fr_150px_1fr_auto] md:items-end"
              >
                <div>
                  <Label size="small">Accessible label</Label>
                  <Input
                    value={social.label}
                    onChange={(event) =>
                      patchSocial(index, { label: event.target.value })
                    }
                  />
                </div>
                <div>
                  <Label size="small">Icon</Label>
                  <Select
                    value={social.platform}
                    onValueChange={(platform) =>
                      patchSocial(index, { platform })
                    }
                  >
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      {[
                        "linkedin",
                        "facebook",
                        "instagram",
                        "youtube",
                        "x",
                        "tiktok",
                        "custom",
                      ].map((platform) => (
                        <Select.Item key={platform} value={platform}>
                          {platform}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>
                <div>
                  <Label size="small">Profile URL</Label>
                  <Input
                    value={social.href}
                    placeholder="https://..."
                    onChange={(event) =>
                      patchSocial(index, { href: event.target.value })
                    }
                  />
                </div>
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={() =>
                    patch({
                      social_links: footer.social_links.filter(
                        (_, position) => position !== index,
                      ),
                    })
                  }
                  aria-label="Remove social link"
                >
                  <Trash />
                </IconButton>
              </div>
            ))}
            <Button
              size="small"
              variant="secondary"
              className="w-fit"
              disabled={footer.social_links.length >= 12}
              onClick={() =>
                patch({
                  social_links: [
                    ...footer.social_links,
                    { label: "", platform: "custom", href: "" },
                  ],
                })
              }
            >
              <Plus /> Add social link
            </Button>
          </div>
        </Panel>

        <Panel
          title="Office locations"
          description="Each location is shown in its own footer column."
        >
          <div className="flex flex-col gap-3">
            {footer.locations.map((location, index) => (
              <div
                key={index}
                className="grid gap-3 border border-ui-border-base bg-ui-bg-subtle p-3 md:grid-cols-2"
              >
                <div>
                  <Label size="small">City or office name</Label>
                  <Input
                    value={location.city}
                    onChange={(event) =>
                      patchLocation(index, { city: event.target.value })
                    }
                  />
                </div>
                <div>
                  <Label size="small">Address</Label>
                  <Textarea
                    rows={2}
                    value={location.address}
                    onChange={(event) =>
                      patchLocation(index, { address: event.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end md:col-span-2">
                  <IconButton
                    size="small"
                    variant="transparent"
                    onClick={() =>
                      patch({
                        locations: footer.locations.filter(
                          (_, position) => position !== index,
                        ),
                      })
                    }
                    aria-label="Remove location"
                  >
                    <Trash />
                  </IconButton>
                </div>
              </div>
            ))}
            <Button
              size="small"
              variant="secondary"
              className="w-fit"
              disabled={footer.locations.length >= 12}
              onClick={() =>
                patch({
                  locations: [...footer.locations, { city: "", address: "" }],
                })
              }
            >
              <Plus /> Add location
            </Button>
          </div>
        </Panel>

        <Panel
          title="Legal links"
          description="Privacy, terms, and other legal links shown under the copyright line."
        >
          <div className="flex flex-col gap-3">
            {footer.legal_links.map((link, index) => (
              <div
                key={index}
                className="grid gap-2 md:grid-cols-[1fr_1fr_auto] md:items-end"
              >
                <div>
                  <Label size="small">Link label</Label>
                  <Input
                    value={link.label}
                    onChange={(event) =>
                      patchLegalLink(index, { label: event.target.value })
                    }
                  />
                </div>
                <div>
                  <Label size="small">Destination</Label>
                  <Input
                    value={link.href}
                    onChange={(event) =>
                      patchLegalLink(index, { href: event.target.value })
                    }
                  />
                </div>
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={() =>
                    patch({
                      legal_links: footer.legal_links.filter(
                        (_, position) => position !== index,
                      ),
                    })
                  }
                  aria-label="Remove legal link"
                >
                  <Trash />
                </IconButton>
              </div>
            ))}
            <Button
              size="small"
              variant="secondary"
              className="w-fit"
              disabled={footer.legal_links.length >= 12}
              onClick={() =>
                patch({
                  legal_links: [...footer.legal_links, { label: "", href: "" }],
                })
              }
            >
              <Plus /> Add legal link
            </Button>
          </div>
        </Panel>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Footer",
  icon: DocumentText,
})

export default FooterPage
