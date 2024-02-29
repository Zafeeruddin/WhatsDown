/*
  Warnings:

  - You are about to drop the column `clientUsername` on the `UserRelations` table. All the data in the column will be lost.
  - You are about to drop the column `serverUsername` on the `UserRelations` table. All the data in the column will be lost.
  - You are about to drop the `Login` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clientId]` on the table `UserRelations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serverId]` on the table `UserRelations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId,serverId]` on the table `UserRelations` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `client` on the `Chatbox` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `server` on the `Chatbox` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clientId` to the `UserRelations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverId` to the `UserRelations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chatbox" DROP CONSTRAINT "Chatbox_client_server_fkey";

-- DropForeignKey
ALTER TABLE "Login" DROP CONSTRAINT "Login_userName_fkey";

-- DropForeignKey
ALTER TABLE "UserRelations" DROP CONSTRAINT "UserRelations_clientUsername_fkey";

-- DropIndex
DROP INDEX "UserRelations_clientUsername_key";

-- DropIndex
DROP INDEX "UserRelations_clientUsername_serverUsername_key";

-- DropIndex
DROP INDEX "UserRelations_serverUsername_key";

-- AlterTable
ALTER TABLE "Chatbox" DROP COLUMN "client",
ADD COLUMN     "client" INTEGER NOT NULL,
DROP COLUMN "server",
ADD COLUMN     "server" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserRelations" DROP COLUMN "clientUsername",
DROP COLUMN "serverUsername",
ADD COLUMN     "clientId" INTEGER NOT NULL,
ADD COLUMN     "serverId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Login";

-- CreateIndex
CREATE UNIQUE INDEX "Chatbox_client_key" ON "Chatbox"("client");

-- CreateIndex
CREATE UNIQUE INDEX "Chatbox_server_key" ON "Chatbox"("server");

-- CreateIndex
CREATE UNIQUE INDEX "UserRelations_clientId_key" ON "UserRelations"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRelations_serverId_key" ON "UserRelations"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRelations_clientId_serverId_key" ON "UserRelations"("clientId", "serverId");

-- AddForeignKey
ALTER TABLE "UserRelations" ADD CONSTRAINT "UserRelations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Register"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatbox" ADD CONSTRAINT "Chatbox_client_server_fkey" FOREIGN KEY ("client", "server") REFERENCES "UserRelations"("clientId", "serverId") ON DELETE RESTRICT ON UPDATE CASCADE;
