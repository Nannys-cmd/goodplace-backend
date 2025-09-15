// Backend/routes/properties.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const dataPath = path.resolve("data/properties.json");

// GET /api/properties
router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(dataPath)) {
      return res.json([]);
    }
    const data = fs.readFileSync(dataPath, "utf-8") || "[]";
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al leer propiedades" });
  }
});

export default router;
