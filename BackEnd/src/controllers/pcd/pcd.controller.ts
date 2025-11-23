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
      if (
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        "meta" in err &&
        "message" in err
      ) {
        // Prisma error
        const prismaErr = err as unknown as { message: string; meta: unknown };
        res
          .status(400)
          .json({ error: prismaErr.message, details: prismaErr.meta });
      } else if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(400).json({ error: String(err) });
      }
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
          // Lista simples de IDs (mantém compatibilidade se alguém usar 'deficiencias')
          deficiencias: pcd.subtipoPcd.map(
            (sp: { subtipoId: number }) => sp.subtipoId
          ),
          // Estrutura detalhada esperada pelo front para carregar seleção e CID
          subtipoPcd: pcd.subtipoPcd.map(
            (sp: { subtipoId: number; cid?: string | null }) => ({
              subtipoId: sp.subtipoId,
              cid: sp.cid || undefined,
            })
          ),
          barreiras:
            pcd.barreirasPcd?.map(
              (bp: { barreira: { id: number; descricao: string } }) => ({
                id: bp.barreira.id,
                descricao: bp.barreira.descricao,
              })
            ) || [],
          createdAt: pcd.createdAt,
          updatedAt: pcd.updatedAt,
        },
      });
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: (error as Error).message });
    }
  },

  async atualizarBarreiras(req: Request, res: Response) {
    try {
      const pcdId = Number(req.params.id);
      const { barreiraIds } = req.body;

      if (!Array.isArray(barreiraIds)) {
        return res.status(400).json({ error: "barreiraIds deve ser um array" });
      }

      const resultado = await PcdService.atualizarBarreiras(pcdId, barreiraIds);
      res.json(resultado);
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  },

  async atualizarSubtipos(req: Request, res: Response) {
    try {
      const pcdId = Number(req.params.id);
      const { subtipoIds } = req.body;

      if (!Array.isArray(subtipoIds)) {
        return res.status(400).json({ error: "subtipoIds deve ser um array" });
      }

      const resultado = await PcdService.atualizarSubtipos(pcdId, subtipoIds);
      res.json(resultado);
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: error.message });
    }
  },
};

// Busca endereço por CEP
import axios from "axios";
interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
  complemento: string;
  erro?: boolean;
}

export async function buscarEnderecoPorCep(req: Request, res: Response) {
  const { cep } = req.params;
  try {
    const response = await axios.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${cep}/json/`
    );
    if (response.data.erro) {
      return res.status(404).json({ error: "CEP não encontrado" });
    }
    res.json({
      rua: response.data.logradouro,
      bairro: response.data.bairro,
      cidade: response.data.localidade,
      estado: response.data.uf,
      cep: response.data.cep,
      complemento: response.data.complemento,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "Erro ao buscar CEP", details: errorMsg });
  }
}
