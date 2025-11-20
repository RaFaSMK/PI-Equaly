import { Request, Response } from "express";
import { BarreirasService } from "../../services/desenvolvimento/barreiras.service";

export const BarreirasController = {
  async criar(req: Request, res: Response) {
    try {
      const { descricao } = req.body;
      if (!descricao) {
        return res.status(400).json({ error: "Descrição é obrigatória" });
      }

      const resultado = await BarreirasService.create(descricao);
      res.status(201).json({
        message: "Barreira criada com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error(error);

      // Se o erro tiver status definido no service, usa ele, senão 500
      const status = error.status || 500;
      res.status(status).json({ error: (error as Error).message || "Erro ao criar barreira" });
    }
  },

  async listar(req: Request, res: Response) {
    try {
      const resultado = await BarreirasService.list();
      res.json({ data: resultado });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      res.status(status).json({ error: (error as Error).message || "Erro ao listar barreiras" });
    }
  },

  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await BarreirasService.findById(id);

      res.json({ data: resultado });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      res.status(status).json({ error: (error as Error).message || "Erro ao buscar barreira" });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { descricao } = req.body;

      if (!descricao) {
        return res.status(400).json({ error: "Descrição é obrigatória" });
      }

      const resultado = await BarreirasService.update(id, descricao);
      res.json({
        message: "Barreira atualizada com sucesso!",
        data: resultado,
      });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      res.status(status).json({ error: (error as Error).message || "Erro ao atualizar barreira" });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await BarreirasService.delete(id);
      res.json({ message: "Barreira deletada com sucesso!" });
    } catch (error) {
      console.error(error);
      const status = error.status || 500;
      res.status(status).json({ error: (error as Error).message || "Erro ao deletar barreira" });
    }
  },
};
