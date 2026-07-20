/**
 * Embedding Service
 * Generates vector embeddings using Ollama's nomic-embed-text model
 */
import { Ollama } from 'ollama';

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434'
});

const EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

/**
 * Generate embedding for a single text
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} - Embedding vector
 */
export async function embed(text) {
  try {
    const response = await ollama.embed({
      model: EMBED_MODEL,
      input: text
    });
    return response.embeddings[0];
  } catch (error) {
    console.error('❌ Embedding error:', error.message);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Generate embeddings for multiple texts (batch)
 * @param {string[]} texts - Array of texts to embed
 * @returns {Promise<number[][]>} - Array of embedding vectors
 */
export async function embedBatch(texts) {
  try {
    const response = await ollama.embed({
      model: EMBED_MODEL,
      input: texts
    });
    return response.embeddings;
  } catch (error) {
    console.error('❌ Batch embedding error:', error.message);
    throw new Error(`Failed to generate batch embeddings: ${error.message}`);
  }
}

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} - Cosine similarity (-1 to 1)
 */
export function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}
