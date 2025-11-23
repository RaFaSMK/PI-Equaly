import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const BarreiraAcessibilidadeRepo = {
  async listarTodos() {
    return prisma.barreiraAcessibilidade.findMany({
      include: {
        barreira: true,
        acessibilidade: true,
      },
    });
  },

  async criar(barreiraId: number, acessibilidadeId: number) {
    return prisma.barreiraAcessibilidade.create({
      data: {
        barreiraId,
        acessibilidadeId,
      },
      include: {
        barreira: true,
        acessibilidade: true,
      },
    });
  },

  async deletar(barreiraId: number, acessibilidadeId: number) {
    return prisma.barreiraAcessibilidade.delete({
      where: {
        barreiraId_acessibilidadeId: {
          barreiraId,
          acessibilidadeId,
        },
      },
    });
  },
};
