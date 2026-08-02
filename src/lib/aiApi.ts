import type { ParseResult, SearchFilters } from '../types'

export async function parseQueryWithAI(query: string): Promise<ParseResult> {
  const res = await fetch('/api/ai/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const body = (await res.json().catch(() => ({}))) as ParseResult & {
    error?: string
  }
  if (!res.ok) {
    throw new Error(body.error || `AI parse failed (${res.status})`)
  }
  return body
}

export async function chatWithAI(input: {
  message: string
  filters?: SearchFilters
  resultCount?: number
  topProducts?: string[]
}): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = (await res.json().catch(() => ({}))) as {
    reply?: string
    error?: string
  }
  if (!res.ok) {
    throw new Error(body.error || `AI chat failed (${res.status})`)
  }
  return body.reply ?? 'I could not generate a reply right now.'
}
