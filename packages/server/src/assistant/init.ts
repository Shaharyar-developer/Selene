import OpenAI from "openai";
import { db } from "../libs/db";
import { openai as client } from "../libs/openai";
import { ASSISTANT } from "../libs/constants";

/**
 * Retrieves the assistant ID from the database.
 * @returns {Promise<string | null>} - A promise that resolves with the assistant ID or null if not found.
 */
const getAssistantId = async (): Promise<string | null> => {
  return await db.get("assistantId");
};

/**
 * Retrieves an assistant by its ID.
 * @param {string} assistantId - The ID of the assistant to retrieve.
 * @returns {Promise<OpenAI.Beta.Assistants.Assistant>} - A promise that resolves with the retrieved assistant.
 */
const retrieveAssistant = async (
  assistantId: string,
): Promise<OpenAI.Beta.Assistants.Assistant> => {
  return await client.beta.assistants.retrieve(assistantId);
};

/**
 * Creates a new assistant.
 * @returns {Promise<OpenAI.Beta.Assistants.Assistant>} - A promise that resolves with the created assistant.
 */
const createAssistant = async (): Promise<OpenAI.Beta.Assistants.Assistant> => {
  const assistant = await client.beta.assistants.create(ASSISTANT);
  await db.set("assistantId", assistant.id);
  return assistant;
};

/**
 * Creates a new assistant or retrieves an existing one.
 * @param {boolean} [forceNew=false] - Whether to force the creation of a new assistant.
 * @returns {Promise<OpenAI.Beta.Assistants.Assistant>} - A promise that resolves with the assistant.
 */
const createOrGetAssistant = async (
  forceNew: boolean = false,
): Promise<OpenAI.Beta.Assistants.Assistant> => {
  if (forceNew) return await createAssistant();

  const assistantId = await getAssistantId();

  if (assistantId) {
    return await retrieveAssistant(assistantId);
  } else {
    return await createAssistant();
  }
};

/**
 * Creates a new thread.
 * @returns {Promise<OpenAI.Beta.Threads.Thread>} - A promise that resolves with the created thread.
 */
const createThread = async (): Promise<OpenAI.Beta.Threads.Thread> => {
  const thread = await client.beta.threads.create();
  await db.set("threadId", thread.id);
  return thread;
};

/**
 * Creates a new thread or retrieves an existing one.
 * @returns {Promise<OpenAI.Beta.Threads.Thread>} - A promise that resolves with the thread.
 */
const createOrGetThread = async (): Promise<OpenAI.Beta.Threads.Thread> => {
  const threadId = await db.get("threadId");

  if (threadId) {
    return await client.beta.threads.retrieve(threadId);
  } else {
    return await createThread();
  }
};

export { createOrGetAssistant, createOrGetThread };
