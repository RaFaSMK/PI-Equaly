import { Request, Response } from "express";
import { VinculosService } from "../../services/desenvolvimento/vinculos.service";

export const VinculosController = {
  async criar(req: Request, res: Response) {
    try {
      const { vagaId, barreiraId } = req.body;

      if (!vagaId || !barreiraId) {
        return res.status(400).json({ error: "vagaId e barreiraId são obrigatórios" });
      }

      const resultado = await VinculosService.criarVinculo(
        Number(vagaId),
        Number(barreiraId)
      );

      res.status(201).json({
        message: "Vínculo criado com sucesso!",
        data: resultado,
      });
    } catch (err) {
      console.error(err);
      res.status(err.status || 500).json({ error: (err as Error).message || "Erro ao criar vínculo" });
    }
  },

  async buscar(req: Request, res: Response) {
    const { id } = req.params;
    const resultado = await VinculosService.buscarVinculo(Number(id));
    if (!resultado) return res.status(404).json({ error: "Vínculo não encontrado" });
    res.json({ data: resultado });
  },

  async listar(req: Request, res: Response) {
    const resultado = await VinculosService.listarVinculos();
    res.json({ data: resultado });
  },
};
