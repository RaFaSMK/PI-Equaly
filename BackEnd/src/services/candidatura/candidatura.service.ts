import { PrismaClient, StatusCandidatura } from "@prisma/client";
const prisma = new PrismaClient();

// Funções de autorização simplificadas
async function ensurePCD(userId: number) {
  const user = await prisma.usuario.findUnique({ where: { id: userId } });
  if (!user || user.tipo !== "PCD") {
    throw new Error("Apenas PCD pode realizar esta ação");
  }
}

async function ensureResponsavelEmpresa(userId: number, vagaId: number) {
  const vaga = await prisma.vaga.findUnique({
    where: { id: vagaId },
    include: { empresa: true },
  });

  if (!vaga) throw new Error("Vaga não encontrada");

  if (vaga.empresa.responsavelId !== userId) {
    throw new Error("Usuário não é responsável por esta vaga");
  }
}

// CRUD
export async function criar(
  userId: number,
  body: { vagaId: number; mensagem?: string }
) {
  await ensurePCD(userId);

  const pcd = await prisma.pcd.findFirst({ where: { usuarioId: userId } });
  if (!pcd) throw new Error("Perfil PCD não encontrado para este usuário");

  const { vagaId, mensagem } = body;

  return prisma.candidatura.create({
    data: {
      vagaId,
      pcdId: pcd.id,
      mensagem,
    },
  });
}

export async function listarPorPcd(userId: number) {
  await ensurePCD(userId);
  const pcd = await prisma.pcd.findFirst({ where: { usuarioId: userId } });

  return prisma.candidatura.findMany({
    where: { pcdId: pcd?.id },
    include: { vaga: true },
  });
}

export async function listarPorVaga(vagaId: number, userId: number) {
  await ensureResponsavelEmpresa(userId, vagaId);

  return prisma.candidatura.findMany({
    where: { vagaId },
    include: { pcd: true },
  });
}

export async function atualizarStatus(
  id: number,
  status: StatusCandidatura,
  userId: number
) {
  const candidatura = await prisma.candidatura.findUnique({ where: { id } });
  if (!candidatura) throw new Error("Candidatura não encontrada");

  await ensureResponsavelEmpresa(userId, candidatura.vagaId);

  return prisma.candidatura.update({
    where: { id },
    data: { status },
  });
}

export async function buscarPorId(id: number, userId: number) {
  const candidatura = await prisma.candidatura.findUnique({
    where: { id },
    include: { vaga: true, pcd: true },
  });

  if (!candidatura) throw new Error("Candidatura não encontrada");

  // Se for PCD só pode ver se for dele
  if (candidatura.pcd.usuarioId === userId) return candidatura;

  // Se for empresa precisa ser o responsável pela vaga
  await ensureResponsavelEmpresa(userId, candidatura.vagaId);
  return candidatura;
}
