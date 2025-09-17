// Backend/routes/availability.js
import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import ical from "ical";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 1. Reservas (desde bookings.json)
    const bookingsPath = path.resolve("data/bookings.json");
    let bookings = [];
    if (fs.existsSync(bookingsPath)) {
      bookings = JSON.parse(fs.readFileSync(bookingsPath, "utf8"));
    }

    const bookingEvents = bookings.map(b => ({
      id: "booking-" + b.id,
      title: `Reserva de ${b.name}`,
      date: b.start.split("T")[0] // 👈 simplificado, podrías expandir entre start y end
    }));

    // 2. Feriados (desde Google Calendar público .ics)
    const url = "https://calendar.google.com/calendar/ical/es-419.ar%23holiday%40group.v.calendar.google.com/public/basic.ics";
    const response = await fetch(url);
    const text = await response.text();
    const data = ical.parseICS(text);

    const holidayEvents = Object.values(data)
      .filter(ev => ev.type === "VEVENT" && ev.summary && ev.start)
      .map(ev => ({
        id: ev.uid,
        title: ev.summary,
        date: new Date(ev.start).toISOString().split("T")[0]
      }));

    // 3. Juntar todo
    const events = [...bookingEvents, ...holidayEvents];
    res.json(events);
  } catch (err) {
    console.error("❌ Error en /api/availability:", err);
    res.status(500).json({ error: "No se pudieron cargar eventos" });
  }
});

export default router;
