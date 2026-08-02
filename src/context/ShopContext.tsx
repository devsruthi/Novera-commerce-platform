import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from 'react'
import { fetchCatalog, CATALOG_PAGE_SIZE } from '../lib/catalogApi'
import {
  describeFilters,
  filtersToQuery,
  suggestMissingFilters,
} from '../lib/parseQuery'
import { rankProducts, searchWithAI } from '../lib/rankProducts'
import { chatWithAI } from '../lib/aiApi'
import {
  addWishlistItem,
  fetchWishlist,
  removeWishlistItem,
} from '../lib/db/wishlist'
import { takePendingWishlistProduct } from '../lib/pendingWishlist'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type {
  ChatMessage,
  FeatureMode,
  Product,
  RankedProduct,
  SearchFilters,
  SortOption,
} from '../types'

type StylaHistoryState = {
  styla: 'home' | 'results'
  q?: string
  mode?: FeatureMode
}

function readHistory(): StylaHistoryState | null {
  const state = window.history.state as StylaHistoryState | null
  if (state?.styla === 'home' || state?.styla === 'results') return state
  return null
}

function goHomeUrl() {
  window.history.replaceState({ styla: 'home' } satisfies StylaHistoryState, '', '/')
}

function syncResultsUrl(q: string, mode: FeatureMode, replace: boolean) {
  const next: StylaHistoryState = { styla: 'results', q, mode }
  const url = `/?q=${encodeURIComponent(q)}&mode=${mode}`
  if (replace) window.history.replaceState(next, '', url)
  else window.history.pushState(next, '', url)
}

interface ShopState {
  query: string
  filters: SearchFilters
  interpretation: string
  confidence: number
  suggestions: string[]
  results: RankedProduct[]
  catalog: Product[]
  sourceNote: string
  sources: string[]
  sort: SortOption
  status: 'idle' | 'parsing' | 'ready' | 'error'
  error: string | null
  wishlist: Product[]
  hasSearched: boolean
  mode: FeatureMode
  compareIds: string[]
  chat: ChatMessage[]
  selectedProductId: string | null
  hasMore: boolean
  nextStart: number | null
}

type Action =
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_SORT'; sort: SortOption }
  | { type: 'SET_MODE'; mode: FeatureMode }
  | { type: 'SEARCH_START'; mode?: FeatureMode }
  | {
      type: 'SEARCH_SUCCESS'
      payload: {
        filters: SearchFilters
        interpretation: string
        confidence: number
        suggestions: string[]
        results: RankedProduct[]
        catalog: Product[]
        sourceNote: string
        sources: string[]
        mode?: FeatureMode
        hasMore: boolean
        nextStart: number | null
      }
    }
  | {
      type: 'APPEND_RESULTS'
      payload: {
        catalog: Product[]
        hasMore: boolean
        nextStart: number | null
      }
    }
  | { type: 'SEARCH_ERROR'; error: string }
  | { type: 'REMOVE_FILTER_CHIP'; chip: string }
  | { type: 'TOGGLE_WISHLIST'; product: Product }
  | { type: 'REMOVE_WISHLIST'; productId: string }
  | { type: 'SET_WISHLIST'; products: Product[] }
  | { type: 'TOGGLE_COMPARE'; productId: string }
  | { type: 'SET_COMPARE'; productIds: string[] }
  | { type: 'ADD_CHAT'; message: ChatMessage }
  | { type: 'OPEN_PRODUCT'; productId: string }
  | { type: 'CLOSE_PRODUCT' }
  | { type: 'CLEAR' }

const initialFilters: SearchFilters = {
  query: '',
  categories: [],
  colors: [],
  occasions: [],
  maxPrice: null,
  minPrice: null,
  brands: [],
  sizes: [],
  tags: [],
}

const welcomeChat: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hi — I can refine your results. Try “cheaper”, “higher rated”, or “more formal”.',
}

const initialState: ShopState = {
  query: '',
  filters: initialFilters,
  interpretation: '',
  confidence: 0,
  suggestions: [],
  results: [],
  catalog: [],
  sourceNote: '',
  sources: [],
  sort: 'relevance',
  status: 'idle',
  error: null,
  wishlist: [],
  hasSearched: false,
  mode: 'search',
  compareIds: [],
  chat: [welcomeChat],
  selectedProductId: null,
  hasMore: false,
  nextStart: null,
}

