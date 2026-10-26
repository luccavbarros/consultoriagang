/* Supabase connection for the login areas.
   The anon (publishable) key is safe here: what each person can see is decided by the rules in supabase/schema.sql.
   Never put the service_role key in this file — that one lives only in Vercel's Environment Variables. */
window.GANG_SUPABASE = {
  url: 'https://zciglalkvmnoleevnuei.supabase.co',
  anonKey: 'sb_publishable_c10r0cEb99JB3Gu4ejGkvw_AJooo9oQ',
};
