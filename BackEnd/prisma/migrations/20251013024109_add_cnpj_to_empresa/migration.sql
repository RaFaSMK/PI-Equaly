/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Empresa" ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Vaga" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "escolaridade" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VagaSubtipo" (
    "vagaId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,

    CONSTRAINT "VagaSubtipo_pkey" PRIMARY KEY ("vagaId","subtipoId")
);

-- CreateTable
CREATE TABLE "public"."VagaAcessibilidade" (
    "vagaId" INTEGER NOT NULL,
    "acessibilidadeId" INTEGER NOT NULL,

    CONSTRAINT "VagaAcessibilidade_pkey" PRIMARY KEY ("vagaId","acessibilidadeId")
);

-- CreateIndex
CREATE INDEX "VagaSubtipo_subtipoId_idx" ON "public"."VagaSubtipo"("subtipoId");

-- CreateIndex
CREATE INDEX "VagaAcessibilidade_acessibilidadeId_idx" ON "public"."VagaAcessibilidade"("acessibilidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "public"."Empresa"("cnpj");

-- AddForeignKey
ALTER TABLE "public"."Vaga" ADD CONSTRAINT "Vaga_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaSubtipo" ADD CONSTRAINT "VagaSubtipo_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaSubtipo" ADD CONSTRAINT "VagaSubtipo_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "public"."SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaAcessibilidade" ADD CONSTRAINT "VagaAcessibilidade_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaAcessibilidade" ADD CONSTRAINT "VagaAcessibilidade_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "public"."Acessibilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
