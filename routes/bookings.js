// Backend/routes/bookings.js
import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivos JSON
const bookingsFile = path.join(__dirname, "../data/bookings.json");

// Config multer para subir DNI
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 📌 Obtener todas las reservas
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(bookingsFile, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Error al leer reservas" });
  }
});

// 📌 Crear reserva
router.post("/", upload.single("dniFile"), (req, res) => {
  try {
    const newBooking = {
      id: Date.now(),
      propertyId: req.body.propertyId,
      name: req.body.name,
      phone: req.body.phone,
      dates: req.body.dates,
      dniFile: req.file ? `/uploads/${req.file.filename}` : null
    };

    const data = fs.existsSync(bookingsFile)
      ? JSON.parse(fs.readFileSync(bookingsFile, "utf-8"))
      : [];

    data.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(data, null, 2));

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar reserva" });
  }
});

export default router;
