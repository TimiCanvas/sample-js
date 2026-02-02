import fs from "fs";
import path from "path";
import xlsx from "xlsx";

import { parseHeaders } from "../parser/header.js";
import { parseRows } from "../parser/rows.js";
import { OUTPUT_DIR } from "../config/settings.js";

/**
 * Parses extracted OCR text and exports vehicles.xlsx
 */
export function runParse(txtPath) {
  // 1. Read extracted OCR text
  const text = fs.readFileSync(txtPath, "utf-8");

  // 2. Parse headers and rows
  const headers = parseHeaders(text);
  const rows = parseRows(text);

  // 3. Merge headers into each row
  const mergedRows = rows.map(row => ({
    ...headers,
    ...row
  }));

  // 4. Create Excel workbook
  const worksheet = xlsx.utils.json_to_sheet(mergedRows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Vehicles");

  // 5. Write Excel file
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const excelPath = path.join(OUTPUT_DIR, "vehicles.xlsx");
  xlsx.writeFile(workbook, excelPath);

  return excelPath;
}

// Standalone execution
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const output = runParse("data/output/extracted.txt");
  console.log("Excel file created:", output);
}
