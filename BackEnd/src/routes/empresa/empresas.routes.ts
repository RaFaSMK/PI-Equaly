import { Router } from "express";
import { EmpresasController } from "../../controllers/empresa/empresas.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Rotas de Empresas
router.get("/", EmpresasController.listar); // Listar todas as empresas
router.get("/minha", authMiddleware, EmpresasController.minha); // Buscar empresa do responsável logado
router.get("/:id", EmpresasController.detalhar); // Detalhar empresa pelo ID
router.post("/", EmpresasController.criar); // Criar nova empresa
router.put("/:id", EmpresasController.atualizar); // Atualizar empresa pelo ID
router.delete("/:id", EmpresasController.deletar); // Deletar empresa pelo ID

export default router;
