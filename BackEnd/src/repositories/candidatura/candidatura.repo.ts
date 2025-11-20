import prisma from "../../prisma/client";
import { StatusCandidatura } from "@prisma/client";

export const CandidaturaRepository = {
  criar: async (vagaId: number, pcdId: number, mensagem?: string) => {
    return prisma.candidatura.create({
      data: { vagaId, pcdId, mensagem }
    });
  },

  buscarPorId: async (id: number) => {
    return prisma.candidatura.findUnique({
      where: { id },
      include: { vaga: true, pcd: true }
    });
  },

  listarPorPcd: async (pcdId: number) => {
    return prisma.candidatura.findMany({
      where: { pcdId },
      include: { vaga: true }
    });
  },

  listarPorVaga: async (vagaId: number) => {
    return prisma.candidatura.findMany({
      where: { vagaId },
      include: { pcd: true, vaga: true }
    });
  },

  atualizarStatus: async (id: number, status: StatusCandidatura) => {
    return prisma.candidatura.update({
      where: { id },
      data: { status }
    });
  }
};
