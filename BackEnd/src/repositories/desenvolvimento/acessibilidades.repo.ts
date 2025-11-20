import prisma from "../../prisma/client";

export const AcessRepo = {
  // Listar todas as acessibilidades
  list() {
    return prisma.acessibilidade.findMany({ orderBy: { id: "asc" } });
  },

  // Criar uma nova acessibilidade
  create(descricao: string) {
    return prisma.acessibilidade.create({ data: { descricao } });
  },

  // Buscar acessibilidade por ID
  findById(id: number) {
    return prisma.acessibilidade.findUnique({ where: { id } });
  },

  // Atualizar uma acessibilidade
  update(id: number, descricao: string) {
    return prisma.acessibilidade.update({
      where: { id },
      data: { descricao },
    });
  },

  // Deletar uma acessibilidade
  delete(id: number) {
    return prisma.acessibilidade.delete({ where: { id } });
  },
};
