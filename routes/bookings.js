// Backend/routes/bookings.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📂 uploads (aseguramos que exista)
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ⚡ Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const clean = file.originalname.replace(/\s+/g, "_");
    cb(null, `${ts}-${clean}`);
  }
});
const upload = multer({ storage });

// 📂 JSON de reservas
const dataDir = path.resolve("data");
const bookingsFile = path.join(dataDir, "bookings.json");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, JSON.stringify([]));

// POST /api/bookings
router.post("/", upload.single("dni"), (req, res) => {
  try {
    const { name, email, propertyId, start, end } = req.body;
    const dniFile = req.file ? `/uploads/${req.file.filename}` : null;

    const bookings = JSON.parse(fs.readFileSync(bookingsFile, "utf8") || "[]");
    const id = bookings.length ? bookings[bookings.length - 1].id + 1 : 1;

    const newBooking = {
      id,
      name,
      email,
      propertyId: Number(propertyId),
      start,
      end,
      dniFile,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    bookings.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    // 📲 Link de WhatsApp
    const ownerPhone = process.env.OWNER_WHATSAPP || "5491157826522";
    const message = encodeURIComponent(
      `Hola! Soy ${name}. Quiero confirmar la reserva (id ${id}) para la propiedad ${propertyId} del ${start} al ${end}. Envié el DNI aquí: ${req.protocol}://${req.get("host")}${dniFile}. Por favor, indícame cómo realizar el pago del 10%.`
    );
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${message}`;

    res.json({ ok: true, id, whatsappUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error guardando la reserva" });
  }
});

export default router;
