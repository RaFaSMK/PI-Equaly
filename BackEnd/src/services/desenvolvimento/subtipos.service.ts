import { SubtiposRepo } from "../../repositories/desenvolvimento/subtipos.repo";

export const SubtiposService = {
  async list() {
    try {
      return await SubtiposRepo.list();
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao listar subtipos"), { status: 500 });
    }
  },

  async create(nome: string, tipoId: number) {
    const final = (nome ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });
    if (!tipoId || isNaN(tipoId)) throw Object.assign(new Error("tipoId inválido"), { status: 400 });

    try {
      return await SubtiposRepo.create(final, tipoId);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao criar subtipo"), { status: 500 });
    }
  },

  async findById(id: number) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });

    try {
      const subtipo = await SubtiposRepo.findById(id);
      if (!subtipo) throw Object.assign(new Error("Subtipo não encontrado"), { status: 404 });
      return subtipo;
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao buscar subtipo"), { status: 500 });
    }
  },

  async update(id: number, nome: string, tipoId: number) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });
    const final = (nome ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });
    if (!tipoId || isNaN(tipoId)) throw Object.assign(new Error("tipoId inválido"), { status: 400 });

    try {
      return await SubtiposRepo.update(id, final, tipoId);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao atualizar subtipo"), { status: 500 });
    }
  },

  async delete(id: number) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });

    try {
      return await SubtiposRepo.delete(id);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao deletar subtipo"), { status: 500 });
    }
  },
};
