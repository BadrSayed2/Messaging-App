/*
  Warnings:

  - You are about to drop the `_ChatToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `first_user` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `second_user` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToUser" DROP CONSTRAINT "_ChatToUser_B_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "first_user" TEXT NOT NULL,
ADD COLUMN     "second_user" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ChatToUser";

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_first_user_fkey" FOREIGN KEY ("first_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_second_user_fkey" FOREIGN KEY ("second_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
