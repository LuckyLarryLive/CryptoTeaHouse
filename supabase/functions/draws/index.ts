import { corsHeaders } from '../_shared/cors.ts'

// @ts-ignore
Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Return empty draws array
    return new Response(
      JSON.stringify([]),
      { 
        headers: corsHeaders,
        status: 200 
      }
    )
  } catch (error) {
    console.error('Draws function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: corsHeaders,
        status: 500 
      }
    )
  }
}) 