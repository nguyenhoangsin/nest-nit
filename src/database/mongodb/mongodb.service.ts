import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoDbService implements OnModuleInit {
  private readonly logger = new Logger('MongoDb');

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.db
      .collection('test')
      .findOne({})
      .then(() => {
        this.logger.log('Connected!');
      })
      .catch((error) => {
        this.logger.error(JSON.stringify(error));
      });
  }
}
