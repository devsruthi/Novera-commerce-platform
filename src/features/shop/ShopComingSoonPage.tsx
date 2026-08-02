import { useLocation } from 'react-router-dom'
import { shop } from './shopUi'

const TITLES: Record<string, { title: string; blurb: string }> = {
  orders: {
    title: 'Orders',
    blurb: 'Track and fulfill customer orders from one place.',
  },
  customers: {
    title: 'Customers',
    blurb: 'See who shops with you and how often they return.',
  },
  analytics: {
    title: 'Analytics',
    blurb: 'Deeper sales, traffic, and conversion insights.',
  },
  reviews: {
    title: 'Reviews',
    blurb: 'Moderate product reviews and reply to feedback.',
  },
  marketing: {
    title: 'Marketing',
    blurb: 'Run promotions, discounts, and store campaigns.',
  },
  support: {
    title: 'Support',
    blurb: 'Get help with your store and account.',
  },
}

/** Placeholder for shop-owner nav items not yet wired to data. */
export function ShopComingSoonPage() {
  const { pathname } = useLocation()
  const key = pathname.split('/').pop() || ''
  const meta = TITLES[key] ?? {
    title: 'Coming soon',
    blurb: 'This section is on the roadmap.',
  }

  return (
    <div className={shop.page}>
      <header>
        <h1 className={shop.title}>{meta.title}</h1>
        <p className={shop.subtitle}>{meta.blurb}</p>
      </header>
      <div className={`${shop.card} flex flex-col items-center px-6 py-16 text-center`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l2.5 2.5" />
          </svg>
        </span>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Coming soon
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          This page matches the Novera shop-owner navigation and will be wired
          once orders and customer data are available.
        </p>
      </div>
    </div>
  )
}
