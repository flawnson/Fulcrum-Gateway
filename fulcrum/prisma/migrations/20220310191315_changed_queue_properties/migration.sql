-- AlterTable
ALTER TABLE "Queue" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "capacity" SET DEFAULT 10000;