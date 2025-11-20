import { Router } from "express";
import { BarreirasController } from "../../controllers/desenvolvimento/barreiras.controller";

const router = Router();

router.post("/", BarreirasController.criar);
router.get("/", BarreirasController.listar);
router.get("/:id", BarreirasController.buscar);
router.put("/:id", BarreirasController.atualizar);
router.delete("/:id", BarreirasController.deletar);

export default router;
