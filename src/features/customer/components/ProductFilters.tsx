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

const COLORS = [
  'black',
  'white',
  'beige',
  'blue',
  'navy',
  'red',
  'green',
  'pink',
  'grey',
  'brown',
]

/** Advanced filter controls for the customer shop listing. */
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

  return (
    <aside className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-indigo-600"
        >
          Reset
        </button>
      </div>

      <label className="mb-3 block text-sm">
        <span className="mb-1 block text-stone-500">Search</span>
        <input
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={value.q}
          onChange={(e) => set('q', e.target.value)}
          placeholder="Dress, knit, sneakers…"
        />
      </label>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <label className="block text-sm">
          <span className="mb-1 block text-stone-500">Min €</span>
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={value.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-stone-500">Max €</span>
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-stone-200 px-3 py-2"
            value={value.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
          />
        </label>
      </div>

      <label className="mb-3 block text-sm">
        <span className="mb-1 block text-stone-500">Min rating</span>
        <select
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={value.minRating}
          onChange={(e) => set('minRating', e.target.value)}
        >
          <option value="">Any</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
        </select>
      </label>

      <label className="mb-3 block text-sm">
        <span className="mb-1 block text-stone-500">Brand</span>
        <select
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={value.brand}
          onChange={(e) => set('brand', e.target.value)}
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-3 block text-sm">
        <span className="mb-1 block text-stone-500">Color</span>
        <select
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={value.color}
          onChange={(e) => set('color', e.target.value)}
        >
          <option value="">Any color</option>
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-3 block text-sm">
        <span className="mb-1 block text-stone-500">Size</span>
        <input
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={value.size}
          onChange={(e) => set('size', e.target.value)}
          placeholder="e.g. M, 38"
        />
      </label>

      <label className="mb-4 block text-sm">
        <span className="mb-1 block text-stone-500">Sort</span>
        <select
          className="w-full rounded-xl border border-stone-200 px-3 py-2"
          value={value.sort}
          onChange={(e) => set('sort', e.target.value as BrowseSort)}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="rating">Top rated</option>
        </select>
      </label>

      <button
        type="button"
        onClick={onApply}
        className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Apply filters
      </button>
    </aside>
  )
}
