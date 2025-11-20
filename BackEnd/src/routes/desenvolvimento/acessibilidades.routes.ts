import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { AcessibilidadesController } from "../../controllers/desenvolvimento/acessibilidades.controller";

const router = Router();

// Middleware simples para capturar erros de async functions
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Rotas de acessibilidades
router.post("/", asyncHandler(AcessibilidadesController.criar));
router.get("/", asyncHandler(AcessibilidadesController.listar));
router.get("/:id", asyncHandler(AcessibilidadesController.buscar));
router.put("/:id", asyncHandler(AcessibilidadesController.atualizar));
router.delete("/:id", asyncHandler(AcessibilidadesController.deletar));

export default router;
