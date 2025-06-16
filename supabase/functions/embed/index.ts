// supabase/functions/embed/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  console.log("Fetching embedding...")

  const { method } = req

  // Allow preflight requests
  if (method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  }

  try {
    const { input } = await req.json()

    if (!input || typeof input !== "string") {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input,
      }),
    })

    const json = await response.json()

    if (!response.ok) {
      return new Response(JSON.stringify({ error: json.error }), {
        status: response.status,
        headers: { "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    const embedding = json.data[0].embedding
    return new Response(JSON.stringify({ embedding }), {
      headers: { "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
       },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
       },
    })
  }
})