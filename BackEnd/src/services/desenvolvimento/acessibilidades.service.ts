import { AcessRepo } from "../../repositories/desenvolvimento/acessibilidades.repo";

export const AcessService = {
  async list() {
    try {
      return await AcessRepo.list();
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao listar acessibilidades"), { status: 500 });
    }
  },

  async create(descricao: string) {
    const final = (descricao ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'descricao' é obrigatório"), { status: 400 });

    try {
      return await AcessRepo.create(final);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao criar acessibilidade"), { status: 500 });
    }
  },

  async findById(id: number) {
    if (!id || id <= 0) throw Object.assign(new Error("ID inválido"), { status: 400 });

    try {
      const result = await AcessRepo.findById(id);
      if (!result) throw Object.assign(new Error("Acessibilidade não encontrada"), { status: 404 });
      return result;
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao buscar acessibilidade"), { status: 500 });
    }
  },

  async update(id: number, descricao: string) {
    if (!id || id <= 0) throw Object.assign(new Error("ID inválido"), { status: 400 });
    const final = (descricao ?? "").trim();
    if (!final) throw Object.assign(new Error("O campo 'descricao' é obrigatório"), { status: 400 });

    try {
      const exist = await AcessRepo.findById(id);
      if (!exist) throw Object.assign(new Error("Acessibilidade não encontrada"), { status: 404 });

      return await AcessRepo.update(id, final);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao atualizar acessibilidade"), { status: 500 });
    }
  },

  async delete(id: number) {
    if (!id || id <= 0) throw Object.assign(new Error("ID inválido"), { status: 400 });

    try {
      const exist = await AcessRepo.findById(id);
      if (!exist) throw Object.assign(new Error("Acessibilidade não encontrada"), { status: 404 });

      return await AcessRepo.delete(id);
    } catch (err) {
      throw Object.assign(new Error(err.message || "Erro ao deletar acessibilidade"), { status: 500 });
    }
  },
};
