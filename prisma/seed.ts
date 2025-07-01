import { PrismaClient, Role } from '@prisma/client';

//  import { Role } from "@prisma/client";
  import bcrypt from 'bcrypt';

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("12345", salt);


  const prisma = new PrismaClient();

  async function main() {
    await prisma.user.upsert({
      where: { email: "admin@woodland.com" }, // Ensure this is a valid email
      update: {},
      create: {
        email: "admin@woodland.com",
       role: Role.Admin,
        password: hash,
       
      },
    });

    
    
  console.log("✅ Seeding complete.");
    
  }
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
