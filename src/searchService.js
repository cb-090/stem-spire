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

export default async function search(query) {
  // const response = await fetch("https://api.openai.com/v1/embeddings", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${apiKey}`, // Not safe to do in frontend!
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-4",
  //     messages: [{ role: "user", content: prompt }]
  //   }),
  // });

  // const data = await response.json();
  // console.log(`Input: ${query}`)
  // console.log(`Model: text-embedding-3-small`)
  // console.log(`Embedding vector size: ${data.length}`)
  // console.log(data);
}