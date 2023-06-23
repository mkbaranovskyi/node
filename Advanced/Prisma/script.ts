import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findMany({});

  console.log(user);
}

main()
  .catch((e) => console.error(e.message))
  .finally(() => prisma.$disconnect());
