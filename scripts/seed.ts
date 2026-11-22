import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth";
import { seedDefaultHomepageSections } from "../src/modules/cms/cmsService";
import { ensureStorageDirectories, getDeploymentDir, getReleasePointer, getWebsiteDir } from "../src/lib/storage";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

async function seed() {
  console.log("--- Seeding SiteNest Platform Database ---");

  await ensureStorageDirectories();

  // 1. Seed Categories
  const categoriesData = [
    { name: "Portfolio", slug: "portfolio", description: "Personal showcases and designer portfolios" },
    { name: "Agency", slug: "agency", description: "Creative studios and business landing pages" },
    { name: "SaaS & Tech", slug: "saas", description: "Software, documentation, and product launches" },
    { name: "E-Commerce", slug: "ecommerce", description: "Product catalogs and storefronts" },
    { name: "Creative", slug: "creative", description: "Artistic experiments and digital galleries" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log("✓ Categories seeded");

  // 2. Seed Default Super Admin and Regular User
  const adminPass = await hashPassword("admin123456");
  const userPass = await hashPassword("user123456");

  const admin = await prisma.user.upsert({
    where: { email: "admin@sitenest.com" },
    update: { role: "SUPER_ADMIN", passwordHash: adminPass },
    create: {
      name: "SiteNest Admin",
      email: "admin@sitenest.com",
      passwordHash: adminPass,
      role: "SUPER_ADMIN",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "user@sitenest.com" },
    update: { role: "USER", passwordHash: userPass },
    create: {
      name: "Alex Creator",
      email: "user@sitenest.com",
      passwordHash: userPass,
      role: "USER",
    },
  });
  console.log("✓ Admin and User accounts seeded");

  // 3. Seed Homepage CMS Sections
  await seedDefaultHomepageSections();
  console.log("✓ Homepage CMS sections seeded");

  // 4. Seed 2 Sample Deployed Websites with actual HTML/CSS assets
  const sampleSites = [
    {
      name: "Alex Dev Portfolio",
      slug: "portfolio",
      subdomain: "portfolio",
      description: "Clean dark-mode software engineer and designer portfolio.",
      categorySlug: "portfolio",
      ownerId: demoUser.id,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alex Dev — Creative Technologist</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0c; color: #f3f4f6; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; }
    .badge { display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); color: #818cf8; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; }
    h1 { font-size: 2.75rem; font-weight: 800; tracking: -0.03em; margin-bottom: 1rem; background: linear-gradient(to right, #ffffff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { max-width: 520px; line-height: 1.6; color: #9ca3af; font-size: 1.05rem; margin-bottom: 2rem; text-align: center; }
    .tags { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
    .tag { background: #18181b; border: 1px solid #27272a; padding: 0.4rem 0.9rem; border-radius: 0.5rem; font-size: 0.85rem; color: #e4e4e7; font-family: monospace; }
    .footer { margin-top: 3rem; font-size: 0.75rem; color: #52525b; }
  </style>
</head>
<body>
  <div class="badge">Live on SiteNest • Subdomain Hosting</div>
  <h1>Alex Chen</h1>
  <p>Software Engineer building distributed platforms, high-performance web applications, and developer tooling.</p>
  <div class="tags">
    <span class="tag">TypeScript</span>
    <span class="tag">Rust</span>
    <span class="tag">Next.js</span>
    <span class="tag">PostgreSQL</span>
    <span class="tag">Docker</span>
  </div>
  <div class="footer">Hosted on SiteNest • Served via Nginx Edge</div>
</body>
</html>`,
    },
    {
      name: "Nexus Digital Agency",
      slug: "agency",
      subdomain: "nexus",
      description: "Modern digital agency specializing in branding and scalable web experiences.",
      categorySlug: "agency",
      ownerId: admin.id,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus Agency — We Craft Digital Products</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; text-align: center; }
    .container { max-width: 600px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.5rem; padding: 3rem 2rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(16px); }
    h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: #ffffff; }
    p { color: #94a3b8; line-height: 1.6; margin-bottom: 2rem; font-size: 1rem; }
    .btn { display: inline-block; background: #3b82f6; color: #fff; font-weight: 600; text-decoration: none; padding: 0.75rem 1.75rem; border-radius: 0.75rem; transition: background 0.2s; }
    .btn:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Nexus Studio</h1>
    <p>We transform ambitious ideas into polished digital realities. Brand identity, design systems, and lightning-fast web applications.</p>
    <a href="#" class="btn">Explore Case Studies</a>
  </div>
</body>
</html>`,
    },
  ];

  for (const item of sampleSites) {
    const cat = await prisma.category.findUnique({ where: { slug: item.categorySlug } });

    const website = await prisma.website.upsert({
      where: { subdomain: item.subdomain },
      update: {
        name: item.name,
        status: "LIVE",
        categoryId: cat?.id || null,
        description: item.description,
      },
      create: {
        name: item.name,
        slug: item.slug,
        subdomain: item.subdomain,
        description: item.description,
        status: "LIVE",
        categoryId: cat?.id || null,
        ownerId: item.ownerId,
      },
    });

    // Write actual release files on disk
    const destDir = getDeploymentDir(website.id, 1);
    if (!fsSync.existsSync(destDir)) {
      await fs.mkdir(destDir, { recursive: true });
    }
    await fs.writeFile(path.join(destDir, "index.html"), item.html, "utf-8");

    // Release symlink
    const pointer = getReleasePointer(website.id);
    try {
      if (fsSync.existsSync(pointer)) {
        await fs.rm(pointer, { recursive: true, force: true });
      }
      await fs.symlink(destDir, pointer, "dir");
    } catch {
      // ignore
    }

    // Deployment record
    const deployment = await prisma.deployment.upsert({
      where: {
        websiteId_version: {
          websiteId: website.id,
          version: 1,
        },
      },
      update: {
        status: "LIVE",
        storagePath: destDir,
        fileSize: Buffer.byteLength(item.html),
        filesCount: 1,
      },
      create: {
        websiteId: website.id,
        version: 1,
        status: "LIVE",
        storagePath: destDir,
        fileSize: Buffer.byteLength(item.html),
        filesCount: 1,
        changeLog: "Initial sample release",
      },
    });

    await prisma.website.update({
      where: { id: website.id },
      data: {
        activeDeploymentId: deployment.id,
        storagePath: destDir,
      },
    });

    console.log(`✓ Sample site deployed: ${item.subdomain}.sitenest.com`);
  }

  console.log("\n=============================================");
  console.log(" SiteNest Platform Seed Complete! ");
  console.log(" Admin: admin@sitenest.com / admin123456");
  console.log(" User:  user@sitenest.com  / user123456");
  console.log("=============================================");
}

seed()
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
