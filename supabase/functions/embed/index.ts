// supabase/functions/embed/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  const { input } = await req.json()

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

  if (!response.ok) {
    return new Response("Failed to fetch embedding", { status: 500 })
  }

  const json = await response.json()
  return new Response(JSON.stringify({ embedding: json.data[0].embedding }), {
    headers: { "Content-Type": "application/json" },
  })
})
