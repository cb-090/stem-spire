import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  const { text } = await req.json()

  if (!text) {
    return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
      status: 400,
    })
  }

  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")
  const model = "text-embedding-3-small"

  const openaiRes = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model,
    }),
  })

  const json = await openaiRes.json()

  if (!openaiRes.ok) {
    return new Response(JSON.stringify(json), { status: openaiRes.status })
  }

  return new Response(JSON.stringify({ embedding: json.data[0].embedding }), {
    headers: { "Content-Type": "application/json" },
  })
})