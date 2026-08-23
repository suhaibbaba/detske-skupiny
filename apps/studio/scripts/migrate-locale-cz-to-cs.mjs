/**
 * Migrate the Czech locale code from "cz" to "cs" across a Sanity dataset.
 *
 * This must be run in lockstep with the code change that renames the locale,
 * because the web app filters content with `language == $locale`. If the app
 * ships "cs" while documents still say "cz" (or the reverse), every localized
 * query returns nothing and the site renders empty.
 *
 * Three things carry the locale code and all three are migrated:
 *   1. `language` on every localized document (published *and* draft).
 *   2. `translation.metadata` documents created by
 *      @sanity/document-internationalization - their `translations` array is
 *      keyed by language id, i.e. `translations[]._key === "cz"`.
 *   3. `dictionaries` documents - each entry stores one string field per
 *      locale, named after the locale id, so the `cz` *field* becomes `cs`.
 *
 * Usage:
 *   npm run migrate:locale                  # dry run (default, writes nothing)
 *   npm run migrate:locale -- --apply       # perform the migration
 *   npm run migrate:locale -- --dataset staging --apply
 *
 * Environment:
 *   SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET  (or --project / --dataset)
 *   SANITY_SCRIPT_TOKEN - write token, read from the plain environment.
 *     Deliberately NOT prefixed with SANITY_STUDIO_, because every
 *     SANITY_STUDIO_* variable is inlined into the publicly served studio
 *     bundle. This script runs in Node only, so the token stays server-side.
 */
import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const FROM = "cz";
const TO = "cs";
const BATCH_SIZE = 100;

// ---------------------------------------------------------------- env + args

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

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

