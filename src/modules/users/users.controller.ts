// src/controllers/users.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../database/mysql/entities/user.entity';
import { User as _User } from '../../database/mongodb/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // MySQL - TypeORM Create User
  @Post('create-mysql')
  async createUser(
    @Body() { username, password }: { username: string; password: string },
  ): Promise<User> {
    return this.usersService.typeORMCreate(username, password);
  }

  // MySQL - TypeORM Find All Users using Repository
  @Get('find-all-mysql')
  async getAllUsers(): Promise<User[]> {
    return this.usersService.typeORMFindAll();
  }

  // MySQL - TypeORM Find All Users using DataSource.query()
  @Get('find-all-mysql-query')
  async getAllUsersUsingQuery(): Promise<User[]> {
    return this.usersService.typeORMFindAllUsingQuery();
  }

  // MySQL - TypeORM Find All Users using QueryBuilder
  @Get('find-all-mysql-query-builder')
  async getAllUsersUsingQueryBuilder(): Promise<User[]> {
    return this.usersService.typeORMFindAllUsingQueryBuilder();
  }

  // MongoDB - Create User
  @Post('create-mongodb')
  async createMongoUser(
    @Body() { username, password }: { username: string; password: string },
  ): Promise<_User> {
    return this.usersService.mongoCreate(username, password);
  }

  // MongoDB - Find All Users
  @Get('find-all-mongodb')
  async getAllMongoUsers(): Promise<_User[]> {
    return this.usersService.mongoFindAll();
  }
}
