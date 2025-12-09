import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://iubbxvipgofxasatmvzg.supabase.co',
  'sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1'
);

console.log("Supabase chargé");
