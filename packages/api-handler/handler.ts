import axios, { AxiosInstance } from "axios";
import { z } from "zod";

import {
  DbSetRequest,
  DbGetRequest,
  DbGetResponse,
  AuthResponse,
  AssistantRunCreateRequest,
} from "./schema";

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  // /db/set endpoint
  public async setDbValue(data: z.infer<typeof DbSetRequest>): Promise<void> {
    const response = await this.client.post("/db/set", data);
    if (response.status !== 200) {
      throw new Error("Failed to set DB value");
    }
  }

  // /db/get endpoint
  public async getDbValue(
    data: z.infer<typeof DbGetRequest>,
  ): Promise<z.infer<typeof DbGetResponse>> {
    const response = await this.client.post("/db/get", data);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to get DB value");
    }
  }

  // /auth endpoint
  public async getAuthCode(): Promise<z.infer<typeof AuthResponse>> {
    const response = await this.client.get("/auth");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to get auth code");
    }
  }

  // /assistant/run/create endpoint
  public async runAssistant(
    data: z.infer<typeof AssistantRunCreateRequest>,
    onText: (text: string) => void,
  ): Promise<void> {
    const response = await this.client.post("/assistant/run/create", data, {
      responseType: "stream",
    });
    const reader = response.data.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onText(decoder.decode(value));
    }
  }
}

export default ApiClient;
