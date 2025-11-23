import { Request, Response } from "express";
import prisma from "../../prisma/client";

export const EmpresasController = {
  // Criar empresa
  async criar(req: Request, res: Response) {
    try {
      const data = req.body;
      const empresa = await prisma.empresa.create({ data });
      return res.json(empresa);
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(400).json({ error: "CNPJ já cadastrado" });
      }
      res.status(500).json({ error: (err as Error).message });
    }
  },

  // Listar todas as empresas
  async listar(req: Request, res: Response) {
    try {
      const empresas = await prisma.empresa.findMany();
      res.json(empresas);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  },

  // Detalhar uma empresa pelo id
  async detalhar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const empresa = await prisma.empresa.findUnique({
        where: { id },
        include: {
          vagas: {
            include: {
              acessibilidades: { include: { acessibilidade: true } },
            },
          },
        },
      });
      if (!empresa)
        return res.status(404).json({ error: "Empresa não encontrada" });
      res.json(empresa);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  },

  // Atualizar uma empresa pelo id
  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const empresa = await prisma.empresa.update({
        where: { id },
        data,
      });
      res.json(empresa);
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(400).json({ error: "CNPJ já cadastrado" });
      }
      res.status(500).json({ error: (err as Error).message });
    }
  },

  // Deletar uma empresa pelo id
  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await prisma.empresa.delete({ where: { id } });
      res.json({ message: "Empresa deletada com sucesso" });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  },

  // Buscar empresa do responsável logado
  async minha(req: Request, res: Response) {
    try {
      interface AuthRequest extends Request {
        user?: { id: number; tipo: string };
      }

      const authReq = req as AuthRequest;

      if (!authReq.user?.id) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const empresa = await prisma.empresa.findUnique({
        where: { responsavelId: authReq.user.id },
        include: {
          vagas: {
            include: {
              acessibilidades: { include: { acessibilidade: true } },
            },
          },
        },
      });

      if (!empresa) {
        return res.status(404).json({ error: "Empresa não encontrada" });
      }

      res.json(empresa);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  },
};
