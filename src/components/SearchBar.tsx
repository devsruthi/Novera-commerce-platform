import { useId, type FormEvent } from 'react'
import { EXAMPLE_SEARCHES } from '../data/products'
import { useShop } from '../context/ShopContext'

interface SearchBarProps {
  compact?: boolean
}

export function SearchBar({ compact = false }: SearchBarProps) {
  const id = useId()
  const { query, setQuery, search, status } = useShop()
  const busy = status === 'parsing'

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void search()
  }

  return (
    <div className={`search-block ${compact ? 'is-compact' : 'is-hero-search'}`}>
      <form className="search-form" onSubmit={onSubmit} role="search">
        {!compact && (
          <span className="search-spark" aria-hidden>
            ✦
          </span>
        )}
        <label htmlFor={id} className="sr-only">
          Describe what you want to wear
        </label>
        <input
          id={id}
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Try "Blue dress for a wedding under €100"`}
          autoComplete="off"
          disabled={busy}
        />
        <button
          type="submit"
          className="search-submit"
          disabled={busy || !query.trim()}
          aria-label={busy ? 'Searching' : 'Find looks'}
        >
          {compact ? (busy ? 'Thinking…' : 'Find looks') : busy ? '…' : '→'}
        </button>
      </form>

      {!compact && (
        <div className="example-row" aria-label="Example searches">
          {EXAMPLE_SEARCHES.map((example) => (
            <button
              key={example.label}
              type="button"
              className="example-chip"
              onClick={() => {
                setQuery(example.query)
                void search(example.query)
              }}
              disabled={busy}
            >
              {example.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