function removeChip(filters: SearchFilters, chip: string): SearchFilters {
  const next = {
    ...filters,
    colors: [...filters.colors],
    categories: [...filters.categories],
    occasions: [...filters.occasions],
    brands: [...filters.brands],
    tags: [...filters.tags],
  }
  if (chip.startsWith('Color: ')) {
    next.colors = next.colors.filter((c) => c !== chip.slice(7))
  } else if (chip.startsWith('Category: ')) {
    next.categories = next.categories.filter((c) => c !== chip.slice(10))
  } else if (chip.startsWith('Occasion: ')) {
    next.occasions = next.occasions.filter((o) => o !== chip.slice(10))
  } else if (chip.startsWith('Max €') || chip.startsWith('Max ')) {
    next.maxPrice = null
  } else if (chip.startsWith('Min €') || chip.startsWith('Min ')) {
    next.minPrice = null
  } else if (chip.startsWith('Style: ')) {
    next.tags = next.tags.filter((t) => t !== chip.slice(7))
  } else if (chip.startsWith('Brand: ')) {
    next.brands = next.brands.filter((b) => b !== chip.slice(7))
  }
  return next
}

function reducer(state: ShopState, action: Action): ShopState {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.query }
    case 'SET_MODE':
      return { ...state, mode: action.mode }
    case 'SET_SORT': {
      const results = rankProducts(state.filters, action.sort, state.catalog)
      return { ...state, sort: action.sort, results }
    }
    case 'SEARCH_START':
      return {
        ...state,
        status: 'parsing',
        error: null,
        hasSearched: true,
        mode: action.mode ?? state.mode,
        hasMore: false,
        nextStart: null,
      }
    case 'SEARCH_SUCCESS': {
      const mode = action.payload.mode ?? state.mode
      const topIds = action.payload.results.slice(0, 3).map((r) => r.product.id)
      return {
        ...state,
        status: 'ready',
        mode,
        filters: action.payload.filters,
        interpretation: action.payload.interpretation,
        confidence: action.payload.confidence,
        suggestions: action.payload.suggestions,
        results: action.payload.results,
        catalog: action.payload.catalog,
        sourceNote: action.payload.sourceNote,
        sources: action.payload.sources,
        query: action.payload.filters.query || state.query,
        compareIds: mode === 'compare' ? topIds : state.compareIds,
        sort: mode === 'reviews' ? 'rating' : state.sort,
        hasMore: action.payload.hasMore,
        nextStart: action.payload.nextStart,
      }
    }
    case 'APPEND_RESULTS': {
      const seen = new Set(state.catalog.map((p) => p.id))
      const mergedCatalog = [
        ...state.catalog,
        ...action.payload.catalog.filter((p) => !seen.has(p.id)),
      ]
      return {
        ...state,
        catalog: mergedCatalog,
        results: rankProducts(state.filters, state.sort, mergedCatalog),
        hasMore: action.payload.hasMore,
        nextStart: action.payload.nextStart,
      }
    }
    case 'SEARCH_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'REMOVE_FILTER_CHIP': {
      const next = removeChip(state.filters, action.chip)
      const query = filtersToQuery(next)
      const filters = { ...next, query }
      return {
        ...state,
        query,
        filters,
        interpretation: describeFilters(filters),
        suggestions: suggestMissingFilters(filters),
        results: rankProducts(filters, state.sort, state.catalog),
        status: 'parsing',
        error: null,
        hasMore: false,
        nextStart: null,
      }
    }
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.some((p) => p.id === action.product.id)
      return {
        ...state,
        wishlist: exists
          ? state.wishlist.filter((p) => p.id !== action.product.id)
          : [...state.wishlist, action.product],
      }
    }
    case 'REMOVE_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter((p) => p.id !== action.productId),
      }
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.products }
    case 'TOGGLE_COMPARE': {
      const exists = state.compareIds.includes(action.productId)
      if (exists) {
        return {
          ...state,
          compareIds: state.compareIds.filter((id) => id !== action.productId),
        }
      }
      if (state.compareIds.length >= 3) return state
      return { ...state, compareIds: [...state.compareIds, action.productId] }
    }
    case 'SET_COMPARE':
      return { ...state, compareIds: action.productIds.slice(0, 3) }
    case 'ADD_CHAT':
      return { ...state, chat: [...state.chat, action.message] }
    case 'OPEN_PRODUCT':
      return { ...state, selectedProductId: action.productId }
    case 'CLOSE_PRODUCT':
      return { ...state, selectedProductId: null }
    case 'CLEAR':
      return { ...initialState, wishlist: state.wishlist }
    default:
      return state
  }
}

