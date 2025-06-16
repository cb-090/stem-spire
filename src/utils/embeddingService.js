export default async function getEmbedding(query) {
  const res = await fetch('https://mtjpyqatrtujdzpsireh.functions.supabase.co/embed', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: query })
  })

  if (!res.ok) {
    const error = await res.json()
    console.log(error)
    throw new Error(error.error?.message || "Embedding failed")
  }

  const { embedding } = await res.json()
  return embedding
}

// import OpenAI from "openai";
// import { getAPIKey } from "./openAIConfig";

// const apiKey = getAPIKey()

// export default async function search(query) {
// const { Configuration, OpenAIApi } = require("openai");


// try {
//     const response = await openai.createEmbedding({
//       model: "text-embedding-ada-002", // Specify the embedding model
//       input: query,
//     });

//     // Extract the embedding vector
//     const embedding = response.data.data[0].embedding;
//     console.log("Embedding:", embedding);
//     return embedding;
//   }
//   catch (error) {
//     console.error("Error generating embedding:", error.response?.data || error.message);
//   }

// // Example usage
// const text = "OpenAI provides powerful tools for developers.";
// generateEmbedding(text);
// console.log(`Input: ${query}`)
// console.log(`Model: text-embedding-3-small`)
// console.log(`Embedding vector size: ${len(embedding_vector)}`)
    
//     return

// }