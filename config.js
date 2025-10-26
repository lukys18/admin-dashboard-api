// Supabase konfigurácia načítaná z Vercel environment variables
window.SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY
};
