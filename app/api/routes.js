import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { processFile } from "../pipeline/service.js";
import { INPUT_DIR } from "../config/settings.js";

const router = express.Router();

// Ensure input directory exists
if (!fs.existsSync(INPUT_DIR)) {
  fs.mkdirSync(INPUT_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, INPUT_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/**
 * POST /upload
 * Accepts a PDF or image file, processes it, and returns Excel
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(INPUT_DIR, req.file.filename);

    const excelPath = await processFile(filePath);

    return res.download(
      excelPath,
      path.basename(excelPath),
      {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File processing failed" });
  }
});

export default router;
