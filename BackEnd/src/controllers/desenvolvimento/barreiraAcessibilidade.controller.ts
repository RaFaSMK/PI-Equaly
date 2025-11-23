import { Request, Response } from "express";
import { BarreiraAcessibilidadeService } from "../../services/desenvolvimento/barreiraAcessibilidade.service";

export const BarreiraAcessibilidadeController = {
  async listar(req: Request, res: Response) {
    try {
      const vinculos = await BarreiraAcessibilidadeService.listarTodos();
      res.json({ data: vinculos });
    } catch (err) {
      const error = err as any;
      res
        .status(error.status || 500)
        .json({ error: error.message || "Erro ao listar vínculos" });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      const { barreiraId, acessibilidadeId } = req.body;

      if (!barreiraId || !acessibilidadeId) {
        return res
          .status(400)
          .json({ error: "barreiraId e acessibilidadeId são obrigatórios" });
      }

      const vinculo = await BarreiraAcessibilidadeService.criar(
        Number(barreiraId),
        Number(acessibilidadeId)
      );

      res.status(201).json({
        message: "Vínculo criado com sucesso!",
        data: vinculo,
      });
    } catch (err) {
      const error = err as any;
      res
        .status(error.status || 500)
        .json({ error: error.message || "Erro ao criar vínculo" });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const { barreiraId, acessibilidadeId } = req.params;

      await BarreiraAcessibilidadeService.deletar(
        Number(barreiraId),
        Number(acessibilidadeId)
      );

      res.json({ message: "Vínculo deletado com sucesso!" });
    } catch (err) {
      const error = err as any;
      res
        .status(error.status || 500)
        .json({ error: error.message || "Erro ao deletar vínculo" });
    }
  },
};
