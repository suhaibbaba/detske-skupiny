import { defineCliConfig } from "sanity/cli";
import * as path from "node:path";
import dotenv from "dotenv";

dotenv.config();

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  // autoUpdates: false,
  deployment: {
    autoUpdates: false,
  },
  vite: (prev: any) => ({
    ...prev,
    resolve: {
      ...(prev?.resolve ?? {}),
      alias: {
        ...((prev?.resolve as any)?.alias ?? {}),
        "@": path.resolve(__dirname, "./"),
      },
    },
  }),
});
