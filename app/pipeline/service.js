// pipeline/service.js
import { runOcr } from "./ocrRunner.js";
import { runParse } from "./parseRunner.js";

export async function processFile(filePath) {
  const txtPath = await runOcr(filePath);   // ✅ await
  const excelPath = await runParse(txtPath); // ✅ await
  return excelPath;
}
