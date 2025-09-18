// Backend/server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔹 Ruta base
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

// 🔹 Endpoint de propiedades (mock)
app.get("/api/properties", (req, res) => {
  const propiedades = [
    {
      id: 1,
      title: "Cabaña en Mendoza",
      description: "Hermosa cabaña con vista a la montaña",
      price: 120,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      title: "Casa en Potrerillos",
      description: "Ideal para escapada romántica",
      price: 150,
      image: "https://via.placeholder.com/300x200",
    },
  ];
  res.json(propiedades);
});

// 🔹 Endpoint de disponibilidad (mock)
app.get("/api/availability", (req, res) => {
  const reservas = [
    { title: "Reserva Juan Pérez", date: "2025-09-20" },
    { title: "Reserva María López", date: "2025-09-25" },
    { title: "Feriado: Día de la Primavera", date: "2025-09-21" },
    { title: "Feriado: Día de la Virgen", date: "2025-12-08" },
  ];
  res.json(reservas);
});

// 🔹 Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
