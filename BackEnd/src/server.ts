import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import routes from "./routes/route.index";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve arquivos de uploads (como currículos)
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Rotas da API
app.use("/api", routes);

// Porta do servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