interface ShopContextValue extends ShopState {
  isPending: boolean
  loadingMore: boolean
  setQuery: (q: string) => void
  setSort: (s: SortOption) => void
  setMode: (m: FeatureMode) => void
  search: (q?: string, mode?: FeatureMode) => Promise<void>
  loadMore: () => Promise<void>
  openFeature: (mode: FeatureMode, query?: string) => Promise<void>
  removeChip: (chip: string) => void
  wishlistOpen: boolean
  toggleWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  openWishlist: () => void
  closeWishlist: () => void
  toggleCompare: (id: string) => void
  openProduct: (id: string) => void
  closeProduct: () => void
  selectedProduct: RankedProduct | null
  sendAssistant: (text: string) => Promise<void>
  clear: () => void
  goBack: () => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

const FEATURE_SEED: Record<FeatureMode, string> = {
  search: 'I need a blue dress for a wedding under €100',
  outfit: 'elegant clothing jewelery for wedding guest under €100',
  compare: 'clothing fashion under €80',
  assistant: 'casual clothing everyday wear',
  reviews: 'top rated clothing electronics jewelery',
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { user, pendingSaveProductId, clearPendingSave } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [isPending, startTransition] = useTransition()
  const skipNextPush = useRef(false)
  const searchRef = useRef<(q?: string, mode?: FeatureMode) => Promise<void>>(
    async () => {},
  )
  const loadingMoreRef = useRef(false)
  /** Ignore stale catalog responses when chips are removed quickly. */
  const filterRequestId = useRef(0)
  const stateRef = useRef(state)
  stateRef.current = state

  // Wishlist from Supabase (per signed-in user)
  useEffect(() => {
    if (!user?.id || !isSupabaseConfigured) {
      dispatch({ type: 'SET_WISHLIST', products: [] })
      return
    }

    const userId = user.id
    let cancelled = false

    void (async () => {
      try {
        let products = await fetchWishlist(userId)
        if (cancelled) return

        if (pendingSaveProductId) {
          const found =
            takePendingWishlistProduct(pendingSaveProductId) ??
            stateRef.current.catalog.find((p) => p.id === pendingSaveProductId) ??
            stateRef.current.results.find(
              (r) => r.product.id === pendingSaveProductId,
            )?.product
          if (found && !products.some((p) => p.id === found.id)) {
            products = [...products, found]
            await addWishlistItem(userId, found).catch(() => {})
          }
          if (!cancelled) clearPendingSave()
        }

        if (!cancelled) dispatch({ type: 'SET_WISHLIST', products })
      } catch {
        if (!cancelled) dispatch({ type: 'SET_WISHLIST', products: [] })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, pendingSaveProductId, clearPendingSave])

  const setQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_QUERY', query })
  }, [])

  const setSort = useCallback((sort: SortOption) => {
    startTransition(() => {
      dispatch({ type: 'SET_SORT', sort })
    })
  }, [])

  const setMode = useCallback((mode: FeatureMode) => {
    dispatch({ type: 'SET_MODE', mode })
  }, [])

  const search = useCallback(
    async (raw?: string, mode?: FeatureMode) => {
      const q = (raw ?? stateRef.current.query).trim()
      if (!q) return
      const nextMode = mode ?? stateRef.current.mode
      filterRequestId.current += 1
      const requestId = filterRequestId.current
      dispatch({ type: 'SET_QUERY', query: q })
      dispatch({ type: 'SEARCH_START', mode: nextMode })
      try {
        const sort =
          nextMode === 'reviews' ? 'rating' : stateRef.current.sort
        const result = await searchWithAI(q, sort)
        if (requestId !== filterRequestId.current) return
        startTransition(() => {
          dispatch({
            type: 'SEARCH_SUCCESS',
            payload: {
              filters: result.filters,
              interpretation: result.interpretation,
              confidence: result.confidence,
              suggestions: result.suggestions,
              results: result.ranked,
              catalog: result.catalog,
              sourceNote: result.sourceNote,
              sources: result.sources,
              mode: nextMode,
              hasMore: result.hasMore,
              nextStart: result.nextStart,
            },
          })
        })

        if (skipNextPush.current) {
          skipNextPush.current = false
        } else {
          const replace = readHistory()?.styla === 'results'
          syncResultsUrl(q, nextMode, replace)
        }
      } catch (err) {
        if (requestId !== filterRequestId.current) return
        dispatch({
          type: 'SEARCH_ERROR',
          error:
            err instanceof Error
              ? err.message
              : 'Something went wrong fetching products.',
        })
      }
    },
    [],
  )

  searchRef.current = search

  const loadMore = useCallback(async () => {
    const current = stateRef.current
    if (
      !current.hasMore ||
      current.nextStart == null ||
      loadingMoreRef.current ||
      current.status !== 'ready'
    ) {
      return
    }

    loadingMoreRef.current = true
    setLoadingMore(true)
    try {
      const page = await fetchCatalog(current.filters, {
        start: current.nextStart,
        limit: CATALOG_PAGE_SIZE,
      })
      startTransition(() => {
        dispatch({
          type: 'APPEND_RESULTS',
          payload: {
            catalog: page.products,
            hasMore: Boolean(page.hasMore),
            nextStart: page.nextStart ?? null,
          },
        })
      })
    } catch {
      /* keep existing results; user can retry Load more */
    } finally {
      loadingMoreRef.current = false
      setLoadingMore(false)
    }
  }, [])

  const openFeature = useCallback(
    async (mode: FeatureMode, query?: string) => {
      const q = (query ?? FEATURE_SEED[mode]).trim()
      await search(q, mode)
    },
    [search],
  )

  const removeChipAction = useCallback((chip: string) => {
    const next = removeChip(stateRef.current.filters, chip)
    const query = filtersToQuery(next)
    const filters = { ...next, query }
    const sort = stateRef.current.sort
    const mode = stateRef.current.mode
    const interpretation = describeFilters(filters)
    const suggestions = suggestMissingFilters(filters)
    const requestId = ++filterRequestId.current

    dispatch({ type: 'REMOVE_FILTER_CHIP', chip })
    syncResultsUrl(query, mode, true)

    void (async () => {
      try {
        const page = await fetchCatalog(filters)
        if (requestId !== filterRequestId.current) return

        startTransition(() => {
          dispatch({
            type: 'SEARCH_SUCCESS',
            payload: {
              filters,
              interpretation,
              confidence: stateRef.current.confidence,
              suggestions,
              results: rankProducts(filters, sort, page.products),
              catalog: page.products,
              sourceNote: page.note ?? '',
              sources: page.sources,
              hasMore: Boolean(page.hasMore),
              nextStart: page.nextStart ?? null,
            },
          })
        })
      } catch (err) {
        if (requestId !== filterRequestId.current) return
        dispatch({
          type: 'SEARCH_ERROR',
          error:
            err instanceof Error
              ? err.message
              : 'Could not refresh products after updating filters.',
        })
      }
    })()
  }, [])

  const toggleWishlist = useCallback(
    (product: Product) => {
      const exists = stateRef.current.wishlist.some((p) => p.id === product.id)
      dispatch({ type: 'TOGGLE_WISHLIST', product })
      if (!user?.id || !isSupabaseConfigured) return
      if (exists) {
        void removeWishlistItem(user.id, product.id).catch(() => {})
      } else {
        void addWishlistItem(user.id, product).catch(() => {})
      }
    },
    [user?.id],
  )

  const removeFromWishlist = useCallback(
    (productId: string) => {
      dispatch({ type: 'REMOVE_WISHLIST', productId })
      if (user?.id && isSupabaseConfigured) {
        void removeWishlistItem(user.id, productId).catch(() => {})
      }
    },
    [user?.id],
  )

  const openWishlist = useCallback(() => {
    setWishlistOpen(true)
  }, [])

  const closeWishlist = useCallback(() => {
    setWishlistOpen(false)
  }, [])

  const toggleCompare = useCallback((productId: string) => {
    dispatch({ type: 'TOGGLE_COMPARE', productId })
  }, [])

  const openProduct = useCallback((productId: string) => {
    dispatch({ type: 'OPEN_PRODUCT', productId })
  }, [])

  const closeProduct = useCallback(() => {
    dispatch({ type: 'CLOSE_PRODUCT' })
  }, [])

  const sendAssistant = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      dispatch({
        type: 'ADD_CHAT',
        message: { id: crypto.randomUUID(), role: 'user', text: trimmed },
      })

      const current = stateRef.current
      let reply =
        'Searching with your new intent and re-ranking catalog results.'
      try {
        reply = await chatWithAI({
          message: trimmed,
          filters: current.filters,
          resultCount: current.results.length,
          topProducts: current.results.slice(0, 5).map((r) => r.product.name),
        })
      } catch {
        /* keep default reply */
      }

      dispatch({
        type: 'ADD_CHAT',
        message: { id: crypto.randomUUID(), role: 'assistant', text: reply },
      })

      await search(trimmed, 'assistant')
    },
    [search],
  )

