import { Router } from "express";
import { PcdController } from "../../controllers/pcd/pcd.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/curriculos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

// LISTAR TODOS OS PCDs
router.get("/", PcdController.listarTodos);

// CRIAR
router.post("/", PcdController.criar);

// BUSCAR PCD DO USUÁRIO LOGADO
router.get("/me", authMiddleware, PcdController.me);

// BUSCAR POR ID
router.get("/:id", PcdController.buscar);

// UPLOAD DE CURRÍCULO
router.post(
  "/:id/curriculo",
  upload.single("curriculo"),
  PcdController.uploadCurriculo
);

export default router;
