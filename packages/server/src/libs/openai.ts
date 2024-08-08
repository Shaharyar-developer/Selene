import OpenAi from "openai";
import { env } from "@/libs/env";

class OpenAiSingleton {
  private static instance: OpenAi;

  private constructor() {}

  public static getInstance(): OpenAi {
    if (!OpenAiSingleton.instance) {
      OpenAiSingleton.instance = new OpenAi({ apiKey: env.OPEN_AI_API_KEY });
    }

    return OpenAiSingleton.instance;
  }
}

export const openai = OpenAiSingleton.getInstance();
