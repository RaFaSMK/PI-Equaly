import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as CandidaturaController from "../../controllers/candidatura/candidatura.controller";

const router = Router();

// PCD aplica para vaga
router.post("/", authMiddleware, CandidaturaController.criarCandidatura);

// PCD lista suas candidaturas
router.get("/pcd", authMiddleware, CandidaturaController.listarPorPcd);

// Empresa lista candidaturas de uma vaga
router.get("/vaga/:vagaId", authMiddleware, CandidaturaController.listarPorVaga);

// Empresa muda status
router.patch(
  "/:id/status",
  authMiddleware,
  CandidaturaController.atualizarStatus
);

// PCD vê uma candidatura em detalhe
router.get("/:id", authMiddleware, CandidaturaController.buscarPorId);

export default router;
