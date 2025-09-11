import express from "express";
import cors from "cors";
import propertiesRoutes from "./routes/properties.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 💡 habilitamos CORS SOLO para tu frontend de Netlify
app.use(cors({
  origin: "https://goodplaces.netlify.app/" // ⚠️ cambiá por la URL real de tu frontend en Netlify
}));

app.use(express.json());

// 👉 todas las rutas de propiedades empiezan con /api/properties
app.use("/api/properties", propertiesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
