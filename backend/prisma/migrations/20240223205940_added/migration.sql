/*
  Warnings:

  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "messages";

-- CreateTable
CREATE TABLE "Register" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Register_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Login" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRelations" (
    "id" SERIAL NOT NULL,
    "clientUsername" TEXT NOT NULL,
    "serverUsername" TEXT NOT NULL,

    CONSTRAINT "UserRelations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chatbox" (
    "id" SERIAL NOT NULL,
    "client" TEXT NOT NULL,
    "server" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chatbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Register_username_key" ON "Register"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Register_email_key" ON "Register"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Login_userName_key" ON "Login"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Login_token_key" ON "Login"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserRelations_clientUsername_key" ON "UserRelations"("clientUsername");

-- CreateIndex
CREATE UNIQUE INDEX "UserRelations_serverUsername_key" ON "UserRelations"("serverUsername");

-- CreateIndex
CREATE UNIQUE INDEX "UserRelations_clientUsername_serverUsername_key" ON "UserRelations"("clientUsername", "serverUsername");

-- CreateIndex
CREATE UNIQUE INDEX "Chatbox_client_key" ON "Chatbox"("client");

-- CreateIndex
CREATE UNIQUE INDEX "Chatbox_server_key" ON "Chatbox"("server");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_userName_fkey" FOREIGN KEY ("userName") REFERENCES "Register"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRelations" ADD CONSTRAINT "UserRelations_clientUsername_fkey" FOREIGN KEY ("clientUsername") REFERENCES "Login"("userName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatbox" ADD CONSTRAINT "Chatbox_client_server_fkey" FOREIGN KEY ("client", "server") REFERENCES "UserRelations"("clientUsername", "serverUsername") ON DELETE RESTRICT ON UPDATE CASCADE;
