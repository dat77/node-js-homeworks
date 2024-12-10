import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class RefreshDto {
  @ApiProperty()
  refresh_token: string;
}


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('get-token')
  async login(@Body() body: LoginDto ) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.authService.login(user);
  }

  @Post('refresh-token')
  async refresh(@Body() body: RefreshDto ) {
    const token = await this.authService.refreshAccessToken(body.refresh_token);

    if (!token) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return token;
  }
}
