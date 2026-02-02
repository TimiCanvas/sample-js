import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL, GENERATION_CONFIG } from "../config/settings.js";

dotenv.config();

/**
 * Returns a configured Gemini client.
 * Deterministic and side-effect free.
 */
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY not found. Please set it in your environment or .env file."
    );
  }

  const client = new GoogleGenerativeAI(apiKey);

  return client;
}
