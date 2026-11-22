import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth";

async function createAdmin() {
  const email = process.argv[2] || "admin@sitenest.com";
  const password = process.argv[3] || "admin123456";
  const name = process.argv[4] || "SiteNest Super Admin";

  console.log(`Creating or updating Super Admin user: ${email}...`);

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      role: "SUPER_ADMIN",
      passwordHash,
    },
    create: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`✓ Super Admin ready: ${user.email} (ID: ${user.id})`);
}

createAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
