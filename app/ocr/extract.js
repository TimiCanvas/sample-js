import fs from "fs";
import path from "path";
import { getGeminiModel } from "../gemini/client.js";
import { GENERATION_CONFIG } from "../config/settings.js";

const OCR_PROMPT = `...`; // unchanged

const MIME_MAP = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".tiff": "image/tiff",
};

export async function extractRawText(filePath) {
  const model = getGeminiModel();

  const ext = path.extname(filePath).toLowerCase();
  if (!MIME_MAP[ext]) {
    throw new Error(`Unsupported file type: ${ext}`);
  }

  const mimeType = MIME_MAP[ext];

  // ✅ THIS WAS MISSING
  const fileBytes = fs.readFileSync(filePath);

  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: OCR_PROMPT },
          {
            inlineData: {
              mimeType,
              data: Buffer.from(fileBytes).toString("base64"),
            },
          },
        ],
      },
    ],
    generationConfig: GENERATION_CONFIG,
  });

  return response.response.text();
}
