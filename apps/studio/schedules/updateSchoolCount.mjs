import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

export const excludeDraft = `!(_id in path("drafts.**"))`;

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
  // Read from the plain environment (CI secret or an untracked .env.local).
  // Deliberately NOT prefixed with SANITY_STUDIO_, because every
  // SANITY_STUDIO_* variable is inlined into the publicly served studio bundle.
  // This script runs in Node only, so the write token stays server-side.
  token: process.env.SANITY_SCRIPT_TOKEN,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION,
  useCdn: false,
});

const BATCH_SIZE = 100; // Adjust based on your needs

export default async function updateSchoolCount() {
  try {
    console.log(`Start Update School Count`);

    const [regions, areas, countries, subareas] = await Promise.all([
      client.fetch(`
      *[_type == "regions"] {
        _id,
        "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area->region._ref == ^._id])
      }
    `),
      client.fetch(`
      *[_type == "areas"] {
        _id,
        "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area._ref == ^._id])
      }
    `),
      client.fetch(`
      *[_type == "countries"] {
        _id,
        "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && area->region->country._ref == ^._id])
      }
    `),
      client.fetch(`
      *[_type == "subareas"] {
        _id,
        "count": count(*[_type == "schools" && ${excludeDraft} && (language == ^.language || !defined(language)) && subarea._ref == ^._id])
      }
    `),
    ]);

    // Combine all items to process
    const allItems = [
      ...regions.map((item) => ({ ...item, type: "regions" })),
      ...areas.map((item) => ({ ...item, type: "areas" })),
      ...countries.map((item) => ({ ...item, type: "countries" })),
      ...subareas.map((item) => ({ ...item, type: "subareas" })),
    ];

    console.log(`Total items to update: ${allItems.length}`);

    // Process in batches
    for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
      const batch = allItems.slice(i, i + BATCH_SIZE);
      let transaction = client.transaction();

      for (const item of batch) {
        transaction = transaction.patch(item._id, {
          set: { schoolCount: item.count },
        });
      }

      await transaction.commit();
      console.log(
        `✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: Updated ${Math.min(i + BATCH_SIZE, allItems.length)}/${allItems.length} items`,
      );
    }

    console.log(`✅ Successfully updated all school counts`);
  } catch (error) {
    console.error("Error updating school counts:", error);
    throw error;
  }
}

updateSchoolCount();
