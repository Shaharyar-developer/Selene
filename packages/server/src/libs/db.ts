import RedisSingleton from "./redis";

export const db = RedisSingleton.getInstance(0);
export const workspaceDB = RedisSingleton.getInstance(1);