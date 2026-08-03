import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

/** Shared layout for login / signup / password flows. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-indigo-50 to-slate-100 text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <Link to="/" className="mb-8 text-center">
          <span className="text-3xl font-extrabold tracking-tight text-indigo-700">
            Novera
          </span>
        </Link>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-7 shadow-xl shadow-indigo-900/5 backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function AuthField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="mb-3 block text-sm">
      <span className="mb-1.5 block font-medium text-stone-700">{label}</span>
      {children}
    </label>
  )
}

export const authInputClass =
  'w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100'

export const authPrimaryBtnClass =
  'mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'
