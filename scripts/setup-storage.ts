import { ensureStorageDirectories, STORAGE_ROOT, UPLOAD_DIR, PENDING_DIR, WEBSITE_DIR, TEMP_DIR } from "../src/lib/storage";

async function main() {
  console.log("Setting up SiteNest storage directories...");
  await ensureStorageDirectories();
  console.log(`✓ Storage Root: ${STORAGE_ROOT}`);
  console.log(`✓ Uploads Pending: ${PENDING_DIR}`);
  console.log(`✓ Hosted Websites: ${WEBSITE_DIR}`);
  console.log(`✓ Temporary: ${TEMP_DIR}`);
  console.log("Storage structure initialized successfully.");
}

main().catch((err) => {
  console.error("Storage setup failed:", err);
  process.exit(1);
});
