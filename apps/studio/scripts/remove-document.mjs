import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

// Get current directory and project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, ".."); // Go up one level to project root

// Try loading env files in order of priority
const envFiles = [".env.local", ".env.development", ".env.production", ".env"];

let envLoaded = false;
for (const envFile of envFiles) {
  const envPath = join(projectRoot, envFile);
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  dotenv.config();
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_STUDIO_API_TOKEN,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION,
  useCdn: false,
});

async function cleanVersions() {
  const documentsList = await client.fetch(
    `*[_type == "home"] | order(_updatedAt desc) {_id, language, _createdAt}`,
  );

  // Group by locale
  const byLocale = documentsList.reduce((acc, item) => {
    const key = item.language;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const keep = [];
  const toDelete = [];

  // For each locale, keep newest 1
  for (const locale of Object.keys(byLocale)) {
    const sorted = byLocale[locale].sort(
      (a, b) => new Date(b._createdAt) - new Date(a._createdAt),
    );
    keep.push(sorted[0]); // keep ONLY the newest
    toDelete.push(...sorted.slice(1)); // mark rest for deletion
  }

  console.log("Keeping:", keep);
  console.log("Deleting:", toDelete);

  if (toDelete.length === 0) {
    console.log("No documents to delete!");
    return;
  }

  // Create transaction to delete unwanted versions
  const transaction = client.transaction();

  toDelete.forEach((doc) => {
    transaction.delete(doc._id);
  });

  try {
    await transaction.commit();
    console.log(`Successfully deleted ${toDelete.length} document(s)`);
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }

  console.log("Cleanup complete!");
}

cleanVersions();
