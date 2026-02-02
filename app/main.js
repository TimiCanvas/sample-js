import express from "express";
import routes from "./api/routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/", routes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`eRamp OCR Service running on http://localhost:${PORT}`);
});
