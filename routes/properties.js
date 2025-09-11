// routes/properties.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// 📂 ruta al JSON con propiedades
const dataPath = path.resolve("data/properties.json");

// GET /api/properties
router.get("/", (req, res) => {
  fs.readFile(dataPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer propiedades" });
    }
    res.json(JSON.parse(data));
  });
});

export default router;
