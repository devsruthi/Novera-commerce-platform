import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useShop } from '../context/ShopContext'
import { buildOutfitQuery, buildOutfitSlots, summarizeReviews } from '../lib/outfitBuilder'
import { formatMoney } from '../lib/catalogApi'
import type { Occasion } from '../types'

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'wedding', label: 'Wedding guest' },
  { value: 'office', label: 'Office' },
  { value: 'casual', label: 'Casual' },
  { value: 'party', label: 'Party' },
  { value: 'date', label: 'Date night' },
  { value: 'travel', label: 'Travel' },
  { value: 'sport', label: 'Sport / tech' },
]

const ASSISTANT_PROMPTS = [
  'Show cheaper options',
  'Higher rated only',
  'More formal',
  'Keep it casual',
  'Focus on jewelry',
]

export function FeaturePanels() {
  const { mode, results, compareIds, toggleCompare, chat, sendAssistant, search } =
    useShop()

  if (mode === 'outfit') return <OutfitPanel />
  if (mode === 'compare') {
    return (
      <ComparePanel
        results={results}
        compareIds={compareIds}
        toggleCompare={toggleCompare}
      />
    )
  }
  if (mode === 'assistant') {
    return <AssistantPanel chat={chat} sendAssistant={sendAssistant} />
  }
  if (mode === 'reviews') return <ReviewsPanel results={results} />
  return (
    <div className="feature-banner">
      <strong>AI Search</strong>
      <span>Natural-language intent → FakeStore catalog → ranked matches with reasons.</span>
      <button type="button" className="ghost-btn" onClick={() => void search('women clothing fashion')}>
        Browse clothing
      </button>
    </div>
  )
}

