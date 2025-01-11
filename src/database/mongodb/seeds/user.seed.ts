// src/seeds/user.seed.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { faker } from '@faker-js/faker';

@Injectable()
export class UserSeed {
  private readonly logger = new Logger(`MongoDb:${UserSeed.name}`);

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async seed() {
    const users = [];
    for (let i = 0; i < 100; i++) {
      const user = new this.userModel({
        username: faker.internet.username(),
        password: faker.internet.password(),
      });
      users.push(user);
    }

    await this.userModel.insertMany(users);
    this.logger.log('100 users have been seeded');
  }
}
