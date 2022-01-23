-- CreateEnum
CREATE TYPE "QueueState" AS ENUM ('ACTIVE', 'PAUSED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ENQUEUED', 'SERVICED', 'DEFERRED', 'ABANDONED', 'NOSHOW');

-- CreateTable
CREATE TABLE "Organizer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "join_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" "QueueState" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "max_party_size" INTEGER NOT NULL DEFAULT 1,
    "grace_period" INTEGER,
    "offline_time" INTEGER,
    "create_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "queue_id" INTEGER NOT NULL,
    "summoned" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "phone_number" TEXT NOT NULL,
    "party_size" INTEGER NOT NULL DEFAULT 1,
    "last_online" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "estimated_wait" INTEGER NOT NULL,
    "join_time" TIMESTAMP(3) NOT NULL,
    "reneged_time" TIMESTAMP(3) NOT NULL,
    "state" "UserStatus" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
