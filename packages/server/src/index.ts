import Express from "express";
import { db } from "@/libs/db";
import { nanoid } from "nanoid";
const app = Express();

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

app.post("/db/get", async (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).send("Key is required");
  }

  if (typeof key !== "string") {
    return res.status(400).send("Key must be a string");
  }

  try {
    const value = await db.get(key);
    if (value === null) {
      return res.status(404).send("Key not found");
    }

    // Check if value is a buffer and convert to string if necessary
    const responseValue = Buffer.isBuffer(value) ? value.toString() : value;
    return res.status(200).send(responseValue);
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

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

app.listen(3000, () => console.log("Server is running on port 3000"));
