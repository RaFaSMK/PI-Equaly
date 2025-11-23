import { Router } from "express";
import { BarreiraAcessibilidadeController } from "../../controllers/desenvolvimento/barreiraAcessibilidade.controller";

const router = Router();

router.get("/", BarreiraAcessibilidadeController.listar);
router.post("/", BarreiraAcessibilidadeController.criar);
router.delete(
  "/:barreiraId/:acessibilidadeId",
  BarreiraAcessibilidadeController.deletar
);

export default router;
