// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://iubbxvipgofxasatmvzg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase chargé', supabase);
