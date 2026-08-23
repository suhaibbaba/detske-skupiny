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

export default async function randomizeSortOrder() {
  try {
    console.log(`Start Update SortOrder for Schools`);

    // Fetch all documents of the type you want to randomize
    const schools = await client.fetch(`
      *[_type == "schools" && !(_id in path("drafts.**"))]{
        _id,
      }
    `);

    console.log(`Updating ${schools.length} schools`);

    const batchSize = 500;
    for (let i = 0; i < schools.length; i += batchSize) {
      const batch = schools.slice(i, i + batchSize);
      let transaction = client.transaction();

      batch.forEach((item) => {
        transaction = transaction.patch(item._id, {
          set: { sortOrder: Math.floor(Math.random() * 10000) },
        });
      });

      await transaction.commit();
      console.log(
        `✅ Batch ${Math.floor(i / batchSize) + 1}: Updated ${i + batch.length}/${schools.length} schools`,
      );
    }
  } catch (error) {
    console.error("❌ Error randomizing sortOrder:", error);
    throw error;
  }
}

randomizeSortOrder();
