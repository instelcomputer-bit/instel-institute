import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY

// Do not crash an entire lazy-loaded route when deployment variables are absent.
// The feature can now show a useful configuration error instead.
export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Certificate verification is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in the deployment environment, then redeploy.'
    )
  }

  return supabase
}
