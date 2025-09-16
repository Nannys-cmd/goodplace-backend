// Backend/server.js
import express from "express";
import cors from "cors";
import propertiesRoutes from "./routes/properties.js";
import bookingsRoutes from "./routes/bookings.js";
import calendarRoutes from "./routes/calendar.js";
import path from "path";
import { fileURLToPath } from "url";

// 🔹 Configuración de ruta base en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Permitir tanto frontend local como Netlify
const allowedOrigins = [
  "http://localhost:5173", // desarrollo
  "https://goodplaces.netlify.app" // producción (ajustá al dominio real en Netlify)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
  })
);

app.use(express.json());

// 🔹 Rutas principales
app.use("/api/properties", propertiesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/calendar", calendarRoutes);

// 🔹 Servir uploads públicamente
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Endpoint raíz (útil para probar en Render)
app.get("/", (req, res) => {
  res.send("Backend de Goodplace corriendo correctamente 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
