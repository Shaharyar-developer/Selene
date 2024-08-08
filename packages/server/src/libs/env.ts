import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    OPEN_AI_API_KEY: z.string().min(1),
  },

  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   *  You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  },
});
