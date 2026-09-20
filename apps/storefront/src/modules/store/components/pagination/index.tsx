"use client"

import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight,
} from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ReactNode } from "react"

export function Pagination({
  title,
  page,
  totalPages,
  totalItems,
  pageSize,
  showingStart,
  showingEnd,
  variant = "default",
  "data-testid": dataTestid,
}: {
  title?: string
  page: number
  totalPages: number
  totalItems?: number
  pageSize?: number
  showingStart?: number
  showingEnd?: number
  variant?: "default" | "training"
  "data-testid"?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("limit", value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const isSinglePage = totalPages <= 1

  const renderTrainingActionButton = ({
    label,
    nextPage,
    disabled,
  }: {
    label: string
    nextPage: number
    disabled: boolean
  }) => (
    <button
      type="button"
      className={clx("text-[15px] font-medium leading-none transition", {
        "cursor-not-allowed text-[#c0c8d4]": disabled,
        "text-[#6b7280] hover:text-[#2c7cf7]": !disabled,
      })}
      disabled={disabled}
      onClick={() => handlePageChange(nextPage)}
    >
      {label}
    </button>
  )

  const renderActionButton = ({
    label,
    icon,
    nextPage,
    disabled,
  }: {
    label: string
    icon?: ReactNode
    nextPage: number
    disabled: boolean
  }) => (
    <button
      type="button"
      className={clx(
        "inline-flex h-10 items-center gap-2 border px-4 text-sm font-medium transition",
        {
          "cursor-not-allowed border-[#dde3ed] bg-white text-[#c0c8d4]": disabled,
          "border-transparent bg-transparent text-[#5b6b7f] hover:border-[#d9e2f2] hover:bg-white hover:text-[#1d4ed8]":
            !disabled,
        }
      )}
      disabled={disabled}
      onClick={() => handlePageChange(nextPage)}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  const renderPageButton = (
    pageNumber: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      type="button"
      key={pageNumber}
      className={clx(
        "inline-flex h-10 min-w-10 items-center justify-center border px-3 text-sm font-semibold transition",
        {
          "border-[#2c7cf7] bg-[#2c7cf7] text-white shadow-[0_10px_25px_rgba(44,124,247,0.28)]":
            isCurrent,
          "border-[#dde3ed] bg-white text-[#5b6b7f] hover:border-[#bfdbfe] hover:text-[#1d4ed8]":
            !isCurrent,
        }
      )}
      aria-current={isCurrent ? "page" : undefined}
      disabled={isCurrent}
      onClick={() => handlePageChange(pageNumber)}
    >
      {label}
    </button>
  )

  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="inline-flex h-10 min-w-10 items-center justify-center text-sm font-semibold text-[#94a3b8]"
    >
      ...
    </span>
  )

  const renderTrainingEllipsis = (key: string) => (
    <span key={key} className="text-[15px] font-medium leading-none text-[#94a3b8]">
      ...
    </span>
  )

  const renderTrainingPageButton = (
    pageNumber: number,
    isCurrent: boolean
  ) => (
    <button
      type="button"
      key={pageNumber}
      className={clx("text-[15px] font-medium leading-none transition", {
        "text-[#2c7cf7]": isCurrent,
        "text-[#6b7280] hover:text-[#2c7cf7]": !isCurrent,
      })}
      aria-current={isCurrent ? "page" : undefined}
      disabled={isCurrent}
      onClick={() => handlePageChange(pageNumber)}
    >
      {pageNumber}
    </button>
  )

  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      buttons.push(
        ...arrayRange(1, totalPages).map((pageNumber) =>
          renderPageButton(pageNumber, pageNumber, pageNumber === page)
        )
      )
    } else if (page <= 4) {
      buttons.push(
        ...arrayRange(1, 5).map((pageNumber) =>
          renderPageButton(pageNumber, pageNumber, pageNumber === page)
        )
      )
      buttons.push(renderEllipsis("ellipsis-1"))
      buttons.push(renderPageButton(totalPages, totalPages, totalPages === page))
    } else if (page >= totalPages - 3) {
      buttons.push(renderPageButton(1, 1, page === 1))
      buttons.push(renderEllipsis("ellipsis-2"))
      buttons.push(
        ...arrayRange(totalPages - 4, totalPages).map((pageNumber) =>
          renderPageButton(pageNumber, pageNumber, pageNumber === page)
        )
      )
    } else {
      buttons.push(renderPageButton(1, 1, page === 1))
      buttons.push(renderEllipsis("ellipsis-3"))
      buttons.push(
        ...arrayRange(page - 1, page + 1).map((pageNumber) =>
          renderPageButton(pageNumber, pageNumber, pageNumber === page)
        )
      )
      buttons.push(renderEllipsis("ellipsis-4"))
      buttons.push(renderPageButton(totalPages, totalPages, totalPages === page))
    }

    return buttons
  }

  const renderTrainingPageButtons = () => {
    const buttons = []
    const maxInlinePage = page === totalPages ? totalPages : Math.max(1, totalPages - 1)
    let startPage = 1
    let endPage = Math.min(maxInlinePage, 2)

    if (page > 2 && page < totalPages - 1) {
      startPage = page - 1
      endPage = Math.min(maxInlinePage, page + 1)
    } else if (page >= totalPages - 1) {
      startPage = Math.max(1, maxInlinePage - 1)
      endPage = maxInlinePage
    }

    if (startPage > 2) {
      buttons.push(renderTrainingEllipsis("ellipsis-start"))
    }

    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
      buttons.push(renderTrainingPageButton(pageNumber, pageNumber === page))
    }

    if (endPage < totalPages - 1) {
      buttons.push(renderTrainingEllipsis("ellipsis-end"))
    }

    return buttons
  }

  if (
    !title ||
    totalItems === undefined ||
    pageSize === undefined ||
    showingStart === undefined ||
    showingEnd === undefined
  ) {
    return (
      <div className="mt-12 flex justify-center">
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          data-testid={dataTestid}
        >
          {renderPageButtons()}
        </div>
      </div>
    )
  }

  if (variant === "training") {
    return (
      <div className="overflow-hidden border border-[#dbe3ef] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)] small:p-6">
        <div className="flex flex-col gap-4 medium:flex-row medium:items-end medium:justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#f59e0b]">
              All Training
            </p>
            <h3
              className="truncate text-[1.2rem] font-bold leading-tight text-[#0f172a] transition hover:text-[#2c7cf7] small:text-[1.35rem]"
              data-testid="store-page-title"
            >
              {title}
            </h3>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[#6b7280] small:gap-x-6"
            data-testid={dataTestid}
          >
            {renderTrainingActionButton({
              label: "First",
              nextPage: 1,
              disabled: page === 1 || isSinglePage,
            })}
            {renderTrainingActionButton({
              label: "Previous",
              nextPage: Math.max(1, page - 1),
              disabled: page === 1 || isSinglePage,
            })}
            <div className="flex flex-wrap items-center gap-3 small:gap-4">
              {renderTrainingPageButtons()}
            </div>
            {renderTrainingActionButton({
              label: "Last",
              nextPage: totalPages,
              disabled: page === totalPages || isSinglePage,
            })}
            <span className="text-[15px] font-medium leading-none text-[#6b7280]">
              Showing {showingStart}-{showingEnd} of {totalItems}
            </span>
            <label className="inline-flex items-center">
              <span className="sr-only">Items per page</span>
              <select
                value={pageSize}
                onChange={(event) => handlePageSizeChange(event.target.value)}
                className="h-11 min-w-[150px] border border-[#d7dce5] bg-[#f8fbff] px-4 text-[14px] font-medium text-[#243244] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#fde68a] small:min-w-[170px] small:text-[15px]"
              >
                {[12, 20, 40].map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-[#dbe3ef] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] small:p-7">
      <div className="flex flex-col gap-5 border-b border-[#e9eef6] pb-5 small:flex-row small:items-end small:justify-between">
        <div>
        
          <h2
            className="mt-3 text-[2rem] font-semibold leading-tight text-[#0f172a]"
            data-testid="store-page-title"
          >
            {title}
          </h2>
        </div>

        <div className="flex flex-col gap-4 small:items-end">
          <div
            className="flex flex-wrap items-center gap-2 text-sm text-[#5b6b7f]"
            data-testid={dataTestid}
          >
            {renderActionButton({
              label: "First",
              icon: <ChevronDoubleLeft className="h-4 w-4" />,
              nextPage: 1,
              disabled: page === 1 || isSinglePage,
            })}
            {renderActionButton({
              label: "Previous",
              icon: <ChevronLeft className="h-4 w-4" />,
              nextPage: Math.max(1, page - 1),
              disabled: page === 1 || isSinglePage,
            })}
            <div className="flex flex-wrap items-center gap-2">
              {renderPageButtons()}
            </div>
            {renderActionButton({
              label: "Next",
              icon: <ChevronRight className="h-4 w-4" />,
              nextPage: Math.min(totalPages, page + 1),
              disabled: page === totalPages || isSinglePage,
            })}
            {renderActionButton({
              label: "Last",
              icon: <ChevronDoubleRight className="h-4 w-4" />,
              nextPage: totalPages,
              disabled: page === totalPages || isSinglePage,
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[#5b6b7f]">
            <span>
              Showing {showingStart}-{showingEnd} of {totalItems}
            </span>
            <label className="inline-flex items-center gap-2">
              <span className="sr-only">Items per page</span>
              <select
                value={pageSize}
                onChange={(event) => handlePageSizeChange(event.target.value)}
                className="h-11 border border-[#d7dce5] bg-white px-4 text-sm font-medium text-[#243244] outline-none transition focus:border-[#2c7cf7] focus:ring-2 focus:ring-[#bfdbfe]"
              >
                {[12, 20, 40].map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
