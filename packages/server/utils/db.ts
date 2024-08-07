import RedisSingleton from "./redis";

export const db = RedisSingleton.getInstance(0);
