import { Request, Response } from "express";
import { AcessService } from "../../services/desenvolvimento/acessibilidades.service";

export const AcessibilidadesController = {
  async criar(req: Request, res: Response) {
    try {
      const { descricao } = req.body;
      if (!descricao) {
        return res.status(400).json({ error: "Descrição é obrigatória" });
      }

      const resultado = await AcessService.create(descricao);
      res.status(201).json({
        message: "Acessibilidade criada com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar acessibilidade" });
    }
  },

  async listar(req: Request, res: Response) {
    try {
      const resultado = await AcessService.list();
      res.json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar acessibilidades" });
    }
  },

  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await AcessService.findById(id);

      if (!resultado) {
        return res.status(404).json({ error: "Acessibilidade não encontrada" });
      }

      res.json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar acessibilidade" });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { descricao } = req.body;

      if (!descricao) {
        return res.status(400).json({ error: "Descrição é obrigatória" });
      }

      const resultado = await AcessService.update(id, descricao);

      if (!resultado) {
        return res.status(404).json({ error: "Acessibilidade não encontrada" });
      }

      res.json({
        message: "Acessibilidade atualizada com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar acessibilidade" });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await AcessService.delete(id);

      if (!resultado) {
        return res.status(404).json({ error: "Acessibilidade não encontrada" });
      }

      res.json({ message: "Acessibilidade deletada com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar acessibilidade" });
    }
  },
};
