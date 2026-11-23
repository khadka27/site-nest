import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth";
import { seedDefaultHomepageSections } from "../src/modules/cms/cmsService";
import { ensureStorageDirectories, getDeploymentDir, getReleasePointer } from "../src/lib/storage";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

async function seed() {
  console.log("--- Seeding SiteNest Botanical Supplement Platform ---");

  await ensureStorageDirectories();

  // 1. Seed Supplement Categories
  const categoriesData = [
    {
      name: "Longevity & Anti-Aging",
      slug: "longevity",
      description: "Cellular rejuvenation, collagen peptides, and antioxidant vitality complexes.",
    },
    {
      name: "Cognitive & Focus",
      slug: "cognitive",
      description: "Nootropic adaptogens, mental clarity, neuroplasticity, and memory support.",
    },
    {
      name: "Energy & Vitality",
      slug: "vitality",
      description: "Mitochondrial ATP production, adaptogenic cordyceps, and clean sustained stamina.",
    },
    {
      name: "Recovery & Sleep",
      slug: "recovery",
      description: "High-bioavailability chelated magnesium, relaxation botanicals, and deep sleep repair.",
    },
    {
      name: "Pure Botanicals",
      slug: "botanicals",
      description: "Organic dual-extracted medicinal mushrooms, raw adaptogens, and wild-crafted herbs.",
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log("✓ Botanical Supplement categories seeded");

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
      name: "Botanical Formulator",
      email: "user@sitenest.com",
      passwordHash: userPass,
      role: "USER",
    },
  });
  console.log("✓ Admin account ready");

  // 3. Seed Homepage CMS Sections
  await seedDefaultHomepageSections();
  console.log("✓ Homepage CMS sections seeded");

  // 4. Seed Supplement Products with Dedicated Static Microsites
  const sampleProducts = [
    {
      name: "Pure Marine Collagen Peptides",
      slug: "marine-collagen",
      subdomain: "collagen",
      description: "Hydrolyzed Type I & III wild deep-sea marine peptides with bioactive hyaluronic acid and vitamin C for radiant skin elasticity and joint rejuvenation.",
      categorySlug: "longevity",
      ownerId: admin.id,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pure Marine Collagen Peptides — SiteNest Botanicals</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FCF0DA; color: #4C4541; min-height: 100vh; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { max-width: 680px; width: 100%; background: #FFF8ED; border: 1px solid #DECBB0; border-radius: 1.5rem; padding: 3rem 2.5rem; box-shadow: 0 10px 25px rgba(76,69,65,0.06); text-align: center; }
    .badge { display: inline-block; padding: 0.35rem 0.9rem; border-radius: 9999px; background: rgba(174,172,120,0.25); border: 1px solid #AEAC78; color: #5A5832; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; }
    h1 { font-size: 2.4rem; font-weight: 800; color: #4C4541; margin-bottom: 0.75rem; line-height: 1.2; }
    .subtitle { font-size: 1.05rem; color: #7A6F68; line-height: 1.6; margin-bottom: 2rem; }
    .specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .spec-box { background: rgba(252,240,218,0.6); border: 1px solid #DECBB0; border-radius: 1rem; padding: 1.25rem 0.75rem; }
    .spec-val { font-size: 1.35rem; font-weight: 800; color: #AEAC78; }
    .spec-label { font-size: 0.7rem; color: #7A6F68; text-transform: uppercase; margin-top: 0.25rem; font-weight: 600; }
    .btn { display: inline-block; background: #F2C46A; color: #2D2305; font-weight: 700; text-decoration: none; padding: 0.85rem 2rem; border-radius: 0.85rem; font-size: 0.95rem; transition: background 0.2s; box-shadow: 0 4px 12px rgba(242,196,106,0.3); }
    .btn:hover { background: #E5B555; }
    .footer { margin-top: 2rem; font-size: 0.75rem; color: #7A6F68; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Wild Deep-Sea Sourced • Zero Additives</div>
    <h1>Pure Marine Collagen Peptides</h1>
    <p class="subtitle">Enriched with bioactive hyaluronic acid and organic camu camu vitamin C. Formulated for maximum bioavailability, skin hydration, and connective tissue synthesis.</p>
    <div class="specs">
      <div class="spec-box">
        <div class="spec-val">10,000mg</div>
        <div class="spec-label">Peptides / Serving</div>
      </div>
      <div class="spec-box">
        <div class="spec-val">Type I & III</div>
        <div class="spec-label">Bioactive Profile</div>
      </div>
      <div class="spec-box">
        <div class="spec-val">99.4%</div>
        <div class="spec-label">Purity Index</div>
      </div>
    </div>
    <a href="#" class="btn">View Certificate of Analysis</a>
    <div class="footer">SiteNest Botanical Nutrition • Dedicated Product Subdomain: collagen.sitenest.com</div>
  </div>
</body>
</html>`,
    },
    {
      name: "Cognitive Adaptogen Complex",
      slug: "cognitive-adaptogen",
      subdomain: "nootropics",
      description: "Dual-extracted Organic Lion's Mane, Rhodiola Rosea, and Suntheanine for sharp working memory, focus endurance, and calm alertness.",
      categorySlug: "cognitive",
      ownerId: admin.id,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cognitive Adaptogen Complex — SiteNest Botanicals</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #171513; color: #FBF3E6; min-height: 100vh; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { max-width: 680px; width: 100%; background: #24201C; border: 1px solid #3D352F; border-radius: 1.5rem; padding: 3rem 2.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.4); text-align: center; }
    .badge { display: inline-block; padding: 0.35rem 0.9rem; border-radius: 9999px; background: rgba(242,196,106,0.15); border: 1px solid #F2C46A; color: #F2C46A; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; }
    h1 { font-size: 2.4rem; font-weight: 800; color: #FBF3E6; margin-bottom: 0.75rem; line-height: 1.2; }
    .subtitle { font-size: 1.05rem; color: #B5AAA0; line-height: 1.6; margin-bottom: 2rem; }
    .specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .spec-box { background: #1E1A17; border: 1px solid #3D352F; border-radius: 1rem; padding: 1.25rem 0.75rem; }
    .spec-val { font-size: 1.35rem; font-weight: 800; color: #AEAC78; }
    .spec-label { font-size: 0.7rem; color: #B5AAA0; text-transform: uppercase; margin-top: 0.25rem; font-weight: 600; }
    .btn { display: inline-block; background: #F2C46A; color: #2D2305; font-weight: 700; text-decoration: none; padding: 0.85rem 2rem; border-radius: 0.85rem; font-size: 0.95rem; transition: background 0.2s; }
    .btn:hover { background: #E5B555; }
    .footer { margin-top: 2rem; font-size: 0.75rem; color: #B5AAA0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Nootropic & Neurogenesis Formula</div>
    <h1>Cognitive Adaptogen Complex</h1>
    <p class="subtitle">Standardized 8:1 fruiting body Lion's Mane extract paired with Siberian Rhodiola and L-Theanine. Designed for clean mental clarity without caffeine crashes.</p>
    <div class="specs">
      <div class="spec-box">
        <div class="spec-val">1,200mg</div>
        <div class="spec-label">Lion's Mane 8:1</div>
      </div>
      <div class="spec-box">
        <div class="spec-val">3% Rosavins</div>
        <div class="spec-label">Rhodiola Extract</div>
      </div>
      <div class="spec-box">
        <div class="spec-val">200mg</div>
        <div class="spec-label">L-Theanine</div>
      </div>
    </div>
    <a href="#" class="btn">Explore Clinical Monograph</a>
    <div class="footer">SiteNest Botanical Nutrition • Dedicated Product Subdomain: nootropics.sitenest.com</div>
  </div>
</body>
</html>`,
    },
    {
      name: "Liposomal Magnesium Glycinate",
      slug: "magnesium-glycinate",
      subdomain: "magnesium",
      description: "Fully reacted bisglycinate chelate encapsulated in sunflower phospholipids for superior neuromuscular relaxation, circadian sleep quality, and zero GI distress.",
      categorySlug: "recovery",
      ownerId: admin.id,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Liposomal Magnesium Glycinate — SiteNest Botanicals</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FCF0DA; color: #4C4541; min-height: 100vh; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { max-width: 680px; width: 100%; background: #FFF8ED; border: 1px solid #DECBB0; border-radius: 1.5rem; padding: 3rem 2.5rem; box-shadow: 0 10px 25px rgba(76,69,65,0.06); text-align: center; }
    .badge { display: inline-block; padding: 0.35rem 0.9rem; border-radius: 9999px; background: rgba(174,172,120,0.25); border: 1px solid #AEAC78; color: #5A5832; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; }
    h1 { font-size: 2.4rem; font-weight: 800; color: #4C4541; margin-bottom: 0.75rem; line-height: 1.2; }
    .subtitle { font-size: 1.05rem; color: #7A6F68; line-height: 1.6; margin-bottom: 2rem; }
    .specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .spec-box { background: rgba(252,240,218,0.6); border: 1px solid #DECBB0; border-radius: 1rem; padding: 1.25rem 0.75rem; }
    .spec-val { font-size: 1.35rem; font-weight: 800; color: #AEAC78; }
    .spec-label { font-size: 0.7rem; color: #7A6F68; text-transform: uppercase; margin-top: 0.25rem; font-weight: 600; }
    .btn { display: inline-block; background: #F2C46A; color: #2D2305; font-weight: 700; text-decoration: none; padding: 0.85rem 2rem; border-radius: 0.85rem; font-size: 0.95rem; transition: background 0.2s; box-shadow: 0 4px 12px rgba(242,196,106,0.3); }
    .btn:hover { background: #E5B555; }
    .footer { margin-top: 2rem; font-size: 0.75rem; color: #7A6F68; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Liposomal Chelate • Deep Restorative Sleep</div>
    <h1>Liposomal Magnesium Glycinate</h1>
    <p class="subtitle">Chelated with pure glycine and encapsulated in phospholipid liposomes for 4x cellular absorption compared to standard magnesium salts. Promotes deep parasympathetic restoration.</p>
    <div class="specs">
      <div class="spec-box">
        <div class="spec-val">400mg</div>
        <div class="spec-label">Elemental Mg</div>
      </div>
      <div class="spec-box">
        <div class="spec-val">Liposomal</div>
        <div class="spec-label">Delivery Matrix</div>
      </div>
      <div class="spec-box">
        <div class="spec-val">Zero</div>
        <div class="spec-label">Laxative Effect</div>
      </div>
    </div>
    <a href="#" class="btn">View Third-Party Lab Results</a>
    <div class="footer">SiteNest Botanical Nutrition • Dedicated Product Subdomain: magnesium.sitenest.com</div>
  </div>
</body>
</html>`,
    },
    {
      name: "Wild Harvest Cordyceps Dual-Extract",
      slug: "wild-cordyceps",
      subdomain: "cordyceps",
      description: "High-potency organic Cordyceps Militaris standardized to 1.5% cordycepin and 30% beta-glucans for cellular ATP energy, oxygen uptake, and endurance.",
      categorySlug: "vitality",
      ownerId: admin.id,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wild Cordyceps Dual-Extract — SiteNest Botanicals</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #171513; color: #FBF3E6; min-height: 100vh; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { max-width: 680px; width: 100%; background: #24201C; border: 1px solid #3D352F; border-radius: 1.5rem; padding: 3rem 2.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.4); text-align: center; }
    .badge { display: inline-block; padding: 0.35rem 0.9rem; border-radius: 9999px; background: rgba(242,196,106,0.15); border: 1px solid #F2C46A; color: #F2C46A; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.25rem; }
    h1 { font-size: 2.4rem; font-weight: 800; color: #FBF3E6; margin-bottom: 0.75rem; line-height: 1.2; }
    .subtitle { font-size: 1.05rem; color: #B5AAA0; line-height: 1.6; margin-bottom: 2rem; }
    .specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .spec-box { background: #1E1A17; border: 1px solid #3D352F; border-radius: 1rem; padding: 1.25rem 0.75rem; }
    .spec-val { font-size: 1.35rem; font-weight: 800; color: #AEAC78; }
    .spec-label { font-size: 0.7rem; color: #B5AAA0; text-transform: uppercase; margin-top: 0.25rem; font-weight: 600; }
    .btn { display: inline-block; background: #F2C46A; color: #2D2305; font-weight: 700; text-decoration: none; padding: 0.85rem 2rem; border-radius: 0.85rem; font-size: 0.95rem; transition: background 0.2s; }
    .btn:hover { background: #E5B555; }
    .footer { margin-top: 2rem; font-size: 0.75rem; color: #B5AAA0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Cellular ATP & VO2 Max Optimization</div>
    <h1>Wild Cordyceps Dual-Extract</h1>
    <p class="subtitle">Hot-water and alcohol dual-extracted Cordyceps Militaris fruiting body. Clinically standardized for active cordycepin and adenosine.</p>
    <div class="specs">
      <div class="spec-box">
        <div class="spec-val">1.5%</div>
        <div class="spec-label">Cordycepin</div>
      </div>
      <div class="spec-box">
        <div class="spec-val">32%</div>
        <div class="spec-label">Beta-(1,3/1,6)-Glucans</div>
      </div>
      <div class="spec-box">
        <div class="spec-val">1,000mg</div>
        <div class="spec-label">Daily Dose</div>
      </div>
    </div>
    <a href="#" class="btn">View Extraction Process</a>
    <div class="footer">SiteNest Botanical Nutrition • Dedicated Product Subdomain: cordyceps.sitenest.com</div>
  </div>
</body>
</html>`,
    },
  ];

  for (const item of sampleProducts) {
    const cat = await prisma.category.findUnique({ where: { slug: item.categorySlug } });

    const website = await prisma.website.upsert({
      where: { subdomain: item.subdomain },
      update: {
        name: item.name,
        slug: item.slug,
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
    await prisma.deployment.upsert({
      where: {
        websiteId_version: {
          websiteId: website.id,
          version: 1,
        },
      },
      update: {
        status: "LIVE",
        storagePath: destDir,
        fileSize: Buffer.byteLength(item.html, "utf-8"),
        filesCount: 1,
        completedAt: new Date(),
      },
      create: {
        websiteId: website.id,
        version: 1,
        status: "LIVE",
        storagePath: destDir,
        fileSize: Buffer.byteLength(item.html, "utf-8"),
        filesCount: 1,
        changeLog: "Initial certified product formulation v1",
        completedAt: new Date(),
      },
    });

    console.log(`✓ Product seeded: ${item.name} (${item.subdomain}.sitenest.com)`);
  }

  console.log("=== Seeding Successfully Completed ===");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
