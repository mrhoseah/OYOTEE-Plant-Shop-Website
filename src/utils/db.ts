// lib/prisma.ts

import { PrismaClient } from '@prisma/client';


let prisma: PrismaClient;

declare global {
    var _prisma: PrismaClient | undefined;
}
if (process.env.NODE_ENV === 'production') {

  prisma = new PrismaClient();

} else {

  if (!global._prisma) {

    global._prisma = new PrismaClient();

  }

  prisma = global._prisma;

}


export default prisma;