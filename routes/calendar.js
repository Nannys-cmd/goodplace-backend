// Backend/routes/calendar.js
import express from "express";
import fetch from "node-fetch";
import ical from "ical";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url =
      "https://calendar.google.com/calendar/ical/es-419.ar%23holiday%40group.v.calendar.google.com/public/basic.ics";

    const response = await fetch(url);
    const text = await response.text();

    const data = ical.parseICS(text);

    // 👀 Log para ver qué llega
    console.log("📅 Ejemplo de datos ICS:", Object.values(data).slice(0, 3));

const events = Object.values(data)
  .filter((ev) => ev.type === "VEVENT" && ev.summary && ev.start) // solo eventos con fecha
  .map((ev) => ({
    id: ev.uid,
    title: ev.summary,
    date: ev.start
      ? new Date(ev.start).toISOString().split("T")[0]
      : null,
  }));

    res.json(events);
  } catch (err) {
    console.error("❌ Error al cargar feriados:", err);
    res.status(500).json({ error: "No se pudieron cargar los feriados" });
  }
});

export default router;
