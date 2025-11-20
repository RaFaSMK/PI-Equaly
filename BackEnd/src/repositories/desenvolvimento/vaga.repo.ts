import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const VagaRepo = {
  async criar(data: {
    empresaId: number;
    titulo: string;
    descricao: string;
    escolaridade?: string;
  }) {
    return prisma.vaga.create({ data });
  },

  async buscarPorId(id: number, p0: { include: { empresa: boolean; }; }) {
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

  async listarTodos(p0: { include: { empresa: boolean; }; }) {
    return prisma.vaga.findMany({
      include: {
        empresa: true,
        subtiposAceitos: { include: { subtipo: true } },
        acessibilidades: { include: { acessibilidade: true } },
        vinculos: true,
      },
    });
  },

  async atualizar(id: number, data: Partial<{ titulo: string; descricao: string; escolaridade?: string }>) {
    return prisma.vaga.update({ where: { id }, data });
  },

  async deletar(id: number) {
    return prisma.vaga.delete({ where: { id } });
  },
};
