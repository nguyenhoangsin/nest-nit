import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../database/mysql/entities/user.entity';
import { User as _User, UserDocument } from '../../database/mongodb/schemas/user.schema';

@Injectable()
export class UsersService {
  private users = [
    { userId: '1', username: 'admin', password: '$2b$10$abcdef...' }, // Lưu ý: Mật khẩu đã được hash
  ];

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectModel(_User.name) private readonly userModel: Model<UserDocument>,
    private readonly dataSource: DataSource,
  ) {}

  async findByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  // TypeORM create using Repository (MySQL)
  async typeORMCreate(username: string, password: string): Promise<User> {
    const user = this.userRepository.create({
      username,
      password,
    });
    return this.userRepository.save(user);
  }

  // TypeORM find all using Repository (MySQL)
  async typeORMFindAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // TypeORM find all using DataSource.query()
  async typeORMFindAllUsingQuery(): Promise<User[]> {
    const query = 'SELECT * FROM users';
    const users = await this.dataSource.query(query);
    return users;
  }

  // TypeORM find all using QueryBuilder
  async typeORMFindAllUsingQueryBuilder(): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user') // Tạo QueryBuilder cho bảng 'user'
      .getMany(); // Lấy tất cả các bản ghi
    return users;
  }

  // MongoDB create
  async mongoCreate(username: string, password: string): Promise<_User> {
    const newUser = new this.userModel({ username, password });
    return newUser.save();
  }

  // MongoDB find all
  async mongoFindAll(): Promise<_User[]> {
    return this.userModel.find().exec();
  }
}
