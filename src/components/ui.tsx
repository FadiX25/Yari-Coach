import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement>

export function PrimaryButton({ className = '', children, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={
        'w-full rounded-2xl bg-[var(--color-volt)] px-6 py-4 font-display text-lg font-bold uppercase tracking-wide text-[var(--color-onaccent)] ' +
        'shadow-[0_10px_30px_-8px_rgba(255,210,0,0.55)] transition-all duration-200 ' +
        'hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none ' +
        className
      }
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ className = '', children, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={
        'w-full rounded-2xl border border-[var(--color-hair)] bg-[var(--color-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--color-bone)] ' +
        'transition-all duration-200 hover:border-[var(--color-volt)]/60 active:scale-[0.98] ' +
        className
      }
    >
      {children}
    </button>
  )
}

export function GhostLink({ className = '', children, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={
        'text-sm text-[var(--color-ash)] transition-colors hover:text-[var(--color-bone)] ' + className
      }
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Input                                                              */
/* ------------------------------------------------------------------ */

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string }

export function Input({ label, className = '', ...rest }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ash)]">
        {label}
      </span>
      <input
        {...rest}
        className={
          'w-full rounded-xl border border-[var(--color-hair)] bg-[var(--color-surface)] px-4 py-3.5 text-[15px] text-[var(--color-bone)] ' +
          'placeholder:text-[var(--color-ash)]/70 outline-none transition-all duration-150 ' +
          'focus:border-[var(--color-volt)] focus:ring-2 focus:ring-[var(--color-volt)]/30 ' +
          className
        }
      />
    </label>
  )
}

/* ------------------------------------------------------------------ */
/* Selectable card                                                    */
/* ------------------------------------------------------------------ */

export function SelectCard({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean
  onClick: () => void
  icon?: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <button
      onClick={onClick}
      className={
        'group flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 active:scale-[0.99] ' +
        (selected
          ? 'border-[var(--color-volt)] bg-[var(--color-volt)]/10 shadow-[inset_0_0_0_1px_rgba(255,210,0,0.4)]'
          : 'border-[var(--color-hair)] bg-[var(--color-surface)] hover:border-[var(--color-ash)]/60')
      }
    >
      {icon && (
        <span
          className={
            'flex size-11 shrink-0 items-center justify-center rounded-xl text-xl transition-colors ' +
            (selected ? 'bg-[var(--color-volt)] text-[var(--color-onaccent)]' : 'bg-[var(--color-surface-2)] text-[var(--color-bone)]')
          }
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-semibold uppercase tracking-wide text-[var(--color-bone)]">
          {title}
        </span>
        {subtitle && <span className="mt-0.5 block text-[13px] text-[var(--color-ash)]">{subtitle}</span>}
      </span>
      <span
        className={
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ' +
          (selected ? 'border-[var(--color-volt)] bg-[var(--color-volt)]' : 'border-[var(--color-hair)]')
        }
      >
        {selected && (
          <svg viewBox="0 0 24 24" className="size-3 text-[var(--color-onaccent)]" fill="none" stroke="currentColor" strokeWidth={4}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Chip (multi-select)                                                */
/* ------------------------------------------------------------------ */

export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95 ' +
        (selected
          ? 'border-[var(--color-volt)] bg-[var(--color-volt)] text-[var(--color-onaccent)]'
          : 'border-[var(--color-hair)] bg-[var(--color-surface)] text-[var(--color-bone)] hover:border-[var(--color-ash)]/60')
      }
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                       */
/* ------------------------------------------------------------------ */

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-hair)]">
      <div
        className="h-full rounded-full bg-[var(--color-volt)] transition-all duration-500 ease-out"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Rank badge — reusable hex badge for Bronze…GM                      */
/* ------------------------------------------------------------------ */

const RANKS: Record<string, [string, string]> = {
  Bronze: ['#c17a47', '#8a5027'],
  Silver: ['#cfd4dc', '#8b929c'],
  Gold: ['#ffd200', '#c79600'],
  Platinum: ['#7fe3d4', '#3fae9d'],
  Emerald: ['#4ade80', '#1f9d55'],
  Diamond: ['#7cc4ff', '#2f7fd1'],
  Master: ['#c084fc', '#8b3fd6'],
  GM: ['#ff5f6d', '#c22032'],
}

export function RankBadge({ rank = 'Gold', size = 88 }: { rank?: keyof typeof RANKS | string; size?: number }) {
  const [light, dark] = RANKS[rank] ?? RANKS.Gold
  const id = `rb-${String(rank)}`
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label={`${rank} rank badge`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      <path
        d="M50 4 L88 26 V74 L50 96 L12 74 V26 Z"
        fill={`url(#${id})`}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={2}
      />
      <path d="M50 4 L88 26 V74 L50 96 L12 74 V26 Z" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={1} transform="scale(0.86) translate(8 8)" />
      <path d="M33 52 l12 12 l22 -26" stroke="#0d0d0d" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.85} />
    </svg>
  )
}