function getArg(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

const apply = process.argv.includes("--apply");
const projectId = getArg("project") || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = getArg("dataset") || process.env.SANITY_STUDIO_DATASET;
const token = process.env.SANITY_SCRIPT_TOKEN;

if (!projectId || !dataset) {
  console.error(
    "Missing project id or dataset. Set SANITY_STUDIO_PROJECT_ID and " +
      "SANITY_STUDIO_DATASET, or pass --project <id> --dataset <name>.",
  );
  process.exit(1);
}

if (apply && !token) {
  console.error(
    "SANITY_SCRIPT_TOKEN is required to apply the migration (write token).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || "2025-11-01",
  useCdn: false,
  // "raw" keeps drafts.* documents in the result set - they carry the locale
  // too and must migrate alongside their published versions.
  perspective: "raw",
});

// ------------------------------------------------------------------- helpers

const isDraft = (id) => id.startsWith("drafts.");

function countBy(items, pick) {
  const counts = {};
  for (const item of items) {
    const key = pick(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function printCounts(title, counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) {
    console.log(`  ${title}: none`);
    return;
  }
  console.log(`  ${title}:`);
  for (const [key, count] of entries) {
    console.log(`    ${String(key).padEnd(32)} ${count}`);
  }
}

/** Commit patches sequentially, BATCH_SIZE documents per transaction. */
async function commitInBatches(label, patches) {
  let committed = 0;
  const failures = [];

  for (let i = 0; i < patches.length; i += BATCH_SIZE) {
    const batch = patches.slice(i, i + BATCH_SIZE);
    let transaction = client.transaction();

    for (const patch of batch) {
      transaction = transaction.patch(patch.id, patch.mutation);
    }

    try {
      await transaction.commit({ visibility: "async" });
      committed += batch.length;
      console.log(
        `  ${label} batch ${Math.floor(i / BATCH_SIZE) + 1}: ` +
          `${committed}/${patches.length}`,
      );
    } catch (error) {
      failures.push({
        batch: Math.floor(i / BATCH_SIZE) + 1,
        ids: batch.map((p) => p.id),
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(
        `  ${label} batch ${Math.floor(i / BATCH_SIZE) + 1} FAILED: ` +
          `${error instanceof Error ? error.message : error}`,
      );
    }
  }

  return { committed, failures };
}

// ---------------------------------------------------- 1. localized documents

async function collectDocuments() {
  const docs = await client.fetch(
    `*[language == $from]{_id, _type}`,
    { from: FROM },
  );

  return {
    docs,
    patches: docs.map((doc) => ({
      id: doc._id,
      mutation: { set: { language: TO } },
    })),
  };
}

// ------------------------------------------------- 2. translation.metadata

async function collectMetadata() {
  const docs = await client.fetch(
    `*[_type == "translation.metadata" && count(translations[_key == $from]) > 0]{
      _id,
      translations
    }`,
    { from: FROM },
  );

  const patches = [];
  const conflicts = [];

  for (const doc of docs) {
    const keys = (doc.translations || []).map((t) => t && t._key);

    // Renaming into a key that already exists would produce a duplicate _key,
    // which Sanity rejects for the whole transaction. Report instead.
    if (keys.includes(TO)) {
      conflicts.push({
        id: doc._id,
        reason: `already has a "${TO}" translation alongside "${FROM}"`,
      });
      continue;
    }

    // Rewrite the whole array rather than patching `_key` in place: `_key` is
    // how Sanity addresses array items, so renaming it via a keyed path is not
    // reliably supported. The objects are carried over verbatim apart from the
    // key itself.
    patches.push({
      id: doc._id,
      mutation: {
        set: {
          translations: (doc.translations || []).map((t) =>
            t && t._key === FROM ? { ...t, _key: TO } : t,
          ),
        },
      },
    });
  }

  return { docs, patches, conflicts };
}

// -------------------------------------------------------- 3. dictionaries

async function collectDictionaries() {
  const docs = await client.fetch(`*[_type == "dictionaries"]{_id, entries}`);

  const patches = [];
  const conflicts = [];
  let affectedEntries = 0;

  for (const doc of docs) {
    const set = {};
    const unset = [];

    for (const entry of doc.entries || []) {
      if (!entry || entry[FROM] === undefined) continue;

      if (!entry._key) {
        conflicts.push({
          id: doc._id,
          reason: `entry "${entry.keyword ?? "?"}" has no _key, cannot patch`,
        });
        continue;
      }

      if (entry[TO] !== undefined) {
        conflicts.push({
          id: doc._id,
          reason:
            `entry "${entry.keyword ?? entry._key}" already has a "${TO}" ` +
            `value; "${FROM}" left in place`,
        });
        continue;
      }

      const path = `entries[_key=="${entry._key}"]`;
      set[`${path}.${TO}`] = entry[FROM];
      unset.push(`${path}.${FROM}`);
      affectedEntries += 1;
    }

    if (unset.length) {
      patches.push({ id: doc._id, mutation: { set, unset } });
    }
  }

  return { docs, patches, conflicts, affectedEntries };
}

// ------------------------------------------------------------------- report

function describeShape(label, doc) {
  if (!doc) {
    console.log(`  ${label}: no document found to inspect`);
    return;
  }
  console.log(`  ${label} (${doc._id}):`);
  console.log(
    `    ${JSON.stringify(doc, null, 2).split("\n").slice(0, 24).join("\n    ")}`,
  );
}

async function main() {
  console.log(
    `\nLocale migration "${FROM}" -> "${TO}"\n` +
      `  project: ${projectId}\n` +
      `  dataset: ${dataset}\n` +
      `  mode:    ${apply ? "APPLY (writes)" : "DRY RUN (no writes)"}\n`,
  );

  const documents = await collectDocuments();
  const metadata = await collectMetadata();
  const dictionaries = await collectDictionaries();

  console.log(`Documents with language == "${FROM}": ${documents.docs.length}`);
  printCounts("by _type", countBy(documents.docs, (d) => d._type));
  printCounts(
    "by state",
    countBy(documents.docs, (d) => (isDraft(d._id) ? "draft" : "published")),
  );

  console.log(
    `\ntranslation.metadata documents with a "${FROM}" key: ` +
      `${metadata.docs.length}`,
  );
  console.log(
    `\ndictionaries documents needing changes: ${dictionaries.patches.length} ` +
      `(${dictionaries.affectedEntries} entries)`,
  );

  const conflicts = [...metadata.conflicts, ...dictionaries.conflicts];
  if (conflicts.length) {
    console.log(`\nSkipped (${conflicts.length}) - needs a human decision:`);
    for (const c of conflicts) console.log(`  ${c.id}: ${c.reason}`);
  }

  if (!apply) {
    // Print one real document of each shape so the patch paths above can be
    // eyeballed against actual data before anything is written.
    console.log("\n--- sample shapes (dry run only) ---");
    describeShape("translation.metadata", metadata.docs[0]);
    describeShape(
      "dictionaries",
      dictionaries.docs.find((d) => (d.entries || []).length),
    );
    console.log(
      `\nDry run complete. Nothing was written.\n` +
        `Re-run with --apply to migrate.\n`,
    );
    return;
  }

  console.log("\nApplying...");
  const results = {
    documents: await commitInBatches("documents", documents.patches),
    metadata: await commitInBatches("translation.metadata", metadata.patches),
    dictionaries: await commitInBatches("dictionaries", dictionaries.patches),
  };

  console.log("\n--- summary ---");
  console.log(`  documents patched:           ${results.documents.committed}`);
  console.log(`  translation.metadata patched: ${results.metadata.committed}`);
  console.log(
    `  dictionaries patched:        ${results.dictionaries.committed}`,
  );
  if (conflicts.length) {
    console.log(`  skipped (conflicts):         ${conflicts.length}`);
  }

  const failures = [
    ...results.documents.failures,
    ...results.metadata.failures,
    ...results.dictionaries.failures,
  ];

  if (failures.length) {
    console.error(`\n  FAILED batches: ${failures.length}`);
    for (const f of failures) {
      console.error(`    batch ${f.batch}: ${f.error}`);
      console.error(`      ids: ${f.ids.join(", ")}`);
    }
    process.exitCode = 1;
    return;
  }

  const remaining = await client.fetch(`count(*[language == $from])`, {
    from: FROM,
  });
  console.log(`\n  documents still on "${FROM}": ${remaining}`);
  console.log(
    remaining === 0
      ? "  Migration complete.\n"
      : "  WARNING: some documents still carry the old locale.\n",
  );
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
