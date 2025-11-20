import { TiposRepo } from "../../repositories/desenvolvimento/tipos.repo";

export const TiposService = {
  async list() {
    try {
      return await TiposRepo.list();
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao listar tipos"), { status: 500 });
    }
  },

  async create(nome: string) {
    const final = (nome ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });

    try {
      return await TiposRepo.create(final);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao criar tipo"), { status: 500 });
    }
  },

  async findById(id: number) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });

    try {
      const tipo = await TiposRepo.findById(id);
      if (!tipo) throw Object.assign(new Error("Tipo não encontrado"), { status: 404 });
      return tipo;
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao buscar tipo"), { status: 500 });
    }
  },

  async update(id: number, nome: string) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });
    const final = (nome ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'nome' é obrigatório"), { status: 400 });

    try {
      return await TiposRepo.update(id, final);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao atualizar tipo"), { status: 500 });
    }
  },

  async delete(id: number) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });

    try {
      return await TiposRepo.delete(id);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao deletar tipo"), { status: 500 });
    }
  },
};
