/**
 * Parses the ROWS table from structured OCR TXT.
 * @param {string} text
 * @returns {Array<Object>}
 */
export function parseRows(text) {
  const rows = [];
  const lines = text.split(/\r?\n/);

  // Find ROWS section
  const rowsIndex = lines.indexOf("ROWS:");
  if (rowsIndex === -1) {
    throw new Error("ROWS section not found");
  }

  const headerLineIndex = rowsIndex + 1;
  if (headerLineIndex >= lines.length) {
    throw new Error("ROWS header line missing");
  }

  // Parse column headers
  const columns = lines[headerLineIndex]
    .split("|")
    .map(c => c.trim());

  const expectedColumns = [
    "S/N",
    "Code",
    "POL",
    "B/L No",
    "Shipper",
    "Consignee",
    "Notify",
    "Year",
    "Make/Model",
    "Chassis",
    "KGS",
    "CBM",
    "Remarks"
  ];

  // Validate schema strictly
  if (JSON.stringify(columns) !== JSON.stringify(expectedColumns)) {
    throw new Error(`Unexpected columns: ${columns.join(", ")}`);
  }

  // Parse data rows
  for (let i = headerLineIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split("|").map(v => v.trim());

    // Skip malformed rows safely
    if (values.length !== columns.length) {
      continue;
    }

    const record = {};

    columns.forEach((col, idx) => {
      const value = values[idx];
      record[col] = value.toUpperCase() === "NULL" ? null : value;
    });

    // Type casting
    record["S/N"] = parseInt(record["S/N"], 10);
    record["Year"] = record["Year"] !== null ? parseInt(record["Year"], 10) : null;
    record["KGS"] = record["KGS"] !== null ? parseInt(record["KGS"], 10) : null;
    record["CBM"] = record["CBM"] !== null ? parseFloat(record["CBM"]) : null;

    rows.push(record);
  }

  return rows;
}
