import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const authHeader = req.headers.get('Authorization')

  // 1. Create a Supabase client with the SERVICE ROLE KEY (Admin access)
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', 
    { global: { headers: { Authorization: authHeader } } }
  )

  // 2. Get the user making the request
  const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser()

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  // 3. Delete the user from Supabase Auth
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 })
})