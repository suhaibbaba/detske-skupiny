/**
 * Add missing entries to the `dictionaries` document.
 *
 * The web app resolves UI strings through next-intl, whose `getMessageFallback`
 * in `apps/web/src/i18n/request.ts` returns the *key itself* when a message is
 * missing. So a key that was never added to the dictionary does not render
 * blank and does not throw - it renders as `contactFormPrivacyPolicyLinkLabel`,
 * in the page, in production, next to a GDPR consent checkbox.
 *
 * That is what this script fixes, and `e2e/crawl.spec.ts` now fails the build
 * on any visible text node that looks like a raw camelCase key, so the class of
 * bug cannot come back silently.
 *
 * Entries are **upserted by keyword**: an entry that already exists keeps every
 * locale value it already has, and only genuinely empty locales are filled in.
 * Nothing an editor has typed is ever overwritten, so this is safe to re-run.
 *
 * Usage:
 *   npm run migrate:dictionary                  # dry run (default, writes nothing)
 *   npm run migrate:dictionary -- --apply       # perform the migration
 *   npm run migrate:dictionary -- --dataset staging --apply
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
import { randomUUID } from "crypto";

/**
 * The entries to guarantee exist, keyed by the keyword the app asks for.
 *
 * Both of these are read by the GDPR consent block in
 * `apps/web/src/components/forms/ContactForm.tsx`. The link label renders
 * unconditionally; the consent label is the fallback used only when the
 * `privacyPolicy` rich-text field on the contact document is empty - which
 * makes it the same bug lying dormant, one cleared field away from being
 * visible. Both are added so the crawler's raw-key assertion holds whatever
 * an editor does to that field.
 */
const ENTRIES = [
  {
    keyword: "contactFormPrivacyPolicyLinkLabel",
    cs: "Zásady ochrany osobních údajů",
    en: "Privacy Policy",
  },
  {
    keyword: "contactFormConsentLabel",
    cs: "Souhlasím se zpracováním osobních údajů",
    en: "I agree to the processing of my personal data",
  },
];

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
  // "raw" keeps drafts.* documents in the result set. A dictionary that is
  // edited but unpublished carries the same gap, and leaving the draft behind
  // means the fix disappears the next time somebody publishes it.
  perspective: "raw",
});

const LOCALES = ["cs", "en"];

// ------------------------------------------------------------------- planning

/**
 * Work out, per dictionary document, what has to change.
 *
 * Three cases per entry:
 *   - keyword absent           -> append a new entry with every locale filled
 *   - keyword present, gaps    -> set only the locales that are empty
 *   - keyword present, no gaps -> nothing to do
 */
function planFor(doc) {
  const entries = doc.entries || [];
  const set = {};
  const append = [];
  const actions = [];

  for (const wanted of ENTRIES) {
    const existing = entries.find((e) => e && e.keyword === wanted.keyword);

    if (!existing) {
      append.push({
        _type: "entry",
        _key: randomUUID().replace(/-/g, "").slice(0, 12),
        keyword: wanted.keyword,
        ...Object.fromEntries(LOCALES.map((loc) => [loc, wanted[loc]])),
      });
      actions.push({
        keyword: wanted.keyword,
        kind: "append",
        detail: LOCALES.map((loc) => `${loc}="${wanted[loc]}"`).join(" "),
      });
      continue;
    }

    if (!existing._key) {
      actions.push({
        keyword: wanted.keyword,
        kind: "skip",
        detail: "entry exists but has no _key, cannot patch it in place",
      });
      continue;
    }

    const missing = LOCALES.filter((loc) => {
      const value = existing[loc];
      return value === undefined || value === null || value === "";
    });

    if (!missing.length) {
      actions.push({
        keyword: wanted.keyword,
        kind: "ok",
        detail: "already complete, left alone",
      });
      continue;
    }

    for (const loc of missing) {
      set[`entries[_key=="${existing._key}"].${loc}`] = wanted[loc];
    }
    actions.push({
      keyword: wanted.keyword,
      kind: "fill",
      detail: missing.map((loc) => `${loc}="${wanted[loc]}"`).join(" "),
    });
  }

  const mutation = {};
  if (Object.keys(set).length) mutation.set = set;
  // `setIfMissing` guards the document that has no `entries` array at all -
  // `insert.after("entries[-1]")` on a missing array is an error, not a no-op.
  if (append.length) {
    mutation.setIfMissing = { entries: [] };
    mutation.insert = { after: "entries[-1]", items: append };
  }

  return {
    id: doc._id,
    actions,
    mutation: Object.keys(mutation).length ? mutation : null,
  };
}

