import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📂 Aseguramos que la carpeta uploads exista
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ⚡ Configuración de multer para guardar la imagen
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const clean = file.originalname.replace(/\s+/g, "_");
    cb(null, `${ts}-${clean}`);
  },
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
    if (!name || !email || !propertyId || !start || !end || !req.file) {
      return res.status(400).json({ ok: false, error: "Faltan datos" });
    }

    const dniFilePath = `/uploads/${req.file.filename}`;

    // Leer y guardar reserva
    const bookings = JSON.parse(fs.readFileSync(bookingsFile, "utf8") || "[]");
    const id = bookings.length ? bookings[bookings.length - 1].id + 1 : 1;

    const newBooking = {
      id,
      name,
      email,
      propertyId: Number(propertyId),
      start,
      end,
      dniFile: dniFilePath,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    bookings.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    // Link de WhatsApp
    const ownerPhone = process.env.OWNER_WHATSAPP || "5491157826522";
    const message = encodeURIComponent(
      `Hola! Soy ${name}. Quiero confirmar la reserva (id ${id}) para la propiedad ${propertyId} del ${start} al ${end}.` +
      ` Envié el DNI aquí: ${req.protocol}://${req.get("host")}${dniFilePath}. Por favor, indicame cómo realizar el pago del 10%.`
    );
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${message}`;

    res.json({ ok: true, id, whatsappUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error guardando la reserva" });
  }
});

export default router;
