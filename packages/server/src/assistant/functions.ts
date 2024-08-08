import { workspaceDB } from "@/libs/db";
import { exec } from "child_process";
import fs from "fs";

export const runCommand = (command: string): Promise<string> => {
  fs.existsSync(`${process.cwd()}/workspace`)
    ? null
    : fs.mkdirSync(`${process.cwd()}/workspace`);
  return new Promise((resolve) => {
    exec(
      command,
      { encoding: "utf-8", cwd: `${process.cwd()}/workspace` },
      (error, stdout, stderr) => {
        if (error) {
          resolve(`Command failed: ${stderr.trim()}`);
        } else {
          resolve(stdout.trim());
        }
      },
    );
  });
};

export async function getAllFromDB(): Promise<Record<string, string>> {
  const keyValuePairs: Record<string, string> = {};
  let cursor = "0";

  do {
    const [newCursor, keys] = await workspaceDB.scan(cursor);
    cursor = newCursor;

    if (keys.length > 0) {
      const values = await workspaceDB.mget(keys);
      keys.forEach((key, index) => {
        if (values[index]) keyValuePairs[key] = values[index];
      });
    }
  } while (cursor !== "0");
  return keyValuePairs;
}

export async function saveToDB(key: string, value: string) {
  await workspaceDB.set(key, value);
  return JSON.stringify({
    key,
    value,
  });
}
export async function deleteFromDB(key: string): Promise<number> {
  return await workspaceDB.del(key);
}
