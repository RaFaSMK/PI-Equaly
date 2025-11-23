import { BarreiraAcessibilidadeRepo } from "../../repositories/desenvolvimento/barreiraAcessibilidade.repo";

export const BarreiraAcessibilidadeService = {
  async listarTodos() {
    return BarreiraAcessibilidadeRepo.listarTodos();
  },

  async criar(barreiraId: number, acessibilidadeId: number) {
    if (!barreiraId || !acessibilidadeId) {
      throw Object.assign(
        new Error("barreiraId e acessibilidadeId são obrigatórios"),
        { status: 400 }
      );
    }

    return BarreiraAcessibilidadeRepo.criar(barreiraId, acessibilidadeId);
  },

  async deletar(barreiraId: number, acessibilidadeId: number) {
    if (!barreiraId || !acessibilidadeId) {
      throw Object.assign(
        new Error("barreiraId e acessibilidadeId são obrigatórios"),
        { status: 400 }
      );
    }

    return BarreiraAcessibilidadeRepo.deletar(barreiraId, acessibilidadeId);
  },
};
