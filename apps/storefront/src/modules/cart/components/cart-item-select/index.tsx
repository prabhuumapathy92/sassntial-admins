"use client"

import { clx } from "@medusajs/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

import ChevronDown from "@modules/common/icons/chevron-down"

type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = "Select...", className, children, ...props }, ref) => {
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    return (
      <div
        onFocus={() => innerRef.current?.focus()}
        onBlur={() => innerRef.current?.blur()}
        className={clx(
          "group relative flex items-center overflow-hidden border border-[#d7dce5] bg-white text-sm font-medium text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-150 focus-within:border-[#2c7cf7] focus-within:ring-2 focus-within:ring-[#bfdbfe]",
          className,
          {
            "text-slate-400": isPlaceholder,
          }
        )}
      >
        <select
          ref={innerRef}
          {...props}
          className="h-full min-h-[44px] w-full appearance-none bg-transparent px-4 pr-10 outline-none"
        >
          <option disabled value="">
            {placeholder}
          </option>
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 text-slate-500 transition-transform duration-150 group-hover:translate-y-[1px]">
          <ChevronDown />
        </span>
      </div>
    )
  }
)

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect
