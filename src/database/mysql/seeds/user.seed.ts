import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '../entities/user.entity';

@Injectable()
export class UserSeed {
  private readonly logger = new Logger(`MySQL:${UserSeed.name}`);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const users = [];
    for (let i = 0; i < 100; i++) {
      const user = new User();
      user.userId = faker.string.uuid();
      user.username = faker.internet.username();
      user.password = faker.internet.password();
      users.push(user);
    }

    await this.userRepository.save(users);
    this.logger.log('100 users have been seeded');
  }
}
