import fs from "fs";
import path from "path";
import { getGeminiModel } from "../gemini/client.js";
import { GENERATION_CONFIG } from "../config/settings.js";

export const OCR_PROMPT = `
You are extracting data from a fixed-format shipping manifest PDF or Image.

This document has:
- One set of document headers (appears once at the top of the document)
- One tabular section that may span multiple pages
- Repeated page headers and column headers that MUST be ignored after the first occurrence

Your task is STRICTLY STRUCTURAL extraction.

========================
STEP 1 — DOCUMENT HEADERS
========================

Extract the following headers ONCE and ONLY ONCE:

- shipping_line
- voyage
- master_name
- pod

Rules:
- Do NOT repeat these headers later
- Extract them exactly as written
- Preserve capitalization
- Ignore addresses and agent details

Output them exactly in this format:

HEADERS:
shipping_line: <value>
voyage: <value>
master_name: <value>
pod: <value>

========================
STEP 2 — TABLE SCHEMA
========================

The table columns in this document ALWAYS follow this exact order:

1. S/N
2. Code
3. POL
4. B/L No
5. Shipper
6. Consignee
7. Notify
8. Year
9. Make/Model
10. Chassis
11. KGS
12. CBM
13. Remarks

Rules:
- DO NOT output the column names again
- DO NOT reorder columns
- DO NOT infer or rename columns
- If a value is missing, output NULL
- Numeric values must be extracted exactly as written (e.g. 12,600 → 12600)

========================
STEP 3 — ROW EXTRACTION
========================

Extract ALL vehicle rows from the table.

Rules:
- Start from row S/N = 1
- Continue sequentially until the LAST ROW on the LAST PAGE
- Do NOT stop early
- Do NOT skip rows
- Do NOT merge rows
- Do NOT include page numbers, page headers, or repeated column headers
- Ignore any text outside the table

========================
STEP 4 — OUTPUT FORMAT
========================

Output MUST follow this exact format:

HEADERS:
shipping_line: ...
voyage: ...
master_name: ...
pod: ...

ROWS:
S/N | Code | POL | B/L No | Shipper | Consignee | Notify | Year | Make/Model | Chassis | KGS | CBM | Remarks
<row 1>
<row 2>
<row 3>
...
<last row>

Rules:
- Use a single pipe (|) as column separator
- One row per line
- No extra commentary
- No markdown
- No explanations
- No repeated headers
- No blank lines inside ROWS

========================
IMPORTANT
========================

- Extract data from ALL pages
- Do NOT stop until the final row on the final page
- Accuracy and completeness are more important than brevity
`;

const MIME_MAP = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".tiff": "image/tiff",
};

/**
 * Sends a PDF or image document to Gemini and returns extracted structured text.
 * @param {string} filePath
 * @returns {Promise<string>}
 */
export async function extractRawText(filePath) {
  const client = getGeminiModel();

  const ext = path.extname(filePath).toLowerCase();
  if (!MIME_MAP[ext]) {
    throw new Error(`Unsupported file type: ${ext}`);
  }

  const mimeType = MIME_MAP[ext];
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString("base64");

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: OCR_PROMPT },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    config: GENERATION_CONFIG,
  });

  return response.text;
}
