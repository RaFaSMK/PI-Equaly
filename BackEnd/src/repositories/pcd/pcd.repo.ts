import prisma from "../../prisma/client";

type EnderecoDTO = {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

type CreatePcdDTO = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  dataNasc: Date;
  escolaridade?: string | null;
  enderecoId: number;
  curriculoUrl?: string | null;
  fotoUrl?: string | null;
  aceitouTermos?: boolean;
  usuarioId?: number | null;
};

export const PcdRepository = {
  async findAll() {
    return prisma.pcd.findMany({
      include: {
        endereco: true,
        subtipoPcd: { include: { subtipo: true } },
        barreirasPcd: { include: { barreira: true } },
      },
      orderBy: { id: "asc" },
    });
  },

  async findById(id: number) {
    return prisma.pcd.findUnique({
      where: { id },
      include: {
        endereco: true,
        subtipoPcd: { include: { subtipo: true } },
        barreirasPcd: { include: { barreira: true } },
        candidaturas: true,
      },
    });
  },

  async findByCpf(cpf: string) {
    return prisma.pcd.findUnique({ where: { cpf } });
  },

  async findByEmail(email: string) {
    return prisma.pcd.findUnique({ where: { email } });
  },

  async findByUsuarioId(usuarioId: number) {
    return prisma.pcd.findUnique({
      where: { usuarioId },
      include: {
        endereco: true,
        subtipoPcd: { include: { subtipo: true } },
        barreirasPcd: { include: { barreira: true } },
        candidaturas: true,
      },
    });
  },

  async createEndereco(dados: EnderecoDTO) {
    return prisma.endereco.create({ data: dados });
  },

  async createPcd(dados: CreatePcdDTO) {
    return prisma.pcd.create({ data: dados });
  },

  async update(id: number, dados: Partial<CreatePcdDTO>) {
    return prisma.pcd.update({
      where: { id },
      data: dados,
    });
  },

  async addSubtipos(pcdId: number, subtipoIds: { id: number; cid?: string }[]) {
    return prisma.pcdSubtipo.createMany({
      data: subtipoIds.map((s) => ({
        pcdId,
        subtipoId: s.id,
        cid: s.cid ?? null,
      })),
      skipDuplicates: true,
    });
  },

  async addBarreiras(pcdId: number, barreiraIds: number[]) {
    return prisma.pcdBarreira.createMany({
      data: barreiraIds.map((barreiraId) => ({ pcdId, barreiraId })),
      skipDuplicates: true,
    });
  },

  async removeBarreiras(pcdId: number) {
    return prisma.pcdBarreira.deleteMany({
      where: { pcdId },
    });
  },

  async removeSubtipos(pcdId: number) {
    return prisma.pcdSubtipo.deleteMany({
      where: { pcdId },
    });
  },
};
