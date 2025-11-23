import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const VagaRepo = {
  async criar(data: {
    empresaId: number;
    titulo: string;
    descricao: string;
    faixaSalarial?: string;
    metodoTrabalho?: string;
    escolaridade?: string;
  }) {
    return prisma.vaga.create({ data });
  },

  async buscarPorId(id: number, p0: { include: { empresa: boolean } }) {
    return prisma.vaga.findUnique({
      where: { id },
      include: {
        empresa: true,
        subtiposAceitos: { include: { subtipo: true } },
        acessibilidades: { include: { acessibilidade: true } },
        vinculos: true,
      },
    });
  },

  async listarTodos(p0: { include: { empresa: boolean } }) {
    return prisma.vaga.findMany({
      include: {
        empresa: true,
        subtiposAceitos: { include: { subtipo: true } },
        acessibilidades: { include: { acessibilidade: true } },
        vinculos: true,
      },
    });
  },

  async atualizar(
    id: number,
    data: Partial<{
      titulo: string;
      descricao: string;
      faixaSalarial?: string;
      metodoTrabalho?: string;
      escolaridade?: string;
    }>
  ) {
    return prisma.vaga.update({ where: { id }, data });
  },

  async deletar(id: number) {
    return prisma.vaga.delete({ where: { id } });
  },

  async addAcessibilidades(vagaId: number, acessibilidadeIds: number[]) {
    return prisma.vagaAcessibilidade.createMany({
      data: acessibilidadeIds.map((acessibilidadeId) => ({
        vagaId,
        acessibilidadeId,
      })),
      skipDuplicates: true,
    });
  },

  async removeAcessibilidades(vagaId: number) {
    return prisma.vagaAcessibilidade.deleteMany({
      where: { vagaId },
    });
  },

  async addSubtipos(vagaId: number, subtipoIds: number[]) {
    return prisma.vagaSubtipo.createMany({
      data: subtipoIds.map((subtipoId) => ({
        vagaId,
        subtipoId,
      })),
      skipDuplicates: true,
    });
  },

  async removeSubtipos(vagaId: number) {
    return prisma.vagaSubtipo.deleteMany({
      where: { vagaId },
    });
  },
};
