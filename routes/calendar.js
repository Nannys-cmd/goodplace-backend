// Backend/routes/calendar.js
import express from "express";
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Guardar JSON de la cuenta de servicio desde la variable de entorno en un archivo temporal
const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT;
if (!serviceAccountJson) {
  console.error("❌ Falta la variable de entorno GOOGLE_SERVICE_ACCOUNT");
}
const keyPath = path.join(__dirname, "../credentials/temp-service-account.json");
fs.writeFileSync(keyPath, serviceAccountJson);

// Configurar Google Calendar con la cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
});

const calendar = google.calendar({ version: "v3", auth });

// GET /api/calendar => devuelve eventos del calendario
router.get("/", async (req, res) => {
  try {
    const calId = process.env.GOOGLE_CALENDAR_ID;
    if (!calId) {
      return res.status(500).json({ error: "Falta configuración de Google Calendar en el servidor" });
    }

    const timeMin = req.query.timeMin || new Date().toISOString();

    const response = await calendar.events.list({
      calendarId: calId,
      timeMin,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 50,
    });

    const events = (response.data.items || []).map((it) => ({
      id: it.id,
      title: it.summary || "Evento",
      start: it.start?.date || it.start?.dateTime,
      end: it.end?.date || it.end?.dateTime,
      description: it.description || "",
    }));

    res.json(events);
  } catch (err) {
    console.error("❌ Error al traer eventos de Google:", err);
    res.status(500).json({ error: "Error al traer eventos de Google", detail: err.message });
  }
});

export default router;
