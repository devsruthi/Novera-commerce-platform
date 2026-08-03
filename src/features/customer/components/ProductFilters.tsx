import type { BrowseSort } from '../../../services/productService'

export interface FilterState {
  q: string
  minPrice: string
  maxPrice: string
  minRating: string
  brand: string
  color: string
  size: string
  sort: BrowseSort
}

export const defaultFilters = (): FilterState => ({
  q: '',
  minPrice: '',
  maxPrice: '',
  minRating: '',
  brand: '',
  color: '',
  size: '',
  sort: 'newest',
})

const PRICE_MAX = 500

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42']

const RATING_CHIPS = [
  { value: '1', stars: 1 },
  { value: '2', stars: 2 },
  { value: '3', stars: 3 },
  { value: '4', stars: 4 },
]

/** Advanced filter controls matching the shop mockup. */
export function ProductFilters({
  value,
  brands,
  onChange,
  onApply,
  onReset,
}: {
  value: FilterState
  brands: string[]
  onChange: (next: FilterState) => void
  onApply: () => void
  onReset: () => void
}) {
  const set = <K extends keyof FilterState>(key: K, v: FilterState[K]) =>
    onChange({ ...value, [key]: v })

  const min = Math.min(
    PRICE_MAX,
    Math.max(0, value.minPrice === '' ? 0 : Number(value.minPrice) || 0),
  )
  const max = Math.min(
    PRICE_MAX,
    Math.max(min, value.maxPrice === '' ? PRICE_MAX : Number(value.maxPrice) || PRICE_MAX),
  )

  const fieldClass =
    'w-full rounded-xl border border-violet-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100'

  return (
    <aside className="w-full rounded-2xl border border-violet-100 bg-white p-4 shadow-md shadow-violet-100/60">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-800"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden>
            <path
              d="M4 4v6h6M20 20v-6h-6M5 15a7 7 0 0 0 12.2 3M19 9A7 7 0 0 0 6.8 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Reset all
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <label className="relative block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-400">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <input
            className={`${fieldClass} pl-9`}
            value={value.q}
            onChange={(e) => set('q', e.target.value)}
            placeholder="Search dresses, tops, shoes..."
          />
        </label>

        <div>
          <div className="mb-1.5 grid grid-cols-2 gap-2">
            <label className="block text-xs">
              <span className="mb-1 block font-medium text-slate-500">Min €</span>
              <input
                type="number"
                min={0}
                max={PRICE_MAX}
                className={fieldClass}
                value={value.minPrice === '' ? String(min) : value.minPrice}
                onChange={(e) => set('minPrice', e.target.value)}
              />
            </label>
            <label className="block text-xs">
              <span className="mb-1 block font-medium text-slate-500">Max €</span>
              <input
                type="number"
                min={0}
                max={PRICE_MAX}
                className={fieldClass}
                value={value.maxPrice === '' ? String(max) : value.maxPrice}
                onChange={(e) => set('maxPrice', e.target.value)}
              />
            </label>
          </div>
          <div className="relative mt-2 h-6">
            <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-violet-100" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-violet-500"
              style={{
                left: `${(min / PRICE_MAX) * 100}%`,
                right: `${100 - (max / PRICE_MAX) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={5}
              value={min}
              onChange={(e) => {
                const next = Math.min(Number(e.target.value), max)
                set('minPrice', String(next))
              }}
              className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-violet-600 [&::-webkit-slider-thumb]:shadow"
              aria-label="Minimum price"
            />
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={5}
              value={max}
              onChange={(e) => {
                const next = Math.max(Number(e.target.value), min)
                set('maxPrice', String(next))
              }}
              className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-violet-600 [&::-webkit-slider-thumb]:shadow"
              aria-label="Maximum price"
            />
          </div>
        </div>

        <label className="block text-xs">
          <select
            className={fieldClass}
            value={value.brand}
            onChange={(e) => set('brand', e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-1.5">
          {RATING_CHIPS.map((chip) => {
            const active = value.minRating === chip.value
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() =>
                  set('minRating', active ? '' : chip.value)
                }
                className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                  active
                    ? 'border-violet-400 bg-violet-100 text-violet-700'
                    : 'border-violet-200 bg-white text-slate-600 hover:border-violet-300'
                }`}
              >
                <span className="rating-star">{'★'.repeat(chip.stars)}</span> & up
              </button>
            )
          })}
        </div>

        <select
          className={fieldClass}
          value={value.size}
          onChange={(e) => set('size', e.target.value)}
        >
          <option value="">Any size</option>
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onApply}
          className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold !text-white transition hover:bg-violet-700"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
            <path
              d="M4 5h16l-6.5 7.5V19l-3 1.5v-8L4 5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          Apply filters
        </button>
      </div>
    </aside>
  )
}
