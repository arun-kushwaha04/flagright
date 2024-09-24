import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function cleanDatabase() {
  // Delete data in reverse order of foreign key dependencies
  await prisma.transaction.deleteMany({});
  await prisma.userBank.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.bank.deleteMany({});
}

async function main() {
  // cleaning db
  await cleanDatabase();
  // Seed banks
  const flagWriteBank = await prisma.bank.create({
    data: { name: 'Flagwrite Bank', currency: 'USD' },
  });
  const boiBank = await prisma.bank.create({
    data: { name: 'Bank Of India', currency: 'INR' },
  });
  const boeBank = await prisma.bank.create({
    data: { name: 'Bank Of Europe', currency: 'EUR' },
  });
  const boaBank = await prisma.bank.create({
    data: { name: 'Bank Of America', currency: 'USD' },
  });
  const borBank = await prisma.bank.create({
    data: { name: 'Bank Of Russia', currency: 'RUB' },
  });
  const bojBank = await prisma.bank.create({
    data: { name: 'Bank Of Japan', currency: 'JPY' },
  });
  const bocBank = await prisma.bank.create({
    data: { name: 'Bank Of China', currency: 'CNY' },
  });

  // Seed users
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: '1',
      email: 'admin@gmail.com',
      password: hashedPassword,
      userType: 'ADMIN',
      banks: {
        create: [
          {
            bank: {
              connect: {
                id: flagWriteBank.id,
              },
            },
            balance: 1000000, // 10000 usd
          },
          {
            bank: {
              connect: {
                id: boiBank.id,
              },
            },
            balance: 10000000, // 100000 inr
          },
          {
            bank: {
              connect: {
                id: boaBank.id,
              },
            },
            balance: 1000000, // 100000 usd
          },
          {
            bank: {
              connect: {
                id: borBank.id,
              },
            },
            balance: 10000000, // 100000 rub
          },
          {
            bank: {
              connect: {
                id: boeBank.id,
              },
            },
            balance: 1000000, // 100000 eur
          },
          {
            bank: {
              connect: {
                id: bojBank.id,
              },
            },
            balance: 10000000, // 100000 jpy
          },
          {
            bank: {
              connect: {
                id: bocBank.id,
              },
            },
            balance: 10000000, // 100000 cny
          },
        ],
      },
      defaultBank: {
        connect: {
          id: flagWriteBank.id,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'User',
      lastName: '1',
      email: 'user1@gmail.com',
      password: hashedPassword,
      userType: 'NORMAL',
      banks: {
        create: [
          {
            bank: {
              connect: {
                id: flagWriteBank.id,
              },
            },
            balance: 1000000, // 10000 usd
          },
          {
            bank: {
              connect: {
                id: boiBank.id,
              },
            },
            balance: 10000000, // 100000 inr
          },
        ],
      },
      defaultBank: {
        connect: {
          id: flagWriteBank.id,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'USER',
      lastName: '2',
      email: 'user2@gmail.com',
      password: hashedPassword,
      userType: 'NORMAL',
      banks: {
        create: [
          {
            bank: {
              connect: {
                id: flagWriteBank.id,
              },
            },
            balance: 10000, // 10000 usd
          },
          {
            bank: {
              connect: {
                id: boaBank.id,
              },
            },
            balance: 10000, // 100000 usd
          },
        ],
      },
      defaultBank: {
        connect: {
          id: flagWriteBank.id,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'USER',
      lastName: '3',
      email: 'user3@gmail.com',
      password: hashedPassword,
      userType: 'NORMAL',
      banks: {
        create: [
          {
            bank: {
              connect: {
                id: flagWriteBank.id,
              },
            },
            balance: 10000, // 10000 usd
          },

          {
            bank: {
              connect: {
                id: borBank.id,
              },
            },
            balance: 100000, // 100000 rub
          },
        ],
      },
      defaultBank: {
        connect: {
          id: flagWriteBank.id,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'USER',
      lastName: '4',
      email: 'user4@gmail.com',
      password: hashedPassword,
      userType: 'NORMAL',
      banks: {
        create: [
          {
            bank: {
              connect: {
                id: flagWriteBank.id,
              },
            },
            balance: 10000, // 10000 usd
          },

          {
            bank: {
              connect: {
                id: boeBank.id,
              },
            },
            balance: 10000, // 100000 eur
          },
        ],
      },
      defaultBank: {
        connect: {
          id: flagWriteBank.id,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      firstName: 'USER',
      lastName: '5',
      email: 'user5@gmail.com',
      password: hashedPassword,
      userType: 'NORMAL',
      banks: {
        create: [
          {
            bank: {
              connect: {
                id: flagWriteBank.id,
              },
            },
            balance: 10000, // 10000 usd
          },

          {
            bank: {
              connect: {
                id: bojBank.id,
              },
            },
            balance: 100000, // 100000 jpy
          },
        ],
      },
      defaultBank: {
        connect: {
          id: flagWriteBank.id,
        },
      },
    },
  });
  await prisma.user.create({
    data: {
      firstName: 'USER',
      lastName: '6',
      email: 'user6@gmail.com',
      password: hashedPassword,
      userType: 'NORMAL',
      banks: {
        create: [
          {
            bank: {
              connect: {
                id: flagWriteBank.id,
              },
            },
            balance: 10000, // 10000 usd
          },

          {
            bank: {
              connect: {
                id: bocBank.id,
              },
            },
            balance: 100000, // 100000 cny
          },
        ],
      },
      defaultBank: {
        connect: {
          id: flagWriteBank.id,
        },
      },
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
