// Backend/routes/properties.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivo JSON
const propertiesFile = path.join(__dirname, "../data/properties.json");

// 📌 Obtener todas las propiedades
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(propertiesFile, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Error al leer propiedades" });
  }
});

export default router;
