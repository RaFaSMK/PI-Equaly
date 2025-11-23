import prisma from "../../prisma/client";

export const TiposRepo = {
  list() {
    return prisma.tipoDeficiencia.findMany({
      orderBy: { id: "asc" },
      include: { subtipos: { select: { id: true, nome: true } } },
    });
  },

  create(nome: string) {
    return prisma.tipoDeficiencia.create({ data: { nome } });
  },

  findById(id: number) {
    return prisma.tipoDeficiencia.findUnique({
      where: { id },
      include: { subtipos: { select: { id: true, nome: true } } },
    });
  },

  update(id: number, nome: string) {
    return prisma.tipoDeficiencia.update({ where: { id }, data: { nome } });
  },

  delete(id: number) {
    return prisma.tipoDeficiencia.delete({ where: { id } });
  },
};
