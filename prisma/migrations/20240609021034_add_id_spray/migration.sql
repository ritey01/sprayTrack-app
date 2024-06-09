-- AlterTable
ALTER TABLE "SprayEvent" ADD COLUMN     "sprayMixId" INTEGER;

-- CreateIndex
CREATE INDEX "SprayEvent_sprayMixId_idx" ON "SprayEvent"("sprayMixId");
