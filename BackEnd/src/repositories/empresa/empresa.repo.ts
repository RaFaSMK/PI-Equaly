import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class EmpresaRepository {
  async create(data: Prisma.EmpresaCreateInput) {
    return prisma.empresa.create({ data });
  }

  async findByCnpj(cnpj: string) {
    return prisma.empresa.findUnique({ where: { cnpj } });
  }

  async findAll() {
    return prisma.empresa.findMany();
  }

  async update(id: number, data: Prisma.EmpresaUpdateInput) {
    return prisma.empresa.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.empresa.delete({ where: { id } });
  }
}
