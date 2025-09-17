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

    // 👀 Log para ver qué llega del calendario
    console.log("📅 Ejemplo de datos ICS:", Object.values(data).slice(0, 3));

    const events = Object.values(data)
      .filter((ev) => ev.type === "VEVENT" && ev.summary) // aceptamos todos con título
      .map((ev) => {
        let date = null;

        if (ev.start) {
          try {
            date = new Date(ev.start).toISOString().split("T")[0];
          } catch (e) {
            console.warn("⚠️ Error convirtiendo fecha:", ev.start);
          }
        }

        return {
          id: ev.uid || ev.summary, // fallback si no hay UID
          title: ev.summary,
          date,
        };
      });

    // 👀 Log de lo que realmente mandamos al frontend
    console.log("✅ Eventos procesados:", events.slice(0, 5));

    res.json(events);
  } catch (err) {
    console.error("❌ Error al cargar feriados:", err);
    res.status(500).json({ error: "No se pudieron cargar los feriados" });
  }
});

export default router;
