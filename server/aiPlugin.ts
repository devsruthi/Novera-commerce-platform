import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'
import OpenAI from 'openai'
import { parseQuery } from '../src/lib/parseQuery'
import type { ParseResult, SearchFilters } from '../src/types'

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

async function readJsonBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {} as T
  return JSON.parse(raw) as T
}

function getClient(apiKey: string | undefined) {
  if (!apiKey) return null
  return new OpenAI({ apiKey })
}

async function handleParse(
  req: IncomingMessage,
  res: ServerResponse,
  env: Record<string, string>,
) {
  const body = await readJsonBody<{ query?: string }>(req)
  const query = (body.query ?? '').trim()
  if (!query) {
    sendJson(res, 400, { error: 'query is required' })
    return
  }

  const fallback = parseQuery(query)
  const client = getClient(env.OPENAI_API_KEY)
  if (!client) {
    sendJson(res, 200, { ...fallback, source: 'rules' })
    return
  }

  try {
    const model = env.OPENAI_MODEL || 'gpt-4o-mini'
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a shopping intent parser for a fashion/electronics store.
Return JSON with keys:
filters: { query, categories[], colors[], occasions[], maxPrice, minPrice, brands[], sizes[], tags[] }
interpretation: string
confidence: number 0-1
suggestions: string[] (2-4 short follow-up queries)

Valid categories: dresses, tops, bottoms, outerwear, shoes, accessories, electronics, other
Valid colors: black, white, blue, navy, red, green, beige, pink, grey, brown, yellow, purple, orange, multicolor
Valid occasions: wedding, office, casual, party, date, sport, travel
Prices are EUR. Use null for unknown min/maxPrice.`,
        },
        { role: 'user', content: query },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(raw) as Partial<ParseResult>
    const filters: SearchFilters = {
      ...fallback.filters,
      ...(parsed.filters ?? {}),
      query: parsed.filters?.query || query,
    }
    sendJson(res, 200, {
      filters,
      interpretation: parsed.interpretation || fallback.interpretation,
      confidence:
        typeof parsed.confidence === 'number'
          ? parsed.confidence
          : fallback.confidence,
      suggestions:
        Array.isArray(parsed.suggestions) && parsed.suggestions.length
          ? parsed.suggestions
          : fallback.suggestions,
      source: 'openai',
    } satisfies ParseResult & { source: string })
  } catch {
    sendJson(res, 200, { ...fallback, source: 'rules-fallback' })
  }
}

async function handleChat(
  req: IncomingMessage,
  res: ServerResponse,
  env: Record<string, string>,
) {
  const body = await readJsonBody<{
    message?: string
    filters?: SearchFilters
    resultCount?: number
    topProducts?: string[]
  }>(req)
  const message = (body.message ?? '').trim()
  if (!message) {
    sendJson(res, 400, { error: 'message is required' })
    return
  }

  const client = getClient(env.OPENAI_API_KEY)
  if (!client) {
    sendJson(res, 200, {
      reply:
        'AI chat needs OPENAI_API_KEY. For now, try refining your search with colors, budget, or occasion.',
      source: 'fallback',
    })
    return
  }

  try {
    const model = env.OPENAI_MODEL || 'gpt-4o-mini'
    const context = JSON.stringify({
      filters: body.filters ?? null,
      resultCount: body.resultCount ?? 0,
      topProducts: body.topProducts ?? [],
    })
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: `You are Styla, a concise shopping assistant.
Give short, helpful fashion/product advice (2-4 sentences).
Context about the current results: ${context}`,
        },
        { role: 'user', content: message },
      ],
    })
    sendJson(res, 200, {
      reply:
        completion.choices[0]?.message?.content?.trim() ||
        'Try adjusting color, budget, or occasion.',
      source: 'openai',
    })
  } catch (err) {
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'OpenAI chat failed',
    })
  }
}

export function aiApiPlugin(env: Record<string, string>): Plugin {
  const mount = (middlewares: Connect.Server) => {
    middlewares.use((req, res, next) => {
      const pathname = (req.url || '/').split('?')[0]

      if (pathname === '/api/ai/parse' && req.method === 'POST') {
        void handleParse(req, res, env).catch((err) => {
          sendJson(res, 500, {
            error: err instanceof Error ? err.message : 'AI parse failed',
          })
        })
        return
      }

      if (pathname === '/api/ai/chat' && req.method === 'POST') {
        void handleChat(req, res, env).catch((err) => {
          sendJson(res, 500, {
            error: err instanceof Error ? err.message : 'AI chat failed',
          })
        })
        return
      }

      next()
    })
  }

  return {
    name: 'styla-ai-api',
    configureServer(server) {
      mount(server.middlewares)
    },
    configurePreviewServer(server) {
      mount(server.middlewares)
    },
  }
}
