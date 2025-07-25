import { createClient } from "@supabase/supabase-js"

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabasekey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const suparrbase = createClient(supabaseUrl, supabasekey)

export default suparrbase