// --------------------------------------------------------------------- report

async function main() {
  console.log(
    `\nDictionary entries\n` +
      `  project: ${projectId}\n` +
      `  dataset: ${dataset}\n` +
      `  mode:    ${apply ? "APPLY (writes)" : "DRY RUN (no writes)"}\n`,
  );

  const docs = await client.fetch(`*[_type == "dictionaries"]{_id, entries}`);

  if (!docs.length) {
    console.error(
      'No "dictionaries" document exists in this dataset. Create one in the ' +
        "studio (Site → Dictionary) before running this migration - this " +
        "script fills gaps in a document, it does not create the singleton.",
    );
    process.exit(1);
  }

  const plans = docs.map(planFor);

  for (const plan of plans) {
    console.log(`${plan.id}:`);
    for (const action of plan.actions) {
      const label =
        action.kind === "append"
          ? "ADD "
          : action.kind === "fill"
            ? "FILL"
            : action.kind === "skip"
              ? "SKIP"
              : "OK  ";
      console.log(`  ${label} ${action.keyword.padEnd(36)} ${action.detail}`);
    }
  }

  const writable = plans.filter((plan) => plan.mutation);

  if (!writable.length) {
    console.log(
      "\nEvery dictionary already has all of these entries. Nothing to do.\n",
    );
    return;
  }

  if (!apply) {
    console.log(
      `\nDry run complete. ${writable.length} document(s) would be patched. ` +
        `Nothing was written.\nRe-run with --apply to migrate.\n`,
    );
    return;
  }

  console.log("\nApplying...");
  let transaction = client.transaction();
  for (const plan of writable) {
    transaction = transaction.patch(plan.id, plan.mutation);
  }

  try {
    await transaction.commit({ visibility: "async" });
  } catch (error) {
    console.error(
      `\nFAILED: ${error instanceof Error ? error.message : error}\n` +
        `Nothing was written - a Sanity transaction is all-or-nothing.\n`,
    );
    process.exit(1);
  }

  console.log(`  patched ${writable.length} document(s)`);

  // Read back rather than trusting the commit: the point of the migration is
  // that the app can resolve these keywords, and only the stored document says
  // whether it can.
  const after = await client.fetch(`*[_type == "dictionaries"]{_id, entries}`);
  const stillMissing = [];
  for (const doc of after) {
    for (const wanted of ENTRIES) {
      const entry = (doc.entries || []).find(
        (e) => e && e.keyword === wanted.keyword,
      );
      for (const loc of LOCALES) {
        if (!entry || !entry[loc]) {
          stillMissing.push(`${doc._id}: ${wanted.keyword}.${loc}`);
        }
      }
    }
  }

  if (stillMissing.length) {
    console.error(`\n  WARNING: still missing after the write:`);
    for (const item of stillMissing) console.error(`    ${item}`);
    process.exitCode = 1;
    return;
  }

  console.log("  verified: every keyword resolves in every locale.\n");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nMigration failed: ${message}`);

  // A bare ECONNRESET/ENOTFOUND here almost always means the project id is
  // wrong or the network cannot reach Sanity, and dumping the whole error
  // object buries that under a page of socket internals.
  if (
    /ECONNRESET|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|fetch failed|tunneling socket/i.test(
      message,
    )
  ) {
    console.error(
      `  Could not reach Sanity. Check SANITY_STUDIO_PROJECT_ID and that this\n` +
        `  machine has outbound access to *.api.sanity.io.\n`,
    );
  }
  process.exit(1);
});
