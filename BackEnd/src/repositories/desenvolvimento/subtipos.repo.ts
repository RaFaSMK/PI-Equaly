import prisma from "../../prisma/client";

export const SubtiposRepo = {
  list() {
    return prisma.subtipoDeficiencia.findMany({ orderBy: { id: "asc" } });
  },

  create(nome: string, tipoId: number) {
    return prisma.subtipoDeficiencia.create({
      data: { nome, tipoId },
    });
  },

  findById(id: number) {
    return prisma.subtipoDeficiencia.findUnique({ where: { id } });
  },

  update(id: number, nome: string, tipoId: number) {
    return prisma.subtipoDeficiencia.update({
      where: { id },
      data: { nome, tipoId },
    });
  },

  delete(id: number) {
    return prisma.subtipoDeficiencia.delete({ where: { id } });
  },
};
