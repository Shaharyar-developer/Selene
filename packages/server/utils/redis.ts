import IoRedis from "ioredis";

class RedisSingleton {
  private static instance: IoRedis;
  private static index: number;
  private constructor() { }

  public static getInstance(index: number): IoRedis {
    if (!RedisSingleton.instance || RedisSingleton.index !== index) {
      RedisSingleton.index = index;
      RedisSingleton.instance = new IoRedis({
        host: "redis",
        port: 6379,
        db: index,
      });
    }
    RedisSingleton.instance.on("error", () => {
      throw new Error(
        "Ensure redis client is running and connection params are correct",
      );
      process.exit(1);
    });

    return RedisSingleton.instance;
  }

  public static async ensureConnection(): Promise<boolean> {
    try {
      const client = RedisSingleton.getInstance(RedisSingleton.index);
      const data = await client.ping();
      return data ? true : false;
    } catch (error) {
      console.error("Redis connection error:", error);
      return false;
    }
  }
}

export default RedisSingleton;
