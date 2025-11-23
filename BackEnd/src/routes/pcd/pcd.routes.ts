import { Router } from "express";
import { PcdController } from "../../controllers/pcd/pcd.controller";
import { buscarEnderecoPorCep } from "../../controllers/pcd/pcd.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { uploadCurriculo } from "../../middlewares/upload";

const router = Router();

// LISTAR TODOS OS PCDs
router.get("/", PcdController.listarTodos);

// BUSCAR ENDEREÇO POR CEP
router.get("/endereco/:cep", buscarEnderecoPorCep);

// CRIAR
router.post("/", PcdController.criar);

// BUSCAR PCD DO USUÁRIO LOGADO
router.get("/me", authMiddleware, PcdController.me);

// ROTAS DE CURRÍCULO (devem vir ANTES de /:id para evitar conflito)
// Upload/replace currículo do PCD autenticado (PDF apenas)
router.post(
  "/curriculo",
  authMiddleware,
  uploadCurriculo.single("curriculo"),
  PcdController.uploadCurriculoMe
);

// Obter a URL do currículo do PCD autenticado
router.get("/curriculo", authMiddleware, PcdController.getCurriculoMe);

// Excluir currículo do PCD autenticado
router.delete("/curriculo", authMiddleware, PcdController.deleteCurriculoMe);

// BUSCAR POR ID (deve vir DEPOIS das rotas específicas)
router.get("/:id", PcdController.buscar);

// Rota legada por ID (mantida por compatibilidade, agora autenticada e restrita ao dono)
router.post(
  "/:id/curriculo",
  authMiddleware,
  uploadCurriculo.single("curriculo"),
  PcdController.uploadCurriculo
);

// ATUALIZAR BARREIRAS DO PCD
router.put("/:id/barreiras", authMiddleware, PcdController.atualizarBarreiras);

// ATUALIZAR SUBTIPOS DO PCD
router.put("/:id/subtipos", authMiddleware, PcdController.atualizarSubtipos);

export default router;
