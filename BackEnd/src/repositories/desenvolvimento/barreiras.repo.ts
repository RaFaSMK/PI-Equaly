import prisma from "../../prisma/client";

export const BarreirasRepo = {
  list() {
    return prisma.barreira.findMany({ orderBy: { id: "asc" } });
  },

  create(descricao: string) {
    return prisma.barreira.create({ data: { descricao } });
  },

  findById(id: number) {
    return prisma.barreira.findUnique({ where: { id } });
  },

  update(id: number, descricao: string) {
    return prisma.barreira.update({
      where: { id },
      data: { descricao },
    });
  },

  delete(id: number) {
    return prisma.barreira.delete({ where: { id } });
  },
};
