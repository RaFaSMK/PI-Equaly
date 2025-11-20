import { Request, Response } from "express";
import PcdService from "../../services/pcd/pcd.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

interface MulterRequest extends AuthRequest {
  file?: Express.Multer.File;
}

export const PcdController = {
  async criar(req: Request, res: Response) {
    try {
      const resultado = await PcdService.criarPcd(req.body);
      res.status(201).json(resultado);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async listarTodos(req: Request, res: Response) {
    try {
      const lista = await PcdService.listarTodos();
      res.json(lista);
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const pcd = await PcdService.buscarPorId(id);
      if (!pcd) return res.status(404).json({ error: "PCD não encontrado" });

      res.json({
        data: {
          id: pcd.id,
          nome: pcd.nome,
          email: pcd.email,
          telefone: pcd.telefone,
          cpf: pcd.cpf,
          dataNasc: pcd.dataNasc,
          escolaridade: pcd.escolaridade,
          curriculoUrl: pcd.curriculoUrl,
          endereco: pcd.endereco,
          deficiencias: pcd.subtipoPcd.map(
            (sp: { subtipoId: number }) => sp.subtipoId
          ),
          createdAt: pcd.createdAt,
          updatedAt: pcd.updatedAt,
        },
      });
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async uploadCurriculo(req: Request, res: Response) {
    try {
      const multerReq = req as MulterRequest;
      const pcdId = Number(req.params.id);
      if (!multerReq.file)
        return res.status(400).json({ error: "Arquivo ausente" });

      const filename = `/uploads/curriculos/${multerReq.file.filename}`;
      const updated = await PcdService.atualizarCurriculo(pcdId, filename);
      res.json(updated);
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user?.id) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const pcd = await PcdService.buscarPorUsuarioId(authReq.user.id);
      if (!pcd) {
        return res.status(404).json({ error: "PCD não encontrado" });
      }

      res.json({
        data: {
          id: pcd.id,
          nome: pcd.nome,
          email: pcd.email,
          telefone: pcd.telefone,
          cpf: pcd.cpf,
          dataNasc: pcd.dataNasc,
          escolaridade: pcd.escolaridade,
          curriculoUrl: pcd.curriculoUrl,
          endereco: pcd.endereco,
          deficiencias: pcd.subtipoPcd.map(
            (sp: { subtipoId: number }) => sp.subtipoId
          ),
          createdAt: pcd.createdAt,
          updatedAt: pcd.updatedAt,
        },
      });
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: (error as Error).message });
    }
  },
};
