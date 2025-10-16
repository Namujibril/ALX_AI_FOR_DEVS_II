import { createClient } from '@supabase/supabase-js'

/**
 * Singleton Supabase client configured from NEXT_PUBLIC env variables.
 * Used for auth and data operations across the app.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
