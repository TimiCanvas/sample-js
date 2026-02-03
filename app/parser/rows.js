export function parseRows(text) {
  const rows = [];
  const lines = text.split(/\r?\n/);

  // 🔎 Find ROWS line robustly
  const rowsIndex = lines.findIndex(
    line => line.trim().toUpperCase() === "ROWS:"
  );

  if (rowsIndex === -1) {
    // Helpful debug output
    throw new Error(
      "ROWS section not found. First 30 lines:\n" +
      lines.slice(0, 30).join("\n")
    );
  }

  const headerLine = lines[rowsIndex + 1];
  if (!headerLine) {
    throw new Error("ROWS header row missing after ROWS:");
  }

  const columns = headerLine.split("|").map(c => c.trim());

  const expectedColumns = [
    "S/N", "Code", "POL", "B/L No", "Shipper", "Consignee",
    "Notify", "Year", "Make/Model", "Chassis", "KGS", "CBM", "Remarks"
  ];

  if (JSON.stringify(columns) !== JSON.stringify(expectedColumns)) {
    throw new Error(
      `Unexpected columns:\n${columns.join(" | ")}`
    );
  }

  // Parse data rows
  for (let i = rowsIndex + 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split("|").map(v => v.trim());
    if (values.length !== columns.length) continue;

    const record = {};
    columns.forEach((col, idx) => {
      record[col] = values[idx] === "NULL" ? null : values[idx];
    });

    // Type coercion
    record["S/N"] = Number(record["S/N"]);
    record["Year"] = record["Year"]  ? record["Year"].replace(/,/g, "") : null;
    record["KGS"] = record["KGS"] ? Number(record["KGS"]) : null;
    record["CBM"] = record["CBM"] ? record["CBM"] : null;

    rows.push(record);
  }

  return rows;
}
