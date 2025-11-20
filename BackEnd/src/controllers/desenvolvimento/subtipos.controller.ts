import { Request, Response } from "express";
import { SubtiposService } from "../../services/desenvolvimento/subtipos.service";

export const SubtiposController = {
  async criar(req: Request, res: Response) {
    try {
      const { nome, tipoId } = req.body;

      if (!nome || !tipoId) {
        return res.status(400).json({ error: "Nome e TipoId são obrigatórios" });
      }

      const resultado = await SubtiposService.create(nome, Number(tipoId));
      res.status(201).json({
        message: "Subtipo criado com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar subtipo" });
    }
  },

  async listar(req: Request, res: Response) {
    try {
      const resultado = await SubtiposService.list();
      res.json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar subtipos" });
    }
  },

  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await SubtiposService.findById(id);

      if (!resultado) {
        return res.status(404).json({ error: "Subtipo não encontrado" });
      }

      res.json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar subtipo" });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nome, tipoId } = req.body;

      if (!nome || !tipoId) {
        return res.status(400).json({ error: "Nome e TipoId são obrigatórios" });
      }

      const resultado = await SubtiposService.update(id, nome, Number(tipoId));

      if (!resultado) {
        return res.status(404).json({ error: "Subtipo não encontrado" });
      }

      res.json({
        message: "Subtipo atualizado com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar subtipo" });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await SubtiposService.delete(id);

      if (!resultado) {
        return res.status(404).json({ error: "Subtipo não encontrado" });
      }

      res.json({ message: "Subtipo deletado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar subtipo" });
    }
  },
};

