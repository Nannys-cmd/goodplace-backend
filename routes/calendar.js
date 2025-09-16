// Backend/routes/calendar.js
import express from "express";
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar Google Calendar con cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../credentials/service-account.json"), // tu JSON aquí
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
});

const calendar = google.calendar({ version: "v3", auth });

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

    const events = (response.data.items || []).map(it => ({
      id: it.id,
      title: it.summary || "Evento",
      start: it.start?.date || it.start?.dateTime,
      end: it.end?.date || it.end?.dateTime,
      description: it.description || "",
    }));

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer eventos de Google", detail: err.message });
  }
});

export default router;
