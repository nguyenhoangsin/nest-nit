import {
  Controller,
  Post,
  Body,
  Req,
  Session,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { Cookies } from '../../common/decorators/cookies.decorator';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { SessionGuard } from '../../common/guards/session.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permissions.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: false }))
  async login(@Body() body: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user: { userId: string; username: string } = await this.authService.validateUser(
      body.username,
      body.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken: string = this.authService.generateAccessToken(user);
    const refreshToken: string = await this.authService.generateRefreshToken(user.userId);
    return { accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(
    @Body('userId') userId: string,
    @Body('username') username: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    const isValid = await this.authService.validateRefreshToken(userId, refreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const newAccessToken = this.authService.generateAccessToken({ userId, username });
    return { accessToken: newAccessToken };
  }

  @Post('logout')
  async logout(@Body('userId') userId: string): Promise<void> {
    try {
      await this.authService.revokeRefreshToken(userId);
    } catch (error) {
      throw new InternalServerErrorException('Failed to logout');
    }
  }

  @Post('login-session')
  async loginSession(
    @Body() body: { username: string; password: string },
    @Session() session: Record<string, any>,
    @Cookies('connect.sid') connectSid: string,
  ) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    session.user = user;
    return { user };
  }

  @Post('logout-session')
  async logoutSession(@Req() req: Request): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((error) => {
          if (error) {
            reject(new InternalServerErrorException('Failed to logout'));
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      throw error; //NestJS will automatically handle unhandled exceptions
    }
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @Post('profile')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Permissions(Permission.VIEW_PROFILE)
  getProfile(@Req() req: Request) {
    return (req as any).user;
  }
}
