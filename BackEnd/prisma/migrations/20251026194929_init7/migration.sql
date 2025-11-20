-- CreateTable
CREATE TABLE "public"."Vinculo" (
    "id" SERIAL NOT NULL,
    "vagaId" INTEGER NOT NULL,
    "barreiraId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vinculo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vinculo_barreiraId_idx" ON "public"."Vinculo"("barreiraId");

-- CreateIndex
CREATE UNIQUE INDEX "Vinculo_vagaId_barreiraId_key" ON "public"."Vinculo"("vagaId", "barreiraId");

-- AddForeignKey
ALTER TABLE "public"."Vinculo" ADD CONSTRAINT "Vinculo_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vinculo" ADD CONSTRAINT "Vinculo_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "public"."Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;
