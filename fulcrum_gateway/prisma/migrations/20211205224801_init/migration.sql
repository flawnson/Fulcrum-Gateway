-- AlterTable
ALTER TABLE "User" ALTER COLUMN "last_online" DROP NOT NULL,
ALTER COLUMN "join_time" DROP NOT NULL,
ALTER COLUMN "reneged_time" DROP NOT NULL;
