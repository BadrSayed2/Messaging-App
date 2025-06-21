/*
  Warnings:

  - A unique constraint covering the columns `[senderId,receiverId]` on the table `ContactRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ContactRequest_senderId_receiverId_key" ON "ContactRequest"("senderId", "receiverId");
