import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Extract userId from URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const userId = pathParts[pathParts.length - 1]

    if (!userId || userId === 'tickets') {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          headers: corsHeaders,
          status: 400 
        }
      )
    }

    // Return empty ticket data
    return new Response(
      JSON.stringify([
        { type: "daily", count: 0 },
        { type: "weekly", count: 0 },
        { type: "monthly", count: 0 },
        { type: "yearly", count: 0 }
      ]),
      { 
        headers: corsHeaders,
        status: 200 
      }
    )
  } catch (error) {
    console.error('Tickets function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: corsHeaders,
        status: 500 
      }
    )
  }
}) 