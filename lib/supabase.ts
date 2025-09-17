import { createBrowserClient } from "@supabase/ssr"

const NEXT_PUBLIC_SUPABASE_URL = 'https://hnsnaafcoriabirletuj.supabase.co'
const NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhuc25hYWZjb3JpYWJpcmxldHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjAyOTEsImV4cCI6MjA3MzY5NjI5MX0.AueYyLDnuqlY__Z3UMizs6vxD6DFQktafC_F4DcphOc'

export function createClient() {
  return createBrowserClient(NEXT_PUBLIC_SUPABASE_URL!, NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Default client for client-side operations
export const supabase = createClient()
