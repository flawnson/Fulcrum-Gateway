/*
  Warnings:

  - The values [INACTIVE] on the enum `QueueState` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Organizer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Queue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `estimated_wait` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Organizer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[join_code]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Organizer` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `Organizer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `join_time` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QueueState_new" AS ENUM ('ACTIVE', 'PAUSED');
ALTER TABLE "Queue" ALTER COLUMN "state" TYPE "QueueState_new" USING ("state"::text::"QueueState_new");
ALTER TYPE "QueueState" RENAME TO "QueueState_old";
ALTER TYPE "QueueState_new" RENAME TO "QueueState";
DROP TYPE "QueueState_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserStatus" ADD VALUE 'UNVERIFIED';
ALTER TYPE "UserStatus" ADD VALUE 'KICKED';

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_queue_id_fkey";

-- AlterTable
ALTER TABLE "Organizer" DROP CONSTRAINT "Organizer_pkey",
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET NOT NULL,
ADD CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Organizer_id_seq";

-- AlterTable
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_pkey",
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "organizer_id" SET DATA TYPE TEXT,
ALTER COLUMN "state" SET DEFAULT E'ACTIVE',
ADD CONSTRAINT "Queue_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Queue_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "estimated_wait",
DROP COLUMN "password",
DROP COLUMN "state",
ADD COLUMN     "status" "UserStatus" NOT NULL,
ADD COLUMN     "summoned_time" TIMESTAMP(3),
ADD COLUMN     "total_wait" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "queue_id" SET DATA TYPE TEXT,
ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "index" SET DEFAULT 0,
ALTER COLUMN "join_time" SET NOT NULL,
ALTER COLUMN "join_time" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Organizer_email_key" ON "Organizer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_join_code_key" ON "Queue"("join_code");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
