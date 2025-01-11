import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../../database/redis/redis.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    // if (user && (await bcrypt.compare(password, user.password))) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  generateAccessToken(user: { userId: string; username: string }): string {
    const payload = { userId: user.userId, username: user.username, permissions: ['VIEW_PROFILE'] };
    const accessToken: string = this.jwtService.sign(payload);

    return accessToken;
  }

  // Generate Refresh Token and save in Redis
  async generateRefreshToken(userId: string): Promise<string> {
    const expiresIn = Number(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'));
    const refreshToken = this.jwtService.sign(
      { userId },
      {
        expiresIn: `${expiresIn}s`,
      },
    );

    await this.redisService.set(`${this.REFRESH_TOKEN}:${userId}`, refreshToken, expiresIn);

    return refreshToken;
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.redisService.get(`${this.REFRESH_TOKEN}:${userId}`);
    return storedToken === token;
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.redisService.del(`${this.REFRESH_TOKEN}:${userId}`);
  }

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersService.typeORMCreate(username, hashedPassword);
  }
}
