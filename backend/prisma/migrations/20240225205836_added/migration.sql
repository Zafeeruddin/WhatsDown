/*
  Warnings:

  - Added the required column `message` to the `Chatbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chatbox" ADD COLUMN     "message" TEXT NOT NULL;
