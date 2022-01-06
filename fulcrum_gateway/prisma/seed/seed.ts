import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { user_table, queue_table, organizer_table} from "./data/data"

const prisma = new PrismaClient();


async function main() {
  await prisma.$connect();

  // delete in order of user -> queue -> organizer to avoid foreign key conflicts
  await prisma.user.deleteMany({});
  await prisma.queue.deleteMany({});
  await prisma.organizer.deleteMany({});

  // generate an insert password into queue and organizer table (hash needs await)
  const password = await bcrypt.hash("password123", 12);
  for (let i = 0; i < queue_table.length; i++){
    queue_table[i]["password"] = password;
  }
  for (let i = 0; i < organizer_table.length; i++){
    organizer_table[i]["password"] = password;
  }


  // make sure to create in order of organizer -> queue -> user to avoid foreign key conflicts
  const createOrganizers = await prisma.organizer.createMany({
    data: organizer_table
  });

  const createQueues = await prisma.queue.createMany({
    data: queue_table
  });

  const createUsers = await prisma.user.createMany({
    data: user_table
  });

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
