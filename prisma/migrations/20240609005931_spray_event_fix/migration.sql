-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('Litres', 'mls', 'Kgs', 'grams');

-- CreateTable
CREATE TABLE "Paddock" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_displayed" BOOLEAN NOT NULL DEFAULT true,
    "companyId" INTEGER,

    CONSTRAINT "Paddock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crops" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_displayed" BOOLEAN NOT NULL DEFAULT true,
    "companyId" INTEGER,

    CONSTRAINT "Crops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprayName" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_displayed" BOOLEAN NOT NULL DEFAULT true,
    "companyId" INTEGER,

    CONSTRAINT "SprayName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprayMix" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "is_displayed" BOOLEAN NOT NULL DEFAULT true,
    "companyId" INTEGER,

    CONSTRAINT "SprayMix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spray" (
    "id" SERIAL NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "unit" "Unit" NOT NULL,
    "is_displayed" BOOLEAN NOT NULL DEFAULT true,
    "sprayNameId" INTEGER NOT NULL,

    CONSTRAINT "Spray_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprayMixSpray" (
    "id" SERIAL NOT NULL,
    "sprayId" INTEGER NOT NULL,
    "sprayMixId" INTEGER NOT NULL,

    CONSTRAINT "SprayMixSpray_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprayMixSprayEvent" (
    "id" SERIAL NOT NULL,
    "sprayEventId" INTEGER NOT NULL,
    "sprayMixId" INTEGER NOT NULL,

    CONSTRAINT "SprayMixSprayEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprayEvent" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "paddockId" INTEGER NOT NULL,
    "cropId" INTEGER NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" INTEGER,
    "comment" TEXT,

    CONSTRAINT "SprayEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "companyId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authorisedEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "authorisedEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Paddock_companyId_idx" ON "Paddock"("companyId");

-- CreateIndex
CREATE INDEX "Crops_companyId_idx" ON "Crops"("companyId");

-- CreateIndex
CREATE INDEX "SprayName_companyId_idx" ON "SprayName"("companyId");

-- CreateIndex
CREATE INDEX "SprayMix_companyId_idx" ON "SprayMix"("companyId");

-- CreateIndex
CREATE INDEX "Spray_sprayNameId_idx" ON "Spray"("sprayNameId");

-- CreateIndex
CREATE INDEX "SprayMixSpray_sprayId_idx" ON "SprayMixSpray"("sprayId");

-- CreateIndex
CREATE INDEX "SprayMixSpray_sprayMixId_idx" ON "SprayMixSpray"("sprayMixId");

-- CreateIndex
CREATE INDEX "SprayMixSprayEvent_sprayEventId_idx" ON "SprayMixSprayEvent"("sprayEventId");

-- CreateIndex
CREATE INDEX "SprayMixSprayEvent_sprayMixId_idx" ON "SprayMixSprayEvent"("sprayMixId");

-- CreateIndex
CREATE INDEX "SprayEvent_companyId_idx" ON "SprayEvent"("companyId");

-- CreateIndex
CREATE INDEX "SprayEvent_paddockId_idx" ON "SprayEvent"("paddockId");

-- CreateIndex
CREATE INDEX "SprayEvent_cropId_idx" ON "SprayEvent"("cropId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "Employee_companyId_idx" ON "Employee"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "authorisedEmail_email_key" ON "authorisedEmail"("email");

-- AddForeignKey
ALTER TABLE "Paddock" ADD CONSTRAINT "Paddock_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crops" ADD CONSTRAINT "Crops_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayName" ADD CONSTRAINT "SprayName_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayMix" ADD CONSTRAINT "SprayMix_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spray" ADD CONSTRAINT "Spray_sprayNameId_fkey" FOREIGN KEY ("sprayNameId") REFERENCES "SprayName"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayMixSpray" ADD CONSTRAINT "SprayMixSpray_sprayId_fkey" FOREIGN KEY ("sprayId") REFERENCES "Spray"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayMixSpray" ADD CONSTRAINT "SprayMixSpray_sprayMixId_fkey" FOREIGN KEY ("sprayMixId") REFERENCES "SprayMix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayMixSprayEvent" ADD CONSTRAINT "SprayMixSprayEvent_sprayEventId_fkey" FOREIGN KEY ("sprayEventId") REFERENCES "SprayEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayMixSprayEvent" ADD CONSTRAINT "SprayMixSprayEvent_sprayMixId_fkey" FOREIGN KEY ("sprayMixId") REFERENCES "SprayMix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayEvent" ADD CONSTRAINT "SprayEvent_paddockId_fkey" FOREIGN KEY ("paddockId") REFERENCES "Paddock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayEvent" ADD CONSTRAINT "SprayEvent_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprayEvent" ADD CONSTRAINT "SprayEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
