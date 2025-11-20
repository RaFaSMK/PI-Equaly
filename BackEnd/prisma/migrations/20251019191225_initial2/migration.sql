/*
  Warnings:

  - You are about to drop the column `email` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Empresa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bairro` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeFantasia` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `porteEmpresa` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razaoSocial` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setorAtuacao` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobre` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Made the column `cnpj` on table `Empresa` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cargo` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo` on the `Usuario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "public"."Empresa_email_key";

-- AlterTable
ALTER TABLE "public"."Empresa" DROP COLUMN "email",
DROP COLUMN "nome",
ADD COLUMN     "bairro" TEXT NOT NULL,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "inscricaoEstadual" TEXT,
ADD COLUMN     "nomeFantasia" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "porteEmpresa" TEXT NOT NULL,
ADD COLUMN     "razaoSocial" TEXT NOT NULL,
ADD COLUMN     "setorAtuacao" TEXT NOT NULL,
ADD COLUMN     "site" TEXT,
ADD COLUMN     "sobre" TEXT NOT NULL,
ALTER COLUMN "cnpj" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "cargo" TEXT NOT NULL,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "pcdid" INTEGER,
ADD COLUMN     "telefone" TEXT NOT NULL,
DROP COLUMN "tipo",
ADD COLUMN     "tipo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "public"."Usuario"("cpf");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_pcdid_fkey" FOREIGN KEY ("pcdid") REFERENCES "public"."Pcd"("id") ON DELETE SET NULL ON UPDATE CASCADE;
