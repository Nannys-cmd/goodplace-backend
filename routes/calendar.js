// routes/calendar.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_CALENDAR_KEY;

    if (!calendarId || !apiKey) {
      return res.status(500).json({ error: "Faltan credenciales en el servidor" });
    }

    const timeMin = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=50&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ Error en Google API:", data.error);
      return res.status(500).json({ error: "Error al traer eventos de Google", detail: data.error });
    }

    const eventos = data.items.map((item) => ({
      id: item.id,
      summary: item.summary,
      start: item.start.date || item.start.dateTime,
      end: item.end.date || item.end.dateTime,
    }));

    res.json(eventos);
  } catch (err) {
    console.error("❌ Error al procesar eventos:", err);
    res.status(500).json({ error: "Error interno del servidor", detail: err.message });
  }
});

export default router;
