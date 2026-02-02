// js/parser/headers.js

/**
 * Parses the HEADERS block from the structured OCR TXT.
 *
 * @param {string} text
 * @returns {Object}
 */
export function parseHeaders(text) {
  const headers = {};
  let inHeaders = false;

  const lines = text.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();

    if (line === "HEADERS:") {
      inHeaders = true;
      continue;
    }

    if (line === "ROWS:") {
      break;
    }

    if (inHeaders && line.includes(":")) {
      const [key, ...rest] = line.split(":");
      const value = rest.join(":");

      headers[key.trim()] = value.trim();
    }
  }

  return headers;
}
