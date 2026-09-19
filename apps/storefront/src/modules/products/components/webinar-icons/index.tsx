import React from "react"

type IconProps = {
  className?: string
}

const base = "h-4 w-4"

export const ClockIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 7.5V12l3 1.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const LevelIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <path
      d="M4 19v-4m5 4V9m5 10V5m5 14v-7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

export const HashIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <path
      d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

export const CalendarIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <rect
      x="3.5"
      y="5"
      width="17"
      height="15"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M8 3.5V6.5M16 3.5V6.5M3.5 10h17"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

export const TagIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <path
      d="M11.4 3.6H5.1a1.5 1.5 0 0 0-1.5 1.5v6.3c0 .4.16.78.44 1.06l7.2 7.2a1.5 1.5 0 0 0 2.12 0l6.3-6.3a1.5 1.5 0 0 0 0-2.12l-7.2-7.2a1.5 1.5 0 0 0-1.06-.44Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" />
  </svg>
)

export const CheckIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <path
      d="m5 12.5 4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const InfoIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 11v5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="12" cy="7.9" r="1.1" fill="currentColor" />
  </svg>
)

export const HeartIcon = ({ className, filled }: IconProps & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <path
      d="M12 20.3s-7.5-4.6-7.5-9.6a4.3 4.3 0 0 1 7.5-2.9 4.3 4.3 0 0 1 7.5 2.9c0 5-7.5 9.6-7.5 9.6Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
)

export const PlayIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <path d="M8 5.5 18.5 12 8 18.5V5.5Z" fill="currentColor" />
  </svg>
)

export const MailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <rect
      x="3"
      y="5.5"
      width="18"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="m4 7 8 6 8-6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const PhoneIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <path
      d="M6.2 3.5h2.9l1.4 3.6-2 1.3a11.5 11.5 0 0 0 5.1 5.1l1.3-2 3.6 1.4v2.9a2 2 0 0 1-2.2 2 16.5 16.5 0 0 1-14.8-14.8 2 2 0 0 1 2-2.2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
)

export const ShareIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <circle cx="18" cy="5.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="18" cy="18.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="m8.3 10.8 7.4-4M8.3 13.2l7.4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

export const ShieldIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className ?? base} aria-hidden>
    <path
      d="M12 3 5 5.8v5.4c0 4.3 2.9 8.2 7 9.3 4.1-1.1 7-5 7-9.3V5.8L12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="m8.8 12 2.2 2.2 4.2-4.4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const FACT_ICONS = {
  clock: ClockIcon,
  level: LevelIcon,
  hash: HashIcon,
  calendar: CalendarIcon,
  tag: TagIcon,
} as const
