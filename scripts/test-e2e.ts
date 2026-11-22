import { prisma } from "../src/lib/prisma";
import { executeDeployment, rollbackDeployment } from "../src/modules/deployments/deploymentService";
import { validateZipFile, ensureStorageDirectories, PENDING_DIR, getDeploymentDir } from "../src/lib/storage";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../src/lib/auth";
import { getHomepageSections, updateHomepageSection } from "../src/modules/cms/cmsService";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";

async function runEndToEndTests() {
  console.log("==================================================");
  console.log(" SITENEST END-TO-END AUTOMATED VERIFICATION SUITE ");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, desc: string) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS [${total}]: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL [${total}]: ${desc}`);
      throw new Error(`Assertion failed: ${desc}`);
    }
  }

  await ensureStorageDirectories();

  // Test 1: Authentication & Password Hashing
  console.log("\n[Test 1] Authentication, Hashing & JWT Session");
  const plain = "superSecurePass123!";
  const hash = await hashPassword(plain);
  assert(await verifyPassword(plain, hash), "Password hashes and verifies with bcrypt");
  assert(!(await verifyPassword("wrong", hash)), "Rejects invalid password");

  const testUserPayload = {
    userId: "test-user-id",
    email: "creator@sitenest.com",
    role: "USER" as const,
    name: "Test Creator",
  };
  const token = await createSessionToken(testUserPayload);
  const verified = await verifySessionToken(token);
  assert(verified?.email === testUserPayload.email, "JWT session token signs and verifies accurately");

  // Test 2: Database Models & Prisma Operations
  console.log("\n[Test 2] PostgreSQL & Prisma Database Health");
  const userCount = await prisma.user.count();
  assert(userCount >= 2, "Database has seeded accounts");
  const categories = await prisma.category.findMany();
  assert(categories.length >= 5, "Database has seeded categories");

  // Test 3: Section-based Homepage CMS
  console.log("\n[Test 3] Homepage Section CMS Engine");
  const sections = await getHomepageSections();
  assert(sections.length >= 10, "All 10 Homepage CMS sections are initialized and ordered");

  await updateHomepageSection("hero", {
    title: "Upload. Deploy. Go Live.",
  });
  const updatedHero = await prisma.homepageSection.findUnique({ where: { sectionKey: "hero" } });
  assert(updatedHero?.title === "Upload. Deploy. Go Live.", "Homepage section updates via CMS service");

  // Test 4: ZIP Security Validation (Path Traversal defense)
  console.log("\n[Test 4] ZIP Security & Path Traversal Prevention");
  const maliciousZip = new AdmZip();
  maliciousZip.addFile("evil.txt", Buffer.from("malicious payload outside root"));
  maliciousZip.addFile("index.html", Buffer.from("<h1>Hello</h1>"));
  maliciousZip.getEntries()[0].entryName = "../../evil.txt";
  const maliciousPath = path.join(PENDING_DIR, "test-malicious.zip");
  maliciousZip.writeZip(maliciousPath);

  const maliciousResult = await validateZipFile(maliciousPath);
  assert(!maliciousResult.valid, "Security scanner successfully detects and blocks Path Traversal");
  await fs.rm(maliciousPath, { force: true });

  // Test 5: Executable file extension blocking
  console.log("\n[Test 5] Executable Extension Blocking (.php, .sh)");
  const phpZip = new AdmZip();
  phpZip.addFile("index.html", Buffer.from("<h1>Valid HTML</h1>"));
  phpZip.addFile("shell.php", Buffer.from("<?php system($_GET['cmd']); ?>"));
  const phpZipPath = path.join(PENDING_DIR, "test-php.zip");
  phpZip.writeZip(phpZipPath);

  const phpResult = await validateZipFile(phpZipPath);
  assert(!phpResult.valid, "Security scanner blocks backend executables (.php)");
  await fs.rm(phpZipPath, { force: true });

  // Test 6: Valid ZIP Upload & Automated Deployment Execution
  console.log("\n[Test 6] Full Deployment Pipeline Execution");
  const validZip = new AdmZip();
  const v1Html = `<!DOCTYPE html><html><head><title>E2E Live Test</title></head><body><h1>Release v1 Live</h1></body></html>`;
  validZip.addFile("index.html", Buffer.from(v1Html));
  validZip.addFile("css/style.css", Buffer.from("body { background: #000; color: #fff; }"));

  const testSubdomain = `test-site-${Date.now()}`;
  const validZipPath = path.join(PENDING_DIR, `${testSubdomain}-v1.zip`);
  validZip.writeZip(validZipPath);

  const site = await prisma.website.create({
    data: {
      name: "E2E Test Site",
      slug: testSubdomain,
      subdomain: testSubdomain,
      status: "DRAFT",
    },
  });

  const deployment = await prisma.deployment.create({
    data: {
      websiteId: site.id,
      version: 1,
      status: "QUEUED",
      storagePath: validZipPath,
      fileSize: (await fs.stat(validZipPath)).size,
    },
  });

  const deployResult = await executeDeployment(deployment.id);
  assert(deployResult.success, "Automated deployment pipeline succeeds without error");

  const updatedSite = await prisma.website.findUnique({
    where: { id: site.id },
    include: { deployments: true },
  });
  assert(updatedSite?.status === "LIVE", "Website status transitioned to LIVE");
  assert(updatedSite?.activeDeploymentId === deployment.id, "Active deployment pointer assigned to release v1");

  const v1ExtractedHtml = await fs.readFile(path.join(getDeploymentDir(site.id, 1), "index.html"), "utf-8");
  assert(v1ExtractedHtml.includes("Release v1 Live"), "Extracted static file content matches upload");

  // Test 7: Re-deployment of Version 2
  console.log("\n[Test 7] Version 2 Re-deployment");
  const v2Zip = new AdmZip();
  const v2Html = `<!DOCTYPE html><html><head><title>E2E Live Test</title></head><body><h1>Release v2 Live</h1></body></html>`;
  v2Zip.addFile("index.html", Buffer.from(v2Html));
  const v2ZipPath = path.join(PENDING_DIR, `${testSubdomain}-v2.zip`);
  v2Zip.writeZip(v2ZipPath);

  const deploymentV2 = await prisma.deployment.create({
    data: {
      websiteId: site.id,
      version: 2,
      status: "QUEUED",
      storagePath: v2ZipPath,
      fileSize: (await fs.stat(v2ZipPath)).size,
      changeLog: "Upgraded landing page layout to v2",
    },
  });

  const deployV2Result = await executeDeployment(deploymentV2.id);
  assert(deployV2Result.success, "Version 2 successfully published");

  const siteAfterV2 = await prisma.website.findUnique({ where: { id: site.id } });
  assert(siteAfterV2?.activeDeploymentId === deploymentV2.id, "Active deployment pointer switched to v2");

  // Test 8: Instant Zero-Downtime Rollback to Version 1
  console.log("\n[Test 8] Instant 1-Click Rollback to Version 1");
  const rolledBack = await rollbackDeployment(site.id, 1);
  assert(rolledBack.version === 1, "Rollback engine returns target version");

  const siteAfterRollback = await prisma.website.findUnique({ where: { id: site.id } });
  assert(siteAfterRollback?.activeDeploymentId === deployment.id, "Release pointer immediately restored to Version 1");

  // Cleanup test site
  await prisma.website.delete({ where: { id: site.id } });
  await fs.rm(validZipPath, { force: true });
  await fs.rm(v2ZipPath, { force: true });

  console.log("\n==================================================");
  console.log(` ALL ${passed}/${total} END-TO-END VERIFICATION CHECKS PASSED `);
  console.log("==================================================");
}

runEndToEndTests()
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
