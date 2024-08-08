import Express from "express";
import { db } from "./libs/db";
import { nanoid } from "nanoid";
import RedisClient from "./libs/redis";
import { createOrGetAssistant, createOrGetThread } from "./assistant/init";
import assert from "assert";
import { env } from "./libs/env";
import cors from "cors";
import Run from "./assistant/run";
import { isValidUTF8 } from "./libs/utils";

const assistant = await createOrGetAssistant(true);
const thread = await createOrGetThread();

// Ensure necessary components are initialized
assert(assistant, "Assistant not created");
assert(thread, "Thread not created");
assert(await RedisClient.ensureConnection(), "Redis Database is not running");
assert(env.OPEN_AI_API_KEY, "OPEN_AI_API_KEY is required");

// Create Express app and Run instance
const app = Express();
const runInstance = new Run({ assistant, thread });

// Middleware setup
app.use(Express.json());
app.use(cors());

/**
 * Endpoint to set a key-value pair in the database.
 * @route POST /db/set
 * @param {string} key - The key to set in the database.
 * @param {any} value - The value to set in the database.
 * @returns {string} - A success message or an error message.
 */
app.post("/db/set", async (req, res) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).send("Key and value are required");
  }

  if (typeof key !== "string") {
    return res.status(400).send("Key must be a string");
  }

  try {
    await db.set(key, value);
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Endpoint to get a value from the database by key.
 * @route POST /db/get
 * @param {string} key - The key to retrieve from the database.
 * @returns {string} - The value associated with the key or an error message.
 */
app.post("/db/get", async (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).send("Key is required");
  }

  if (typeof key !== "string") {
    return res.status(400).send("Key must be a string");
  }

  try {
    const value = await db.getBuffer(key);

    if (value === null) {
      return res.status(404).send("Key not found");
    }

    const responseValue = isValidUTF8(value)
      ? value.toString("utf8")
      : value.toString();

    return res.status(200).send(responseValue);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Endpoint to generate an authentication code.
 * @route GET /auth
 * @returns {object} - An object containing the authentication code.
 */
app.get("/auth", async (req, res) => {
  try {
    await db.del("linkId");
    const id = nanoid();
    await db.set("linkId", id);
    return res.status(200).send({ code: id });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Endpoint to create a new assistant run with a given prompt.
 * @route POST /assistant/run/create
 * @param {string} prompt - The prompt to create a new assistant run.
 * @returns A readable stream of the assistant's response.
 */
app.post("/assistant/run/create", async (req, res) => {
  const { prompt } = req.body;
  if (prompt) {
    try {
      runInstance.on("text", (text) => {
        res.write(text);
      });

      runInstance.on("end", () => {
        res.end();
      });
      runInstance.createRun(prompt);
    } catch (error) {
      console.error("Error creating transcription:", error);
      res.status(500).json({ error: "Error creating transcription" });
    }
  } else {
    res.status(400).json({ error: "Invalid request body" });
  }
});

// Start the server
app.listen(3000, () => console.log("Server is running on port 3000"));
