import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'
import type { Category, CatalogResponse, Product, ProductSource } from '../src/types'
import { searchFakeStore } from './providers/fakestore'
import {
  searchSerpApiShopping,
  serpApiConfigured,
} from './providers/serpapi'

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function parseCategories(raw: string | null): Category[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) as Category[]
}

async function handleCatalogSearch(
  req: IncomingMessage,
  res: ServerResponse,
  env: Record<string, string>,
) {
  try {
    const url = new URL(req.url || '/', 'http://localhost')
    const q = url.searchParams.get('q') || 'fashion'
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')
    const limit = Number(url.searchParams.get('limit') || 24)
    const start = Number(url.searchParams.get('start') || 0)
    const categories = parseCategories(url.searchParams.get('categories'))

    const opts = {
      q,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 24,
      start: Number.isFinite(start) && start > 0 ? start : 0,
      categories,
    }

    let products: Product[] = []
    let source: ProductSource = 'fakestore'
    let note =
      'Catalog powered by FakeStoreAPI — add SERPAPI_API_KEY for Google Shopping.'
    let hasMore = false
    let nextStart: number | null = null

    if (serpApiConfigured(env)) {
      try {
        const page = await searchSerpApiShopping(env, opts)
        products = page.products
        hasMore = page.hasMore
        nextStart = page.nextStart
        source = 'serpapi'
        note =
          'Live Google Shopping via SerpAPI — product images and merchant links.'
      } catch (err) {
        const page = await searchFakeStore(opts)
        products = page.products
        hasMore = page.hasMore
        nextStart = page.nextStart
        note = `SerpAPI unavailable (${err instanceof Error ? err.message : 'error'}); FakeStore fallback.`
      }
    } else {
      const page = await searchFakeStore(opts)
      products = page.products
      hasMore = page.hasMore
      nextStart = page.nextStart
    }

    const sources = [...new Set(products.map((p) => p.source))]

    sendJson(res, 200, {
      products,
      source,
      sources,
      note,
      hasMore,
      nextStart,
    } satisfies CatalogResponse)
  } catch (err) {
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'Catalog search failed',
      products: [] as Product[],
      source: 'fakestore',
      sources: [],
      hasMore: false,
      nextStart: null,
    })
  }
}

export function catalogApiPlugin(env: Record<string, string>): Plugin {
  const mount = (middlewares: Connect.Server) => {
    middlewares.use((req, res, next) => {
      const pathname = (req.url || '/').split('?')[0]

      if (pathname === '/api/catalog/search') {
        if (req.method !== 'GET') {
          sendJson(res, 405, { error: 'Method not allowed' })
          return
        }
        void handleCatalogSearch(req, res, env)
        return
      }

      next()
    })
  }

  return {
    name: 'styla-catalog-api',
    configureServer(server) {
      mount(server.middlewares)
    },
    configurePreviewServer(server) {
      mount(server.middlewares)
    },
  }
}
