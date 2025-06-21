-- CreateEnum
CREATE TYPE "messageStatus" AS ENUM ('RECIEVED', 'READ');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "status" "messageStatus" NOT NULL DEFAULT 'RECIEVED';
