import express from "express";
import cors from "cors";
import propertiesRoutes from "./routes/properties.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 👉 todas las rutas de propiedades empiezan con /api/properties
app.use("/api/properties", propertiesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

