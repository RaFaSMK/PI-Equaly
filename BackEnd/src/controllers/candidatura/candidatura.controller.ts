import { Request, Response } from "express";
import * as CandidaturaService from "../../services/candidatura/candidatura.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export async function criarCandidatura(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    const data = await CandidaturaService.criar(authReq.user.id, req.body);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function listarPorPcd(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    const data = await CandidaturaService.listarPorPcd(authReq.user.id);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function listarPorVaga(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    const vagaId = Number(req.params.vagaId);
    const data = await CandidaturaService.listarPorVaga(
      vagaId,
      authReq.user.id
    );
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function atualizarStatus(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    const candidaturaId = Number(req.params.id);
    const { status } = req.body;
    const data = await CandidaturaService.atualizarStatus(
      candidaturaId,
      status,
      authReq.user.id
    );
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function buscarPorId(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user?.id) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    const id = Number(req.params.id);
    const data = await CandidaturaService.buscarPorId(id, authReq.user.id);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}
