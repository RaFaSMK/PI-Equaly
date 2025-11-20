import { Request, Response } from "express";
import { VagaService } from "../../services/desenvolvimento/vaga.service";

export const VagaController = {
  async criar(req: Request, res: Response) {
    try {
      const { empresaId, titulo, descricao, escolaridade } = req.body;

      if (!empresaId || !titulo || !descricao || !escolaridade) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
      }

      const vaga = await VagaService.criarVaga(
        Number(empresaId),
        titulo,
        descricao,
        escolaridade
      );

      res.status(201).json({
        message: "Vaga criada com sucesso!",
        data: vaga,
      });
    } catch (err) {
      console.error(err);
      res.status(err.status || 500).json({ error: (err as Error).message || "Erro ao criar vaga" });
    }
  },

  async buscar(req: Request, res: Response) {
    const { id } = req.params;
    const vaga = await VagaService.buscarVaga(Number(id));
    if (!vaga) return res.status(404).json({ error: "Vaga não encontrada" });
    res.json({ data: vaga });
  },

  async listar(req: Request, res: Response) {
    const vagas = await VagaService.listarVagas();
    res.json({ data: vagas });
  },

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const vagaAtualizada = await VagaService.atualizarVaga(Number(id), req.body);
    if (!vagaAtualizada) return res.status(404).json({ error: "Vaga não encontrada" });
    res.json({ message: "Vaga atualizada com sucesso!", data: vagaAtualizada });
  },

  async deletar(req: Request, res: Response) {
    const { id } = req.params;
    const vagaDeletada = await VagaService.deletarVaga(Number(id));
    if (!vagaDeletada) return res.status(404).json({ error: "Vaga não encontrada" });
    res.json({ message: "Vaga deletada com sucesso!" });
  },
};
