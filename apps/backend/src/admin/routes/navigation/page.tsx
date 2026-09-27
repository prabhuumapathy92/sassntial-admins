import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  BarsThree,
  DotsSix,
  EyeMini,
  EyeSlashMini,
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
  Tooltip,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { sdk } from "../../lib/sdk"

/** Kept in step with MegaMenuIcon in the storefront's menu-items module. */
const ICONS = [
  "users",
  "storefront",
  "globe",
  "chart",
  "newspaper",
  "rocket",
  "book",
  "lightbulb",
] as const

type NavNode = {
  id?: string
  label: string
  href: string | null
  icon: string | null
  media?: unknown
  /** Disabling hides the entry and unpublishes the page it links to. */
  is_active?: boolean
  children: NavNode[]
}

type NavTree = {
  primary: NavNode[]
  secondary: NavNode[]
  cta: NavNode[]
}

const emptyNode = (): NavNode => ({
  label: "",
  href: "",
  icon: null,
  is_active: true,
  children: [],
})

/** Immutably replaces the node at `path`, mapping it through `update`. */
const mapAt = (
  nodes: NavNode[],
  path: number[],
  update: (node: NavNode) => NavNode | null
): NavNode[] => {
  const [index, ...rest] = path

  return nodes.flatMap((node, current) => {
    if (current !== index) {
      return [node]
    }

    if (!rest.length) {
      const next = update(node)
      return next ? [next] : []
    }

    return [{ ...node, children: mapAt(node.children, rest, update) }]
  })
}

/**
 * Moves a node to another position among its siblings.
 *
 * `from` points at the node itself and `toIndex` is a position in the same
 * list, so the node is lifted out and re-inserted rather than swapped: a drag
 * across several rows should shift the ones it passes, not trade places with
 * whatever it landed on.
 */
const reorderAt = (
  nodes: NavNode[],
  from: number[],
  toIndex: number
): NavNode[] => {
  const parentPath = from.slice(0, -1)
  const fromIndex = from[from.length - 1]

  const reorder = (siblings: NavNode[]): NavNode[] => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= siblings.length) {
      return siblings
    }

    const next = [...siblings]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    return next
  }

  if (!parentPath.length) {
    return reorder(nodes)
  }

  return mapAt(nodes, parentPath, (node) => ({
    ...node,
    children: reorder(node.children),
  }))
}

/**
 * Whether two paths point at siblings.
 *
 * Dragging only reorders within one list. A link means "one of the things
 * under this heading", so moving it into another group would change what it
 * says, not just where it sits - that is an edit for the Link field, or for
 * deleting the row and adding it where it belongs.
 */
const isSamePath = (a: number[], b: number[]) =>
  a.length === b.length && a.every((step, index) => step === b[index])

const isSibling = (a: number[], b: number[]) =>
  a.length === b.length &&
  a.slice(0, -1).every((step, index) => step === b[index])

type DragState = {
  active: number[] | null
  over: number[] | null
  onStart: (path: number[]) => void
  onOver: (path: number[]) => void
  onDrop: (path: number[]) => void
  onEnd: () => void
}

/**
 * Switches one row, leaving its children alone.
 *
 * The storefront already drops a hidden item's whole subtree, so the children
 * do not need a flag of their own - and writing one would be destructive:
 * hiding a group would count as hiding each link inside it, and a link's page
 * is unpublished when the link is switched off. Hiding the Training menu's
 * "Next Steps" column once took the contact page down with it. The rows are
 * dimmed instead, which describes the same menu without changing them.
 */
const setActive = (node: NavNode, isActive: boolean): NavNode => ({
  ...node,
  is_active: isActive,
})

/** Applies a visibility change to every entry pointing at the same place. */
const setActiveByHref = (
  nodes: NavNode[],
  href: string,
  isActive: boolean
): NavNode[] =>
  nodes.map((node) =>
    node.href?.trim() === href
      ? setActive(node, isActive)
      : { ...node, children: setActiveByHref(node.children, href, isActive) }
  )

const nodeAt = (nodes: NavNode[], path: number[]): NavNode | undefined =>
  path.reduce<NavNode | undefined>(
    (node, index) => (node ? node.children[index] : nodes[index]),
    undefined
  )

const addAt = (nodes: NavNode[], path: number[] | null): NavNode[] => {
  if (!path) {
    return [...nodes, emptyNode()]
  }

  return mapAt(nodes, path, (node) => ({
    ...node,
    children: [...node.children, emptyNode()],
  }))
}

/**
 * Whether this item renders as a mega menu.
 *
 * The storefront derives the layout the same way: children without an href are
 * headings, which means the item is a mega menu rather than a plain dropdown.
 * Showing it here stops an editor wondering why adding a link changed the shape
 * of the menu.
 */
const isMegaMenu = (node: NavNode) =>
  node.children.some((child) => !child.href?.trim())

