import { z } from "zod";

// /db/set endpoint
export const DbSetRequest = z.object({
  key: z.string(),
  value: z.union([z.string(), z.instanceof(Buffer)]),
});
export type DbSetRequestType = z.infer<typeof DbSetRequest>;

// /db/get endpoint
export const DbGetRequest = z.object({
  key: z.string(),
});
export type DbGetRequestType = z.infer<typeof DbGetRequest>;

export const DbGetResponse = z.union([z.string(), z.instanceof(Buffer)]);
export type DbGetResponseType = z.infer<typeof DbGetResponse>;

// /auth endpoint
export const AuthResponse = z.object({
  code: z.string(),
});
export type AuthResponseType = z.infer<typeof AuthResponse>;

// /assistant/run/create endpoint
export const AssistantRunCreateRequest = z.object({
  prompt: z.string(),
});
export type AssistantRunCreateRequestType = z.infer<
  typeof AssistantRunCreateRequest
>;

export const AssistantRunCreateResponse = z.string();
export type AssistantRunCreateResponseType = z.infer<
  typeof AssistantRunCreateResponse
>;
