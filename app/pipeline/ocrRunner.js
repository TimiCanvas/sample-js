import fs from "fs";
import path from "path";

import { extractRawText } from "../ocr/extract.js";
import { OUTPUT_DIR } from "../config/settings.js";

/**
 * Runs OCR on a file and saves extracted text to output/extracted.txt
 */
export async function runOcr(filePath) {
  const text = await extractRawText(filePath);

  console.log("==== EXTRACTED TEXT START ====");
  console.log(text.slice(0, 2000));
  console.log("==== EXTRACTED TEXT END ====");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const txtPath = path.join(OUTPUT_DIR, "extracted.txt");

  fs.writeFileSync(txtPath, text, { encoding: "utf-8" });

  return txtPath;
}

// Standalone execution (Node.js equivalent of __main__)
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runOcr("data/input/silver_glory_january.pdf")
    .then((out) => console.log("OCR output saved to:", out))
    .catch(console.error);
}

