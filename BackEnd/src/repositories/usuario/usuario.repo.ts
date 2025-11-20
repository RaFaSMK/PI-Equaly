import prisma from "../../prisma/client";

export const UsuariosRepo = {
  create(data: {
    nome: string;
    cargo?: string | null;
    cpf: string;
    telefone: string;
    email: string;
    senha: string;
    tipo: string;
    empresaId?: number | null;
    pcdid?: number | null;
  }) {
    return prisma.usuario.create({
      data: {
        nome: data.nome,
        cargo: data.cargo ?? null,
        cpf: data.cpf,
        telefone: data.telefone,
        email: data.email,
        senha: data.senha,
        tipo: data.tipo,

        // 👇 Agora sim correto
        empresa: data.empresaId
          ? { connect: { id: data.empresaId } }
          : undefined,

        pcd: data.pcdid
          ? { connect: { id: data.pcdid } }
          : undefined,
      },
    });
  },

  findByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  },

  findByCpf(cpf: string) {
    return prisma.usuario.findUnique({ where: { cpf } });
  },
};
