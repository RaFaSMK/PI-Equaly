import { VagaRepo } from "../../repositories/desenvolvimento/vaga.repo";
import { PcdRepository } from "../../repositories/pcd/pcd.repo";
import prisma from "../../prisma/client";

export const VagaService = {
  async criarVaga(
    empresaId: number,
    titulo: string,
    descricao: string,
    faixaSalarial?: string,
    metodoTrabalho?: string,
    escolaridade?: string,
    acessibilidadeIds?: number[],
    subtipoIds?: number[]
  ) {
    if (!empresaId || !titulo || !descricao) {
      throw Object.assign(
        new Error("empresaId, titulo e descricao são obrigatórios"),
        { status: 400 }
      );
    }

    const vaga = await VagaRepo.criar({
      empresaId,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      faixaSalarial: faixaSalarial?.trim() || undefined,
      metodoTrabalho: metodoTrabalho?.trim() || undefined,
      escolaridade: escolaridade?.trim() || undefined,
    });

    // Adicionar acessibilidades se fornecidas
    if (acessibilidadeIds && acessibilidadeIds.length > 0) {
      await VagaRepo.addAcessibilidades(vaga.id, acessibilidadeIds);
    }

    // Adicionar subtipos se fornecidos
    if (subtipoIds && subtipoIds.length > 0) {
      await VagaRepo.addSubtipos(vaga.id, subtipoIds);
    }

    // retorna já com empresa incluída
    return VagaRepo.buscarPorId(vaga.id, { include: { empresa: true } });
  },

  async buscarVaga(id: number) {
    if (!id)
      throw Object.assign(new Error("id é obrigatório"), { status: 400 });
    return VagaRepo.buscarPorId(id, { include: { empresa: true } });
  },

  async listarVagas() {
    return VagaRepo.listarTodos({ include: { empresa: true } });
  },

  async atualizarVaga(
    id: number,
    data: Partial<{
      titulo: string;
      descricao: string;
      faixaSalarial?: string;
      metodoTrabalho?: string;
      escolaridade?: string;
      acessibilidadeIds?: number[];
      subtipoIds?: number[];
    }>
  ) {
    if (!id)
      throw Object.assign(new Error("id é obrigatório"), { status: 400 });

    await VagaRepo.atualizar(id, {
      titulo: data.titulo?.trim(),
      descricao: data.descricao?.trim(),
      faixaSalarial: data.faixaSalarial?.trim() || undefined,
      metodoTrabalho: data.metodoTrabalho?.trim() || undefined,
      escolaridade: data.escolaridade?.trim() || undefined,
    });

    // Atualizar acessibilidades se fornecidas
    if (data.acessibilidadeIds) {
      await VagaRepo.removeAcessibilidades(id);
      if (data.acessibilidadeIds.length > 0) {
        await VagaRepo.addAcessibilidades(id, data.acessibilidadeIds);
      }
    }

    // Atualizar subtipos se fornecidos
    if (data.subtipoIds) {
      await VagaRepo.removeSubtipos(id);
      if (data.subtipoIds.length > 0) {
        await VagaRepo.addSubtipos(id, data.subtipoIds);
      }
    }

    return VagaRepo.buscarPorId(id, { include: { empresa: true } });
  },

  async deletarVaga(id: number) {
    if (!id)
      throw Object.assign(new Error("id é obrigatório"), { status: 400 });
    return VagaRepo.deletar(id);
  },

  /**
   * Calcula a compatibilidade entre um PCD e uma vaga
   * Verifica quantas barreiras do PCD são resolvidas pelas acessibilidades da vaga
   * @param pcdId - ID do PCD
   * @param vagaId - ID da vaga
   * @returns Objeto com porcentagem de compatibilidade e detalhes
   */
  async calcularCompatibilidade(pcdId: number, vagaId: number) {
    if (!pcdId || !vagaId) {
      throw Object.assign(new Error("pcdId e vagaId são obrigatórios"), {
        status: 400,
      });
    }

    // Buscar barreiras do PCD (já vem com barreirasPcd incluído)
    const pcd = await PcdRepository.findById(pcdId);
    if (!pcd) {
      throw Object.assign(new Error("PCD não encontrado"), { status: 404 });
    }

    // Buscar acessibilidades da vaga (já vem com acessibilidades incluído)
    const vaga = await VagaRepo.buscarPorId(vagaId, {
      include: { empresa: true },
    });
    if (!vaga) {
      throw Object.assign(new Error("Vaga não encontrada"), { status: 404 });
    }

    const barreirasPcd = (pcd as any).barreirasPcd || [];
    const acessibilidadesVaga = (vaga as any).acessibilidades || [];

    // Se o PCD não tem barreiras, compatibilidade é 100%
    if (barreirasPcd.length === 0) {
      return {
        compatibilidade: 100,
        barreirasResolvidas: 0,
        totalBarreiras: 0,
      };
    }

    // Se a vaga não tem acessibilidades, compatibilidade é 0%
    if (acessibilidadesVaga.length === 0) {
      return {
        compatibilidade: 0,
        barreirasResolvidas: 0,
        totalBarreiras: barreirasPcd.length,
      };
    }

    // Extrair IDs de barreiras e acessibilidades
    const barreiraIds = barreirasPcd.map((pb: any) => pb.barreiraId);
    const acessibilidadeIds = acessibilidadesVaga.map(
      (va: any) => va.acessibilidadeId
    );

    // Buscar mapeamento BarreiraAcessibilidade para ver quais barreiras são resolvidas
    const mapeamentos = await prisma.barreiraAcessibilidade.findMany({
      where: {
        barreiraId: { in: barreiraIds },
        acessibilidadeId: { in: acessibilidadeIds },
      },
    });

    // Criar conjunto de barreiras resolvidas (sem duplicatas)
    const barreirasResolvidasSet = new Set(
      mapeamentos.map((m) => m.barreiraId)
    );

    const barreirasResolvidas = barreirasResolvidasSet.size;
    const totalBarreiras = barreiraIds.length;
    const compatibilidade = Math.round(
      (barreirasResolvidas / totalBarreiras) * 100
    );

    return {
      compatibilidade,
      barreirasResolvidas,
      totalBarreiras,
    };
  },

  /**
   * Lista vagas com compatibilidade calculada para um PCD específico
   * @param pcdId - ID do PCD
   * @returns Array de vagas com porcentagem de compatibilidade
   */
  async listarVagasCompativeis(pcdId: number) {
    if (!pcdId) {
      throw Object.assign(new Error("pcdId é obrigatório"), { status: 400 });
    }

    // Buscar todas as vagas (já vem com acessibilidades incluído)
    const vagas = await VagaRepo.listarTodos({ include: { empresa: true } });

    // Calcular compatibilidade para cada vaga
    const vagasComCompatibilidade = await Promise.all(
      vagas.map(async (vaga) => {
        const { compatibilidade, barreirasResolvidas, totalBarreiras } =
          await this.calcularCompatibilidade(pcdId, vaga.id);

        return {
          ...vaga,
          compatibilidade,
          barreirasResolvidas,
          totalBarreiras,
        };
      })
    );

    // Ordenar por compatibilidade (maior primeiro)
    return vagasComCompatibilidade.sort(
      (a, b) => b.compatibilidade - a.compatibilidade
    );
  },
};
