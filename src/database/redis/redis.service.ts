import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  client;
  private readonly logger = new Logger('REDIS');

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('REDIS_URL');

    this.client = createClient({ url });
    this.client.on('error', (error) => {
      this.logger.error(JSON.stringify(error));
    });
    this.client.connect().then(async () => {
      this.logger.log('Connected!');
    });

    // this.monitorClient();
  }

  private monitorClient() {
    const monitorClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: Number(this.configService.get<string>('REDIS_PORT')),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    // Start tracking mode
    monitorClient.monitor((error, monitor) => {
      if (error) {
        this.logger.error(`Monitor ${JSON.stringify(error)}`);
        return;
      }
      this.logger.log('Monitor started...');
      monitor.on('monitor', (time, args, source) => {
        this.logger.log(args.join(' '));
      });
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, expiresIn?: number): Promise<void> {
    if (expiresIn) {
      await this.client.set(key, value, { EX: expiresIn }); //expiresIn is second
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async getAllKeys(): Promise<string[]> {
    const keys = await this.client.keys('*');
    return keys;
  }

  // Retrieve all data from Redis
  async getAllData(): Promise<any> {
    const keys = await this.getAllKeys();
    const data = {};

    for (const key of keys) {
      const value = await this.get(key);
      data[key] = value;
    }

    return data;
  }
}
