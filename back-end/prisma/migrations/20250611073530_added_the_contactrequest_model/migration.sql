/*
  Warnings:

  - A unique constraint covering the columns `[first_user,second_user]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Message_id_key";

-- AlterTable
ALTER TABLE "Message" ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" SERIAL NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_first_user_second_user_key" ON "Chat"("first_user", "second_user");

-- AddForeignKey
ALTER TABLE "ContactRequest" ADD CONSTRAINT "ContactRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactRequest" ADD CONSTRAINT "ContactRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
