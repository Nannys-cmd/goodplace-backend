// Backend/routes/calendar.js
import express from "express";
import fetch from "node-fetch"; 

const router = express.Router();

// GET /api/calendar => proxy a Google Calendar
router.get("/", async (req, res) => {
  try {
    const key = process.env.GOOGLE_CALENDAR_KEY;
    const calId = process.env.GOOGLE_CALENDAR_ID;
    if (!key || !calId) {
      return res.status(500).json({ error: "Falta configuración de Google Calendar en el servidor" });
    }

    const timeMin = req.query.timeMin || new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events?key=${key}&timeMin=${encodeURIComponent(timeMin)}&singleEvents=true&orderBy=startTime&maxResults=50`;

    const r = await fetch(url);
    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ error: "Error en Google API", detail: txt });
    }
    const data = await r.json();

    const events = (data.items || []).map(it => ({
      id: it.id,
      title: it.summary || "Evento",
      start: it.start?.date || it.start?.dateTime,
      end: it.end?.date || it.end?.dateTime,
      description: it.description || ""
    }));

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al traer eventos de Google" });
  }
});

export default router;
