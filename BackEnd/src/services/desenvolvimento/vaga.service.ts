import { VagaRepo } from "../../repositories/desenvolvimento/vaga.repo";

export const VagaService = {
  async criarVaga(empresaId: number, titulo: string, descricao: string, escolaridade?: string) {
    if (!empresaId || !titulo || !descricao) {
      throw Object.assign(
        new Error("empresaId, titulo e descricao são obrigatórios"),
        { status: 400 }
      );
    }

    const vaga = await VagaRepo.criar({
      empresaId,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      escolaridade: escolaridade?.trim() || undefined,
    });

    // retorna já com empresa incluída
    return VagaRepo.buscarPorId(vaga.id, { include: { empresa: true } });
  },

  async buscarVaga(id: number) {
    if (!id) throw Object.assign(new Error("id é obrigatório"), { status: 400 });
    return VagaRepo.buscarPorId(id, { include: { empresa: true } });
  },

  async listarVagas() {
    return VagaRepo.listarTodos({ include: { empresa: true } });
  },

  async atualizarVaga(
    id: number,
    data: Partial<{ titulo: string; descricao: string; escolaridade?: string }>
  ) {
    if (!id) throw Object.assign(new Error("id é obrigatório"), { status: 400 });

    await VagaRepo.atualizar(id, {
      titulo: data.titulo?.trim(),
      descricao: data.descricao?.trim(),
      escolaridade: data.escolaridade?.trim() || undefined,
    });

    return VagaRepo.buscarPorId(id, { include: { empresa: true } });
  },

  async deletarVaga(id: number) {
    if (!id) throw Object.assign(new Error("id é obrigatório"), { status: 400 });
    return VagaRepo.deletar(id);
  },
};
