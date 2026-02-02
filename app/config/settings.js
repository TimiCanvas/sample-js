// js/config/settings.js

import path from "path";
import { fileURLToPath } from "url";

// __file__ equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// BASE_DIR = Path(__file__).resolve().parents[2]
export const BASE_DIR = path.resolve(__dirname, "..", "..");

// INPUT_DIR = BASE_DIR / "data" / "input"
export const INPUT_DIR = path.join(BASE_DIR, "data", "input");

// OUTPUT_DIR = BASE_DIR / "data" / "output"
export const OUTPUT_DIR = path.join(BASE_DIR, "data", "output");

// Gemini model
export const GEMINI_MODEL = "gemini-2.5-flash";

// Generation config (1:1 mapping)
export const GENERATION_CONFIG = {
  temperature: 0,
  top_p: 1,
  top_k: 1,
  max_output_tokens: 1_000_000,
};

// Allowed extensions (Python set → JS Set)
export const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".tiff",
]);
