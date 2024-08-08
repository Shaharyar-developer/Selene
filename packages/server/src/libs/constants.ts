import type OpenAI from "openai";

const ASSISTANT_TOOLS: OpenAI.Beta.AssistantTool[] = [
  {
    type: "function",
    function: {
      name: "runShellCommand",
      description: "Run a shell command in a linux bash environment",
      parameters: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "The shell command to be executed",
          },
        },
        required: ["command"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "saveToDB",
      description: "save a key value pair to a redis database",
      parameters: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "The identifying key of the value being saved",
          },
          value: {
            type: "string",
            description: "The value being saved",
          },
        },
        required: ["key", "value"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "deleteFromDB",
      description: "delete a key value pair from a redis database",
      parameters: {
        type: "object",
        properties: {
          key: {
            type: "string",
            description: "The identifying key of the value being saved",
          },
        },
        required: ["key"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "getAllFromDB",
      description: "Retrieve all saved data from redis database",
    },
  },
];

export const ASSISTANT = {
  model: "gpt-4o-mini",
  name: "Selene",
  instructions:
    "You are a assistant called Selene, your purpose is to provide helpful information and entertainment by making use of the tools available to you. Keep your responses casual, concise and to the point in english. If you ever fail to recall important information, try to think of similar information to help you remember and as a last resort, ask for more information. Ensure that your reply only contains standard ASCII characters. Your responses MUST ALWAYS be in the english language. Remember to not use any language except the english language regardless of the situation.",

  tools: ASSISTANT_TOOLS,
} as OpenAI.Beta.AssistantCreateParams;
