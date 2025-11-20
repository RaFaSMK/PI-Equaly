import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import prisma from "../prisma/client";

/**
 * Middleware que verifica se o usuário logado é o responsável pela empresa
 * especificada no body.empresaId (usado para criar vaga)
 */
export async function ensureResponsavelByEmpresaBody(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const body = req.body as { empresaId?: number };
    const empresaId = Number(body.empresaId);
    if (!empresaId) {
      return res.status(400).json({ error: "empresaId é obrigatório" });
    }

    const empresa = await prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { responsavelId: true },
    });

    if (!empresa) {
      return res.status(404).json({ error: "Empresa não encontrada" });
    }

    if (empresa.responsavelId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Você não é responsável por esta empresa" });
    }

    next();
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: (error as Error).message });
  }
}

/**
 * Middleware que verifica se o usuário logado é o responsável pela empresa
 * dona da vaga especificada em req.params.id (usado para editar/deletar vaga)
 */
export async function ensureResponsavelByVagaParam(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const params = req.params as { id?: string };
    const vagaId = Number(params.id);
    if (!vagaId) {
      return res.status(400).json({ error: "vagaId é obrigatório" });
    }

    const vaga = await prisma.vaga.findUnique({
      where: { id: vagaId },
      include: { empresa: { select: { responsavelId: true } } },
    });

    if (!vaga) {
      return res.status(404).json({ error: "Vaga não encontrada" });
    }

    if (vaga.empresa.responsavelId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Você não é responsável pela empresa desta vaga" });
    }

    next();
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: (error as Error).message });
  }
}
