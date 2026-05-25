import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'
import { getSupabaseEnv } from './env'

export function createClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv()

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  )
}
