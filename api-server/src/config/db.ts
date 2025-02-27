import { createClient } from '@supabase/supabase-js'
import { Config } from './env'

const supabaseUrl = Config.SUPABASE_PROJECT_URL
const supabaseAnonKey = Config.SUPABASE_ANON_KEY

export const db = createClient(supabaseUrl, supabaseAnonKey)