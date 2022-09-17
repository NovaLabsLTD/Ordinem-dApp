import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithTwitter() {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "twitter",
  });

  console.log({ user, session, error });
  
}
