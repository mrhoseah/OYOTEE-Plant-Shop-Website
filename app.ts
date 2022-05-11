import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function main() {
  const allUsers = await prisma.user.findMany();
  const products = await prisma.product.findMany();
  const categories = await prisma.user.findMany();
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
