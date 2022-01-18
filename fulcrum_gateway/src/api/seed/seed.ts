import { dbSetup } from "./dbSetup";
import prisma from '../prismaClient';

async function main() {
  await dbSetup();
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
