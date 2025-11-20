-- AlterTable
ALTER TABLE "public"."Empresa" ADD COLUMN     "responsavelId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Empresa" ADD CONSTRAINT "Empresa_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
