import type { CliConfig } from "@sanity/cli";

const config: CliConfig = {
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "../studio/schema.json",
    generates: "../../packages/types/src/sanity.generated.ts",
    overloadClientMethods: false,
  },
};

export default config;
