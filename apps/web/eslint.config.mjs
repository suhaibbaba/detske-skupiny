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

      // TODO: eslint-config-next 16 ships eslint-plugin-react-hooks 7, which
      // added these two rules at "error". They fire only on components that
      // predate the upgrade (SchoolListClient, LanguageSwitcher, MapComponent,
      // useSchoolFilters) and every fix is a behavioural change to an effect,
      // not an upgrade fix - so they are warnings for now and tracked
      // separately rather than silently rewritten during a dependency bump.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
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
