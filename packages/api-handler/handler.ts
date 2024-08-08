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

  /**
   * Creates an instance of ApiClient.
   * @param {string} baseURL - The base URL for the API.
   */
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  /**
   * Sets a value in the database.
   * @param {z.infer<typeof DbSetRequest>} data - The data to set in the database.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - Throws an error if the request fails.
   */
  public async setDbValue(data: z.infer<typeof DbSetRequest>): Promise<void> {
    const response = await this.client.post("/db/set", data);
    if (response.status !== 200) {
      throw new Error("Failed to set DB value");
    }
  }

  /**
   * Gets a value from the database.
   * @param {z.infer<typeof DbGetRequest>} data - The data to get from the database.
   * @returns {Promise<z.infer<typeof DbGetResponse>>} - A promise that resolves with the retrieved data.
   * @throws {Error} - Throws an error if the request fails.
   */
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

  /**
   * Gets an authentication code.
   * @returns {Promise<z.infer<typeof AuthResponse>>} - A promise that resolves with the authentication code.
   * @throws {Error} - Throws an error if the request fails.
   */
  public async getAuthCode(): Promise<z.infer<typeof AuthResponse>> {
    const response = await this.client.get("/auth");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to get auth code");
    }
  }

  /**
   * Runs an assistant with the provided data.
   * @param {z.infer<typeof AssistantRunCreateRequest>} data - The data to run the assistant with.
   * @param {(text: string) => void} onText - Callback function to handle text output from the assistant.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   * @throws {Error} - Throws an error if the request fails.
   */
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
