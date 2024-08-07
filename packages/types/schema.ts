import { z } from "zod";

// /db/set endpoint schema
export const setRequestSchema = z.object({
  key: z.string(),
  value: z.union([z.string(), z.instanceof(Buffer)]),
});

// /db/get endpoint schema
export const getRequestSchema = z.object({
  key: z.string(),
});
