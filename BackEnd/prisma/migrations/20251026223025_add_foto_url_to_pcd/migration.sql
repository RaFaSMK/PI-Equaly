/*
  Warnings:

  - You are about to drop the column `pcdid` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[responsavelId]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuarioId]` on the table `Pcd` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tipo` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_pcdid_fkey";

-- AlterTable
ALTER TABLE "public"."Pcd" ADD COLUMN     "aceitouTermos" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fotoUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."PcdSubtipo" ADD COLUMN     "cid" TEXT;

-- AlterTable
ALTER TABLE "public"."SubtipoDeficiencia" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "pcdid",
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "public"."TipoUsuario" NOT NULL;

-- CreateTable
CREATE TABLE "public"."PcdAcessibilidade" (
    "pcdId" INTEGER NOT NULL,
    "acessibilidadeId" INTEGER NOT NULL,

    CONSTRAINT "PcdAcessibilidade_pkey" PRIMARY KEY ("pcdId","acessibilidadeId")
);

-- CreateIndex
CREATE INDEX "PcdAcessibilidade_acessibilidadeId_idx" ON "public"."PcdAcessibilidade"("acessibilidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_responsavelId_key" ON "public"."Empresa"("responsavelId");

-- CreateIndex
CREATE UNIQUE INDEX "Pcd_usuarioId_key" ON "public"."Pcd"("usuarioId");

-- AddForeignKey
ALTER TABLE "public"."PcdAcessibilidade" ADD CONSTRAINT "PcdAcessibilidade_pcdId_fkey" FOREIGN KEY ("pcdId") REFERENCES "public"."Pcd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PcdAcessibilidade" ADD CONSTRAINT "PcdAcessibilidade_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "public"."Acessibilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
