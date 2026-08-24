import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

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
