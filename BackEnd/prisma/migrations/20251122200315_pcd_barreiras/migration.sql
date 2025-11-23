/*
  Warnings:

  - You are about to drop the `PcdAcessibilidade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PcdAcessibilidade" DROP CONSTRAINT "PcdAcessibilidade_acessibilidadeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PcdAcessibilidade" DROP CONSTRAINT "PcdAcessibilidade_pcdId_fkey";

-- AlterTable
ALTER TABLE "public"."SubtipoDeficiencia" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Usuario" ALTER COLUMN "cargo" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."PcdAcessibilidade";

-- CreateTable
CREATE TABLE "public"."PcdBarreira" (
    "pcdId" INTEGER NOT NULL,
    "barreiraId" INTEGER NOT NULL,

    CONSTRAINT "PcdBarreira_pkey" PRIMARY KEY ("pcdId","barreiraId")
);

-- CreateIndex
CREATE INDEX "PcdBarreira_barreiraId_idx" ON "public"."PcdBarreira"("barreiraId");

-- AddForeignKey
ALTER TABLE "public"."PcdBarreira" ADD CONSTRAINT "PcdBarreira_pcdId_fkey" FOREIGN KEY ("pcdId") REFERENCES "public"."Pcd"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PcdBarreira" ADD CONSTRAINT "PcdBarreira_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "public"."Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;
