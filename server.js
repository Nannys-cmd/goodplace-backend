// Backend/server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // 👈 para traer eventos de Google Calendar
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔹 Ruta base
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

// 🔹 Endpoint de disponibilidad (reservas + feriados)
app.get("/api/availability", async (req, res) => {
  try {
    // 🟢 Reservas simuladas (acá después podés enchufar DB si querés)
    const reservas = [
      { title: "Reserva Juan Pérez", date: "2025-09-20" },
      { title: "Reserva María López", date: "2025-09-25" },
    ];

    // 🟢 Feriados desde Google Calendar (Argentina)
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_CALENDAR_KEY;

    let feriados = [];
    if (calendarId && apiKey) {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events?key=${apiKey}&timeMin=${new Date().toISOString()}&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener eventos de Google Calendar");

      const data = await response.json();
      feriados = data.items.map((event) => ({
        title: `Feriado: ${event.summary}`,
        date: event.start.date || event.start.dateTime.split("T")[0],
      }));
    }

    // 🔹 Combinar reservas y feriados
    const events = [...reservas, ...feriados];

    res.json(events);
  } catch (err) {
    console.error("Error al obtener disponibilidad:", err);
    res.status(500).json({ error: "Error al obtener disponibilidad" });
  }
});

// 🔹 Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