const NodeEditor = ({
  node,
  path,
  depth,
  hidden,
  onChange,
  onToggleActive,
  drag,
  onRemove,
  onAddChild,
}: {
  node: NavNode
  path: number[]
  depth: number
  /** True when an ancestor is switched off, so this row will not render. */
  hidden: boolean
  onChange: (path: number[], patch: Partial<NavNode>) => void
  onToggleActive: (path: number[]) => void
  drag: DragState
  onRemove: (path: number[]) => void
  onAddChild: (path: number[]) => void
}) => {
  // Depth 1 items with children are mega-menu headings, which use an icon and
  // no destination. Everything else is a link.
  const isHeading = depth === 1 && !!node.children.length

  const isOff = hidden || node.is_active === false
  const isDragging = !!drag.active && isSamePath(drag.active, path)
  // Only a sibling can be dropped here, so only a sibling gets the marker.
  const isDropTarget =
    !!drag.active &&
    !!drag.over &&
    isSamePath(drag.over, path) &&
    !isDragging &&
    isSibling(drag.active, path)

  return (
    <div
      className="flex flex-col gap-3 border-l border-ui-border-base pl-4"
      style={{ marginLeft: depth ? 8 : 0 }}
    >
      <div
        onDragOver={(event) => {
          if (!drag.active || !isSibling(drag.active, path)) {
            return
          }

          // Without this the browser refuses the drop and the row springs back.
          event.preventDefault()
          drag.onOver(path)
        }}
        onDrop={(event) => {
          if (!drag.active || !isSibling(drag.active, path)) {
            return
          }

          event.preventDefault()
          drag.onDrop(path)
        }}
        className="flex flex-wrap items-end gap-3"
        style={{
          opacity: isDragging ? 0.4 : isOff ? 0.55 : 1,
          borderTopColor: isDropTarget ? "var(--fg-interactive)" : undefined,
          borderTopWidth: isDropTarget ? 2 : undefined,
          paddingTop: isDropTarget ? 6 : undefined,
        }}
      >
        <div className="min-w-[200px] flex-1">
          <Label size="small" weight="plus">
            Label
          </Label>
          <Input
            value={node.label}
            placeholder="Menu label"
            onChange={(event) =>
              onChange(path, { label: event.target.value })
            }
          />
        </div>

        {isHeading ? (
          <div className="min-w-[160px]">
            <Label size="small" weight="plus">
              Icon
            </Label>
            <Select
              value={node.icon ?? "book"}
              onValueChange={(value) => onChange(path, { icon: value })}
            >
              <Select.Trigger>
                <Select.Value placeholder="Icon" />
              </Select.Trigger>
              <Select.Content>
                {ICONS.map((icon) => (
                  <Select.Item key={icon} value={icon}>
                    {icon}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
        ) : (
          <div className="min-w-[220px] flex-1">
            <Label size="small" weight="plus">
              Link
            </Label>
            <Input
              value={node.href ?? ""}
              placeholder="/services"
              onChange={(event) => onChange(path, { href: event.target.value })}
            />
          </div>
        )}

        <div className="flex items-center gap-1 pb-1">
          <Tooltip content="Drag to reorder within this list">
            <span
              draggable
              onDragStart={() => drag.onStart(path)}
              onDragEnd={drag.onEnd}
              className="flex cursor-grab items-center p-1 text-ui-fg-muted active:cursor-grabbing"
              aria-label={`Drag ${node.label || "item"} to reorder`}
            >
              <DotsSix />
            </span>
          </Tooltip>
          <Tooltip
            content={
              node.is_active === false
                ? "Show in the menu"
                : hidden
                ? "Already hidden with its group - switch this off to unpublish the linked page too"
                : "Hide everywhere and unpublish the linked page"
            }
          >
            <IconButton
              size="small"
              variant="transparent"
              onClick={() => onToggleActive(path)}
            >
              {node.is_active === false ? <EyeSlashMini /> : <EyeMini />}
            </IconButton>
          </Tooltip>
          {depth < 2 && (
            <Tooltip content={depth === 0 ? "Add group or link" : "Add link"}>
              <IconButton
                size="small"
                variant="transparent"
                onClick={() => onAddChild(path)}
              >
                <Plus />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip content="Remove">
            <IconButton
              size="small"
              variant="transparent"
              onClick={() => onRemove(path)}
            >
              <Trash />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {depth === 0 && !!node.children.length && (
        <Text size="xsmall" className="text-ui-fg-subtle">
          Renders as {isMegaMenu(node) ? "a mega menu" : "a dropdown"} — leave a
          child&apos;s link empty to turn it into a mega-menu heading.
        </Text>
      )}

      {node.children.map((child, index) => (
        <NodeEditor
          key={index}
          node={child}
          path={[...path, index]}
          depth={depth + 1}
          hidden={isOff}
          onChange={onChange}
          onToggleActive={onToggleActive}
          drag={drag}
          onRemove={onRemove}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  )
}

/**
 * Only the fields the API owns.
 *
 * The editor loads the tree straight from the API, so every node also carries
 * a server-side `id`. The update schema rejects unknown fields, so posting the
 * tree back as-is failed with "Unrecognized fields: 'id'" - which meant no
 * change made here was ever saved.
 */
const toBody = (nodes: NavNode[]): unknown[] =>
  nodes.map((node) => ({
    label: node.label,
    href: node.href ?? null,
    icon: node.icon ?? null,
    media: node.media ?? null,
    is_active: node.is_active !== false,
    children: toBody(node.children),
  }))

const NavigationPage = () => {
  const queryClient = useQueryClient()
  const [menu, setMenu] = useState<keyof NavTree>("primary")
  const [items, setItems] = useState<NavNode[]>([])
  const [dragPath, setDragPath] = useState<number[] | null>(null)
  const [overPath, setOverPath] = useState<number[] | null>(null)

  /**
   * Order stays a pending edit behind Save, unlike visibility: moving a row
   * only rearranges what is already on the site, and the result is visible on
   * screen, so there is nothing to lose track of.
   */
  const drag: DragState = {
    active: dragPath,
    over: overPath,
    onStart: setDragPath,
    onOver: setOverPath,
    onDrop: (path) => {
      if (dragPath) {
        setItems((current) =>
          reorderAt(current, dragPath, path[path.length - 1])
        )
      }

      setDragPath(null)
      setOverPath(null)
    },
    onEnd: () => {
      setDragPath(null)
      setOverPath(null)
    },
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["navigation"],
    queryFn: () =>
      sdk.client.fetch<{ navigation: NavTree }>("/admin/navigation"),
  })

  useEffect(() => {
    setItems(data?.navigation?.[menu] ?? [])
  }, [data, menu])

  type SavePayload = { items: NavNode[]; message: string }

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: ({ items: payload }: SavePayload) =>
      sdk.client.fetch<{ navigation: NavTree }>("/admin/navigation", {
        method: "POST",
        body: { menu, items: toBody(payload) },
      }),
    onSuccess: (_navigation, variables) => {
      queryClient.invalidateQueries({ queryKey: ["navigation"] })
      toast.success(variables.message)
    },
    onError: (mutationError: Error) => {
      toast.error(mutationError.message || "Could not save the navigation")
    },
  })

  const handleChange = (path: number[], patch: Partial<NavNode>) =>
    setItems((current) =>
      mapAt(current, path, (node) => ({ ...node, ...patch }))
    )

  /**
   * Hiding an entry takes its destination off the site, so the other entries
   * linking there are hidden at the same time.
   *
   * The storefront would drop them anyway once the page is unpublished; doing
   * it here means the editor shows that before the save rather than after. To
   * remove a single link and keep the page live, delete the row instead.
   *
   * Saves immediately. Every other control here edits text that is obviously
   * still a draft, but this one unpublishes a page, and leaving it pending
   * behind the Save button meant a refresh quietly put the entry back with no
   * sign the change had been lost.
   */
  const handleToggleActive = (path: number[]) => {
    const previous = items
    const target = nodeAt(previous, path)

    if (!target) {
      return
    }

    const isActive = target.is_active === false
    const toggled = mapAt(previous, path, (node) =>
      setActive(node, isActive)
    )
    const href = target.href?.trim()
    const next = href ? setActiveByHref(toggled, href, isActive) : toggled

    setItems(next)

    const name = target.label.trim() || "Menu item"

    mutate(
      {
        items: next,
        message: isActive
          ? `${name} is showing again`
          : `${name} is hidden${href ? " and its page unpublished" : ""}`,
      },
      // The request is the source of truth, so a failure puts the eye back
      // rather than leaving the screen claiming a change that did not happen.
      { onError: () => setItems(previous) }
    )
  }

  const handleSave = async () => {
    const labelled = items.filter((item) => item.label.trim().length)

    if (labelled.length !== items.length) {
      toast.error("Every item needs a label")
      return
    }

    await mutateAsync({ items: labelled, message: "Navigation saved" })
  }

  if (isLoading) {
    return (
      <Container>
        <Text>Loading navigation...</Text>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container>
        <Text className="text-ui-fg-error">
          {(error as Error)?.message ?? "Could not load the navigation"}
        </Text>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h2">Navigation</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Controls the storefront header, side menu and call-to-action.
          </Text>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={menu}
            onValueChange={(value) => setMenu(value as keyof NavTree)}
          >
            <Select.Trigger className="min-w-[160px]">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="primary">Primary menu</Select.Item>
              <Select.Item value="secondary">Secondary menu</Select.Item>
              <Select.Item value="cta">Call to action</Select.Item>
            </Select.Content>
          </Select>

          <Button
            variant="secondary"
            onClick={() => setItems((current) => addAt(current, null))}
          >
            <Plus /> Add item
          </Button>

          <Button onClick={handleSave} isLoading={isPending}>
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {items.length ? (
          items.map((node, index) => (
            <NodeEditor
              key={index}
              node={node}
              path={[index]}
              depth={0}
              hidden={false}
              onChange={handleChange}
              onToggleActive={handleToggleActive}
              drag={drag}
              onRemove={(path) =>
                setItems((current) => mapAt(current, path, () => null))
              }
              onAddChild={(path) =>
                setItems((current) => addAt(current, path))
              }
            />
          ))
        ) : (
          <Text size="small" className="text-ui-fg-subtle">
            This menu is empty. Add an item to get started.
          </Text>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Navigation",
  icon: BarsThree,
})

export default NavigationPage
