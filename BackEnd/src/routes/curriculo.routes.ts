// routes/curriculos.routes.ts
import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/", (req, res) => {
  const uploadsPath = path.resolve(__dirname, "../../uploads/curriculos");

  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar currículos" });
    }

    const urls = files.map(file => `/uploads/curriculos/${file}`);
    res.json({ arquivos: urls });
  });
});

export default router;
