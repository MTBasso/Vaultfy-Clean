/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Vault` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vault_name_userId_key" ON "Vault"("name", "userId");
