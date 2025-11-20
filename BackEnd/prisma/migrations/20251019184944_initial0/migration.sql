-- CreateEnum
CREATE TYPE "public"."StatusCandidatura" AS ENUM ('ENVIADA', 'ACEITA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('PCD', 'EMPRESA', 'DESENVOLVEDOR');

-- AlterTable
ALTER TABLE "public"."Vaga" ALTER COLUMN "escolaridade" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Pcd" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNasc" TIMESTAMP(3) NOT NULL,
    "escolaridade" TEXT,
    "enderecoId" INTEGER NOT NULL,
    "curriculoUrl" TEXT,
    "usuarioId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pcd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PcdSubtipo" (
    "pcdId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,

    CONSTRAINT "PcdSubtipo_pkey" PRIMARY KEY ("pcdId","subtipoId")
);

-- CreateTable
CREATE TABLE "public"."Candidatura" (
    "id" SERIAL NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "pcdId" INTEGER NOT NULL,
    "status" "public"."StatusCandidatura" NOT NULL DEFAULT 'ENVIADA',
    "mensagem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "public"."TipoUsuario" NOT NULL,
    "empresaId" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Endereco" (
    "id" SERIAL NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pcd_email_key" ON "public"."Pcd"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pcd_cpf_key" ON "public"."Pcd"("cpf");

-- CreateIndex
CREATE INDEX "PcdSubtipo_subtipoId_idx" ON "public"."PcdSubtipo"("subtipoId");

-- CreateIndex
CREATE INDEX "Candidatura_vagaId_idx" ON "public"."Candidatura"("vagaId");

-- CreateIndex
CREATE INDEX "Candidatura_pcdId_idx" ON "public"."Candidatura"("pcdId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Pcd" ADD CONSTRAINT "Pcd_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "public"."Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pcd" ADD CONSTRAINT "Pcd_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PcdSubtipo" ADD CONSTRAINT "PcdSubtipo_pcdId_fkey" FOREIGN KEY ("pcdId") REFERENCES "public"."Pcd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PcdSubtipo" ADD CONSTRAINT "PcdSubtipo_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "public"."SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidatura" ADD CONSTRAINT "Candidatura_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidatura" ADD CONSTRAINT "Candidatura_pcdId_fkey" FOREIGN KEY ("pcdId") REFERENCES "public"."Pcd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
