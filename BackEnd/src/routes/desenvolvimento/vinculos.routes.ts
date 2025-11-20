import { Router } from "express";
import { VinculosController } from "../../controllers/desenvolvimento/vinculos.controller";

const router = Router();

router.post("/", VinculosController.criar);
router.get("/:id", VinculosController.buscar);
router.get("/", VinculosController.listar);

export default router;
