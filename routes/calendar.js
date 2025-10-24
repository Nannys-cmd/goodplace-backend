// Backend/routes/calendar.js
import express from "express";
import fetch from "node-fetch";
import ical from "ical";

const router = express.Router();

// 🔹 Recibir ?url= link_ical
router.get("/", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Falta parámetro URL" });

    const response = await fetch(url);
    const text = await response.text();
    const data = ical.parseICS(text);

    const events = Object.values(data)
      .filter((ev) => ev.type === "VEVENT")
      .map((ev) => ({
        id: ev.uid || ev.summary,
        title: ev.summary,
        start: ev.start,
        end: ev.end,
      }));

    res.json(events);
  } catch (err) {
    console.error("❌ Error al cargar calendario:", err);
    res.status(500).json({ error: "No se pudo cargar el calendario" });
  }
});

export default router;
