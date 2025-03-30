import { createClient, RedisClientType } from 'redis';

class Redis {
  private static instance: Redis;
  private readonly client: RedisClientType;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on('error', (err) => console.log('Redis Client Error', err));
  }

  public getClient() {
    return this.client;
  }

  public static getInstance() {
    if (!Redis.instance) Redis.instance = new Redis();

    return Redis.instance;
  }
}

export default Redis;
