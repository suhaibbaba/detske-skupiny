import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * The import direction the folder layout encodes.
 *
 *   app  ->  sections  ->  features  ->  components / lib  ->  types / utils
 *
 * Reading is allowed downwards only. A route may reach for a feature; a
 * feature may reach for a shared component; a shared component may not reach
 * back up into the feature or the route that happens to use it today - that is
 * how `components/` stops being a second home for page code, and how a feature
 * stays movable.
 *
 * `sections/` sits between the two because it is the one module whose job is
 * to map a Sanity `_type` onto a feature's component, so it has to see every
 * feature while nothing below it does.
 *
 * These are `no-restricted-imports` patterns rather than a plugin so that the
 * rule is readable in one screen and needs no extra dependency. They are
 * errors, so CI fails on a violation.
 */
const forbid = (patterns) => ({
  "no-restricted-imports": [
    "error",
    {
      patterns: patterns.map(({ group, message }) => ({ group, message })),
    },
  ],
});

const NO_APP = {
  group: ["@/app/*", "@/app/**"],
  message:
    "Route files are the top of the tree. Move whatever is shared down into features/, lib/ or types/ and import it from there.",
};

const NO_FEATURES = {
  group: ["@/features/*", "@/features/**"],
  message:
    "This layer is below features/. A shared component or lib module that needs a feature's code is a sign the code belongs in the shared layer, not that the arrow should be reversed.",
};

const NO_SECTIONS = {
  group: ["@/sections/*", "@/sections/**"],
  message:
    "sections/ maps Sanity section types onto feature components and is imported by routes only.",
};

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",

      // TODO: eslint-plugin-react-hooks 7 (via eslint-config-next 16) added
      // this at "error". The two components still tripping it - LanguageSwitcher
      // and MapComponent - both derive state in an effect, and the fix is a
      // behavioural change rather than a mechanical one.
      //
      // "react-hooks/immutability" used to be demoted here too. Its only
      // offender was SchoolListClient, which this branch deleted, so the rule
      // is back at its default "error".
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  // ---- import direction ---------------------------------------------------
  {
    files: [
      "src/components/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}",
      "src/hooks/**/*.{ts,tsx}",
      "src/providers/**/*.{ts,tsx}",
      "src/routes/**/*.{ts,tsx}",
      "src/types/**/*.{ts,tsx}",
      "src/utils/**/*.{ts,tsx}",
    ],
    rules: forbid([NO_APP, NO_FEATURES, NO_SECTIONS]),
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: forbid([NO_APP, NO_SECTIONS]),
  },
  {
    files: ["src/sections/**/*.{ts,tsx}"],
    rules: forbid([NO_APP]),
  },
  {
    /**
     * Tests are exempt.
     *
     * `lib/sanity/queries.test.ts` exists to parse every exported query against
     * groq-js, which means importing all of them - from lib and from three
     * features. That is the test doing its job, not a layering mistake, and
     * nothing it imports ships.
     */
    files: ["**/*.test.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
    rules: { "no-restricted-imports": "off" },
  },

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
