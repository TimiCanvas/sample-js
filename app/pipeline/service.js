import { runOcr } from "./ocrRunner.js";
import { runParse } from "./parseRunner.js";

/**
 * Orchestrates OCR + parsing pipeline.
 * Input: PDF or image file path
 * Output: Excel file path
 */
export function processFile(filePath) {
  const txtPath = runOcr(filePath);
  const excelPath = runParse(txtPath);
  return excelPath;
}
