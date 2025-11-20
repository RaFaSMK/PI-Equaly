import { Request, Response } from "express";
import { TiposService } from "../../services/desenvolvimento/tipos.service";

export const TiposController = {
  async criar(req: Request, res: Response) {
    try {
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({ error: "Nome é obrigatório" });
      }

      const resultado = await TiposService.create(nome);
      res.status(201).json({
        message: "Tipo criado com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar tipo" });
    }
  },

  async listar(req: Request, res: Response) {
    try {
      const resultado = await TiposService.list();
      res.json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar tipos" });
    }
  },

  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await TiposService.findById(id);

      if (!resultado) {
        return res.status(404).json({ error: "Tipo não encontrado" });
      }

      res.json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar tipo" });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({ error: "Nome é obrigatório" });
      }

      const resultado = await TiposService.update(id, nome);

      if (!resultado) {
        return res.status(404).json({ error: "Tipo não encontrado" });
      }

      res.json({
        message: "Tipo atualizado com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar tipo" });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await TiposService.delete(id);

      if (!resultado) {
        return res.status(404).json({ error: "Tipo não encontrado" });
      }

      res.json({ message: "Tipo deletado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar tipo" });
    }
  },
};
