import { filtersToLabel } from '../lib/parseQuery'
import { useShop } from '../context/ShopContext'

export function FilterChips() {
  const { filters, removeChip, interpretation, confidence, status } = useShop()
  const chips = filtersToLabel(filters)

  if (status === 'idle' || (!chips.length && !interpretation)) return null

  return (
    <section className="filter-panel" aria-live="polite">
      <div className="filter-meta">
        <p className="interpretation">{interpretation}</p>
        {confidence > 0 && (
          <span className="confidence">
            {Math.round(confidence * 100)}% parse confidence
          </span>
        )}
      </div>
      {chips.length > 0 && (
        <ul className="chip-list">
          {chips.map((chip) => (
            <li key={chip}>
              <button
                type="button"
                className="filter-chip"
                onClick={() => removeChip(chip)}
                aria-label={`Remove ${chip}`}
              >
                {chip}
                <span aria-hidden>×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
