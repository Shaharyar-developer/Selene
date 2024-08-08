import { z } from "zod";

// /db/set endpoint
export const setRequest = z.object({
  key: z.string(),
  value: z.union([z.string(), z.instanceof(Buffer)]),
});

// /db/get endpoint
export const getRequest = z.object({
  key: z.string(),
});

// /auth/create endpoint
export const newAuthResponse = z.object({
  code: z.string(),
});
export type newAuthResponseType = z.infer<typeof newAuthResponse>;
