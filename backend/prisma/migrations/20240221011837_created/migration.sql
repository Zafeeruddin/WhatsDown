-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "client" TEXT NOT NULL,
    "server" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);
