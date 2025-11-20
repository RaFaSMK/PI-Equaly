import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const VinculosRepo = {
  async criar(vagaId: number, barreiraId: number, subtipoId: number | undefined, acessibilidadeId: number | undefined, p0: { include: { vaga: { include: { empresa: boolean; }; }; barreira: boolean; }; }) {
    return prisma.vinculo.create({
      data: { vagaId, barreiraId },
    });
  },

  async buscarPorId(id: number, p0: { include: { vaga: { include: { empresa: boolean; }; }; barreira: boolean; }; }) {
    return prisma.vinculo.findUnique({
      where: { id },
      include: { vaga: true, barreira: true },
    });
  },

  async listarTodos(p0: { include: { vaga: { include: { empresa: boolean; }; }; barreira: boolean; }; }) {
    return prisma.vinculo.findMany({
      include: { vaga: true, barreira: true },
    });
  },
};
