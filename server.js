// Backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Rutas
import bookingsRoutes from "./routes/bookings.js";
import propertiesRoutes from "./routes/properties.js";
import calendarRoutes from "./routes/calendar.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rutas
app.use("/api/bookings", bookingsRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/calendar", calendarRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
