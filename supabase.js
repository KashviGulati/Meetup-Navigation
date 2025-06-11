import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';  // 👈 from @env, NOT 'dotenv'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
