/** Shared class tokens for the Novera shop-owner dashboard. */
export const shop = {
  page: 'space-y-6',
  card: 'rounded-2xl border border-slate-200/80 bg-white shadow-sm',
  cardPad: 'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6',
  title: 'text-2xl font-bold tracking-tight text-slate-900',
  subtitle: 'mt-1 text-sm text-slate-500',
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60',
  btnSecondary:
    'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50',
  btnGhost:
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800',
  input:
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100',
  label: 'mb-1.5 block text-sm font-medium text-slate-700',
  sectionTitle: 'text-base font-semibold text-slate-900',
  pillActive: 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700',
  pillDanger: 'inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700',
  pillMuted: 'inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600',
} as const
