import { VinculosRepo } from "../../repositories/desenvolvimento/vinculos.repo";
import { VagaService } from "./vaga.service";
import { BarreirasService } from "./barreiras.service";
import { SubtiposService } from "./subtipos.service";
import { AcessService } from "../../services/desenvolvimento/acessibilidades.service";

const includeRelations = {
  include: {
    vaga: {
      include: { empresa: true },
    },
    barreira: true,
  },
};

export const VinculosService = {
  async criarVinculo(
    vagaId: number,
    barreiraId: number,
    subtipoId?: number,
    acessibilidadeId?: number
  ) {
    if (!vagaId || !barreiraId) {
      throw Object.assign(new Error("vagaId e barreiraId são obrigatórios"), { status: 400 });
    }

    const vaga = await VagaService.buscarVaga(vagaId);
    if (!vaga) throw Object.assign(new Error(`Vaga com ID ${vagaId} não encontrada`), { status: 404 });

    const barreira = await BarreirasService.findById(barreiraId);
    if (!barreira) throw Object.assign(new Error(`Barreira com ID ${barreiraId} não encontrada`), { status: 404 });

    if (subtipoId) {
      const subtipo = await SubtiposService.findById(subtipoId);
      if (!subtipo) throw Object.assign(new Error(`Subtipo com ID ${subtipoId} não encontrado`), { status: 404 });
    }

    if (acessibilidadeId) {
      const acess = await AcessService.findById(acessibilidadeId);
      if (!acess) throw Object.assign(new Error(`Acessibilidade com ID ${acessibilidadeId} não encontrada`), { status: 404 });
    }

    // Passando o include para o repository
    return VinculosRepo.criar(vagaId, barreiraId, subtipoId, acessibilidadeId, includeRelations);
  },

  async buscarVinculo(id: number) {
    if (!id) throw Object.assign(new Error("id é obrigatório"), { status: 400 });
    return VinculosRepo.buscarPorId(id, includeRelations);
  },

  async listarVinculos() {
    return VinculosRepo.listarTodos(includeRelations);
  },
};
