import { Router } from "express";
import { VagaController } from "../../controllers/desenvolvimento/vaga.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  ensureResponsavelByEmpresaBody,
  ensureResponsavelByVagaParam,
} from "../../middlewares/empresa.middleware";

const router = Router();

// Rotas públicas
router.get("/", VagaController.listar);
router.get("/:id", VagaController.buscar);

// Rotas protegidas - apenas o responsável da empresa pode criar/editar/deletar
router.post(
  "/",
  authMiddleware,
  ensureResponsavelByEmpresaBody,
  VagaController.criar
);
router.put(
  "/:id",
  authMiddleware,
  ensureResponsavelByVagaParam,
  VagaController.atualizar
);
router.delete(
  "/:id",
  authMiddleware,
  ensureResponsavelByVagaParam,
  VagaController.deletar
);

export default router;
