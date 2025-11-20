import { Router } from "express";
import { SubtiposController } from "../../controllers/desenvolvimento/subtipos.controller";

const router = Router();

router.post("/", SubtiposController.criar);
router.get("/", SubtiposController.listar);
router.get("/:id", SubtiposController.buscar);
router.put("/:id", SubtiposController.atualizar);
router.delete("/:id", SubtiposController.deletar);

export default router;