function OutfitPanel() {
  const { search, results, status, openProduct, sourceNote, sources } = useShop()
  const [occasion, setOccasion] = useState<Occasion>('wedding')
  const [budget, setBudget] = useState(100)
  const [notes, setNotes] = useState('')
  const slots = useMemo(() => buildOutfitSlots(results), [results])
  const usingShopping = sources.includes('serpapi')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void search(buildOutfitQuery(occasion, budget, notes), 'outfit')
  }

  return (
    <section className="feature-panel outfit-panel">
      <div className="feature-panel-head">
        <h2>Outfit Generator</h2>
        <p>
          Pick an occasion, budget, and style notes — we search{' '}
          <strong>Google Shopping via SerpAPI</strong> and list matching products
          with images and buy links.
        </p>
        {sourceNote && (
          <p className={`outfit-source-note ${usingShopping ? 'is-live' : ''}`}>
            {sourceNote}
          </p>
        )}
      </div>

      <form className="outfit-form" onSubmit={onSubmit}>
        <label>
          Occasion
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value as Occasion)}
          >
            {OCCASIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Max budget (€{budget})
          <input
            type="range"
            min={20}
            max={200}
            step={5}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
        </label>
        <label>
          Style notes / search
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. blue midi dress, silver jewelry, minimal"
          />
        </label>
        <button type="submit" className="solid-btn" disabled={status === 'parsing'}>
          {status === 'parsing' ? 'Searching Google Shopping…' : 'Generate outfit'}
        </button>
      </form>

      {status === 'ready' && slots.length === 0 && (
        <p className="feature-hint">
          No shopping matches yet. Add a style note or try another occasion, and
          make sure <code>SERPAPI_API_KEY</code> is set in <code>.env.local</code>.
        </p>
      )}

      {slots.length > 0 && (
        <div className="outfit-slots">
          {slots.map((item, i) => (
            <article key={item.product.id} className="outfit-slot">
              <button
                type="button"
                className="outfit-slot-main"
                onClick={() => openProduct(item.product.id)}
              >
                <span className="outfit-slot-label">Piece {i + 1}</span>
                <img src={item.product.imageUrl} alt="" />
                <div>
                  <p className="outfit-slot-brand">{item.product.brand}</p>
                  <h3>{item.product.name}</h3>
                  <p>{formatMoney(item.product.price, item.product.currency)}</p>
                  <small>{item.summary}</small>
                </div>
              </button>
              {item.product.productUrl ? (
                <a
                  className="outfit-buy-link"
                  href={item.product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop at {item.product.brand || 'retailer'}
                </a>
              ) : (
                <button
                  type="button"
                  className="outfit-buy-link is-muted"
                  onClick={() => openProduct(item.product.id)}
                >
                  View details
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function ComparePanel({
  results,
  compareIds,
  toggleCompare,
}: {
  results: ReturnType<typeof useShop>['results']
  compareIds: string[]
  toggleCompare: (id: string) => void
}) {
  const selected = results.filter((r) => compareIds.includes(r.product.id))

  return (
    <section className="feature-panel">
      <div className="feature-panel-head">
        <h2>Compare</h2>
        <p>Select up to 3 products below, then weigh price, rating, and match reasons.</p>
      </div>

      <div className="compare-picks">
        {results.slice(0, 8).map((item) => {
          const on = compareIds.includes(item.product.id)
          return (
            <button
              key={item.product.id}
              type="button"
              className={`compare-pick ${on ? 'is-on' : ''}`}
              onClick={() => toggleCompare(item.product.id)}
            >
              <img src={item.product.imageUrl} alt="" />
              <span>{on ? 'Selected' : 'Compare'}</span>
            </button>
          )
        })}
      </div>

      {selected.length >= 2 ? (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Attribute</th>
                {selected.map((item) => (
                  <th key={item.product.id}>{item.product.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Image</td>
                {selected.map((item) => (
                  <td key={item.product.id}>
                    <img
                      className="compare-thumb"
                      src={item.product.imageUrl}
                      alt=""
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td>Price</td>
                {selected.map((item) => (
                  <td key={item.product.id}>
                    {formatMoney(item.product.price, item.product.currency)}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Rating</td>
                {selected.map((item) => (
                  <td key={item.product.id}>
                    {item.product.rating.toFixed(1)}
                    <span className="rating-star">★</span> ({item.product.reviewCount})
                  </td>
                ))}
              </tr>
              <tr>
                <td>Category</td>
                {selected.map((item) => (
                  <td key={item.product.id}>{item.product.category}</td>
                ))}
              </tr>
              <tr>
                <td>Why it matches</td>
                {selected.map((item) => (
                  <td key={item.product.id}>{item.summary}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="feature-hint">Pick at least 2 items to compare.</p>
      )}
    </section>
  )
}

function AssistantPanel({
  chat,
  sendAssistant,
}: {
  chat: ReturnType<typeof useShop>['chat']
  sendAssistant: (text: string) => Promise<void>
}) {
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const log = logRef.current
    if (log) {
      log.scrollTop = log.scrollHeight
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [chat, busy])

  const onSend = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setBusy(true)
    try {
      await sendAssistant(trimmed)
      setDraft('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="feature-panel assistant-panel">
      <div className="assistant-panel-head">
        <img
          className="assistant-brand-icon"
          src="/novera-icon.png"
          alt=""
          width={40}
          height={40}
          aria-hidden
        />
        <div>
          <p className="assistant-kicker">Novera</p>
          <h2>AI Assistant</h2>
          <p>Chat to refine filters — results update underneath.</p>
        </div>
      </div>

      <div className="assistant-shell">
        <div className="chat-log" ref={logRef} aria-live="polite">
          {chat.map((m) => (
            <div key={m.id} className={`chat-row is-${m.role}`}>
              {m.role === 'assistant' && (
                <span className="chat-avatar" aria-hidden>
                  <img src="/novera-icon.png" alt="" width={22} height={22} />
                </span>
              )}
              <div className={`chat-bubble is-${m.role}`}>{m.text}</div>
            </div>
          ))}
          {busy && (
            <div className="chat-row is-assistant">
              <span className="chat-avatar" aria-hidden>
                <img src="/novera-icon.png" alt="" width={22} height={22} />
              </span>
              <div className="chat-bubble is-assistant is-typing" aria-label="Thinking">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={endRef} className="chat-end" />
        </div>

        <div className="assistant-composer">
          <div className="assistant-prompts">
            {ASSISTANT_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                className="example-chip dark"
                disabled={busy}
                onClick={() => void onSend(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <form
            className="assistant-form"
            onSubmit={(e) => {
              e.preventDefault()
              void onSend(draft)
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Tell me how to refine the list…"
              disabled={busy}
              aria-label="Message Novera assistant"
            />
            <button
              type="submit"
              className="solid-btn assistant-send"
              disabled={busy || !draft.trim()}
            >
              {busy ? '…' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function ReviewsPanel({
  results,
}: {
  results: ReturnType<typeof useShop>['results']
}) {
  const summary = useMemo(() => summarizeReviews(results), [results])

  return (
    <section className="feature-panel">
      <div className="feature-panel-head">
        <h2>Reviews Summary</h2>
        <p>Rating signals from FakeStore product reviews, rolled up for this shortlist.</p>
      </div>

      <div className="review-stats">
        <div>
          <strong>
            {summary.avgRating.toFixed(1)}
            <span className="rating-star">★</span>
          </strong>
          <span>Avg rating</span>
        </div>
        <div>
          <strong>{summary.totalReviews}</strong>
          <span>Total reviews</span>
        </div>
        <div>
          <strong>{results.length}</strong>
          <span>Items ranked</span>
        </div>
      </div>

      <ul className="review-insights">
        {summary.insights.map((insight) => (
          <li key={insight}>{insight}</li>
        ))}
      </ul>
    </section>
  )
}
