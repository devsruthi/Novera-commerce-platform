import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { aiApiPlugin } from './server/aiPlugin'

// Catalog no longer uses SerpAPI / FakeStore middleware — products come from Supabase.
// AI parse/chat stays on the Vite middleware for Phase 1 (isolated under features/ai).

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), aiApiPlugin(env)],
  }
})
