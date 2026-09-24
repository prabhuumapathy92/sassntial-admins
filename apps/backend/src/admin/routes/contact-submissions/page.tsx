import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowDownTray, Envelope } from "@medusajs/icons"
import {
  Button,
  Container,
  Drawer,
  Heading,
  Table,
  Text,
  toast,
} from "@medusajs/ui"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { sdk } from "../../lib/sdk"

type ContactSubmission = {
  id: string
  full_name: string
  company: string | null
  email: string
  phone_number: string | null
  location: string | null
  message: string
  created_at: string
}

type ListResponse = {
  contact_submissions: ContactSubmission[]
  count: number
  limit: number
  offset: number
}

const PAGE_SIZE = 20

const formatDate = (value: string) => {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed)
}

const truncate = (value: string, max = 70) =>
  value.length > max ? `${value.slice(0, max)}...` : value

const ContactSubmissionsPage = () => {
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contact-submissions", page],
    queryFn: () =>
      sdk.client.fetch<ListResponse>("/admin/contact-submissions", {
        query: { limit: PAGE_SIZE, offset: page * PAGE_SIZE },
      }),
    placeholderData: keepPreviousData,
  })

  const submissions = data?.contact_submissions ?? []
  const count = data?.count ?? 0
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE))

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // The SDK parses JSON, so the CSV is fetched as a blob and handed to the
      // browser as a download rather than rendered.
      const blob = await sdk.client.fetch<Blob>(
        "/admin/contact-submissions/export",
        { headers: { accept: "text/csv" } }
      )

      const url = URL.createObjectURL(
        blob instanceof Blob ? blob : new Blob([String(blob)], { type: "text/csv" })
      )
      const link = document.createElement("a")

      link.href = url
      link.download = `contact-submissions-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (exportError) {
      console.error(exportError)
      toast.error("Error", { description: "Failed to export submissions" })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Contact submissions</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {count} {count === 1 ? "enquiry" : "enquiries"} from the storefront
            contact form.
          </Text>
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={handleExport}
          isLoading={isExporting}
          disabled={count === 0}
        >
          <ArrowDownTray />
          Export CSV
        </Button>
      </div>

      {isLoading && (
        <div className="px-6 py-8">
          <Text size="small" className="text-ui-fg-subtle">
            Loading...
          </Text>
        </div>
      )}

      {isError && (
        <div className="px-6 py-8">
          <Text size="small" className="text-ui-fg-error">
            Could not load submissions
            {error instanceof Error ? `: ${error.message}` : "."}
          </Text>
        </div>
      )}

      {!isLoading && !isError && submissions.length === 0 && (
        <div className="px-6 py-10 text-center">
          <Text size="small" className="text-ui-fg-subtle">
            No submissions yet. They appear here as soon as someone sends the
            contact form.
          </Text>
        </div>
      )}

      {!isLoading && !isError && submissions.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Received</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Company</Table.HeaderCell>
                  <Table.HeaderCell>Message</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {submissions.map((submission) => (
                  <Table.Row
                    key={submission.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(submission)}
                  >
                    <Table.Cell className="whitespace-nowrap">
                      {formatDate(submission.created_at)}
                    </Table.Cell>
                    <Table.Cell>{submission.full_name}</Table.Cell>
                    <Table.Cell>{submission.email}</Table.Cell>
                    <Table.Cell>{submission.company || "-"}</Table.Cell>
                    <Table.Cell>{truncate(submission.message)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <div className="flex items-center justify-between px-6 py-3">
            <Text size="small" className="text-ui-fg-subtle">
              Page {page + 1} of {pageCount}
            </Text>
            <div className="flex items-center gap-x-2">
              <Button
                variant="secondary"
                size="small"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="small"
                disabled={page + 1 >= pageCount}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Drawer open={!!selected} onOpenChange={() => setSelected(null)}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{selected?.full_name}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-y-4 overflow-auto">
            {selected && (
              <>
                <Detail label="Received" value={formatDate(selected.created_at)} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Company" value={selected.company} />
                <Detail label="Phone" value={selected.phone_number} />
                <Detail label="Location" value={selected.location} />
                <div>
                  <Text
                    size="xsmall"
                    leading="compact"
                    className="font-semibold uppercase tracking-wider text-ui-fg-muted"
                  >
                    Message
                  </Text>
                  <Text
                    size="small"
                    className="mt-1 whitespace-pre-line text-ui-fg-base"
                  >
                    {selected.message}
                  </Text>
                </div>
              </>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

const Detail = ({ label, value }: { label: string; value: string | null }) => (
  <div>
    <Text
      size="xsmall"
      leading="compact"
      className="font-semibold uppercase tracking-wider text-ui-fg-muted"
    >
      {label}
    </Text>
    <Text size="small" className="mt-1 text-ui-fg-base">
      {value || "-"}
    </Text>
  </div>
)

export const config = defineRouteConfig({
  label: "Contact submissions",
  icon: Envelope,
})

export default ContactSubmissionsPage
