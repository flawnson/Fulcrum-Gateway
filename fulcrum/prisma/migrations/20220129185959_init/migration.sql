-- CreateEnum
CREATE TYPE "QueueState" AS ENUM ('ACTIVE', 'PAUSED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('UNVERIFIED', 'KICKED', 'ENQUEUED', 'SERVICED', 'DEFERRED', 'ABANDONED', 'NOSHOW');

-- CreateTable
CREATE TABLE "Organizer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "join_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" "QueueState" NOT NULL DEFAULT E'ACTIVE',
    "capacity" INTEGER NOT NULL,
    "max_party_size" INTEGER NOT NULL DEFAULT 1,
    "grace_period" INTEGER,
    "offline_time" INTEGER,
    "create_time" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "organizer_id" TEXT NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summoned" BOOLEAN NOT NULL DEFAULT false,
    "phone_number" TEXT,
    "party_size" INTEGER NOT NULL DEFAULT 1,
    "last_online" TIMESTAMP(3),
    "index" INTEGER NOT NULL DEFAULT 0,
    "join_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finish_time" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT E'UNVERIFIED',
    "summoned_time" TIMESTAMP(3),
    "queue_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
