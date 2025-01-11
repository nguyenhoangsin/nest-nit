import { Module, Global } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MySQLModule } from './mysql/mysql.module';
import { MongoDBModule } from './mongodb/mongodb.module';

@Global()
@Module({
  imports: [RedisModule, MySQLModule, MongoDBModule],
  exports: [RedisModule, MySQLModule, MongoDBModule],
})
export class DatabaseModule {}
