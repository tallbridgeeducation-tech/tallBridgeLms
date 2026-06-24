import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpcbdutzazgfylxkjjag.supabase.co';
const supabaseAnonKey = 'sb_publishable_Rp8RiwOQyTNRzilvLj79ig_0cRtj-no';

export const db = createClient(supabaseUrl, supabaseAnonKey);