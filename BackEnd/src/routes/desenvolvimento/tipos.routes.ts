import { Router } from "express";
import { TiposController } from "../../controllers/desenvolvimento/tipos.controller";

const router = Router();

router.post("/", TiposController.criar);
router.get("/", TiposController.listar);
router.get("/:id", TiposController.buscar);
router.put("/:id", TiposController.atualizar);
router.delete("/:id", TiposController.deletar);

export default router;
