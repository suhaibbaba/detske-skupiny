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

/**
 * A module that calls `styled()` is a client module.
 *
 * `styled` is Emotion, and Emotion's `styled` carries `"use client"` all the
 * way down (`@mui/material/styles/styled.mjs`, `@mui/system/styled`). A server
 * module that imports it gets a client *reference*, not a function, so calling
 * it throws at module evaluation:
 *
 *   Attempted to call the default export of .../styled.mjs from the server,
 *   but it's on the client.
 *
 * The output server-renders perfectly well - SSR is not the issue, the module
 * graph is - so the fix is never to stop using `styled`. It is to keep the
 * primitive in its own small `"use client"` file, which a Server Component
 * then imports and renders like any other element, its children still
 * server-rendered. See docs/client-surface.md.
 *
 * Written inline rather than as a package because it is fifteen lines and the
 * config already prefers a readable rule over a dependency.
 */
const clientOnlyStyled = {
  meta: {
    type: "problem",
    docs: {
      description:
        'require "use client" in any module that calls styled() (Emotion is client-only at the module level)',
    },
    schema: [],
    messages: {
      missingDirective:
        '`styled()` is a client-only call, so this module needs a "use client" directive at the top of the file. If it should stay on the server, express the styling as `sx` at the call site instead, or move the styled primitive into its own small "use client" file. See docs/client-surface.md.',
    },
  },
  create(context) {
    // The directive prologue only counts at the very top of the module, so
    // this reads the leading string-expression statements rather than grepping
    // for the text anywhere in the file.
    const hasUseClient = (program) =>
      program.body.some(
        (node) =>
          node.type === "ExpressionStatement" &&
          node.expression.type === "Literal" &&
          node.directive === "use client",
      );

    // `styled(X)(...)`, `styled.div\`...\``, and the `styled(X, opts)` form all
    // start from an identifier named `styled`, which is what MUI and Emotion
    // both export.
    const isStyled = (node) =>
      (node.type === "Identifier" && node.name === "styled") ||
      (node.type === "MemberExpression" &&
        node.object.type === "Identifier" &&
        node.object.name === "styled");

    let ok = true;

    return {
      Program(node) {
        ok = hasUseClient(node);
      },
      CallExpression(node) {
        if (ok || !isStyled(node.callee)) return;
        context.report({ node: node.callee, messageId: "missingDirective" });
      },
      TaggedTemplateExpression(node) {
        if (ok || !isStyled(node.tag)) return;
        context.report({ node: node.tag, messageId: "missingDirective" });
      },
    };
  },
};

/**
 * An `sx` written in a server module has to be serialisable.
 *
 * Every MUI component is a Client Component, so whatever a Server Component
 * puts in `sx` is serialised across the boundary. MUI accepts a
 * `(theme) => ...` callback and accepts function-valued keys inside the
 * object, and both are perfectly good code in a client module - from a server
 * module they are:
 *
 *   Functions cannot be passed directly to Client Components unless you
 *   explicitly expose it by marking it with "use server".
 *
 * `"use server"` is emphatically not the fix - that directive declares a
 * Server Action. The theme reaches `sx` without a callback in two ways:
 * palette values as string paths (`bgcolor: "primary.light"`), and the
 * non-palette tokens as the plain constants in `theme/custom.ts`.
 *
 * Scoped to the two shapes this codebase writes styles in - a `sx={...}`
 * attribute, and a `satisfies Record<string, SxProps<Theme>>` style table -
 * rather than to every function anywhere. A helper that *returns* an sx object
 * (`const chipSx = (colour): SxProps<Theme> => ({...})`) is called at the call
 * site and produces a plain object, so it is not this bug and is not reported.
 */
const serializableSx = {
  meta: {
    type: "problem",
    docs: {
      description:
        'forbid function values in `sx` in modules without a "use client" directive',
    },
    schema: [],
    messages: {
      functionInSx:
        'A function in `sx` cannot cross the server/client boundary - MUI components are all Client Components, so this is "Functions cannot be passed directly to Client Components" at request time. Read palette values as string paths (`bgcolor: "primary.light"`) and the rest as the plain constants in theme/custom.ts. Marking the module "use client" also fixes it, but only do that if the module needs to be client for a real reason.',
    },
  },
  create(context) {
    const hasUseClient = (program) =>
      program.body.some(
        (node) =>
          node.type === "ExpressionStatement" &&
          node.expression.type === "Literal" &&
          node.directive === "use client",
      );

    const isFn = (node) =>
      node?.type === "ArrowFunctionExpression" ||
      node?.type === "FunctionExpression";

    let ok = true;

    /** Every function nested anywhere under `node`, reported in place. */
    const reportFunctionsIn = (node, seen = new Set()) => {
      if (!node || typeof node !== "object" || seen.has(node)) return;
      seen.add(node);
      if (isFn(node)) {
        context.report({ node, messageId: "functionInSx" });
        return;
      }
      for (const key of Object.keys(node)) {
        if (key === "parent") continue;
        const value = node[key];
        if (Array.isArray(value))
          value.forEach((v) => reportFunctionsIn(v, seen));
        else if (value && typeof value.type === "string")
          reportFunctionsIn(value, seen);
      }
    };

    return {
      Program(node) {
        ok = hasUseClient(node);
      },
      JSXAttribute(node) {
        if (ok || node.name?.name !== "sx") return;
        if (node.value?.type !== "JSXExpressionContainer") return;
        reportFunctionsIn(node.value.expression);
      },
      // `const styles = {...} satisfies Record<string, SxProps<Theme>>`
      TSSatisfiesExpression(node) {
        if (ok) return;
        const annotation = context.sourceCode.getText(node.typeAnnotation);
        if (!annotation.includes("SxProps")) return;
        reportFunctionsIn(node.expression);
      },
    };
  },
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

  // ---- the client boundary ------------------------------------------------
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      boundary: {
        rules: {
          "client-only-styled": clientOnlyStyled,
          "serializable-sx": serializableSx,
        },
      },
    },
    rules: {
      "boundary/client-only-styled": "error",
      "boundary/serializable-sx": "error",
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
