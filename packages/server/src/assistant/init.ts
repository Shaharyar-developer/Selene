import OpenAI from "openai";
import { db } from "@/libs/db";
import { openai as client } from "@/libs/openai";
import { ASSISTANT } from "@/libs/constants";

const getAssistantId = async (): Promise<string | null> => {
  return await db.get("assistantId");
};

const retrieveAssistant = async (
  assistantId: string,
): Promise<OpenAI.Beta.Assistants.Assistant> => {
  return await client.beta.assistants.retrieve(assistantId);
};

const createAssistant = async (): Promise<OpenAI.Beta.Assistants.Assistant> => {
  const assistant = await client.beta.assistants.create(ASSISTANT);
  await db.set("assistantId", assistant.id);
  return assistant;
};

const createOrGetAssistant = async (
  forceNew = false,
): Promise<OpenAI.Beta.Assistants.Assistant> => {
  if (forceNew) return await createAssistant();

  const assistantId = await getAssistantId();

  if (assistantId) {
    return await retrieveAssistant(assistantId);
  } else {
    return await createAssistant();
  }
};

const createThread = async () => {
  const thread = await client.beta.threads.create();
  await db.set("threadId", thread.id);
  return thread;
};

const createOrGetThread = async () => {
  const threadId = await db.get("threadId");

  if (threadId) {
    return await client.beta.threads.retrieve(threadId);
  } else {
    return await createThread();
  }
};

export { createOrGetAssistant, createOrGetThread };
