// Backend/routes/calendar.js
import express from "express";
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import ical from "ical";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // URL del calendario público de feriados nacionales en formato ICS
    const url =
      "https://calendar.google.com/calendar/ical/es.arg%23holiday%40group.v.calendar.google.com/public/basic.ics";

    const response = await fetch(url);
    const text = await response.text();

    const data = ical.parseICS(text);

    const events = Object.values(data)
      .filter((ev) => ev.type === "VEVENT")
      .map((ev) => ({
        id: ev.uid,
        title: ev.summary,
        date: ev.start.toISOString().split("T")[0], // YYYY-MM-DD directo
      }));

    res.json(events);
  } catch (err) {
    console.error("❌ Error al cargar feriados:", err);
    res.status(500).json({ error: "No se pudieron cargar los feriados" });
  }
});

export default router;