  const clear = useCallback(() => {
    setWishlistOpen(false)
    dispatch({ type: 'CLEAR' })
    goHomeUrl()
  }, [])

  const goBack = useCallback(() => {
    if (wishlistOpen) {
      setWishlistOpen(false)
      return
    }
    if (readHistory()?.styla === 'results') {
      window.history.back()
      return
    }
    dispatch({ type: 'CLEAR' })
    goHomeUrl()
  }, [wishlistOpen])

  useEffect(() => {
    if (!readHistory()) {
      const params = new URLSearchParams(window.location.search)
      const q = params.get('q')?.trim()
      const mode = (params.get('mode') as FeatureMode | null) ?? 'search'
      if (q) {
        window.history.replaceState(
          { styla: 'results', q, mode } satisfies StylaHistoryState,
          '',
          `/?q=${encodeURIComponent(q)}&mode=${mode}`,
        )
        skipNextPush.current = true
        void searchRef.current(q, mode)
      } else {
        goHomeUrl()
      }
    }

    const onPopState = (event: PopStateEvent) => {
      const view = (event.state as StylaHistoryState | null)?.styla
      const q = (event.state as StylaHistoryState | null)?.q
      const mode = (event.state as StylaHistoryState | null)?.mode ?? 'search'

      if (view === 'results' && q) {
        skipNextPush.current = true
        void searchRef.current(q, mode)
        return
      }

      dispatch({ type: 'CLEAR' })
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const selectedProduct = useMemo(() => {
    if (!state.selectedProductId) return null
    const fromResults = state.results.find(
      (r) => r.product.id === state.selectedProductId,
    )
    if (fromResults) return fromResults

    const fromWishlist = state.wishlist.find(
      (p) => p.id === state.selectedProductId,
    )
    if (!fromWishlist) return null

    return {
      product: fromWishlist,
      score: 0,
      reasons: [],
      summary: 'Saved in your wishlist',
    } satisfies RankedProduct
  }, [state.selectedProductId, state.results, state.wishlist])

  const value = useMemo<ShopContextValue>(
    () => ({
      ...state,
      isPending,
      loadingMore,
      wishlistOpen,
      selectedProduct,
      setQuery,
      setSort,
      setMode,
      search,
      loadMore,
      openFeature,
      removeChip: removeChipAction,
      toggleWishlist,
      removeFromWishlist,
      openWishlist,
      closeWishlist,
      toggleCompare,
      openProduct,
      closeProduct,
      sendAssistant,
      clear,
      goBack,
    }),
    [
      state,
      isPending,
      loadingMore,
      wishlistOpen,
      selectedProduct,
      setQuery,
      setSort,
      setMode,
      search,
      loadMore,
      openFeature,
      removeChipAction,
      toggleWishlist,
      removeFromWishlist,
      openWishlist,
      closeWishlist,
      toggleCompare,
      openProduct,
      closeProduct,
      sendAssistant,
      clear,
      goBack,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
