import { BarreirasRepo } from "../../repositories/desenvolvimento/barreiras.repo";

// Função auxiliar para validar descrição
function validarDescricao(descricao?: string) {
  const final = (descricao ?? "").trim();
  if (!final) throw Object.assign(new Error("O campo 'descricao' é obrigatório"), { status: 400 });
  return final;
}

export const BarreirasService = {
  async list() {
    try {
      return await BarreirasRepo.list();
    } catch (err) {
      const msg = err?.message || "Erro ao listar barreiras";
      throw Object.assign(new Error(msg), { status: 500 });
    }
  },

  async create(descricao: string) {
    const final = validarDescricao(descricao);

    try {
      // Checar se já existe barreira com mesma descrição
      const existentes = await BarreirasRepo.list();
      if (existentes.some(b => b.descricao.toLowerCase() === final.toLowerCase())) {
        throw Object.assign(new Error("Barreira já existe"), { status: 400 });
      }

      return await BarreirasRepo.create(final);
    } catch (err) {
      const msg = err?.meta?.target
        ? `Erro de banco: ${err.meta.target} - ${err.message}`
        : err?.message || "Erro ao criar barreira";
      throw Object.assign(new Error(msg), { status: err?.status || 500 });
    }
  },

  async findById(id: number) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });

    try {
      const barreira = await BarreirasRepo.findById(id);
      if (!barreira) throw Object.assign(new Error("Barreira não encontrada"), { status: 404 });
      return barreira;
    } catch (err) {
      const msg = err?.message || "Erro ao buscar barreira";
      throw Object.assign(new Error(msg), { status: 500 });
    }
  },

  async update(id: number, descricao: string) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });
    const final = validarDescricao(descricao);

    try {
      const barreiraExistente = await BarreirasRepo.findById(id);
      if (!barreiraExistente) throw Object.assign(new Error("Barreira não encontrada"), { status: 404 });

      // Checar duplicidade
      const todas = await BarreirasRepo.list();
      if (todas.some(b => b.descricao.toLowerCase() === final.toLowerCase() && b.id !== id)) {
        throw Object.assign(new Error("Já existe outra barreira com essa descrição"), { status: 400 });
      }

      return await BarreirasRepo.update(id, final);
    } catch (err) {
      const msg = err?.meta?.target
        ? `Erro de banco: ${err.meta.target} - ${err.message}`
        : err?.message || "Erro ao atualizar barreira";
      throw Object.assign(new Error(msg), { status: err?.status || 500 });
    }
  },

  async delete(id: number) {
    if (isNaN(id)) throw Object.assign(new Error("ID inválido"), { status: 400 });

    try {
      const barreiraExistente = await BarreirasRepo.findById(id);
      if (!barreiraExistente) throw Object.assign(new Error("Barreira não encontrada"), { status: 404 });

      return await BarreirasRepo.delete(id);
    } catch (err) {
      const msg = err?.meta?.target
        ? `Erro de banco: ${err.meta.target} - ${err.message}`
        : err?.message || "Erro ao deletar barreira";
      throw Object.assign(new Error(msg), { status: err?.status || 500 });
    }
  },
};
