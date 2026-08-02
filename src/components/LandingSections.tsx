import { useShop } from '../context/ShopContext'
import type { FeatureMode } from '../types'

const BRANDS = [
  'FakeStore',
  'Clothing',
  'Jewelery',
  'Electronics',
  "Men's",
  "Women's",
]

const FEATURES: Array<{
  title: string
  body: string
  action: string
  mode: FeatureMode
  query?: string
}> = [
  {
    title: 'AI Search',
    body: 'Describe an outfit in plain language and get ranked matches with reasons.',
    action: 'Try now',
    mode: 'search',
    query: 'I need elegant clothing under €100',
  },
  {
    title: 'Outfit Generator',
    body: 'Turn an occasion and budget into a shortlist that actually fits the brief.',
    action: 'Try now',
    mode: 'outfit',
  },
  {
    title: 'Compare',
    body: 'Weigh price, style cues, and relevance so the best pick rises to the top.',
    action: 'Explore',
    mode: 'compare',
  },
  {
    title: 'AI Assistant',
    body: 'Refine filters with chips instead of starting over every time.',
    action: 'Chat now',
    mode: 'assistant',
  },
  {
    title: 'Reviews Summary',
    body: 'Ratings and stock signals help you decide faster with less guesswork.',
    action: 'See how',
    mode: 'reviews',
  },
]

export function LandingSections() {
  const { openFeature } = useShop()

  return (
    <>
      <section className="brands-bar" aria-label="Catalog sources">
        <p className="brands-label">Powered by FakeStoreAPI categories</p>
        <div className="brands-row">
          {BRANDS.map((brand) => (
            <span key={brand} className="brand-logo">
              {brand}
            </span>
          ))}
          <span className="brand-logo is-more">v2.1.11</span>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="features-intro">
          <h2>
            AI makes <em>fashion simple</em>
          </h2>
          <p>
            From natural-language search to ranked recommendations — Styla keeps
            discovery fast, clear, and personal.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className="feature-card"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className="feature-icon" aria-hidden>
                ✦
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
              <button
                type="button"
                className="feature-link"
                onClick={() => void openFeature(feature.mode, feature.query)}
              >
                {feature.action} →
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-banner">
        <div className="trust-copy">
          <span className="trust-icon" aria-hidden>
            ✓
          </span>
          <p>
            Trusted, secure & transparent — Catalog data from FakeStoreAPI for
            prototyping. Clear rankings, no hidden fees.
          </p>
        </div>
        <a
          className="trust-link"
          href="https://fakestoreapi.com/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more →
        </a>
      </section>
    </>
  )
}
