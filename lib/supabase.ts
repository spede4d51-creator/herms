import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = 'https://ihapcvknqlpvoggksmof.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYXBjdmtucWxwdm9nZ2tzbW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODg2MTIsImV4cCI6MjA3MDA2NDYxMn0.5oERCCNnHAnFPW7liVC0S3mHE_jI-UOWHQ0oyaGOMg4'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
