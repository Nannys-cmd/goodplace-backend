// Backend/server.js
import express from "express";
import cors from "cors";
import propertiesRoutes from "./routes/properties.js";
import bookingsRoutes from "./routes/bookings.js";
import calendarRoutes from "./routes/calendar.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://goodplaces.netlify.app", 
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        // permitir requests sin origin (por ejemplo desde Render o Postman)
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Request bloqueado por CORS:", origin);
        callback(new Error("No permitido por CORS"));
      }
    },
  })
);

app.use(express.json());

app.use("/api/properties", propertiesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/calendar", calendarRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend de Goodplace corriendo correctamente 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

