<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  // ⚡ Remplace par tes infos Supabase
  const SUPABASE_URL = 'https://iubbxvipgofxasatmvzg.supabase.co';
  const SUPABASE_ANON_KEY = 'TON_ANON_KEY_ICI';

  export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>
